import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundFX } from "@/components/BackgroundFX";
import { Navbar } from "@/components/Navbar";
import { OverlayProvider } from "@/components/OverlayContext";
import { SmoothScroll } from "@/components/SmoothScroll";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ebenezer Tay · AI Engineer & Product Builder",
  description:
    "Portfolio of Ebenezer Tay, a Singapore-based AI engineer, full-stack developer and founder building products like SnapRent.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ai-no-select ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden bg-ai-bg font-sans text-slate-200 antialiased">
        <OverlayProvider>
          <SmoothScroll />
          <div className="relative flex min-h-screen flex-col">
            <BackgroundFX />
            <Navbar />
            <main className="relative z-10 flex-1 pt-16">{children}</main>
          </div>
        </OverlayProvider>
      </body>
    </html>
  );
}
