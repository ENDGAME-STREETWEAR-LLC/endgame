"use client";

import { XBOX_AUTH_URL } from "@/constants/auth";
import useGamingServices from "@/hooks/useGamingServices";
import { Services } from "@/types";
import { CircleLoader } from "react-spinners";

export default function XboxMainMenu() {
  const [loading, error, sync, data, authState] = useGamingServices();

  return (
    <div className="w-full h-full justify-center items-center flex flex-col gap-[1rem]">
      {/** Render message if user is logged out of XBL network */}
      {!loading && !authState.xbl && (
        <>
          <p>You are currently logged out of XBL Network.</p>
          <a
            target="_self"
            href={XBOX_AUTH_URL}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Log into XBL network
          </a>
        </>
      )}

      {/** Render components for loading and error states */}
      {loading && <CircleLoader color="white" />}
      {error && <p>{error}</p>}

      {/** Render message if user has no data in sync yet for their XBL account  */}
      {!loading && !error && authState.xbl && !data.xbl && (
        <>
          <p>No data is in sync yet.</p>
        </>
      )}

      {/** Render synced content for logged in XBL account */}
      {!loading && !error && data.xbl && (
        <>
          <p>XBL User Info</p>
          <p>{data.xbl.profile.id}</p>
        </>
      )}

      {authState.xbl && (
        <button
          disabled={loading}
          onClick={() => sync(Services.XBL)}
          className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Sync data for XBL account
        </button>
      )}
    </div>
  );
}
