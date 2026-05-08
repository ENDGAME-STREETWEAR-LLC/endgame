"use client";

type TransmissionProps = {
  title: string;
  body: string;
  date: string;
};

export default function Transmission({ title, body, date }: TransmissionProps) {
  return (
    <article className="flex flex-col gap-1 p-4 bg-[#FFFFFF0A] border-l-2 border-[#FFFFFF55] rounded-sm">
      <header className="flex justify-between items-baseline gap-4">
        <h4 className="font-bold tracking-wide">{title}</h4>
        <time className="text-xs opacity-60 whitespace-nowrap">{date}</time>
      </header>
      <p className="text-sm opacity-80">{body}</p>
    </article>
  );
}
