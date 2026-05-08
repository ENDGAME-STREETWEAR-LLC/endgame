"use client";

import { useLocalization } from "@/hooks/useLocalization";
import Transmission from "./Transmission";

const FAKE_TRANSMISSIONS = [
  {
    id: "1",
    title: "New drop incoming",
    body: "A new collection is being prepared. Stay tuned.",
    date: "2026-05-08",
  },
  {
    id: "2",
    title: "Night City restock",
    body: "Cyberpunk-themed apparel will be back in stock next week.",
    date: "2026-05-01",
  },
  {
    id: "3",
    title: "Welcome to ENDGAME",
    body: "Thank you for joining the experience.",
    date: "2026-04-15",
  },
];

export default function Transmissions() {
  const { localization: t } = useLocalization();

  return (
    <section className="flex flex-col gap-4 w-full max-w-[600px]">
      <h2 className="text-2xl font-bold tracking-widest uppercase">
        {t.nexus.transmissions.title}
      </h2>
      <div className="flex flex-col gap-2">
        {FAKE_TRANSMISSIONS.map(({ id, title, body, date }) => (
          <Transmission key={id} title={title} body={body} date={date} />
        ))}
      </div>
    </section>
  );
}
