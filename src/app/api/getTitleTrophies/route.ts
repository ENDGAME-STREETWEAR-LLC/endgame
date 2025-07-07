import { getTitleOptionsFromPlatform, verifyEmpty } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";
import { getProfileFromUserName, getTitleTrophies } from "psn-api";

export const GET = async (req: NextRequest) => {
  try {
    const accessToken = req.nextUrl.searchParams.get("accessToken") as string;
    verifyEmpty(accessToken);

    const npServiceName = req.nextUrl.searchParams.get(
      "npServiceName"
    ) as string;
    verifyEmpty(npServiceName, "NP Service Name must not be empty");

    const platform = req.nextUrl.searchParams.get("platform") as string;
    verifyEmpty(platform, "Platform must not be empty");

    const options = getTitleOptionsFromPlatform(platform);

    const response = await getTitleTrophies(
      { accessToken },
      npServiceName,
      "all",
      options
    );
    return NextResponse.json(response);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
