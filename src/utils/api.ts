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

export const PsnEndpoints = Object.freeze({
  AccessToken: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/getAccessToken`,
  UserProfile: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/getUserProfile`,
  UserTitles: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/getUserTitles`,
  TitleTrophies: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/getTitleTrophies`,
  RefreshToken: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/refreshToken`,
});

type PsnEndpoint = (typeof PsnEndpoints)[keyof typeof PsnEndpoints];

export const XboxEndpoints = Object.freeze({
  Auth: `${process.env.NEXT_PUBLIC_API_URL}/api/xbox/auth`,
});

type XboxEndpoint = (typeof XboxEndpoints)[keyof typeof XboxEndpoints];

type Endpoint = PsnEndpoint | XboxEndpoint;

export const fetcher = async (
  endpoint: Endpoint | [Endpoint, string],
  options?: RequestInit
) => {
  let url: string;
  if (typeof endpoint === "string") {
    url = endpoint;
  } else {
    url = endpoint[0] + endpoint[1];
  }
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    console.log("Fetcher error", data, response.statusText);
    throw new Error(data.message);
  }
  return data;
};
