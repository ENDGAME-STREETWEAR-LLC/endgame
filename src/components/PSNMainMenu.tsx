"use client";

import { NPSSO_URL, PSN_AUTH_URL } from "@/constants/auth";
import useGamingServices from "@/hooks/useGamingServices";
import { Services } from "@/types";
import { fetcher, PsnEndpoints } from "@/utils/api";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";
import { CircleLoader } from "react-spinners";

export default function PSNMainMenu() {
  const [loading, error, sync, data, authState] = useGamingServices();
  const router = useRouter();

  const [npsso, setNpsso] = useState("");

  const changeNpssoHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setNpsso(event.target.value),
    [npsso]
  );

  const submitNpssoHandler = useCallback(async () => {
    try {
      const data = await fetcher([PsnEndpoints.AccessToken, `?npsso=${npsso}`]);

      // TODO add expiry time for session cookies
      document.cookie = `psn_session=${JSON.stringify(data)}`;
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [npsso]);

  return (
    <div className="w-full h-full justify-center items-center flex flex-col gap-[1rem]">
      {/** Render message if user is logged out of PSN network */}
      {!loading && !authState.psn && (
        <>
          <p>You are currently logged out of PSN Network.</p>
          <a
            target="_blank"
            href={PSN_AUTH_URL}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Log into PSN Network
          </a>
          <a href={NPSSO_URL} target="_blank">
            <button className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]">
              Retrieve NPSSO token
            </button>
          </a>
          <input
            className="bg-[#FFFFFF33] rounded-full p-2"
            type="text"
            placeholder="Enter NPSSO..."
            onChange={changeNpssoHandler}
          />
          <button
            onClick={submitNpssoHandler}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Submit
          </button>
        </>
      )}

      {/** Render components for loading and error states */}
      {loading && <CircleLoader color="white" />}
      {error && <p>{error}</p>}

      {/** Render message if user has no data in sync yet for their PSN account  */}
      {!loading && !error && authState.psn && !data.psn && (
        <>
          <p>No data is in sync yet.</p>
        </>
      )}

      {/** Render synced content for logged in PSN account */}
      {!loading && !error && data.psn && (
        <>
          <p>PSN User Info</p>
          <p>{data.psn.profile.onlineId}</p>
        </>
      )}

      {authState.psn && (
        <button
          disabled={loading}
          onClick={() => sync(Services.PSN)}
          className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Sync data for PSN account
        </button>
      )}
    </div>
  );
}
