import { fetcher, PsnEndpoints } from "@/utils/api";

const GamingServices = {
  Playstation: "playstation",
  Xbox: "xbox",
  Steam: "steam",
};

export default function MainApp() {
  const syncAchievementsHandler = async (
    service: keyof typeof GamingServices
  ) => {
    switch (service) {
      case "Playstation":
        break;
      case "Xbox":
        break;
      case "Steam":
        break;
    }
  };

  return (
    <div>
      <header>
        <h1>Sync achievements</h1>
        {Object.keys(GamingServices).map((key) => (
          <button key={key}>Sync {key} achievements</button>
        ))}
      </header>
    </div>
  );
}
