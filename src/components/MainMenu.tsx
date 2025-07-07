import { AuthTokensResponse } from "psn-api";
import { useCallback, useState } from "react";

type MainMenuProps = {
  authorization: AuthTokensResponse;
};

export default function MainMenu({ authorization }: MainMenuProps) {
  const getUserProfileHandler = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/getUserProfile?accessToken=${authorization.accessToken}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log(data);
      alert(data);
    } catch (error) {
      console.error(error);
    }
  }, [authorization]);
  const getTitlesHandler = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/getUserTitles?accessToken=${authorization.accessToken}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log(data);
      alert(data);
    } catch (error) {
      console.error(error);
    }
  }, [authorization]);

  return (
    <div>
      <button
        className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
        onClick={getUserProfileHandler}
      >
        Get user profile
      </button>
      <button
        className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
        onClick={getTitlesHandler}
      >
        Get user titles
      </button>
    </div>
  );
}
