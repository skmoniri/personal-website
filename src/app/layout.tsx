import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";

import CRTDisplay from "../components/crt/CRTDisplay";
import CustomCursor from "../components/ui/CustomCursor";
import StructuredData from "../components/seo/StructuredData";

import "./globals.css";

const SITE_URL = "https://kamyarmoniri.com";

const alteHaas = localFont({
  src: [
    {
      path: "../fonts/AlteHaasGroteskRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AlteHaasGroteskBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-alte-haas",
  display: "swap",
  preload: true,
});

const eurostile = localFont({
  src: "../fonts/eurostile.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-eurostile",
  display: "swap",
  preload: true,
});

const clashGrotesk = localFont({
  src: "../fonts/ClashGrotesk-Variable.woff2",
  variable: "--font-clash-grotesk",
  display: "swap",
  weight: "200 700",
});

const lahzeh = localFont({
  src: "../fonts/Lahzeh-FamilyVF.woff2",
  variable: "--font-lahzeh",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  alternates: {
    canonical: "/",
  },

  title: {
    default: "Kamyar Moniri | Frontend & Creative Developer",
    template: "%s | Kamyar Moniri",
  },

  description:
    "Portfolio of Kamyar Moniri, a frontend and creative developer building interactive websites and digital experiences with React, Next.js, and TypeScript.",

  applicationName: "Kamyar Moniri Portfolio",

  authors: [
    {
      name: "Kamyar Moniri",
      url: SITE_URL,
    },
  ],

  creator: "Kamyar Moniri",
  publisher: "Kamyar Moniri",

  category: "technology",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Kamyar Moniri",
    title: "Kamyar Moniri | Frontend & Creative Developer",
    description:
      "Explore the portfolio of Kamyar Moniri. Interactive websites, creative development, and distinctive digital experiences.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kamyar Moniri | Frontend & Creative Developer",
    description:
      "Frontend development, interactive websites, and creative digital experiences.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  referrer: "strict-origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${alteHaas.variable} ${eurostile.variable} ${clashGrotesk.variable} ${lahzeh.variable}`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground font-sans">
        {/* SEO structured data */}
        <StructuredData />

        {/* CRT display with WebGL test support */}
        <Suspense fallback={null}>
          <CRTDisplay>{children}</CRTDisplay>
        </Suspense>

        {/* Custom crosshair cursor */}
        <CustomCursor />
      </body>
    </html>
  );
}
