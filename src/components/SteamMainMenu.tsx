"use client";

import { STEAM_AUTH_URL } from "@/constants/auth";
import useGamingServices from "@/hooks/useGamingServices";
import { Services } from "@/types";
import { CircleLoader } from "react-spinners";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalization } from "@/hooks/useLocalization";

export default function SteamMainMenu() {
  const router = useRouter();
  const [loading, error, sync, data, authState, logout] = useGamingServices();
  const [authInProgress, setAuthInProgress] = useState(false);
  const { localization: t } = useLocalization();

  useEffect(() => {
    if (authInProgress && data.steam) {
      alert(t.sessionExpired);
    }
  }, [authInProgress]);

  const syncDataHandler = () => {
    if (authState.steam) {
      sync(Services.Steam);
    } else {
      setAuthInProgress(true);
    }
  };

  const cancelAuthHandler = () => setAuthInProgress(false);

  const logoutHandler = async () => {
    await logout(Services.Steam);
    document.cookie = "steam_session=; Max-Age=0; path=/steam/home";
    router.refresh();
  };

  return (
    <div className="w-full h-full justify-center items-center flex flex-col gap-[1rem]">
      {/** Render message if user is logged out of Steam network */}
      <Modal open={authInProgress}>
        <div className="flex flex-col gap-3 text-center items-center w-full p-4">
          <p>{t.steam.loggedOut}</p>
          <a
            target="_self"
            href={STEAM_AUTH_URL}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-transparent- text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-4 sm:w-auto"
          >
            <img
              alt={t.steam.logIn}
              src="https://community.akamai.steamstatic.com/public/shared/images/signinthroughsteam/sits_landing.png"
            ></img>
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

      {/** Render message if user has no data in sync yet for their Steam account  */}
      {!loading && !error && !data.steam && (
        <>
          <p>{t.noData}</p>
        </>
      )}

      {/** Render synced content for logged in Steam account */}
      {!loading && !error && data.steam && (
        <>
          <h2 className="font-bold text-xl">{t.steam.info.title}</h2>
          <img
            width={200}
            height={200}
            src={data.steam.profile.response.players[0].avatarfull}
          ></img>
          <p>
            {t.steam.info.playerName}{" "}
            {data.steam.profile.response.players[0].personaname}
          </p>
          <p>
            {t.steam.info.id} {data.steam.profile.response.players[0].steamid}
          </p>
          <p>
            {t.steam.info.totalOwnedGames}{" "}
            {data.steam.games.response.game_count}
          </p>

          <div className="w-[500px] h-[500px] overflow-x-scroll bg-[#FFFFFF33] p-2 rounded-sm">
            <p>{t.steam.info.ownedGames}</p>
            {data.steam.games.response.games.map((game, index) => {
              const achievements =
                data?.steam?.achievements.response.games.find(
                  (achGame) => achGame.id === game.appid
                )?.achievements;

              return (
                <div className="flex flex-col mt-4" key={game.appid + index}>
                  <img
                    width={150}
                    height={100}
                    alt={game.name}
                    src={game.headerImage}
                  ></img>
                  <p>
                    {t.steam.info.gameName} {game.name}
                  </p>
                  <p>
                    {t.steam.info.hasPlayed}{" "}
                    {game.playtime_forever > 0 ? t.yes : t.no}
                  </p>
                  <p>
                    {t.steam.info.gameDescription} {game.detailedDescription}
                  </p>

                  {
                    <div className="flex flex-col mt-4">
                      <p>
                        {t.steam.info.earnedAchievements}{" "}
                        {!achievements?.length && t.none}
                      </p>
                      {achievements?.map((achievement) => (
                        <div
                          key={achievement.apiname}
                          className="flex flex-col mb-4"
                        >
                          <img
                            width={100}
                            height={100}
                            alt={achievement.apiname}
                            src={achievement.icon}
                          ></img>
                          <p>
                            {t.steam.info.achievementName}{" "}
                            {achievement.displayName}
                          </p>
                          {achievement.description && (
                            <p>
                              {t.steam.info.achievementDescription}{" "}
                              {achievement.description}
                            </p>
                          )}
                          <p>
                            {t.steam.info.isHidden}{" "}
                            {achievement.hidden === 1 ? t.yes : t.no}
                          </p>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              );
            })}
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
      {!loading && data.steam && (
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
