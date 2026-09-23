import Image from "next/image";
import { cn } from "@/lib/utils";
import { Accordion } from "@/components/project/Accordion";
import { ChapterDivider } from "@/components/project/ChapterDivider";
import { FlexTable } from "@/components/project/FlexTable";

// Rebuilt from the redesigned Figma file (Portfolio_Asset, "Projects" page,
// "Phonitale — Project Detail" frame). The narrative is now a long,
// chaptered walkthrough (Overview / Process / Evaluation / Reflection)
// instead of the earlier condensed 5-section version — see the Figma file
// for the source of truth on copy and layout.

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-fit bg-accent px-4 py-1 text-xs font-medium tracking-[3px] text-paper">
      {children}
    </span>
  );
}

// Shared kicker + title + body shell for every "feature" block. Deliberately
// NOT the shared <Section> component (src/components/project/Section.tsx) —
// that component's plain-text kicker and py-14/py-20 rhythm is load-bearing
// for every other case study on the site, and this redesign's filled-pill
// kicker + tighter px-[88px] py-10 spacing is specific to this page.
function PhonitaleSection({
  kicker,
  title,
  align = "center",
  children,
}: {
  kicker: string;
  title: string;
  align?: "left" | "center";
  children: React.ReactNode;
}) {
  const centered = align === "center";
  return (
    <section className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-8 md:px-[88px] md:py-10">
      <Kicker>{kicker}</Kicker>
      <h2
        className={`mt-4 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl ${
          centered ? "text-center" : ""
        }`}
      >
        {title}
      </h2>
      <div className={`flex flex-col gap-6 ${centered ? "items-center text-center" : ""}`}>
        {children}
      </div>
    </section>
  );
}

function ExampleBox({ children, bordered = true, fit = false }: { children: React.ReactNode; bordered?: boolean; fit?: boolean }) {
  return (
    <div className={cn("p-6", fit ? "mx-auto w-fit" : "w-full", bordered && "rounded-2xl border border-line bg-paper")}>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function IconStat({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-4">
      <div className="flex h-[150px] w-full items-center justify-center overflow-hidden bg-line">
        {icon}
      </div>
      <div className="flex flex-col gap-1.5 text-center">
        <p className="font-display text-xl font-semibold text-accent">{title}</p>
        <p className="text-sm leading-snug text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

// Splits "Lead-in: rest of the sentence" bullets into a bold lead-in plus
// regular body copy. Falls back to plain text if there's no clean split.
function LeadInBullet({ text, index }: { text: string; index?: number }) {
  const sep = ": ";
  const idx = text.indexOf(sep);
  const prefix = index ? `${index}. ` : "";
  if (idx === -1) return <p className="text-sm leading-relaxed text-ink-muted">{prefix}{text}</p>;
  const lead = text.slice(0, idx);
  const rest = text.slice(idx + sep.length);
  return (
    <p className="text-sm leading-relaxed text-ink-muted">
      <span className="font-display font-semibold text-ink">{prefix}{lead}:</span> {rest}
    </p>
  );
}

// The 4-step Transliteration -> Segmentation -> Keyword Match -> Cue Generation
// pipeline is styled as a small embedded product mockup (its own palette,
// borders, and typography) rather than the site's own design system, since
// it's meant to read as "a peek at the actual PhoniTale app," not as a
// site-native component.
function PipelineDiagram() {
  const steps = [
    {
      title: "Transliteration",
      body: (
        <>
          Converts the 🇺🇸 L2 word&rsquo;s sound into the closest 🇰🇷 L1 sounds
        </>
      ),
      result: "/sɯkʰwantʌ/",
      bg: "bg-[#cedbed]",
    },
    {
      title: "Segmentation",
      body: "Divides the new sound sequence into valid 🇰🇷 L1 syllables",
      result: "/sɯ/ - /kʰwan/ - /tʌ/",
      bg: "bg-[#cedbed]",
    },
    {
      title: "Keyword Match",
      body: "Finds 🇰🇷 L1 dictionary words that match the sound segments",
      result: (
        <>
          🇰🇷 세관 - 더
          <br />
          (/sɛɡwan/ - /tʌ/)
        </>
      ),
      bg: "bg-[#cedbed]",
    },
    {
      title: "Cue Generation",
      body: "An LLM weaves the 🇰🇷 L1 keywords into a memorable sentence.",
      result: (
        <>
          🇰🇷 세관에서 시간을 더 낭비했다.
          <br />
          (/sɛ.ɡwan ɛ.sʌ si.ɡɑn.ɯl. tʌ. nɑŋ.bi.ɛt.t*ɑ/)
        </>
      ),
      bg: "bg-[#c9c4e3]",
      wide: true,
    },
  ];

  return (
    <div className="w-full rounded-[10px] bg-[#e3e6ea] p-4">
      <div className="mb-3 flex justify-start">
        <Image src={`${IMG}/img_approach_1.png`} alt="PhoniTale: from Phonology + Mnemonic + Tale" width={500} height={40} unoptimized className="h-auto w-[500px] max-w-full" />
      </div>
      <div className="flex items-stretch gap-[3px]">
        {steps.map((step, i) => (
          <div key={step.title} className="contents">
            <div
              className={`flex h-[240px] flex-col items-center justify-between rounded-[5px] border border-[#101010] px-5 py-6 text-center ${step.bg} ${
                step.wide ? "w-[220px] shrink-0" : "flex-1"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm font-semibold text-ink">{step.title}</p>
                <p className="text-sm text-ink-muted">{step.body}</p>
              </div>
              <div className="h-px w-full bg-[#101010]/30" />
              <p className="text-sm text-ink">{step.result}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex w-5 shrink-0 items-center justify-center text-ink-muted">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const IMG = "/images/phonitale";

// Hero media for the project's ProjectHero slot (passed in from the route
// page, not rendered by PhonitaleDetail itself). Both source videos are
// raw 1920x1080 recordings with their real content pillarboxed in black
// (content is centered in the frame in both cases: vid_architecture's
// content spans x=161-1758, a 1597:1080 rectangle). Both blocks scale
// fluidly at their true content aspect ratio — object-cover then only
// ever crops the black bars, never the content, at any viewport — and
// cap out at the exact desktop spec once xl: gives them room to sit
// side by side sharing a 364px height (538 * 1080/1597 ≈ 364, so the
// left block naturally lands on the same height as the right one).
// Below xl the two stack full-width instead of squeezing into a row.
export function PhonitaleHeroVideos() {
  return (
    <div className="mt-14 flex flex-col gap-4 xl:flex-row">
      <div className="relative aspect-[1597/1080] w-full max-w-[538px] shrink-0 overflow-hidden rounded-2xl bg-[#E1E6E9] xl:aspect-auto xl:h-[364px] xl:w-[538px]">
        <video
          src={`${IMG}/vid_architecture.mp4`}
          autoPlay
          muted
          loop
          playsInline
          className="absolute -left-[2px] top-0 h-full w-[calc(100%+4px)] max-w-none object-cover"
        />
      </div>
      <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-[#E1E6E9] py-[12px] xl:h-[364px] xl:flex-1">
        <div className="relative aspect-[440/340] w-full max-w-[440px] overflow-hidden rounded-[15px]">
          <video
            src={`${IMG}/vid_web.mp4`}
            autoPlay
            muted
            loop
            playsInline
            className="absolute -left-[2px] top-0 h-full w-[calc(100%+4px)] max-w-none object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export function PhonitaleDetail() {
  return (
    <>
      <ChapterDivider title="Overview" subtitle="What is PhoniTale, and what did I do here?" />

      <PhonitaleSection kicker="OVERVIEW" title="PhoniTale" align="left">
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-ink-muted">: from Phonology + Mnemonic + Tale</p>
          <p className="text-sm leading-relaxed text-ink-muted">
            An AI system that creates fun, memorable mnemonics for learning foreign vocabulary.
            It&rsquo;s as creative as human-made ones, and the first built to work across languages
            with completely different sound systems.
          </p>
        </div>
      </PhonitaleSection>

      <PhonitaleSection kicker="MY ROLE" title="Human Evaluation Lead" align="left">
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-ink-muted">
            As a Visiting Researcher at CMU&rsquo;s School of Computer Science in Spring 2025, I
            worked with a team on this NLP + HCI research project. I led the human evaluation:
            designing the study, building the web platform to run it, and analyzing the results.
          </p>
          <p className="text-sm leading-relaxed text-ink-muted">
            I also researched the linguistic background, reviewed related literature, and
            contributed to system architecture design and paper writing alongside my engineering
            teammates.
          </p>
        </div>
      </PhonitaleSection>

      {/* Result — structural exception: hero row + 4-up icon stat grid */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8 md:px-[88px] md:py-10">
        <Kicker>RESULT</Kicker>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex flex-1 flex-col gap-4">
            <p className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              Built PhoniTale,
              <br />
              Published at EMNLP 2025
              <br />
              Main Conference
            </p>
            <a
              href="https://aclanthology.org/2025.emnlp-main.1299/"
              target="_blank"
              rel="noreferrer"
              className="w-fit text-sm text-ink-muted underline underline-offset-2 hover:text-ink"
            >
              Read Paper ↗
            </a>
          </div>
          <div className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-lg md:h-[368px] md:w-[500px]">
            <Image
              src={`${IMG}/img_result_1.png`}
              alt="Presenting the PhoniTale poster at EMNLP 2025"
              fill
              sizes="(min-width: 768px) 500px, 100vw"
              className="object-cover object-bottom"
            />
          </div>
        </div>
        <div className="flex flex-col gap-8 sm:flex-row">
          <IconStat
            icon={<Image src={`${IMG}/result-icon-1-novel-system.png`} alt="" width={476} height={300} className="h-full w-full object-contain" />}
            title="Built Novel System"
            description="First system to generate mnemonics for typologically distant language pairs, like English and Korean."
          />
          <IconStat
            icon={<Image src={`${IMG}/result-icon-2-outperforms-llm.png`} alt="" width={476} height={300} className="h-full w-full object-contain" />}
            title="Outperforms LLM-only"
            description={<><em>PhoniTale</em>&rsquo;s specialized phonological modules outperform pure LLM generation.</>}
          />
          <IconStat
            icon={<Image src={`${IMG}/result-icon-3-matches-expert.png`} alt="" width={476} height={300} className="h-full w-full object-contain" />}
            title="Matches Expert Recall"
            description={<><em>PhoniTale</em>&rsquo;s mnemonics scored 0.609 vs. 0.590 for expert-made ones in recall tests.</>}
          />
          <IconStat
            icon={<Image src={`${IMG}/result-icon-4-infinitely-scalable.png`} alt="" width={476} height={300} className="h-full w-full object-contain" />}
            title="Infinitely Scalable"
            description="Generates high-quality mnemonics for any word, with zero manual effort."
          />
        </div>
      </section>

      <ChapterDivider title="Process" subtitle="Why did this project start, and how did we approach it?" />

      <PhonitaleSection kicker="BACKGROUND" title="It All Started with Our Own Frustration">
        <p className="w-full text-sm leading-relaxed text-ink-muted">
          We were studying for the GRE (grad school applications in the U.S.), and English
          vocabulary just wouldn&rsquo;t stick.
        </p>
        <div className="relative aspect-[2048/2313] w-full max-w-[900px] overflow-hidden rounded-lg">
          <Image src={`${IMG}/background-gre-photo.png`} alt="Studying vocabulary flashcards for the GRE" fill sizes="(min-width: 900px) 900px, 100vw" className="object-cover" />
        </div>
      </PhonitaleSection>

      <PhonitaleSection kicker="PROBLEM" title="So Why Did the LLM Get It So Wrong?">
        <p className="w-full text-sm leading-relaxed text-ink-muted">
          English and Korean don&rsquo;t sound alike. Not even close. Here&rsquo;s what LLMs miss:
        </p>
        <ExampleBox bordered={false} fit>
          {[
            {
              title: "1. Different Structure",
              body: "English letters line up in a row. Korean letters stack into blocks.",
              img: "img_problem_1.png",
              width: 2452,
              height: 340,
            },
            {
              title: "2. Different Syllable Length",
              body: "One English syllable often stretches into several in Korean.",
              img: "img_problem_2.png",
              width: 2448,
              height: 292,
            },
            {
              title: "3. Missing Sounds",
              body: 'Sounds like "th" don’t exist in Korean.',
              img: "img_problem_3.png",
              width: 2448,
              height: 292,
            },
            {
              title: "4. Different Rules",
              body: "English treats /k/ as one flexible sound. Korean splits it into three distinct letters.",
              img: "img_problem_4.png",
              width: 2448,
              height: 580,
            },
          ].map((step, i, arr) => (
            <div key={step.title} className={i < arr.length - 1 ? "border-b border-line pb-6" : ""}>
              <div className="flex flex-col items-start gap-2 text-left">
                <p className="font-display text-xl font-semibold text-accent">{step.title}</p>
                <p className="text-sm leading-relaxed text-ink-muted">{step.body}</p>
                <div className="mt-2 w-full max-w-[613px]">
                  <Image
                    src={`${IMG}/${step.img}`}
                    alt=""
                    width={step.width}
                    height={step.height}
                    unoptimized
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </ExampleBox>
      </PhonitaleSection>

      <PhonitaleSection kicker="Goal" title="We Shaped Three Goals">
        <div className="flex w-full flex-col gap-8 sm:flex-row">
          <IconStat
            icon={
              // eslint-disable-next-line @next/next/no-img-element -- local decorative SVG; next/image needs dangerouslyAllowSVG configured
              <img src={`${IMG}/svg_goal_1.svg`} alt="" className="h-[98px] w-[102px]" />
            }
            title="Human-level Effectiveness"
            description="Generate mnemonics as memorable as ones made by human experts."
          />
          <IconStat
            icon={
              // eslint-disable-next-line @next/next/no-img-element -- local decorative SVG; next/image needs dangerouslyAllowSVG configured
              <img src={`${IMG}/svg_goal_2.svg`} alt="" className="h-[90px] w-[87px]" />
            }
            title="Fully Scalable"
            description={<>Automate the entire process <br /> with no manual work required.</>}
          />
          <IconStat
            icon={
              // eslint-disable-next-line @next/next/no-img-element -- local decorative SVG; next/image needs dangerouslyAllowSVG configured
              <img src={`${IMG}/svg_goal_3.svg`} alt="" className="h-[90px] w-[90px]" />
            }
            title="Works for Any Language Pair"
            description="Build a system that works for any two languages with different sound systems"
          />
        </div>
      </PhonitaleSection>

      <PhonitaleSection kicker="APPROACH" title={'We Designed PhoniTale to Really "Listen"'}>
        <p className="w-full text-sm leading-relaxed text-ink-muted">
          See how &ldquo;Squander&rdquo; becomes a Korean keyword, and then a memorable cue.
          <br />
          * L1 = native language, L2 = language you&rsquo;re learning
        </p>
        <PipelineDiagram />
        <Accordion label="See Detailed Architecture">
          <div className="w-full overflow-hidden rounded-2xl border border-line p-6">
            <div className="relative w-full" style={{ aspectRatio: "3575/1612" }}>
              <Image src={`${IMG}/approach-architecture-diagram.png`} alt="Detailed PhoniTale pipeline architecture diagram" fill className="object-contain" />
            </div>
          </div>
        </Accordion>
      </PhonitaleSection>

      <ChapterDivider title="Evaluation" subtitle="What did I design to prove our idea and how did it turn out?" />

      <PhonitaleSection kicker="OBJECTIVE" title="Here's What We Set Out to Prove">
        <ol className="w-full list-decimal space-y-1 pl-6 text-left font-display text-xl font-semibold text-accent sm:text-center sm:list-inside sm:pl-0">
          <li>PhoniTale matches human-expert mnemonics.</li>
          <li>It outperforms older AI-based methods.</li>
        </ol>
        <Accordion label="See What We Compared" className="w-full text-left">
          <FlexTable
            columns={[{ label: "Compared Against", width: 150 }, { label: "Name", width: 100 }, { label: "Description" }]}
            rows={[
              [
                "Human-expert",
                "KSS",
                <ul key="d1" className="list-disc space-y-1 pl-5">
                  <li>Mnemonics written by professional Korean vocab-learning experts</li>
                  <li>
                    A well-known Korean vocab-learning brand,{" "}
                    <a href="https://www.youtube.com/@kssedu" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
                      Kyeong-Sun-Sik Edu
                    </a>
                  </li>
                </ul>,
              ],
              [
                "Older AI (SOTA)",
                "OGR",
                <ul key="d2" className="list-disc space-y-1 pl-5">
                  <li>Prior best-performing AI method: heavily LLM-dependent, high hallucination risk</li>
                  <li>
                    <a href="https://aclanthology.org/2024.findings-emnlp.316/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
                      Overgenerate-and-Rank (2024)
                    </a>
                  </li>
                </ul>,
              ],
              [
                "Ours",
                "PhoniTale",
                <ul key="d3" className="list-disc space-y-1 pl-5">
                  <li>Uses specialized phonological modules, built for distant language pairs</li>
                </ul>,
              ],
            ]}
          />
        </Accordion>
      </PhonitaleSection>

      <PhonitaleSection kicker="EVALUATION DESIGN" title="So Here's How I Designed the Test">
        <p className="w-full text-sm leading-relaxed text-ink-muted">
          To prove it, I designed a study measuring PhoniTale&rsquo;s effectiveness with real human
          learners, both quantitatively and qualitatively.
        </p>

        <div className="flex w-full flex-col items-center gap-5 md:flex-row">
          <div className="relative h-[140px] w-full shrink-0 rounded-[10px] bg-line md:w-[640px]">
            <Image src={`${IMG}/img_evaluationdesign_1.png`} alt="KSS (Human Expert) vs OGR (Older SOTA) vs PHT (Our Model), N = 17 each" fill unoptimized className="object-contain p-6" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display text-xl font-semibold text-accent">Groups &amp; Participants</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              We compared human, AI baseline, and our model side by side, using Korean-native
              adults. Participants were screened through an English proficiency test, then
              randomly assigned across the three groups.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-5 md:flex-row">
          <div className="relative h-[140px] w-full shrink-0 rounded-[10px] bg-line md:w-[640px]">
            <Image src={`${IMG}/img_evaluationdesign_2.png`} alt="Instruction → Learning → Testing (Recognition → Generation) → Survey, 3 sets" fill unoptimized className="object-contain p-6" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display text-xl font-semibold text-accent">Procedure</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              Following methods from prior work, participants learned words with mnemonics, then
              were tested on recognition and generation, and rated each mnemonic&rsquo;s
              helpfulness and appeal.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-5 md:flex-row">
          <div className="relative flex h-[140px] w-full shrink-0 items-end justify-center overflow-hidden rounded-[10px] bg-line px-6 pt-6 md:w-[640px]">
            <Image
              src={`${IMG}/img_evaluationdesign_3.png`}
              alt="PhoniTale evaluation web platform screenshot"
              width={440}
              height={105}
              className="h-auto w-full max-w-[440px]"
            />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display text-xl font-semibold text-accent">Web Platform</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              I built a custom web platform to reach remote participants, capture precise timing
              data, and eliminate variables unrelated to the mnemonics themselves.
            </p>
          </div>
        </div>

        <Accordion label="See Full Procedure Details" className="text-left">
          <FlexTable
            columns={[{ label: "Phase", width: 150 }, { label: "Task", width: 300 }, { label: "Provided Components" }]}
            rows={[
              [
                "Learning",
                <ul key="t1" className="list-disc space-y-1 pl-5">
                  <li>Task: Memorize</li>
                  <li>30-second time limit</li>
                  <li>12 words per 1 set</li>
                </ul>,
                <ul key="t1b" className="list-disc space-y-1 pl-5">
                  <li>English word (visually segmented)</li>
                  <li>Korean definition</li>
                  <li>Audio pronunciation</li>
                  <li>Korean keyword sequence</li>
                  <li>Verbal cue</li>
                </ul>,
              ],
              [
                <>Testing<br />- Recognition</>,
                <ul key="t2" className="list-disc space-y-1 pl-5">
                  <li>Task: Type the Korean definition</li>
                  <li>30-second time limit</li>
                  <li>Response → Correctness score</li>
                </ul>,
                <ul key="t2b" className="list-disc space-y-1 pl-5">
                  <li>English word</li>
                  <li>Audio pronunciation</li>
                </ul>,
              ],
              [
                <>Testing<br />- Generation</>,
                <ul key="t3" className="list-disc space-y-1 pl-5">
                  <li>Task: Type the English word</li>
                  <li>30-second time limit</li>
                  <li>Response → Correctness score</li>
                </ul>,
                <ul key="t3b" className="list-disc space-y-1 pl-5">
                  <li>Korean definition</li>
                </ul>,
              ],
              [
                "Survey",
                <ul key="t4" className="list-disc space-y-1 pl-5">
                  <li>
                    Task: Rate each mnemonic
                    <ul className="list-disc space-y-1 pl-5 pt-1">
                      <li>Helpfulness</li>
                      <li>Coherence</li>
                      <li>Imageability</li>
                    </ul>
                  </li>
                  <li>Response → Preference score</li>
                </ul>,
                <ul key="t4b" className="list-disc space-y-1 pl-5">
                  <li>English word (visually segmented)</li>
                  <li>Korean definition</li>
                  <li>Audio pronunciation</li>
                  <li>Korean keyword sequence</li>
                  <li>Verbal cue</li>
                </ul>,
              ],
            ]}
          />
        </Accordion>
      </PhonitaleSection>

      <PhonitaleSection kicker="PLATFORM DESIGN" title="How I Approached the Platform Design">
        <p className="w-full text-sm leading-relaxed text-ink-muted">
          A simple, focused interface built specifically for running this evaluation.
        </p>

        <div className="flex w-full flex-col gap-2 text-left">
          <p className="font-display text-xl font-semibold text-accent">1. Key Path</p>
          <p className="text-sm leading-relaxed text-ink-muted">
            Mapped the essential flow participants needed to follow, based on the evaluation
            procedure.
          </p>
          <div className="relative mt-2 w-full overflow-hidden rounded-[10px] bg-line p-4">
            <Image
              src={`${IMG}/img_design_keypath.png`}
              alt="Key path flow diagram"
              width={916}
              height={96}
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 text-left">
          <p className="font-display text-xl font-semibold text-accent">2. Wireframe</p>
          <p className="text-sm leading-relaxed text-ink-muted">
            Studied existing language-learning apps to explore layout patterns and core UX
            decisions.
          </p>
          <div className="relative mt-2 w-full overflow-hidden rounded-[10px] bg-line p-4">
            <Image
              src={`${IMG}/img_design_wireframe.png`}
              alt="Wireframe exploration"
              width={916}
              height={96}
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 text-left">
          <p className="font-display text-xl font-semibold text-accent">3. Design</p>
          <p className="text-sm leading-relaxed text-ink-muted">
            Prioritized a simple, distraction-free interface, so participants could focus on the
            task, not the design.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-1 flex-col items-center gap-4 rounded-[10px] bg-line px-6 py-6">
              <p className="w-full text-left font-display text-lg font-semibold text-accent">Key Component</p>
              <div className="relative h-[233px] w-full max-w-[400px] overflow-hidden rounded-sm">
                <Image src={`${IMG}/img_design_keycomponent.png`} alt="Key component mockup" fill className="object-contain" />
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">
                Matching English and Korean keywords were color-coded to show their phonetic link,
                while distinct font styles separated the word&rsquo;s meaning from the mnemonic
                story, making the logic behind each cue visually clear at a glance.
              </p>
            </div>
            <div className="flex flex-1 flex-col items-center gap-4 rounded-[10px] bg-line px-6 py-6">
              <p className="w-full text-left font-display text-lg font-semibold text-accent">Learning</p>
              <div className="relative h-[329px] w-full max-w-[400px] overflow-hidden rounded-sm">
                <Image src={`${IMG}/img_design_learning.png`} alt="Learning screen mockup" fill className="object-contain" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-1 flex-col items-center gap-4 rounded-[10px] bg-line px-6 py-6">
              <p className="w-full text-left font-display text-lg font-semibold text-accent">Test - Recognition</p>
              <div className="relative h-[252px] w-full max-w-[400px] overflow-hidden rounded-sm">
                <Image src={`${IMG}/img_design_recognition.png`} alt="Recognition test mockup" fill className="object-contain" />
              </div>
              <p className="w-full text-left font-display text-lg font-semibold text-accent">Test - Generation</p>
              <div className="relative h-[251px] w-full max-w-[400px] overflow-hidden rounded-sm">
                <Image src={`${IMG}/img_design_generation.png`} alt="Generation test mockup" fill className="object-contain" />
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center gap-4 rounded-[10px] bg-line px-6 py-6">
              <p className="w-full text-left font-display text-lg font-semibold text-accent">Survey</p>
              <div className="relative h-[473px] w-full max-w-[400px] overflow-hidden rounded-sm">
                <Image src={`${IMG}/img_design_survey.png`} alt="Survey screen mockup" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </PhonitaleSection>

      <PhonitaleSection kicker="PLATFORM DEVELOPMENT" title="From Design to Fully Working Product">
        <p className="w-full text-sm leading-relaxed text-ink-muted">
          In spring 2025, vibe coding was just taking off, and I wanted to try it firsthand.
          <br />
          So I designed the system architecture and built the entire platform myself, solo.
        </p>

        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex flex-1 flex-col items-center gap-4 rounded-[10px] bg-line px-6 py-5">
            <p className="w-full text-left font-display text-xl font-semibold text-accent">System Architecture</p>
            <div className="relative h-[140px] w-full max-w-[640px]">
              <Image
                src={`${IMG}/img_development_architecture.png`}
                alt="System architecture: group-specific URL to web frontend to backend (AWS), with group-specific test set and DynamoDB database"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-4 rounded-[10px] bg-line px-6 py-5 md:w-[250px]">
            <p className="w-full text-left font-display text-xl font-semibold text-accent">Tools</p>
            <div className="relative h-[160px] w-full max-w-[220px]">
              <Image src={`${IMG}/img_development_tools.png`} alt="Cursor and Claude" fill className="object-contain" />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 rounded-[10px] bg-line p-4">
          <div className="relative h-[450px] w-full max-w-[800px] overflow-hidden rounded shadow">
            <Image src={`${IMG}/platform-demo.gif`} alt="Demo of the PhoniTale evaluation platform" fill unoptimized className="object-cover" />
          </div>
          <a
            href="https://phonitale-react-git-no-auth-su-young-kwons-projects.vercel.app/wodnr/no-auth/round/1/start"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ink-muted underline underline-offset-2 hover:text-ink"
          >
            Try It Yourself!
          </a>
        </div>
      </PhonitaleSection>

      <PhonitaleSection kicker="FINDINGS" title="The Data Proved PhoniTale Works!">
        <p className="w-full text-sm leading-relaxed text-ink-muted">
          I analyzed data from 51 participants, collected through the platform, to test both
          goals, and the results confirmed them.
        </p>
        <div className="flex w-full flex-col gap-6 md:flex-row md:items-center">
          <div className="relative w-full shrink-0 overflow-hidden rounded-[10px] bg-line p-[30px] md:w-fit">
            <Image
              src={`${IMG}/img_findings.png`}
              alt="Chart comparing recognition and generation recall across the three groups"
              width={440}
              height={210}
              className="h-auto w-full max-w-[440px]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-5 text-left">
            <div>
              <p className="font-display text-xl font-semibold text-accent">1. PhoniTale matches human-expert mnemonics</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                In the generation task, PhoniTale scored 0.609, with no statistically significant
                difference from human-expert mnemonics (0.590).
              </p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-accent">2. PhoniTale outperforms older AI-based methods</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                PhoniTale significantly outperformed the older AI method (OGR) in generation
                accuracy, 0.609 vs. 0.539 (p &lt; .05).
              </p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-accent">+ One More Thing: Preference ≠ Performance</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                Interestingly, people still preferred human-made cues, even when PhoniTale helped
                them remember just as well.
              </p>
            </div>
          </div>
        </div>
      </PhonitaleSection>

      <ChapterDivider title="Reflection" subtitle="What did I experience and learn?" />

      <section className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8 md:px-[88px] md:py-10">
        <ExampleBox>
          <p className="text-sm font-medium text-ink-muted">New Experience</p>
          <div className="flex flex-col gap-3">
            <LeadInBullet index={1} text="First Step into AI Research: My first project in AI/NLP research, from idea to publication." />
            <LeadInBullet index={2} text="Built a System Solo: Went beyond planning to design and build the entire evaluation platform myself." />
            <LeadInBullet index={3} text="Published at a Top-Tier Conference: Presented our work at EMNLP 2025 Main Conference." />
          </div>
        </ExampleBox>
        <ExampleBox>
          <p className="text-sm font-medium text-ink-muted">New Learnings</p>
          <div className="flex flex-col gap-3">
            <LeadInBullet index={1} text="What Research Really Means: I learned what research actually looks like, turning a personal pain point into a real question, building an approach to answer it, and proving it works. That full arc taught me more than any single step could." />
            <LeadInBullet index={2} text="The Barrier to Building Has Dropped: Beyond planning, I directly handled development and data analysis for the first time. I realized that with curiosity and an idea, anyone can now build something and put it into the world. This makes me want to focus less on the tools themselves, and more on intent and value." />
            <LeadInBullet index={3} text="New Challenges Compound: Diving headfirst into unfamiliar territory pushed me a level up, in both skill and perspective. I want to keep embracing the unfamiliar and growing from it." />
          </div>
        </ExampleBox>
      </section>
    </>
  );
}
