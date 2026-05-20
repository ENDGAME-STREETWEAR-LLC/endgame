"use client";

import Link from "next/link";

type BiomeGateProps = {
  name: string;
  description: string;
  href: string;
  artwork?: string;
};

export default function BiomeGate({
  name,
  description,
  href,
  artwork,
}: BiomeGateProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 p-4 bg-[#FFFFFF11] hover:bg-[#FFFFFF22] border border-[#FFFFFF22] hover:border-[#FFFFFF55] rounded-lg transition-colors w-full max-w-[280px]"
    >
      <div className="aspect-[4/3] w-full bg-[#FFFFFF11] rounded-md overflow-hidden flex items-center justify-center">
        {artwork ? (
          <img
            src={artwork}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs uppercase tracking-widest opacity-40">
            artwork
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold tracking-wide group-hover:opacity-90">
        {name}
      </h3>
      <p className="text-sm opacity-70">{description}</p>
      <span className="mt-1 text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100">
        Enter →
      </span>
    </Link>
  );
}
