import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { work, type WorkProject } from "../../data/projects";
import ActionButton from "../ui/ActionButton";
import "./ProjectHero.css";

const styles = {
  projectPage: "projectPage",
  topBar: "topBar",
  backLink: "backLink",
  topBarRight: "topBarRight",
  sectionHeader: "sectionHeader",
  sectionIndex: "sectionIndex",
  redSquare: "redSquare",
  heroGrid: "heroGrid",
  identityPanel: "identityPanel",
  asciiPanel: "asciiPanel",
  panelTop: "panelTop",
  panelBottom: "panelBottom",
  identityContent: "identityContent",
  aliIdentity: "aliIdentity",
  aliLogo: "aliLogo",
  aliOffset: "aliOffset",
  aliTitle: "aliTitle",
  aliGlare: "aliGlare",
  aliSubtitle: "aliSubtitle",
  tivasaIdentity: "tivasaIdentity",
  tivasaWordmark: "tivasaWordmark",
  tivasaTitle: "tivasaTitle",
  tivasaDot: "tivasaDot",
  tivasaUnderline: "tivasaUnderline",
  projectInformation: "projectInformation",
  projectCategory: "projectCategory",
  informationRule: "informationRule",
  projectDescription: "projectDescription",
  liveIndicator: "liveIndicator",
  liveDot: "liveDot",
  asciiStage: "asciiStage",
  asciiFrame: "asciiFrame",
  corner: "corner",
  cornerTL: "cornerTL",
  cornerTR: "cornerTR",
  cornerBL: "cornerBL",
  cornerBR: "cornerBR",
  heroFooter: "heroFooter",
  exploreLink: "exploreLink",
  detailsPlaceholder: "detailsPlaceholder",
  tivasaTextWrap: "tivasaTextWrap",
  tivasaCrtWave: "tivasaCrtWave",
  aliCrtWave: "aliCrtWave",
} as const;

type ProjectHeroProps = {
  project: WorkProject;
};

function AliHatefIdentity() {
  return (
    <div className={styles.aliIdentity}>
      <div className={styles.aliLogo}>
        <span aria-hidden="true" className={styles.aliOffset}>
          ALI
          <br />
          HATEF
        </span>

        <h1 className={styles.aliTitle}>
          ALI
          <br />
          HATEF
          <span className="sr-only"> — Barber Booking Website</span>
        </h1>

        {/* Subtle analog CRT distortion */}
        <span aria-hidden="true" className={styles.aliCrtWave}>
          ALI
          <br />
          HATEF
        </span>
      </div>

      <div className={styles.aliSubtitle}>
        <span>BARBER</span>
        <span>STUDIO</span>
      </div>
    </div>
  );
}

function TivasaIdentity() {
  return (
    <div className={styles.tivasaIdentity}>
      <div className={styles.tivasaWordmark}>
        <div className={styles.tivasaTextWrap}>
          <h1 className={styles.tivasaTitle}>
            TIVASA
            <span className="sr-only"> — Industrial HVAC and VRF Website</span>
          </h1>
          <span aria-hidden="true" className={styles.tivasaCrtWave}>
            TIVASA
          </span>
        </div>
        <span aria-hidden="true" className={styles.tivasaDot} />
      </div>

      <span aria-hidden="true" className={styles.tivasaUnderline} />
    </div>
  );
}

function ProjectIdentity({ slug }: { slug: string }) {
  switch (slug) {
    case "alihatef":
      return <AliHatefIdentity />;

    case "tivasa":
      return <TivasaIdentity />;

    default:
      return null;
  }
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const currentIndex = work.findIndex((item) => item.slug === project.slug);

  const previousProject = work[(currentIndex - 1 + work.length) % work.length];

  const nextProject = work[(currentIndex + 1) % work.length];
  return (
    <section className={styles.projectPage}>
      {/* Project navigation */}

      <div className={styles.topBar}>
        <Link href="/#work" className={styles.backLink}>
          <ArrowLeft size={17} strokeWidth={1.5} />
          <span>BACK TO WORK</span>
        </Link>

        <nav className="projectSwitcher" aria-label="Project navigation">
          <Link
            href={`/${previousProject.slug}`}
            className="projectArrowButton"
            aria-label={`Previous project: ${previousProject.name}`}
            title={`Previous: ${previousProject.name}`}
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </Link>

          <div className="projectSwitcherInfo">
            <span className="projectSwitcherCount">
              {String(currentIndex + 1).padStart(2, "0")}
              {" / "}
              {String(work.length).padStart(2, "0")}
            </span>
          </div>

          <Link
            href={`/${nextProject.slug}`}
            className="projectArrowButton"
            aria-label={`Next project: ${nextProject.name}`}
            title={`Next: ${nextProject.name}`}
          >
            <ArrowRight size={20} strokeWidth={1.5} />
          </Link>
        </nav>
      </div>

      {/* Keep original two-column layout */}
      <div className={styles.heroGrid}>
        {/* Left: Original identity */}
        <div className={styles.identityPanel}>
          <div className={styles.identityContent}>
            <ProjectIdentity slug={project.slug} />

            <div className={styles.projectInformation}>
              {project.slug === "alihatef" ? (
                <>
                  <h2 className="projectIntroTitle">
                    A digital platform for a modern barber studio.
                  </h2>

                  <div className="projectIntroBody">
                    <p>
                      ALI HATEF is a custom-built platform designed to simplify
                      appointment booking and bring a barber studio’s digital
                      presence and business operations into one place.
                    </p>

                    <p>
                      The project combines a bold, editorial visual identity
                      with a complete booking system, customer management,
                      online payments, and an administrative dashboard.
                    </p>

                    <p>
                      From design and development to deployment, the goal was to
                      build a reliable, practical product tailored to the needs
                      of a real business.
                    </p>
                  </div>

                  <div className="projectActionWrapper">
                    <ActionButton
                      mode="border"
                      label="VISIT WEBSITE"
                      href="https://alihatef.ir"
                      external
                    />
                  </div>
                </>
              ) : project.slug === "tivasa" ? (
                <>
                  <h2 className="projectIntroTitle">
                    A digital presence for an industrial HVAC company.
                  </h2>

                  <div className="projectIntroBody">
                    <p>
                      TIVASA is a custom-designed website built to showcase an
                      industrial HVAC company&apos;s products, projects, and
                      technical expertise through a clear, modern digital
                      experience.
                    </p>

                    <p>
                      The project combines an editorial visual identity with
                      structured product presentations, project showcases, and
                      carefully crafted interactions, balancing industrial
                      character with a refined, professional aesthetic.
                    </p>

                    <p>
                      From design and development to deployment, the goal was to
                      create a distinctive digital platform that communicates
                      TIVASA&apos;s expertise and presents its work with clarity
                      and confidence.
                    </p>
                  </div>
                  <div className="projectActionWrapper">
                  <ActionButton
                    mode="border"
                    label="VISIT WEBSITE"
                    href="https://tivasaco.com"
                    external
                  />
                </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right: Original ASCII sizing */}
        <div className={styles.asciiPanel}>
          <div className={styles.asciiStage}>
            <iframe
              key={project.slug}
              src={project.asciiSrc}
              title={`${project.name} animated ASCII artwork`}
              className={styles.asciiFrame}
              loading="lazy"
              scrolling="no"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
