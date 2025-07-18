import { cookies } from "next/headers";
import { XBLAuthBody } from "types";

// Configuración importante - coloca estos valores en tus variables de entorno
const XBOX_API_KEY = "c4a1fcac-49ef-4427-afae-e5dd85122381"

async function fetchXboxAchievements(xuid: string) {
  const url = `https://xbl.io/api/v2/achievements/player/${xuid}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": XBOX_API_KEY as string,
      },
      next: { revalidate: 3600 }, // Cache los resultados por 1 hora
    });

    if (!response.ok) {
      throw new Error(`Xbox API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return null;
  }
}

export default async function XboxAchievements() {
  if (!XBOX_API_KEY) {
    return (
      <div className="p-4 text-red-600">
        Error: Missing .env variable XBOX_API_KEY
      </div>
    );
  }

  const storedCookies = await cookies();
  const storedSession = storedCookies.get("xbox_session")?.value as string;

  if (!storedSession)
    return <div className="p-4 text-red-600">Error: Missing Xbox User ID</div>;

  const { xuid } = JSON.parse(storedSession) as XBLAuthBody;

  const achievementsData = await fetchXboxAchievements(xuid);

  if (!achievementsData) {
    return (
      <div className="p-4 text-red-600">
        Error loading achievements. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Xbox Live Achievements</h1>

      <div className="mb-4">
        <p>Player: {achievementsData.xuid}</p>
        <p>Total achievements: {achievementsData.achievements?.length || 0}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementsData.achievements?.map((achievement: any) => (
          <div key={achievement.id} className="border p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg">{achievement.name}</h2>
            <p className="text-gray-600">{achievement.description}</p>
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-semibold">Game:</span>{" "}
                {achievement.titleName}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Unlocked:</span>{" "}
                {achievement.progression?.timeUnlocked || "No desbloqueado"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Points:</span>{" "}
                {achievement.rewardPoints}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
