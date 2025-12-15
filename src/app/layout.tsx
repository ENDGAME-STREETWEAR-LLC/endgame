import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/hooks/useAuthStore";
import { GamingServicesContextProvider } from "@/hooks/useGamingServices";
import { cookies } from "next/headers";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ENDGAME",
  description: "Endgame Portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storedCookies = await cookies();

  const session = {
    psn: storedCookies.get("psn_session")?.value,
    xbl: storedCookies.get("xbox_session")?.value,
    steam: storedCookies.get("steam_session")?.value,
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div id="modal-root"></div>
        <main>
          <AuthContextProvider>
            <GamingServicesContextProvider value={session}>
              <nav>
                <ul className="flex gap-4 bg-[#FFFFFF33] m-2 p-4">
                  <li className="hover:opacity-30">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="hover:opacity-30">
                    <Link href="/psn/home">Playstation</Link>
                  </li>
                  <li className="hover:opacity-30">
                    <Link href="/xbox/home">Xbox</Link>
                  </li>
                  <li className="hover:opacity-30">
                    <Link href="/steam/home">Steam</Link>
                  </li>
                </ul>
              </nav>
              {children}
            </GamingServicesContextProvider>
          </AuthContextProvider>
        </main>
      </body>
    </html>
  );
}
