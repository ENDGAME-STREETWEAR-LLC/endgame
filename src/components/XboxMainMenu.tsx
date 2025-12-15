"use client";

import { XBOX_AUTH_URL } from "@/constants/auth";
import useGamingServices from "@/hooks/useGamingServices";
import { Services } from "@/types";
import { CircleLoader } from "react-spinners";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function XboxMainMenu() {
  const router = useRouter();
  const [loading, error, sync, data, authState, logout] = useGamingServices();
  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {
    if (authInProgress && data.xbl) {
      alert("Your session has expired. Please log in again.");
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
          <p>You are currently logged out of XBL Network.</p>
          <a
            target="_self"
            href={XBOX_AUTH_URL}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Log into XBL network
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

      {/** Render message if user has no data in sync yet for their XBL account  */}
      {!loading && !error && !data.xbl && (
        <>
          <p>No data is in sync yet.</p>
        </>
      )}

      {/** Render synced content for logged in XBL account */}
      {!loading && !error && data.xbl && (
        <>
          <p>XBL User Info</p>
          <p>Name: {data.xbl.profile.id}</p>

          <div className="flex w-full justify-evenly">
            <div className="w-[300px] h-[300px] overflow-x-scroll bg-[#FFFFFF33] p-2 rounded-sm">
              <p>Earned achievements:</p>
              {JSON.stringify(data.xbl.achievements)}
            </div>

            <div className="w-[300px] h-[300px] overflow-x-scroll bg-[#FFFFFF33] p-2 rounded-sm">
              <p>Profile Data:</p>
              {JSON.stringify(data.xbl.profile)}
            </div>
          </div>
        </>
      )}

      <button
        disabled={loading}
        onClick={syncDataHandler}
        className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      >
        Sync data for XBL account
      </button>
      {!loading && data.xbl && (
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
