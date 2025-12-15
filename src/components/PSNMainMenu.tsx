"use client";

import { NPSSO_URL, PSN_AUTH_URL } from "@/constants/auth";
import useGamingServices from "@/hooks/useGamingServices";
import { PSNAuthSession, Services } from "@/types";
import { fetcher, PsnEndpoints } from "@/utils/api";
import { formatObjectJSON } from "@/utils/text";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { CircleLoader, ClipLoader } from "react-spinners";
import Modal from "./Modal";

export default function PSNMainMenu() {
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, error, sync, data, authState, logout] = useGamingServices();
  const router = useRouter();

  const [npsso, setNpsso] = useState("");

  const changeNpssoHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setNpsso(event.target.value),
    [npsso]
  );

  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {
    if (authInProgress && data.psn) {
      alert("Your session has expired. Please log in again.");
    }
  }, [authInProgress]);

  const syncDataHandler = () => {
    if (authState.psn) {
      sync(Services.PSN);
    } else {
      setAuthInProgress(true);
    }
  };

  const cancelAuthHandler = () => setAuthInProgress(false);

  const submitNpssoHandler = useCallback(async () => {
    try {
      setAuthLoading(true);
      const data = (await fetcher([
        PsnEndpoints.AccessToken,
        `?npsso=${npsso}`,
      ])) as PSNAuthSession;

      document.cookie = `psn_session=${JSON.stringify(data)}; max-age=${
        data.expiresIn
      }; path=/psn/home`;
      setNpsso("");
      setAuthInProgress(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  }, [npsso]);

  const logoutHandler = async () => {
    await logout(Services.PSN);
    document.cookie = "psn_session=; Max-Age=0; path=/psn/home";
    router.refresh();
  };

  return (
    <div className="w-full h-full justify-center items-center flex flex-col gap-[1rem]">
      {/** Render message if user is logged out of PSN network */}

      <Modal open={authInProgress}>
        <div className="flex flex-col gap-3 text-center items-center w-full p-4">
          <p>You are currently logged out of PSN Network.</p>
          <a
            target="_blank"
            href={PSN_AUTH_URL}
            className="w-full cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
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
          {authLoading ? (
            <button
              disabled
              className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            >
              <ClipLoader />
            </button>
          ) : (
            <>
              <button
                onClick={submitNpssoHandler}
                className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              >
                Submit
              </button>
              <button
                onClick={cancelAuthHandler}
                className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </Modal>

      {/** Render components for loading and error states */}
      {loading && <CircleLoader color="white" />}
      {error && <p>{error}</p>}

      {/** Render message if user has no data in sync yet for their PSN account  */}
      {!loading && !error && !data.psn && (
        <>
          <p>No data is in sync yet.</p>
        </>
      )}

      {/** Render synced content for logged in PSN account */}
      {!loading && !error && data.psn && (
        <>
          <p>PSN User Info</p>
          <p>Name: {data.psn.profile.onlineId}</p>

          <div className="flex w-full justify-evenly">
            <div className="w-[300px] h-[300px] overflow-x-scroll bg-[#FFFFFF33] p-2 rounded-sm">
              <p>Earned trophies:</p>
              {data.psn.trophies.map((trophy, index) => (
                <div className="mt-4" key={index}>
                  {formatObjectJSON(trophy).map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                  <br></br>
                </div>
              ))}
            </div>

            <div className="w-[300px] h-[300px] overflow-x-scroll bg-[#FFFFFF33] p-2 rounded-sm">
              <p>Owned Titles:</p>
              {data.psn.titles.trophyTitles.map((title, index) => (
                <div className="mt-4" key={title.npServiceName + index}>
                  {formatObjectJSON(title).map((text) => (
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
        Sync data for PSN account
      </button>
      {!loading && data.psn && (
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
