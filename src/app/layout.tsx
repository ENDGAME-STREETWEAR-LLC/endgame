import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/hooks/useAuthStore";
import { GamingServicesContextProvider } from "@/hooks/useGamingServices";
import { cookies } from "next/headers";

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
    xbl: storedCookies.get("xbl_session")?.value,
    steam: storedCookies.get("steam_session")?.value,
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          <AuthContextProvider>
            <GamingServicesContextProvider value={session}>
              <nav>
                <ul className="flex gap-4 bg-[#FFFFFF33] m-2 p-4">
                  <li className="hover:opacity-30">
                    <a href="/">Home</a>
                  </li>
                  <li className="hover:opacity-30">
                    <a href="/psn/home">Playstation</a>
                  </li>
                  <li className="hover:opacity-30">
                    <a href="/xbox/home">Xbox</a>
                  </li>
                  <li className="hover:opacity-30">
                    <a href="/steam/home">Steam</a>
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
