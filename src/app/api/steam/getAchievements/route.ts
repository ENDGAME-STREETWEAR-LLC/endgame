import { verifyEmpty } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    verifyEmpty(userId, "User ID must not be empty");

    const response = await fetch(
      `${process.env.EXPRESS_URL}/steam/achievements?userId=${userId}`
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
