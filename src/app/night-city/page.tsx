"use client";

import { NightCity } from "@/biomes/night-city";

export default function NightCityPage() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-[32px] row-start-2 items-center justify-center sm:items-start">
        <NightCity />
      </div>
    </div>
  );
}
