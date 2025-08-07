import { verifyEmpty } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";
import {
  getTitleTrophies,
  getUserTrophiesEarnedForTitle,
  TitleThinTrophy,
} from "psn-api";

export const GET = async (req: NextRequest) => {
  try {
    const accessToken = req.headers.get("authorization") as string;
    verifyEmpty(accessToken);

    const npCommunicationId = req.nextUrl.searchParams.get(
      "npCommunicationId"
    ) as string;
    verifyEmpty(npCommunicationId, "NP Service Name must not be empty");

    const npServiceName = req.nextUrl.searchParams.get("npServiceName") as
      | "trophy"
      | "trophy2";
    verifyEmpty(npServiceName, "Platform must not be empty");

    const userTrophies = await getUserTrophiesEarnedForTitle(
      { accessToken },
      "me",
      npCommunicationId,
      "all",
      { npServiceName }
    );

    const earnedUserTrophies = userTrophies.trophies.filter(
      (trophy) => trophy.earned
    );

    const titleTrophies = await getTitleTrophies(
      { accessToken },
      npCommunicationId,
      "all",
      { npServiceName: npServiceName as "trophy" | "trophy2" }
    );

    const earnedTitleTrophies = titleTrophies.trophies.reduce(
      (array, titleTrophy) => {
        const trophyEarned = earnedUserTrophies.some(
          (userTrophy) => userTrophy.trophyId === titleTrophy.trophyId
        );

        if (trophyEarned) array.push(titleTrophy);
        return array;
      },
      [] as TitleThinTrophy[]
    );

    return NextResponse.json(earnedTitleTrophies);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
