import { verifyEmpty } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";
import { getUserTitles } from "psn-api";

export const GET = async (req: NextRequest) => {
  try {
    const accessToken = req.nextUrl.searchParams.get("accessToken") as string;
    verifyEmpty(accessToken);

    const response = await getUserTitles({ accessToken }, "me");
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
