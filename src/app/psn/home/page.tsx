import PSNMainMenu from "@/components/PSNMainMenu";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const storedCookies = await cookies();
  const storedSession = storedCookies.get("psn_session");

  if (!storedSession) return redirect("/");

  return <PSNMainMenu />;
}
