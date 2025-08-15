/* eslint-disable  @typescript-eslint/no-explicit-any */

import { fetcher, XboxEndpoints } from "@/utils/api";
import { formatObjectJSON } from "@/utils/text";
import { cookies } from "next/headers";
import { XBLAuthBody } from "types";

async function fetchXboxAchievements(xuid: string) {
  try {
    const data = await fetcher([XboxEndpoints.Achievements, `?xuid=${xuid}`]);
    return data;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return null;
  }
}

export default async function XboxAchievements() {
  const storedCookies = await cookies();
  console.log("xbox session", storedCookies.get("xbox_session"));
  const storedSession = storedCookies.get("xbox_session")?.value as string;

  if (!storedSession)
    return <div className="p-4 text-red-600">Error: Missing Xbox User ID</div>;

  const { xuid } = JSON.parse(storedSession) as XBLAuthBody;
  console.log("xuid", xuid);

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
      <h1 className="text-2xl font-bold">Xbox Live Achievements</h1>

      <div>
        <p>Player: {xuid}</p>
        <p>Titles:</p>
        {achievementsData.map((title: any, index: number) => (
          <div className="mt-4" key={title.titleId + index}>
            {formatObjectJSON(title).map((text) => (
              <p key={text}>{text}</p>
            ))}
            <br></br>
          </div>
        ))}
      </div>
    </div>
  );
}
