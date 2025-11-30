import {
  fetcher,
  PsnEndpoints,
  SteamEndpoints,
  XboxEndpoints,
} from "@/utils/api";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {
  ProfileFromUserNameResponse,
  TitleThinTrophy,
  UserTitlesResponse,
} from "psn-api";
import { useState } from "react";
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
} from "types";

export default function useGamingServices(cookies: ReadonlyRequestCookies) : GamingServicesHook {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [psnData, setPsnData] = useState<null | PSNData>(null);
  const [xblData, setXblData] = useState<null | XBLData>(null);
  const [steamData, setSteamData] = useState<null | SteamData>(null);

  const syncPsnData = async () => {
    const storedSession = cookies.get("psn_session")?.value;
    if (!storedSession) return;

    try {
      setLoading(true);

      const session = JSON.parse(storedSession) as PSNAuthSession;

      const profile = (await fetcher(PsnEndpoints.UserProfile, {
        headers: {
          Authorization: session.accessToken,
        },
      })) as ProfileFromUserNameResponse;

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

      setPsnData({
        profile,
        titles,
        trophies,
      });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const syncXblData = async () => {
    const storedSession = cookies.get("xbl_session")?.value;
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

      setXblData({ achievements, profile });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const syncSteamData = async () => {
    const userId = cookies.get("steam_session")?.value as SteamAuthSession;

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

    setSteamData({ profile, games, achievements });
  };

  const sync = (service: Services) => {
    switch(service) {
      case Services.PSN:
        syncPsnData()
        break;
      case Services.XBL:
        syncXblData()
        break;
      case Services.Steam:
        syncSteamData()
        break;
    }
  }

  return [
    loading,
    error,
    sync,
    {
      psn: psnData,
      xbl: xblData,
      steam: steamData,
    },
  ];
}
