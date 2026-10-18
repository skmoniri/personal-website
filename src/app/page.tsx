import type { Metadata } from "next";

import Hero from "../components/sections/Hero";
import Work from "../components/sections/Work";
import About from "../components/sections/About";
import Services from "../components/sections/Services";

const SITE_URL = "https://kamyarmoniri.com";

export const metadata: Metadata = {
  title: {
    absolute: "Kamyar Moniri | Frontend & Creative Developer",
  },

  description:
    "Kamyar Moniri is a frontend and creative developer specializing in React, Next.js, TypeScript, and interactive web experiences. Explore selected projects and creative development work.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Kamyar Moniri | Frontend & Creative Developer",
    description:
      "Creative frontend development, interactive web experiences, and selected projects by Kamyar Moniri.",
    url: SITE_URL,
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Kamyar Moniri",
      url: SITE_URL,
      jobTitle: "Frontend Developer",
      knowsAbout: [
        "Frontend Development",
        "Creative Development",
        "React",
        "Next.js",
        "TypeScript",
        "Web Development",
        "Interactive Web Design",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Kamyar Moniri",
      description:
        "Personal portfolio of frontend and creative developer Kamyar Moniri.",
      inLanguage: "en",
      author: {
        "@id": `${SITE_URL}/#person`,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Kamyar Moniri | Frontend & Creative Developer",
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#person`,
      },
      inLanguage: "en",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <main className="lab-container">
        <Hero />
        <About />
        <Services />
        <Work />
      </main>
    </>
  );
}
