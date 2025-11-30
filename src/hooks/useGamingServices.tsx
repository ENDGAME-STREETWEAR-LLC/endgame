/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client";

import {
  fetcher,
  PsnEndpoints,
  SteamEndpoints,
  XboxEndpoints,
} from "@/utils/api";
import {
  ProfileFromUserNameResponse,
  TitleThinTrophy,
  UserTitlesResponse,
} from "psn-api";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  PSNAuthSession,
  PSNData,
  SteamAchievementsData,
  SteamAuthSession,
  SteamData,
  XBLAchievementsData,
  XBLAuthSession,
  XBLData,
  XBLProfileData,
  GamingServicesHook,
  SteamGamesData,
  SteamProfileData,
  Services,
  GamingSessionValue,
} from "@/types";

export const GamingServicesContext = createContext<GamingSessionValue>(
  null as any
);

export const GamingServicesContextProvider = (
  props: PropsWithChildren<{ value: GamingSessionValue }>
) => {
  return (
    <GamingServicesContext.Provider value={props.value}>
      {props.children}
    </GamingServicesContext.Provider>
  );
};

export default function useGamingServices(): GamingServicesHook {
  const session = useContext(GamingServicesContext);
  if (!session)
    throw new Error(
      "useGamingServices must be used from within GamingServicesContextProvider component."
    );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [psnData, setPsnData] = useState<null | PSNData>(null);
  const [xblData, setXblData] = useState<null | XBLData>(null);
  const [steamData, setSteamData] = useState<null | SteamData>(null);

  const authState = useMemo(() => {
    if (!session) {
      return {
        psn: false,
        xbl: false,
        steam: false,
      };
    }

    return {
      psn: !!session.psn,
      xbl: !!session.xbl,
      steam: !!session.steam,
    };
  }, [session]);

  useEffect(() => {
    const storedPsn = localStorage.getItem("psn");
    const storedXbl = localStorage.getItem("xbl");
    const storedSteam = localStorage.getItem("steam");

    if (storedPsn) {
      setPsnData(JSON.parse(storedPsn));
    }

    if (storedXbl) {
      setXblData(JSON.parse(storedXbl));
    }

    if (storedSteam) {
      setSteamData(JSON.parse(storedSteam));
    }
  }, []);

  const syncPsnData = async () => {
    const storedSession = session.psn;
    if (!storedSession) return;

    try {
      setLoading(true);

      const session = JSON.parse(storedSession) as PSNAuthSession;

      const profile = (
        await fetcher(PsnEndpoints.UserProfile, {
          headers: {
            Authorization: session.accessToken,
          },
        })
      ).profile as ProfileFromUserNameResponse["profile"];

      const titles = (await fetcher(PsnEndpoints.UserTitles, {
        headers: {
          Authorization: session.accessToken,
        },
      })) as UserTitlesResponse;

      const trophies = await Promise.all(
        titles.trophyTitles.map(async (title) => ({
          [title.trophyTitleName]: (await fetcher(
            [
              PsnEndpoints.TitleTrophies,
              `?npCommunicationId=${title.npCommunicationId}&npServiceName=${title.npServiceName}`,
            ],
            {
              headers: {
                Authorization: session.accessToken,
              },
            }
          )) as TitleThinTrophy[],
        }))
      );

      const data = {
        profile,
        titles,
        trophies,
      };

      setPsnData(data);
      localStorage.setItem("psn", JSON.stringify(data));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const syncXblData = async () => {
    const storedSession = session.xbl;
    if (!storedSession) return;

    try {
      setLoading(true);

      const { xuid } = JSON.parse(storedSession) as XBLAuthSession;

      const achievements = (await fetcher([
        XboxEndpoints.Achievements,
        `?xuid=${xuid}`,
      ])) as XBLAchievementsData;

      const profile = (await fetcher([
        XboxEndpoints.Profile,
        `?xuid=${xuid}`,
      ])) as XBLProfileData;

      const data = { achievements, profile };

      setXblData(data);
      localStorage.setItem("xbl", JSON.stringify(data));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const syncSteamData = async () => {
    const userId = session.steam;
    if (!userId) return;

    try {
      setLoading(true);

      const profile = (await fetcher([
        SteamEndpoints.Profile,
        `?userId=${userId}`,
      ])) as SteamProfileData;

      const achievements = (await fetcher([
        SteamEndpoints.Achievements,
        `?userId=${userId}`,
      ])) as SteamAchievementsData;

      const games = (await fetcher([
        SteamEndpoints.Games,
        `?userId=${userId}`,
      ])) as SteamGamesData;

      const data = { profile, games, achievements };

      setSteamData(data);
      localStorage.setItem("steam", JSON.stringify(data));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const sync = (service: Services) => {
    switch (service) {
      case Services.PSN:
        syncPsnData();
        break;
      case Services.XBL:
        syncXblData();
        break;
      case Services.Steam:
        syncSteamData();
        break;
    }
  };

  return [
    loading,
    error,
    sync,
    {
      psn: psnData,
      xbl: xblData,
      steam: steamData,
    },
    authState,
  ];
}
