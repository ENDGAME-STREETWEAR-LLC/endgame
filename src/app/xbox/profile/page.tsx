/* eslint-disable  @typescript-eslint/no-explicit-any */

import { fetcher, XboxEndpoints } from "@/utils/api";
import { formatObjectJSON } from "@/utils/text";
import { cookies } from "next/headers";
import Link from "next/link";
import { XBLAuthSession, XBLProfileData } from "@/types";

async function fetchXboxProfile(xuid: string) {
  try {
    const data = (await fetcher([
      XboxEndpoints.Profile,
      `?xuid=${xuid}`,
    ])) as XBLProfileData;
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

  const profileData = await fetchXboxProfile(xuid);

  if (!profileData) {
    return (
      <div className="p-4 text-red-600">
        Error loading profile. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full w-screen">
      <Link href="/xbox/home">Back to home</Link>
      <h1 className="text-2xl font-bold">Xbox Live Profile</h1>

      <div>
        <p>Player: {xuid}</p>
        <p>Titles:</p>
        <div className="mt-4">
          {formatObjectJSON(profileData).map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
