"use client";

import { NPSSO_URL, PSN_AUTH_URL } from "@/constants/auth";
import { ChangeEvent, useCallback, useState } from "react";

type PSNAuthProps = {
  onSubmit?: (npsso: string) => void;
};

export default function PSNAuth({ onSubmit = () => {} }: PSNAuthProps) {
  const [npsso, setNpsso] = useState("");

  const changeNpssoHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setNpsso(event.target.value),
    [npsso]
  );

  const submitNpssoHandler = useCallback(
    () => onSubmit(npsso),
    [npsso, onSubmit]
  );

  return (
    <div>
      <a
        target="_blank"
        href={PSN_AUTH_URL}
        className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      >
        Log into PS Network
      </a>
      <a href={NPSSO_URL} target="_blank">
        <button className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]">
          Retrieve NPSSO token
        </button>
      </a>
      <input
        type="text"
        placeholder="Enter NPSSO..."
        onChange={changeNpssoHandler}
      />
      <button
        onClick={submitNpssoHandler}
        className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      >
        Submit
      </button>
    </div>
  );
}
