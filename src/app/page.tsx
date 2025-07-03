"use client";

import MainMenu from "@/components/MainMenu";
import PSNAuth from "@/components/PSNAuth";
import { isExpired } from "@/utils/api";
import Image from "next/image";
import { AuthTokensResponse } from "psn-api";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [authorization, setAuthorization] = useState<AuthTokensResponse>();

  // To be used in the future when refreshing 
  const refreshTokenHandler = async () => {
    try {
      const response = await fetch(
        `/api/refreshToken?refreshToken=${authorization?.refreshToken}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      setAuthorization(data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitNpssoHandler = async (npsso: string) => {
    try {
      const url = "/api/getAccessToken?npsso=" + npsso;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      setAuthorization(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {!authorization && !loading && (
          <PSNAuth onSubmit={submitNpssoHandler} />
        )}
        {authorization && <MainMenu authorization={authorization} />}
        {loading && <p>In progress...</p>}
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
