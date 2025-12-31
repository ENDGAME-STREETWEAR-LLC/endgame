"use client";

import { XBOX_AUTH_URL } from "@/constants/auth";
import useGamingServices from "@/hooks/useGamingServices";
import { Services, XBLSettingsID } from "@/types";
import { CircleLoader } from "react-spinners";
import Modal from "./Modal";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalization } from "@/hooks/useLocalization";

export default function XboxMainMenu() {
  const router = useRouter();
  const [loading, error, sync, data, authState, logout] = useGamingServices();
  const [authInProgress, setAuthInProgress] = useState(false);
  const { localization: t } = useLocalization();

  const settingsMap = useMemo(() => {
    if (!data?.xbl) return {};
    const settings = data.xbl?.profile.settings;
    const settingsMap: Partial<Record<XBLSettingsID, string>> = {};

    settings.forEach((setting) => (settingsMap[setting.id] = setting.value));
    return settingsMap;
  }, [data]);

  useEffect(() => {
    if (authInProgress && data.xbl) {
      alert(t.sessionExpired);
    }
  }, [authInProgress]);

  const syncDataHandler = () => {
    if (authState.xbl) {
      sync(Services.XBL);
    } else {
      setAuthInProgress(true);
    }
  };

  const cancelAuthHandler = () => setAuthInProgress(false);

  const logoutHandler = async () => {
    await logout(Services.XBL);
    document.cookie = "xbox_session=; Max-Age=0; path=/xbox/home";
    router.refresh();
  };

  return (
    <div className="w-full h-full justify-center items-center flex flex-col gap-[1rem]">
      {/** Render message if user is logged out of XBL network */}
      <Modal open={authInProgress}>
        <div className="flex flex-col gap-3 text-center items-center w-full p-4">
          <p>{t.xbox.loggedOut}</p>
          <a
            target="_self"
            href={XBOX_AUTH_URL}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            {t.xbox.logIn}
          </a>
          <button
            onClick={cancelAuthHandler}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            {t.cancel}
          </button>
        </div>
      </Modal>

      {/** Render components for loading and error states */}
      {loading && <CircleLoader color="white" />}
      {error && <p>{error}</p>}

      {/** Render message if user has no data in sync yet for their XBL account  */}
      {!loading && !error && !data.xbl && (
        <>
          <p>{t.noData}</p>
        </>
      )}

      {/** Render synced content for logged in XBL account */}
      {!loading && !error && data.xbl && (
        <>
          <h2 className="font-bold text-xl">{t.xbox.info.title}</h2>
          <p>
            {t.xbox.info.profileId} {data.xbl.profile.id}
          </p>
          <p>
            {t.xbox.info.gamertag} {settingsMap.Gamertag}
          </p>
          <p>
            {t.xbox.info.accountTier} {settingsMap.AccountTier}
          </p>
          <p>
            {t.xbox.info.bio} {settingsMap.Bio}
          </p>

          <div className="flex w-full justify-center">
            <div className="w-[500px] h-[500px] overflow-x-scroll bg-[#FFFFFF33] p-2 rounded-sm">
              <p>{t.xbox.info.playedGames}</p>
              {data.xbl.achievements
                .filter((game) => game.type === "Game")
                .map((game) => (
                  <div className="flex flex-col mt-4" key={game.titleId}>
                    <img width={200} height={200} src={game.displayImage}></img>
                    <p>
                      {t.xbox.info.gameName} {game.name}
                    </p>
                    {typeof game?.detail === "string" && (
                      <p>
                        {t.xbox.info.gameDetail} {game.detail}
                      </p>
                    )}

                    <p>
                      {t.xbox.info.totalAchievements}{" "}
                      {game.achievement.currentAchievements}
                    </p>
                    <p>
                      {t.xbox.info.currentGamerScore}{" "}
                      {game.achievement.currentGamerscore}
                    </p>
                    <p>
                      {t.xbox.info.progressPercentage}{" "}
                      {game.achievement.progressPercentage}%
                    </p>
                    <div className="flex flex-col mt-4">
                      <p>{t.xbox.info.earnedAchievements}</p>
                      {game.achievements.map((achievement) => (
                        <div
                          className="flex flex-col mb-4"
                          key={achievement.id}
                        >
                          <img
                            width={200}
                            height={200}
                            alt={achievement.name}
                            src={
                              achievement.mediaAssets.find(
                                (asset) => asset.type === "Icon"
                              )?.url
                            }
                          ></img>
                          <p>
                            {t.xbox.info.achievementName} {achievement.name}
                          </p>
                          <p>
                            {t.xbox.info.achievementDescription}{" "}
                            {achievement.description}
                          </p>
                          <p>
                            {t.xbox.info.achievementLockedDescription}{" "}
                            {achievement.lockedDescription}
                          </p>
                          <p>
                            {t.xbox.info.achievementCategory}{" "}
                            {achievement.rarity.currentCategory}
                          </p>
                          <p>
                            {t.xbox.info.isSecretAchievement}{" "}
                            {achievement.isSecret ? t.yes : t.no}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              <p></p>
            </div>
          </div>
        </>
      )}

      <button
        disabled={loading}
        onClick={syncDataHandler}
        className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      >
        {t.syncData}
      </button>
      {!loading && data.xbl && (
        <button
          disabled={loading}
          onClick={logoutHandler}
          className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          {t.signOut}
        </button>
      )}
    </div>
  );
}
