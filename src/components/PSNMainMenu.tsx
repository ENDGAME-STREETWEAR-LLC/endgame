import Link from "next/link";

export default function PSNMainMenu() {
  return (
    <div className="w-full h-full justify-center items-center flex flex-col gap-[1rem]">
      <Link
        href={"/psn/user"}
        className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
      >
        View user profile
      </Link>
      <Link
        href={"/psn/games"}
        className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
      >
        View user titles and trophies
      </Link>
    </div>
  );
}
