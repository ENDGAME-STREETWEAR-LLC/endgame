import { verifyEmpty } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const xuid = req.nextUrl.searchParams.get("xuid");
    verifyEmpty(xuid, "XUID must not be empty");

    const response = await fetch(
      `${process.env.EXPRESS_URL}/achievements?xuid=${xuid}`
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
