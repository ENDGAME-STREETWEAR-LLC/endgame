/* eslint-disable  @typescript-eslint/no-explicit-any */

import { fetcher, XboxEndpoints } from "@/utils/api";
import { cookies } from "next/headers";
import { XBLAchievementsData, XBLAuthSession } from "@/types";
import Link from "next/link";

async function fetchXboxAchievements(xuid: string) {
  try {
    const data = (await fetcher([
      XboxEndpoints.Achievements,
      `?xuid=${xuid}`,
    ])) as XBLAchievementsData;
    return data;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return null;
  }
}

export default async function XboxAchievements() {
  const storedCookies = await cookies();
  const storedSession = storedCookies.get("xbox_session")?.value as string;

  if (!storedSession)
    return <div className="p-4 text-red-600">Error: Missing Xbox User ID</div>;

  const { xuid } = JSON.parse(storedSession) as XBLAuthSession;

  const achievementsData = await fetchXboxAchievements(xuid);

  if (!achievementsData) {
    return (
      <div className="p-4 text-red-600">
        Error loading achievements. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full w-full">
      <Link href="/xbox/home">Back to home</Link>
      <h1 className="text-2xl font-bold">Xbox Live Achievements</h1>

      <div>
        <p>Player: {xuid}</p>
        <p>Titles:</p>
        {JSON.stringify(achievementsData)}
      </div>
    </div>
  );
}
