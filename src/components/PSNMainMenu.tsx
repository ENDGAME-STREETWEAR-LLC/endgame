"use client";

import { NPSSO_URL, PSN_AUTH_URL } from "@/constants/auth";
import useGamingServices from "@/hooks/useGamingServices";
import { PSNAuthSession, Services } from "@/types";
import { fetcher, PsnEndpoints } from "@/utils/api";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { CircleLoader, ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { useLocalization } from "@/hooks/useLocalization";

const arraySum = (array: number[]) =>
  array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

export default function PSNMainMenu() {
  const { localization: t } = useLocalization();
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
      alert(t.sessionExpired);
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
          <p>{t.psn.loggedOut}</p>
          <a
            target="_blank"
            href={PSN_AUTH_URL}
            className="w-full cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            {t.psn.logIn}
          </a>
          <a href={NPSSO_URL} target="_blank">
            <button className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]">
              {t.psn.retrieveToken}
            </button>
          </a>
          <input
            className="bg-[#FFFFFF33] rounded-full p-2"
            type="text"
            placeholder={t.psn.placeholder}
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
                {t.submit}
              </button>
              <button
                onClick={cancelAuthHandler}
                className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              >
                {t.cancel}
              </button>
            </>
          )}
        </div>
      </Modal>

      {/** Render components for loading and error states */}
      {loading && <CircleLoader color="white" />}
      {error && <p>{t.error}</p>}

      {/** Render message if user has no data in sync yet for their PSN account  */}
      {!loading && !error && !data.psn && (
        <>
          <p>{t.noData}</p>
        </>
      )}

      {/** Render synced content for logged in PSN account */}
      {!loading && !error && data.psn && (
        <>
          <h2 className="font-bold text-xl">{t.psn.info.title}:</h2>
          <img
            width={data.psn.profile.avatarUrls[0].size}
            height={data.psn.profile.avatarUrls[0].size}
            src={data.psn.profile.avatarUrls[0].avatarUrl}
          ></img>
          <p>
            {t.psn.info.profileName} {data.psn.profile.onlineId}
          </p>

          <div className="flex w-full justify-center">
            <div className="w-[500px] h-[500px] overflow-x-scroll bg-[#FFFFFF33] p-2 rounded-sm">
              <p>{t.psn.info.ownedTitles}</p>
              {data.psn.titles.trophyTitles.map((title, index) => (
                <div className="mt-4" key={title.npServiceName + index}>
                  <img
                    width={200}
                    height={200}
                    alt={title.trophyTitleName}
                    src={title.trophyTitleIconUrl}
                  ></img>
                  <p>
                    {t.psn.info.titleName} {title.trophyTitleName}
                  </p>
                  {title.trophyTitlePlatform !== "PS5" && (
                    <p>
                      {t.psn.info.titleDetail} {title.trophyTitleDetail}
                    </p>
                  )}
                  <p>
                    {t.psn.info.totalTrophiesPercentage} {title.progress}%
                  </p>
                  <p>
                    {t.psn.info.titlePlatform} {title.trophyTitlePlatform}
                  </p>
                  <p>
                    {t.psn.info.totalTrophiesCount}{" "}
                    {arraySum(Object.values(title.earnedTrophies))}
                  </p>
                  <div>
                    <p>
                      {t.psn.trophyTypes.bronze}: {title.earnedTrophies.bronze}
                    </p>
                    <p>
                      {t.psn.trophyTypes.silver}: {title.earnedTrophies.silver}
                    </p>
                    <p>
                      {t.psn.trophyTypes.gold}: {title.earnedTrophies.gold}
                    </p>
                    <p>
                      {t.psn.trophyTypes.platinum}:{" "}
                      {title.earnedTrophies.platinum}
                    </p>
                  </div>
                  <div className="flex flex-col mt-4">
                    <p>{t.psn.info.earnedTrophies}</p>
                    {data?.psn?.trophies
                      ?.find(
                        (trophy) =>
                          title.trophyTitleName === Object.keys(trophy)[0]
                      )
                      ?.[title.trophyTitleName].map((trophy) => (
                        <div
                          className="flex flex-col mb-4"
                          key={trophy.trophyId}
                        >
                          <img
                            width={200}
                            height={200}
                            src={trophy.trophyIconUrl}
                            alt={trophy.trophyId.toString()}
                          ></img>
                          <p>
                            {t.psn.info.trophyName} {trophy.trophyName}
                          </p>
                          <p>
                            {t.psn.info.trophyType}{" "}
                            {t.psn.trophyTypes[trophy.trophyType]}
                          </p>
                          <p>
                            {t.psn.info.trophyDetail} {trophy.trophyDetail}
                          </p>
                          <p>
                            {t.psn.info.trophyHidden}{" "}
                            {trophy.trophyHidden ? t.yes : t.no}
                          </p>
                        </div>
                      ))}
                  </div>
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
        {t.syncData}
      </button>
      {!loading && data.psn && (
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
