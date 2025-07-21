import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("middleware running");
  const appKey = process.env.NEXT_PUBLIC_XBOX_APP_KEY;

  if (!appKey) {
    console.error("Missing .env variable: NEXT_PUBLIC_XBOX_APP_KEY");
    return NextResponse.redirect("/");
  }

  const params = req.nextUrl.searchParams;
  const code = params.get("code");

  if (!code) {
    console.error("Missing Authentication Code");
    return NextResponse.redirect("/");
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
    console.error("Error authenticating with XBL:", response.statusText);
    return NextResponse.error();
  }

  const data = await response.json();

  const nextRes = NextResponse.redirect(new URL("/xbox/home", req.url));
  nextRes.cookies.set("xbox_session", JSON.stringify(data));
  return nextRes;
}

export const config = {
  matcher: "/xbox",
};
