import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const storedCookies = await cookies();

    if (!body) {
      return NextResponse.json(
        { message: "Missing request body" },
        { status: 400 }
      );
    }

    if (Array.isArray(body)) {
      for (const cookie of body) {
        storedCookies.set(cookie?.name, cookie?.value);
      }
    } else {
      storedCookies.set(body?.name, body?.value);
    }

    return NextResponse.json(storedCookies.getAll(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
