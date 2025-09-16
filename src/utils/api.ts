/* eslint-disable  @typescript-eslint/no-explicit-any */

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { AuthTokensResponse } from "psn-api";

/**
 * Function to verify that a given value is not falsy/undefined. Used within API route handlers.
 * @param value Any value coming from an API request (such as request body, query params, etc...).
 * @param message Message to be returned as a response if the value is empty.
 * @returns
 */
export function verifyEmpty(
  value: any,
  message = "Token payload must not be empty"
) {
  if (!value) return NextResponse.json({ message }, { status: 400 });
}

/**
 * Function to verify if JWT token is invalid or expired.
 * @param tokenObj An object containing two properties, an 'idToken' which must be a valid Bearer token in JWT format, and 'expiresIn' which must be the expiry time of the token in seconds.
 * @returns True if token is expired, false if token is still valid.
 */
export function isExpired({ idToken, expiresIn }: AuthTokensResponse) {
  const decodedJwt = jwt.decode(idToken, { json: true }) as jwt.JwtPayload;
  verifyEmpty(decodedJwt, "Provided JWT is not valid");

  const expiryDate = new Date(((decodedJwt.iat as number) + expiresIn) * 1000);
  const currentDate = new Date(Date.now());

  return currentDate > expiryDate;
}

/**
 * All possible endpoints for PSN API
 */
export const PsnEndpoints = Object.freeze({
  AccessToken: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/getAccessToken`,
  UserProfile: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/getUserProfile`,
  UserTitles: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/getUserTitles`,
  TitleTrophies: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/getTitleTrophies`,
  RefreshToken: `${process.env.NEXT_PUBLIC_API_URL}/api/psn/refreshToken`,
});

type PsnEndpoint = (typeof PsnEndpoints)[keyof typeof PsnEndpoints];

/**
 * All possible endpoints for XBL API
 */
export const XboxEndpoints = Object.freeze({
  Auth: `${process.env.NEXT_PUBLIC_API_URL}/api/xbox/auth`,
  Achievements: `${process.env.NEXT_PUBLIC_API_URL}/api/xbox/getAchievements`,
  Profile: `${process.env.NEXT_PUBLIC_API_URL}/api/xbox/getProfile`,
});

type XboxEndpoint = (typeof XboxEndpoints)[keyof typeof XboxEndpoints];

/**
 * All possible endpoints for Steam API
 */
export const SteamEndpoints = Object.freeze({
  Profile: `${process.env.NEXT_PUBLIC_API_URL}/api/steam/getProfile`,
  Games: `${process.env.NEXT_PUBLIC_API_URL}/api/steam/getGames`,
  Achievements: `${process.env.NEXT_PUBLIC_API_URL}/api/steam/getAchievements`,
});

type SteamEndpoint = (typeof SteamEndpoints)[keyof typeof SteamEndpoints];

/**
 * Generic Endpoint type that extends every possible endpoint
 */
type Endpoint = PsnEndpoint | XboxEndpoint | SteamEndpoint;

/**
 * Custom fetcher function that safely uses endpoints declared in the API utils file.
 * @param endpoint Must contain a valid Endpoint from the API utils. Can be an endpoint string, or an array that contains an endpoint string as its first item, and a query string as its second item (i.e "?foo=bar&john=doe").
 * @param options Request init options passed down to the fetch function.
 * @returns Data fetched from the API handler routes.
 */
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
