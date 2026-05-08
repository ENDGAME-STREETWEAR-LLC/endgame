"use client";

import { BiomeGates } from "./biome-gates";

export default function Nexus() {
  return (
    <div className="flex flex-col items-center gap-16 w-full">
      {/* Maze hero is rendered above this section by the page's existing layout. */}
      {/* Transmissions are intentionally not rendered here yet — enable later by importing from "./transmissions". */}
      <BiomeGates />
    </div>
  );
}
