"use client";

import { XBOX_AUTH_URL } from "@/constants/auth";

export default function XboxAuth() {
  return (
    <div className="flex flex-col items-center justify-center gap-[1rem]">
      <a
        target="_self"
        href={XBOX_AUTH_URL}
        className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      >
        Log into XBL network
      </a>
    </div>
  );
}
