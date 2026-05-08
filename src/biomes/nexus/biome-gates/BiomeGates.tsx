"use client";

import { useLocalization } from "@/hooks/useLocalization";
import BiomeGate from "./BiomeGate";

const BIOMES = [
  {
    key: "nightCity",
    href: "/night-city",
  },
  {
    key: "leonida",
    href: "/leonida",
  },
] as const;

export default function BiomeGates() {
  const { localization: t } = useLocalization();

  return (
    <section className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl font-bold tracking-widest uppercase">
        {t.nexus.biomeGates.title}
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {BIOMES.map(({ key, href }) => (
          <BiomeGate
            key={key}
            name={t.biomes[key].name}
            description={t.biomes[key].description}
            href={href}
          />
        ))}
      </div>
    </section>
  );
}
