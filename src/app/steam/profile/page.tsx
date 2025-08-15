import { cookies } from "next/headers";
import { fetcher, SteamEndpoints } from "@/utils/api";

async function fetchSteamProfile(userId: string) {
  try {
    const data = await fetcher([SteamEndpoints.Profile, `?userId=${userId}`]);
    return data;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return null;
  }
}

export default async function SteamProfile() {
  const storedCookies = await cookies();
  console.log("steam session", storedCookies.get("steam_session"));
  const steamId = storedCookies.get("steam_session")?.value as string;

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Steam Profile Info</h1>

      <div className="mb-4">
        <p>Player: {steamId}</p>
        <p>Titles: {JSON.stringify(profileData)}</p>
      </div>
    </div>
  );
}
