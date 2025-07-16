import { Endpoints, fetcher } from "@/utils/api";
import { cookies } from "next/headers";
import Link from "next/link";
import { ProfileFromUserNameResponse } from "psn-api";

export default async function User() {
  const cookieStore = await cookies();
  const authorization = JSON.parse(
    cookieStore.get("authorization")?.value as string
  );

  const data = (await fetcher(Endpoints.UserProfile, {
    headers: {
      Authorization: authorization.accessToken,
    },
  })) as ProfileFromUserNameResponse;

  return (
    <>
      <Link href="/home">Back to home</Link>
      {JSON.stringify(data)}
    </>
  );
}
