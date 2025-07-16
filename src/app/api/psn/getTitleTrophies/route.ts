import { verifyEmpty } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";
import { getTitleTrophies } from "psn-api";

export const GET = async (req: NextRequest) => {
  try {
    const accessToken = req.headers.get("authorization") as string;
    verifyEmpty(accessToken);

    const npCommunicationId = req.nextUrl.searchParams.get(
      "npCommunicationId"
    ) as string;
    verifyEmpty(npCommunicationId, "NP Service Name must not be empty");

    const npServiceName = req.nextUrl.searchParams.get(
      "npServiceName"
    ) as string;
    verifyEmpty(npServiceName, "Platform must not be empty");

    const response = await getTitleTrophies(
      { accessToken },
      npCommunicationId,
      "all",
      {
        npServiceName: npServiceName as "trophy" | "trophy2",
      }
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
