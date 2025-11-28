import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header";
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
  metadataBase: new URL("https://faceit-insights.vercel.app"),
  title: {
    template: "%s | FACEIT Insights",
    default: "FACEIT Insights - CS2 Match Analytics & Player Stats",
  },
  description: "Visualize your CS2 match story. Analyze momentum, player impact, and earn badges with detailed FACEIT match statistics.",
  keywords: ["FACEIT", "CS2", "Counter-Strike 2", "Stats", "Analytics", "Match History", "Player Stats", "Esports"],
  authors: [{ name: "FACEIT Insights" }],
  openGraph: {
    title: "FACEIT Insights - CS2 Match Analytics",
    description: "Visualize your CS2 match story. Analyze momentum, player impact, and earn badges.",
    url: "https://faceit-insights.vercel.app",
    siteName: "FACEIT Insights",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FACEIT Insights - CS2 Match Analytics",
    description: "Visualize your CS2 match story. Analyze momentum, player impact, and earn badges.",
    creator: "@faceitinsights",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}
      >
        <Header />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
