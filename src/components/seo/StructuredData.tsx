const SITE_URL = "https://kamyarmoniri.com";

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Kamyar Moniri",
        url: SITE_URL,
        jobTitle: "Frontend & Creative Developer",
        knowsAbout: [
          "Frontend Development",
          "Creative Development",
          "React",
          "Next.js",
          "TypeScript",
          "Web Design",
          "Interactive Web Experiences",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Kamyar Moniri",
        url: SITE_URL,
        inLanguage: "en",
        description:
          "Portfolio of Kamyar Moniri, a frontend and creative developer building interactive websites and digital experiences.",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
