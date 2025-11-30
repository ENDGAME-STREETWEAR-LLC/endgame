"use client";

import { STEAM_AUTH_URL } from "@/constants/auth";
import useGamingServices from "@/hooks/useGamingServices";
import { Services } from "@/types";
import { CircleLoader } from "react-spinners";

export default function SteamMainMenu() {
  const [loading, error, sync, data, authState] = useGamingServices();

  return (
    <div className="w-full h-full justify-center items-center flex flex-col gap-[1rem]">
      {/** Render message if user is logged out of Steam network */}
      {!loading && !authState.steam && (
        <>
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
        </>
      )}

      {/** Render components for loading and error states */}
      {loading && <CircleLoader color="white" />}
      {error && <p>{error}</p>}

      {/** Render message if user has no data in sync yet for their Steam account  */}
      {!loading && !error && authState.steam && !data.steam && (
        <>
          <p>No data is in sync yet.</p>
        </>
      )}

      {/** Render synced content for logged in Steam account */}
      {!loading && !error && data.steam && (
        <>
          <p>Steam User Info</p>
          <p>{data.steam.profile.response.players[0].personaname}</p>
        </>
      )}

      {authState.steam && (
        <button
          disabled={loading}
          onClick={() => sync(Services.Steam)}
          className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Sync data for Steam account
        </button>
      )}
    </div>
  );
}
