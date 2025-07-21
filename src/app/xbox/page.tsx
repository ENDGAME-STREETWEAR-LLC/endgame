import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function XboxPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const appKey = process.env.XBOX_APP_KEY;

  if (!appKey) {
    console.log("Missing .env variable: XBOX_APP_KEY");
    return redirect("/");
  }

  const params = await searchParams;
  const code = params.code;

  if (!code) {
    console.log("Missing Authentication Code");
    return redirect("/");
  }

  const response = await fetch("https://xbl.io/app/claim", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      app_key: appKey,
    }),
  });

  if (!response.ok) {
    return (
      <div>
        <p>Error authenticating with XBL:</p>
        <p>{response.statusText}</p>
      </div>
    );
  }

  const data = await response.json();

  const storedCookies = await cookies();
  storedCookies.set("xbox_session", JSON.stringify(data));

  return redirect("/xbox/home");
}
