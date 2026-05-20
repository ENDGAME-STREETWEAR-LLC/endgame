"use client";

import { Shop } from "./shop";

export default function NightCity() {
  return (
    <div className="flex flex-col items-center gap-12 w-full">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-widest uppercase">
          Night City
        </h1>
        <p className="text-sm opacity-70 max-w-[500px]">
          Cyberpunk-themed drops. Welcome to the streets.
        </p>
      </header>
      <Shop />
    </div>
  );
}
