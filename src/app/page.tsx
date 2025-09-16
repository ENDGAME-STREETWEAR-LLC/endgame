"use client";

import PSNAuth from "@/components/PSNAuth";
import SteamAuth from "@/components/SteamAuth";
import XboxAuth from "@/components/XboxAuth";
import { PsnEndpoints, fetcher } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitNpssoHandler = async (npsso: string) => {
    try {
      setLoading(true);
      const data = await fetcher([PsnEndpoints.AccessToken, `?npsso=${npsso}`]);

      // TODO add expiry time for session cookies
      document.cookie = `psn_session=${JSON.stringify(data)}`;
      router.replace("/psn/home");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-[32px] row-start-2 items-center justify-center sm:items-start">
        {!loading && (
          <>
            <PSNAuth onSubmit={submitNpssoHandler} />
            <XboxAuth />
            <SteamAuth />
          </>
        )}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
