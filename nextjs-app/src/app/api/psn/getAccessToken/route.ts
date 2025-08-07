import { VALID_NPSSO_LENGTH } from "@/constants/auth";
import { verifyEmpty } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";
import {
  exchangeAccessCodeForAuthTokens,
  exchangeNpssoForAccessCode,
} from "psn-api";

export const GET = async (req: NextRequest) => {
  try {
    const npsso = req.nextUrl.searchParams.get("npsso") as string;
    verifyEmpty("NPSSO must not be empty.")

    if (npsso.length !== VALID_NPSSO_LENGTH)
      return NextResponse.json(
        { message: "Provided NPSSO is not valid." },
        { status: 400 }
      );

    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    return NextResponse.json(authorization);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
