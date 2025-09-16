import SteamMainMenu from "@/components/SteamMainMenu";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const storedCookies = await cookies();
  const storedSession = storedCookies.get("steam_session");

  if (!storedSession) return redirect("/");

  return <SteamMainMenu />;
}
