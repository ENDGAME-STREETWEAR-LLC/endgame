"use client";

import { STEAM_AUTH_URL } from "@/constants/auth";
import useGamingServices from "@/hooks/useGamingServices";
import { Services } from "@/types";
import { formatObjectJSON } from "@/utils/text";
import { CircleLoader } from "react-spinners";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SteamMainMenu() {
  const router = useRouter();
  const [loading, error, sync, data, authState, logout] = useGamingServices();
  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {
    if (authInProgress && data.steam) {
      alert("Your session has expired. Please log in again.");
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
          <p>You are currently logged out of Steam Network.</p>
          <a
            target="_self"
            href={STEAM_AUTH_URL}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-transparent- text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-4 sm:w-auto"
          >
            <img
              alt="Log into Steam Network"
              src="https://community.akamai.steamstatic.com/public/shared/images/signinthroughsteam/sits_landing.png"
            ></img>
          </a>
          <button
            onClick={cancelAuthHandler}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/** Render components for loading and error states */}
      {loading && <CircleLoader color="white" />}
      {error && <p>{error}</p>}

      {/** Render message if user has no data in sync yet for their Steam account  */}
      {!loading && !error && !data.steam && (
        <>
          <p>No data is in sync yet.</p>
        </>
      )}

      {/** Render synced content for logged in Steam account */}
      {!loading && !error && data.steam && (
        <>
          <p>Steam User Info</p>
          <p>Name: {data.steam.profile.response.players[0].personaname}</p>
          <p>Total owned games: {data.steam.games.response.game_count}</p>

          <div className="flex w-full justify-evenly">
            <div className="w-[300px] h-[300px] overflow-x-scroll bg-[#FFFFFF33] p-2 rounded-sm">
              <p>Achievements:</p>
              {data.steam.achievements.response.games.map((game) => {
                return (
                  <div className="mt-4" key={game.id}>
                    {formatObjectJSON(game).map((text) => (
                      <p key={text}>{text}</p>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="w-[300px] h-[300px] overflow-x-scroll bg-[#FFFFFF33] p-2 rounded-sm">
              <p>Owned Games:</p>
              {data.steam.games.response.games.map((game, index) => (
                <div className="mt-4" key={game.appid + index}>
                  {formatObjectJSON(game).map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                  <br></br>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        disabled={loading}
        onClick={syncDataHandler}
        className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      >
        Sync data for Steam account
      </button>
      {!loading && data.steam && (
        <button
          disabled={loading}
          onClick={logoutHandler}
          className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Sign out
        </button>
      )}
    </div>
  );
}
