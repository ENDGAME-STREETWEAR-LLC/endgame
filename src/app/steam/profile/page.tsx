import { cookies } from "next/headers";
import { fetcher, SteamEndpoints } from "@/utils/api";
import { formatObjectJSON } from "@/utils/text";
import { SteamAuthSession, SteamProfileData } from "types";
import Link from "next/link";

async function fetchSteamProfile(userId: string) {
  try {
    const data = (await fetcher([
      SteamEndpoints.Profile,
      `?userId=${userId}`,
    ])) as SteamProfileData;
    return data.response.players[0];
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

  const profileData = await fetchSteamProfile(steamId);

  if (!profileData) {
    return (
      <div className="p-4 text-red-600">
        Error loading profile. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <Link href="/steam/home">Back to home</Link>
      <h1 className="text-2xl font-bold mb-4">Steam Games Info</h1>

      <div className="mb-4">
        <p>Player: {steamId}</p>
        <p>Profile:</p>
        <div className="mt-4">
          {formatObjectJSON(profileData).map((text) => (
            <p key={text}>{text}</p>
          ))}
          <br></br>
        </div>
      </div>
    </div>
  );
}
