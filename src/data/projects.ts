export const work = [
  {
    id: "01",
    slug: "alihatef",
    name: "ALI HATEF",
    description: "BARBER / BOOKING PLATFORM",
    mark: "AH",
    asciiSrc: "/ascii/ali-hatef.html",

    seo: {
      title: "Ali Hatef — Barber Booking Website",
      description:
        "Kamyar Moniri designed and developed Ali Hatef, a barber booking platform featuring online appointments, payments, customer management, and an admin dashboard.",
      keywords: [
        "Ali Hatef",
        "Ali Hatef Website",
        "Barber Booking Website",
        "Appointment Booking",
        "Kamyar Moniri",
        "Frontend Development",
      ],
    },
  },
  {
    id: "02",
    slug: "tivasa",
    name: "TIVASA",
    description: "VRF / INDUSTRIAL SYSTEMS",
    mark: "TV",
    asciiSrc: "/ascii/tivasa.html",

    seo: {
      title: "Tivasa — VRF & Industrial Systems Website",
      description:
        "Explore Tivasa, an industrial HVAC website designed and developed by Kamyar Moniri, featuring VRF systems, product presentations, and project showcases.",
      keywords: [
        "Tivasa",
        "Tivasa Website",
        "VRF Systems",
        "Industrial Website",
        "Corporate Website Development",
        "Kamyar Moniri",
      ],
    },
  },
] as const;

export type WorkProject = (typeof work)[number];

export function getProjectBySlug(slug: string) {
  return work.find((project) => project.slug === slug);
}
