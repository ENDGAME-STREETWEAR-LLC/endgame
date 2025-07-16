import { Endpoints, fetcher } from "@/utils/api";
import { cookies } from "next/headers";
import Link from "next/link";
import { TitleTrophiesResponse, UserTitlesResponse } from "psn-api";

export default async function Games() {
  const cookieStore = await cookies();
  const authorization = JSON.parse(
    cookieStore.get("authorization")?.value as string
  );

  const titlesData = (await fetcher(Endpoints.UserTitles, {
    headers: {
      Authorization: authorization.accessToken,
    },
  })) as UserTitlesResponse;

  const trophiesData = await Promise.all(
    titlesData.trophyTitles.map(
      async (title) =>
        (await fetcher(
          [
            Endpoints.TitleTrophies,
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
      <Link href="/home">Back to home</Link>
      {JSON.stringify(titlesData)}
      {JSON.stringify(trophiesData)}
    </>
  );
}
