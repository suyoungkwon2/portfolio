import { DataTable } from "@/components/project/DataTable";
import { ImagePlaceholder } from "@/components/project/ImagePlaceholder";
import { ProcessSteps } from "@/components/project/ProcessSteps";
import { PullQuote } from "@/components/project/PullQuote";
import { Section } from "@/components/project/Section";
import { StatGrid } from "@/components/project/Stat";

// MARS is a datathon case study: the story is "constrained-time
// competition → real hospital data → a working pipeline that clinicians
// rated better round over round." Structure leads with the award +
// evaluation lift, then compresses the 4-stage process and 3-module
// architecture into scannable blocks instead of the PDF's page-by-page
// narrative.
export function MarsDetail() {
  return (
    <>
      <Section kicker="Result" title="2nd place, out of 10 finalist teams">
        <p className="text-base leading-relaxed text-ink-muted">
          Physicians spend up to <strong className="text-ink">30% of their work time</strong>{" "}
          hand-writing discharge summaries — and Korea&apos;s 2024 medical staffing crisis, which
          drove an 86.7% resident resignation rate, made that burden worse. I led a 4-person team
          building a GenAI pipeline that drafts full discharge summaries from real, unstructured
          patient records — under a 17-day deadline, with no internet access and no model choice
          beyond what the datathon allowed.
        </p>
        <div className="mt-10">
          <StatGrid
            stats={[
              { value: "1st / 100", label: "Preliminary round — 3-task NLP benchmark" },
              { value: "2nd / 10", label: "Final round — Excellence Award" },
              { value: "3.55 → 3.70", label: "Clinician satisfaction, round 1 → round 2" },
              { value: "400", label: "Real patient records used (final round)" },
            ]}
          />
        </div>
      </Section>

      <Section kicker="Problem" title="Three compounding pressures on documentation quality" wide>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Documentation burden",
              body: "Physicians manually synthesize sprawling, unstructured clinical data into standardized summaries — up to 30% of total work time.",
            },
            {
              title: "Staffing crisis",
              body: "A prolonged national medical dispute drove an 86.7% resident resignation rate starting Feb 2024, concentrating the burden on fewer remaining staff.",
            },
            {
              title: "Falling fidelity",
              body: "Burden + staffing shortage together degraded documentation quality and put patient-safety handoffs at risk.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-base font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="Process" title="Discover → Define → Develop → Evaluate" wide>
        <ProcessSteps
          steps={[
            {
              title: "Discover",
              body: "Reviewed ~20 papers on clinical text generation; mapped SNUBH's note structure (Chief Complaint, Present Illness, Assessment, Careplan) and abbreviation set to preserve clinical logic.",
            },
            {
              title: "Define",
              body: "Set 4 goals — clinical fidelity, factual accuracy, efficiency, fairness — and split the technical problem into data-complexity and clinical-domain challenge tracks.",
            },
            {
              title: "Develop",
              body: "Built a 3-module pipeline: preprocessing, chained prompting, postprocessing — see architecture below.",
            },
            {
              title: "Evaluate",
              body: "Scored the system with both clinician surveys and an LLM-judge rubric, across 2 iteration rounds.",
            },
          ]}
        />
      </Section>

      <Section kicker="Architecture" title="A 3-module generation pipeline" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          Each module targets a specific failure mode: noisy source data, hallucination risk, and
          inconsistent output formatting.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "1 · Preprocessing",
              body: "Merges duplicate records, segments text by clinical signal (Subjective/Objective/Plan), and unifies each patient's scattered files into one temporal corpus.",
            },
            {
              title: "2 · Prompt",
              body: "3 chained prompts — role & task setup, then JSON structuring, then patient summary — with dynamic segmentation per hospital department.",
            },
            {
              title: "3 · Postprocessing",
              body: "Converts structured JSON into a human-readable document with headers, standardizes dates, and strips noise/special characters.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-line bg-paper-2/50 p-5">
              <h3 className="font-display text-sm font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
        <ImagePlaceholder
          label="Diagram — 3-module architecture (preprocessing → prompt → postprocessing)"
          aspect="mt-8 aspect-[16/9]"
        />
      </Section>

      <Section kicker="Evaluation" title="Clinicians rated it higher in round 2 than round 1" wide>
        <DataTable
          columns={["Department", "Round 1", "Round 2"]}
          rows={[
            ["Gastroenterology", "3.0", "3.4"],
            ["Cardiology", "3.6", "3.8"],
            ["Nephrology", "3.8", "3.6"],
            ["Neurosurgery", "3.8", "4.0"],
            ["Overall average", "3.55", "3.70"],
          ]}
          highlightRow={4}
        />
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          Independently, an LLM-judge rubric scored the final system on clinical clarity (3.17/4),
          conciseness (3.75/4), and hallucination avoidance (3.25/4) against ground-truth summaries
          — the mixed signal across departments shaped where we&apos;d focus a v2.
        </p>
      </Section>

      <Section>
        <PullQuote>Get time back. Move care forward.</PullQuote>
      </Section>
    </>
  );
}
