import type { Metadata } from "next";
import "./globals.css";
import { BackgroundFX } from "@/components/BackgroundFX";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark ai-no-select">
      <body className="min-h-screen bg-ai-bg text-white antialiased overflow-x-hidden">
        <div className="relative flex min-h-screen flex-col">
          <BackgroundFX />
          <CustomCursor />
          <Navbar />
          <main className="relative z-10 flex-1 pt-20">{children}</main>
        </div>
      </body>
    </html>
  );
}
