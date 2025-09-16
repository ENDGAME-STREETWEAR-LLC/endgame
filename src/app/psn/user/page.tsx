import { PsnEndpoints, fetcher } from "@/utils/api";
import { cookies } from "next/headers";
import Link from "next/link";
import { ProfileFromUserNameResponse } from "psn-api";
import { PSNAuthSession } from "types";

export default async function User() {
  const storedCookies = await cookies();
  const storedSession = storedCookies.get("psn_session")?.value;

  if (!storedSession)
    return (
      <div>
        <p>Missing authorization</p>
      </div>
    );

  const authorization = JSON.parse(storedSession) as PSNAuthSession;

  const data = (await fetcher(PsnEndpoints.UserProfile, {
    headers: {
      Authorization: authorization.accessToken,
    },
  })) as ProfileFromUserNameResponse;

  return (
    <>
      <Link href="/psn/home">Back to home</Link>
      <div>
        <p>About me: {data.profile?.aboutMe}</p>
        <p>Account ID: {JSON.stringify(data.profile?.accountId)}</p>
        <p>Avatars:</p>
        {data.profile?.avatarUrls?.map((avatar) => (
          <img
            key={JSON.stringify(avatar)}
            alt={data?.profile?.onlineId}
            width={avatar?.size}
            height={avatar?.size}
            src={avatar?.avatarUrl}
          />
        ))}
        <p>
          Console availability:{" "}
          {data.profile?.consoleAvailability?.availabilityStatus}
        </p>
        <p>Following: {data.profile?.following}</p>
        <p>Friend relation: {data.profile?.friendRelation}</p>
        <p>Officially Verified: {data.profile?.isOfficiallyVerified}</p>
        <p>Languages used: {data.profile?.languagesUsed}</p>
        <p>Online ID: {data.profile?.onlineId}</p>
        <p>Np ID: {data.profile?.npId}</p>
        <p>First name: {data.profile?.personalDetail?.firstName}</p>
        <p>Last name: {data.profile?.personalDetail?.lastName}</p>
        <p>Profile pictures:</p>
        {data.profile?.personalDetail?.profilePictureUrls?.map((picture) => (
          <img
            key={JSON.stringify(picture)}
            alt={data?.profile?.onlineId}
            width={picture?.size}
            height={picture?.size}
            src={picture?.profilePictureUrl}
          />
        ))}
        <p>Personal detail sharing: {data.profile?.personalDetailSharing}</p>
        <p>Is Plus subscriber: {data.profile?.plus}</p>
        <p>Online Presence: {JSON.stringify(data.profile?.presences || "")}</p>
        <p>
          Primary online status:{" "}
          {JSON.stringify(data.profile?.primaryOnlineStatus || "")}
        </p>
        <p>
          Request Message Flag:{" "}
          {JSON.stringify(data.profile?.requestMessageFlag || "")}
        </p>
        <p>
          Trophy summary: {JSON.stringify(data.profile?.trophySummary || "")}
        </p>
      </div>
    </>
  );
}
