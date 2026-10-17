import type { MetadataRoute } from "next";
import { work } from "@/data/projects";

const SITE_URL = "https://kamyarmoniri.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...work.map((project) => ({
      url: `${SITE_URL}/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
