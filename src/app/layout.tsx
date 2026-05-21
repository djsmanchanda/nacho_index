import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { GradientBg } from "@/components/layout/gradient-bg";
import { ProfileLinks } from "@/components/layout/profile-links";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nacho Index",
  description:
    "A highly stylized personal leaderboard for reviewing nachos, chips, and snacks with detailed analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100 antialiased">
        <GradientBg />
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <ProfileLinks />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fafafa",
            },
          }}
        />
      </body>
    </html>
  );
}
