import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/xbox") {
    const appKey = process.env.NEXT_PUBLIC_XBOX_APP_KEY;

    if (!appKey) {
      console.error("Missing .env variable: NEXT_PUBLIC_XBOX_APP_KEY");
      return NextResponse.redirect(new URL("/", req.url));
    }

    const params = req.nextUrl.searchParams;
    const code = params.get("code");

    if (!code) {
      console.error("Missing Authentication Code");
      return NextResponse.redirect(new URL("/", req.url));
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

  if (req.nextUrl.pathname === "/steam") {
    const claimedId = req.nextUrl.searchParams.get("openid.claimed_id");
    console.log("user id", claimedId);

    if (!claimedId) {
      console.error("Invalid OpenID Identity");
      return NextResponse.redirect(new URL("/", req.url));
    }

    const userId = claimedId.split("/")[5];
    const nextRes = NextResponse.redirect(new URL("/steam/home", req.url));

    nextRes.cookies.set("steam_session", userId);
    return nextRes;
  }
}

export const config = {
  matcher: ["/xbox", "/steam"],
};
