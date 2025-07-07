import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { AuthTokensResponse } from "psn-api";

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

export const getTitleOptionsFromPlatform = (
  platform: string
): Partial<{ npServiceName: "trophy" }> => {
  if (platform === "PS5") return {};
  return { npServiceName: "trophy" };
};
