import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectHero from "@/components/projects/ProjectHero";
import { getProjectBySlug, work } from "../../../data/projects";

const SITE_URL = "https://kamyarmoniri.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const projectUrl = `${SITE_URL}/${project.slug}`;

  return {
    title: project.seo.title,
    description: project.seo.description,

    keywords: [...project.seo.keywords],

    alternates: {
      canonical: projectUrl,
    },

    openGraph: {
      type: "article",
      url: projectUrl,
      siteName: "Kamyar Moniri",
      title: `${project.seo.title} | Kamyar Moniri`,
      description: project.seo.description,
      locale: "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title: `${project.seo.title} | Kamyar Moniri`,
      description: project.seo.description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectUrl = `${SITE_URL}/${project.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${projectUrl}#project`,
    name: project.seo.title,
    description: project.seo.description,
    url: projectUrl,
    inLanguage: "en",
    creator: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Kamyar Moniri",
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <main className="lab-page-shell">
        <ProjectHero project={project} />
      </main>
    </>
  );
}
