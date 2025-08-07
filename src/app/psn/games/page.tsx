import { PsnEndpoints, fetcher } from "@/utils/api";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  TitleThinTrophy,
  UserTitlesResponse,
  UserTrophiesBySpecificTitleResponse,
} from "psn-api";
import { Fragment } from "react";

export default async function Games() {
  const storedCookies = await cookies();
  const storedSession = storedCookies.get("psn_session")?.value;

  if (!storedSession)
    return (
      <div>
        <p>Missing authorization</p>
      </div>
    );

  const authorization = JSON.parse(storedSession);

  const titlesData = (await fetcher(PsnEndpoints.UserTitles, {
    headers: {
      Authorization: authorization.accessToken,
    },
  })) as UserTitlesResponse;

  const trophiesData = await Promise.all(
    titlesData.trophyTitles.map(
      async (title) =>
        (await fetcher(
          [
            PsnEndpoints.TitleTrophies,
            `?npCommunicationId=${title.npCommunicationId}&npServiceName=${title.npServiceName}`,
          ],
          {
            headers: {
              Authorization: authorization.accessToken,
            },
          }
        )) as TitleThinTrophy[]
    )
  );

  return (
    <>
      <Link href="/psn/home">Back to home</Link>
      {titlesData?.trophyTitles?.map((title, index) => (
        <Fragment key={title.npCommunicationId + index}>
          <div className="bg-[rgb(40,40,40)]">
            <p>Title name: {title?.trophyTitleName}</p>
            <p>Title Detail: {title?.trophyTitleDetail}</p>
            <p>Title Trophy progress: {title?.progress}</p>
            <p>Total Trophies: {JSON.stringify(title?.earnedTrophies || "")}</p>
            <p>
              Last updated time:{" "}
              {new Date(title?.lastUpdatedDateTime || "").toDateString()}
            </p>
            <p>Title Platform: {title?.trophyTitlePlatform}</p>
            <p>Has trophy groups: {title?.hasTrophyGroups}</p>
            <p>Trophy set version: {title?.trophySetVersion}</p>
            <p>Earned Trophies:</p>
            <br></br>
            {trophiesData?.at(index)?.map((trophy) => {
              return (
                <span key={trophy?.trophyId}>
                  <p>Name: {trophy?.trophyName}</p>
                  <p>Detail: {trophy?.trophyDetail}</p>
                  <p>Type: {trophy?.trophyType}</p>
                  <p>Is Secret: {JSON.stringify(trophy?.trophyHidden)}</p>
                  <br></br>
                </span>
              );
            })}
          </div>
          <br></br>
        </Fragment>
      ))}
    </>
  );
}
