import { NextRequest, NextResponse } from "next/server";
import { SteamAuthSession, XBLAuthSession } from "@/types";

/**
 * Request matchers for middleware function
 */
const REQUEST_MATCHERS = Object.freeze({
  /**
   * Xbox request matcher path.
   */
  Xbox: "/xbox",
  /**
   * Steam request matcher path.
   */
  Steam: "/steam",
});

/**
 * Middleware function to control sign in flows for Xbox Live and Steam.
 * Both authentication providers utilize redirects in their authentication service, reason for which
 * they must be handled inside a middleware function to verify user credentials and safely allow
 * the user to access the homepage. Auth credentials are stored as session data inside the
 * browser's cookies, which are persisted across pages as the user browses the website.
 */
export async function middleware(req: NextRequest) {
  switch (req.nextUrl.pathname) {
    // Xbox middleware
    case REQUEST_MATCHERS.Xbox:
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

      // Use code to claim authentication data for user
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

      const data = (await response.json()) as XBLAuthSession;
      const xboxRes = NextResponse.redirect(new URL("/xbox/home", req.url));

      // TODO set expiry time for session cookies
      xboxRes.cookies.set("xbox_session", JSON.stringify(data), {
        maxAge: 3600,
        path: "/xbox/home",
      });
      return xboxRes;

    case REQUEST_MATCHERS.Steam:
      // Search Query Param containing the user's Steam ID.
      const claimedId = req.nextUrl.searchParams.get("openid.claimed_id");

      if (!claimedId) {
        console.error("Invalid OpenID Identity");
        return NextResponse.redirect(new URL("/", req.url));
      }

      const userId = claimedId.split("/")[5] as SteamAuthSession;
      const steamRes = NextResponse.redirect(new URL("/steam/home", req.url));

      // TODO set expiry time for session cookies
      steamRes.cookies.set("steam_session", userId, {
        maxAge: 3600,
        path: "/steam/home",
      });
      return steamRes;
  }
}

// Request matchers must be added as string literals to be recognized by Next.JS
export const config = {
  matcher: ["/xbox", "/steam"],
};
