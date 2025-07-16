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

export const Endpoints = Object.freeze({
  AccessToken: `${process.env.API_URL}/api/getAccessToken`,
  UserProfile: `${process.env.API_URL}/api/getUserProfile`,
  UserTitles: `${process.env.API_URL}/api/getUserTitles`,
  TitleTrophies: `${process.env.API_URL}/api/geTitleTrophies`,
  RefreshToken: `${process.env.API_URL}/api/refreshToken`,
});

type Endpoint = (typeof Endpoints)[keyof typeof Endpoints];

export const fetcher = async (
  endpoint: Endpoint | [Endpoint, string],
  options: RequestInit
) => {
  let url: string;
  if (typeof endpoint === "string") {
    url = endpoint;
  } else {
    url = endpoint[0] + endpoint[1];
  }
  const response = await fetch(url, options);

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);

  return data;
};
