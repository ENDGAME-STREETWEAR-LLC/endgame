"use client";

import { STEAM_AUTH_URL } from "@/constants/auth";

export default function SteamAuth() {
  return (
    <div className="flex flex-col items-center justify-center gap-[1rem]">
      <a
        target="_self"
        href={STEAM_AUTH_URL}
        className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-transparent- text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-4 sm:w-auto"
      >
        <img
          alt="Log into Steam Network"
          src="https://community.akamai.steamstatic.com/public/shared/images/signinthroughsteam/sits_landing.png"
        ></img>
      </a>
    </div>
  );
}
