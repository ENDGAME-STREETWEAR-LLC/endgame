import { verifyEmpty } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";
import { exchangeRefreshTokenForAuthTokens } from "psn-api";

export const GET = async (req: NextRequest) => {
  try {
    const refreshToken = req.nextUrl.searchParams.get("refreshToken") as string;
    verifyEmpty(refreshToken);

    const newAuthorization = await exchangeRefreshTokenForAuthTokens(
      refreshToken
    );
    return NextResponse.json(newAuthorization);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
