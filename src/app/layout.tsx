import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/hooks/useAuthStore";
import { GamingServicesContextProvider } from "@/hooks/useGamingServices";
import { cookies } from "next/headers";
import Navigation from "@/components/Navigation";
import { LocalizationProvider } from "@/hooks/useLocalization";

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
  description: "Endgame",
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
          <LocalizationProvider>
            <AuthContextProvider>
              <GamingServicesContextProvider value={session}>
                <Navigation />
                {children}
              </GamingServicesContextProvider>
            </AuthContextProvider>
          </LocalizationProvider>
        </main>
      </body>
    </html>
  );
}
