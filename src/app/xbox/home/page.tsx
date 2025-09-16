import XboxMainMenu from "@/components/XboxMainMenu";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const storedCookies = await cookies();
  const storedSession = storedCookies.get("xbox_session");

  if (!storedSession) return redirect("/");

  return <XboxMainMenu />;
}
