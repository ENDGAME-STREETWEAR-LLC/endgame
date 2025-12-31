"use client";

import { useLocalization } from "@/hooks/useLocalization";
import Link from "next/link";

export default function Navigation() {
  const { localization: t } = useLocalization();

  return (
    <nav>
      <ul className="flex gap-4 bg-[#FFFFFF33] m-2 p-4">
        <li className="hover:opacity-30">
          <Link href="/">{t.nav.home}</Link>
        </li>
        <li className="hover:opacity-30">
          <Link href="/psn/home">{t.nav.playstation}</Link>
        </li>
        <li className="hover:opacity-30">
          <Link href="/xbox/home">{t.nav.xbox}</Link>
        </li>
        <li className="hover:opacity-30">
          <Link href="/steam/home">{t.nav.steam}</Link>
        </li>
      </ul>
    </nav>
  );
}
