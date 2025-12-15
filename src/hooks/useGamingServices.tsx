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
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  PSNAuthSession,
  PSNData,
  SteamAchievementsData,
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
import useAuthStore from "./useAuthStore";

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

  const [{ user }, supabase] = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [psnData, setPsnData] = useState<null | PSNData>(null);
  const [xblData, setXblData] = useState<null | XBLData>(null);
  const [steamData, setSteamData] = useState<null | SteamData>(null);

  const retrieveSupabaseData = useCallback(
    async (service: Services) => {
      let table;

      switch (service) {
        case Services.PSN:
          table = "psn_data";
          break;

        case Services.XBL:
          table = "xbox_data";
          break;

        case Services.Steam:
          table = "steam_data";
          break;
      }

      const query = await supabase
        .from(table)
        .select("*")
        .eq("user_id", user.id);

      if (query.error) throw new Error(query.error.message);

      if (query.data.length === 0) return null;

      return query.data[0].data;
    },
    [supabase, user]
  );

  const updateSupabaseData = useCallback(
    async (service: Services, data: null | (PSNData | XBLData | SteamData)) => {
      let table;

      switch (service) {
        case Services.PSN:
          table = "psn_data";
          break;

        case Services.XBL:
          table = "xbox_data";
          break;

        case Services.Steam:
          table = "steam_data";
          break;
      }

      let query;

      if (data) {
        query = await supabase
          .from(table)
          .upsert(
            {
              user_id: user.id,
              data,
            },
            { onConflict: "user_id" }
          )
          .select("*");
      } else {
        query = await supabase
          .from(table)
          .delete()
          .eq("user_id", user.id)
          .select("*");
      }

      if (query.error) throw new Error(query.error.message);

      return query.data;
    },
    [supabase, user]
  );

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
    new Promise(async () => {
      setLoading(true)

      const storedPsn = await retrieveSupabaseData(Services.PSN);
      const storedXbl = await retrieveSupabaseData(Services.XBL);
      const storedSteam = await retrieveSupabaseData(Services.Steam);

      if (storedPsn) {
        setPsnData(storedPsn);
      }

      if (storedXbl) {
        setXblData(storedXbl);
      }

      if (storedSteam) {
        setSteamData(storedSteam);
      }

      setLoading(false)
    });
  }, []);

  const syncPsnData = async () => {
    const storedSession = session.psn;
    if (!storedSession) return;

    try {
      setError("");
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

      await updateSupabaseData(Services.PSN, data);
      setPsnData(data);
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
      setError("");
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

      await updateSupabaseData(Services.XBL, data);
      setXblData(data);
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
      setError("");
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

      await updateSupabaseData(Services.Steam, data);
      setSteamData(data);
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

  const logout = async (service: Services) => {
    setLoading(true);
    setError("");

    try {
      await updateSupabaseData(service, null);

      switch (service) {
        case Services.PSN:
          setPsnData(null);
          break;
        case Services.XBL:
          setXblData(null);
          break;
        case Services.Steam:
          setSteamData(null);
          break;
      }
    } catch (error) {
      setError("Logout failed: " + (error as Error).message);
    } finally {
      setLoading(false);
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
    logout,
  ];
}
