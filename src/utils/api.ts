import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { AuthTokensResponse } from "psn-api";

export async function routeWithErrorHandling(
  callback: (req: NextRequest) => Promise<NextResponse>
) {
  try {
    return async (req: NextRequest) => await callback(req);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export function verifyEmpty(
  value: any,
  message = "Token payload must not be empty"
) {
  if (!value) return NextResponse.json({ message }, { status: 400 });
}

export function isExpired({ idToken, expiresIn }: AuthTokensResponse) {
  const decodedJwt = jwt.decode(idToken, { json: true }) as jwt.JwtPayload;
  verifyEmpty(decodedJwt, "Provided JWT is not valid");

  const expiryDate = new Date(((decodedJwt.iat as number) + expiresIn) * 1000);
  const currentDate = new Date(Date.now());

  return currentDate > expiryDate;
}
