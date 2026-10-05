import Image from "next/image";
import { CaseSection, IconStat, ResultLinks } from "@/components/project/CaseSection";
import { ChapterDivider } from "@/components/project/ChapterDivider";
import { Kicker } from "@/components/project/TenSecondSummary";

// Overview chapter (Overview / My Role / Result) from the Figma file
// (Portfolio_Asset, "M.A.R.S — Project Detail" frame). Rendered above the
// portfolio-PDF slides until the rest of the M.A.R.S page is rebuilt.

const IMG = "/images/mars";

const RESULT_LINKS = [
  { label: "Read News", url: "https://www.joongang.co.kr/article/25379464" },
  {
    label: "KAIST LinkedIn Post",
    url: "https://www.linkedin.com/posts/kcb-kaistqsvsmpqxmukr-tcustwswmtxuqsvsmpqxmukr-share-7392430372019646465-eNeh/",
  },
];

// Hero media for ProjectHero's slot (passed in from the route page).
// video_hero2.mp4 re-encoded to 720p H.264 (plays in every browser, ~1.6MB);
// the landing card reuses the same file.
export function MarsHeroVideo() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-line">
      <video
        src={`${IMG}/vid_hero.mp4`}
        poster={`${IMG}/vid_hero_poster.webp`}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

export function MarsOverview() {
  return (
    <>
      <ChapterDivider title="Overview" subtitle="What is M.A.R.S, and what did I do here?" />

      <CaseSection kicker="OVERVIEW" title="M.A.R.S" align="left">
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-ink-muted">
            : Medical Auto-documentation with Real-world Structuring
          </p>
          <p className="text-sm leading-relaxed text-ink-muted">
            A two-round, 2-month datathon hosted by Seoul National University Bundang Hospital.
            <br />
            Built an LLM system that turns raw clinical notes into discharge summaries, using
            MIMIC-IV dataset and real notes from 400 patients.
          </p>
        </div>
      </CaseSection>

      <CaseSection kicker="MY ROLE" title="Team Lead" align="left">
        <ul className="list-disc pl-5 text-sm leading-relaxed text-ink-muted">
          <li>Assembled the team and ran the project end to end</li>
          <li>Researched ~30 papers and clinical domain knowledge to define the approach</li>
          <li>Built the data cleansing, prompt design, and full system architecture</li>
          <li>
            Validated &amp; bridged: ran clinician evaluations and translated between clinicians
            and engineers
          </li>
          <li>Presented at the final</li>
        </ul>
      </CaseSection>

      {/* Result — structural exception: hero row + 3-up icon stat grid */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8 md:px-[88px] md:py-10">
        <Kicker>RESULT</Kicker>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <p className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              Re-engineered Clinical Workflow with LLMs
            </p>
            <p className="font-display text-xl font-semibold leading-tight text-ink sm:text-2xl">
              🥇 1st Place @ Preliminary (1 of 100)
              <br />
              🥈 2nd Place @ Final (2 of 10)
            </p>
            <ResultLinks links={RESULT_LINKS} />
          </div>
          <div className="relative aspect-[299/368] w-full max-w-[299px] shrink-0 overflow-hidden">
            <Image
              src={`${IMG}/img_result_1.webp`}
              alt="Receiving the Excellence Award at the M.A.R.S datathon"
              fill
              sizes="299px"
              className="object-cover object-bottom"
            />
          </div>
        </div>
        <div className="flex flex-col gap-8 sm:flex-row">
          <IconStat
            icon={
              // eslint-disable-next-line @next/next/no-img-element -- local decorative SVG; next/image needs dangerouslyAllowSVG configured
              <img src={`${IMG}/svg_result_1.svg`} alt="" className="h-[96px] w-[103px]" />
            }
            title="Offered Research Role"
            description={
              <>
                Invited to co-publish and intern at
                <br />
                SNUBH Center for AI in Healthcare.
              </>
            }
          />
          <IconStat
            icon={
              // The ✦ at the gear's center is a separate layer in Figma.
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- local decorative SVG; next/image needs dangerouslyAllowSVG configured */}
                <img src={`${IMG}/svg_result_2.svg`} alt="" className="h-[78px] w-[152px]" />
                {/* eslint-disable-next-line @next/next/no-img-element -- local decorative SVG; next/image needs dangerouslyAllowSVG configured */}
                <img
                  src={`${IMG}/svg_result_2_star.svg`}
                  alt=""
                  className="absolute left-1/2 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            }
            title="Built for Real Deployment"
            description={
              <>
                Our system was piloted in SNUBH&rsquo;s
                <br />
                clinical documentation workflow.
              </>
            }
          />
          <IconStat
            icon={
              // eslint-disable-next-line @next/next/no-img-element -- local decorative SVG; next/image needs dangerouslyAllowSVG configured
              <img src={`${IMG}/svg_result_3.svg`} alt="" className="h-[96px] w-[109px]" />
            }
            title="Clinician-Validated"
            description={
              <>
                4 departments, 2 feedback rounds,
                <br />
                3.55 → 3.70 satisfaction.
              </>
            }
          />
        </div>
      </section>
    </>
  );
}
