/* eslint-disable  @typescript-eslint/no-explicit-any */

import { cookies } from "next/headers";
import { fetcher, SteamEndpoints } from "@/utils/api";
import { formatObjectJSON } from "@/utils/text";
import { SteamAuthSession, SteamGamesData } from "types";
import Link from "next/link";

async function fetchSteamGames(userId: string) {
  try {
    const data = (await fetcher([
      SteamEndpoints.Games,
      `?userId=${userId}`,
    ])) as SteamGamesData;
    return data.response;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return null;
  }
}

export default async function SteamProfile() {
  const storedCookies = await cookies();
  const steamId = storedCookies.get("steam_session")?.value as SteamAuthSession;

  if (!steamId)
    return <div className="p-4 text-red-600">Error: Missing Steam User ID</div>;

  const gamesData = await fetchSteamGames(steamId);

  if (!gamesData) {
    return (
      <div className="p-4 text-red-600">
        Error loading games. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <Link href="/steam/home">Back to home</Link>
      <h1 className="text-2xl font-bold mb-4">Steam Games Info</h1>

      <div className="mb-4">
        <p>Player: {steamId}</p>
        <p>Total owned games: {gamesData.game_count}</p>
        <p>Owned Games:</p>
        {gamesData.games.map((game, index) => (
          <div className="mt-4" key={game.appid + index}>
            {formatObjectJSON(game).map((text) => (
              <p key={text}>{text}</p>
            ))}
            <br></br>
          </div>
        ))}
      </div>
    </div>
  );
}
