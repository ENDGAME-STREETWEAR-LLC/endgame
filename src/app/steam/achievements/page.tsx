/* eslint-disable  @typescript-eslint/no-explicit-any */

import { cookies } from "next/headers";
import { fetcher, SteamEndpoints } from "@/utils/api";
import { formatObjectJSON } from "@/utils/text";

async function fetchSteamAchievements(userId: string) {
  try {
    const data = await fetcher([
      SteamEndpoints.Achievements,
      `?userId=${userId}`,
    ]);
    return data.response;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return null;
  }
}

export default async function SteamProfile() {
  const storedCookies = await cookies();
  const steamId = storedCookies.get("steam_session")?.value as string;

  if (!steamId)
    return <div className="p-4 text-red-600">Error: Missing Steam User ID</div>;

  const achievementsData = await fetchSteamAchievements(steamId);

  if (!achievementsData) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error loading achievements.</p>
        <p>Your profile is not public</p>
        <p>
          Try changing your profile settings at the{" "}
          <a href="https://store.steampowered.com/">Steam Community Page</a>
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <h1 className="text-2xl font-bold mb-4">Steam Achievements Info</h1>

      <div className="mb-4">
        <p>Player: {steamId}</p>

        <p>Game count: {achievementsData.game_count}</p>
        <p>Achievements:</p>
        {achievementsData.games.map((game: any) => {
          return (
            <div className="mt-4" key={game.id}>
              {formatObjectJSON(game).map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
