import { verifyEmpty } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";
import { getProfileFromUserName } from "psn-api";

export const GET = async (req: NextRequest) => {
  try {
    const accessToken = req.headers.get("authorization") as string;
    verifyEmpty(accessToken);

    const response = await getProfileFromUserName({ accessToken }, "me");
    return NextResponse.json(response.profile);
  } catch (error) {
    console.log("error",error)
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
