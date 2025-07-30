import { PsnEndpoints, fetcher } from "@/utils/api";
import { cookies } from "next/headers";
import Link from "next/link";
import { TitleTrophiesResponse, UserTitlesResponse } from "psn-api";

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
        )) as TitleTrophiesResponse
    )
  );

  return (
    <>
      <Link href="/psn/home">Back to home</Link>
      {titlesData?.trophyTitles?.map((title, index) => (
        <div>
          <p>Title name: {title?.trophyTitleName}</p>
          <p>Icon:</p>
          <p>Title Detail: {title?.trophyTitleDetail}</p>
          <p>Title Trophy progress: {title?.progress}</p>
          <p>
            Defined trophies: {JSON.stringify(title?.definedTrophies || "")}
          </p>
          <p>Earned Trophies: {JSON.stringify(title?.earnedTrophies || "")}</p>
          <p>
            Last updated time:{" "}
            {new Date(title?.lastUpdatedDateTime || "").toDateString()}
          </p>
          <p>Title Platform: {title?.trophyTitlePlatform}</p>
          <p>Has trophy groups: {title?.hasTrophyGroups}</p>
          <p>Trophy set version: {title?.trophySetVersion}</p>
          <p>Trophies:</p>
          {trophiesData?.at(index)?.trophies?.map((trophy) => {
            return (
              <span key={trophy?.trophyId}>
                <p>Name: {trophy?.trophyName}</p>
                <p>Detail: {trophy?.trophyDetail}</p>
                <p>Icon:</p>
                <p>Type: {trophy?.trophyType}</p>
                <p>Is Secret: {trophy?.trophyHidden}</p>
              </span>
            );
          })}
        </div>
      ))}
    </>
  );
}
