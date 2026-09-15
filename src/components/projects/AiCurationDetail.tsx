import { DataTable } from "@/components/project/DataTable";
import { ImagePlaceholder } from "@/components/project/ImagePlaceholder";
import { ProcessSteps } from "@/components/project/ProcessSteps";
import { PullQuote } from "@/components/project/PullQuote";
import { Section } from "@/components/project/Section";
import { StatGrid } from "@/components/project/Stat";

// AI Curation is a two-stage validation story: prove fidelity internally
// (Copilot tool) before proving parity externally (production A/B).
// Structure mirrors that sequence so the reader sees why each test
// existed, not just the end headline.
export function AiCurationDetail() {
  return (
    <>
      <Section kicker="Result" title="25% of homepage slots, fully autonomous">
        <p className="text-base leading-relaxed text-ink-muted">
          Kurly&apos;s merchandisers manually curate themed campaigns across 40K+ SKUs — a process
          that couldn&apos;t scale past their staff capacity. I built an AI system where a
          merchandiser inputs a theme and the model selects the product mix and keeps it fresh on
          its own, validated to match human curation quality before shipping to production.
        </p>
        <div className="mt-10">
          <StatGrid
            stats={[
              { value: "25%", label: "Of critical homepage slots, AI-run" },
              { value: "200+", label: "Autonomous campaigns live" },
              { value: "8.95 / 10", label: "Expert satisfaction score on 21 test campaigns" },
              { value: "0", label: "Manual ops required per campaign" },
            ]}
          />
        </div>
      </Section>

      <Section kicker="Problem" title="An operational bottleneck, mapped from 8 employee interviews" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          Merchandising and marketing staff walked me through the full campaign workflow — trend
          search → concept → product selection → approval → launch. The bottleneck showed up at
          every step: tiresome manual sequencing, hard-to-track out-of-stock SKUs, concept
          re-work when too few products qualified, and manual sales-data checks that ate hours
          per campaign.
        </p>
      </Section>

      <Section kicker="Validation, stage 1" title="Prove fidelity internally, before touching production" wide>
        <ProcessSteps
          steps={[
            {
              title: "Build Copilot",
              body: "An internal Gradio tool letting MD/Marketing generate candidate product lists per theme — used company-wide for 8 weeks, 6 iterations from feedback.",
            },
            {
              title: "Model bake-off",
              body: "Proprietary algorithm (GPT-4o) vs. GCP Vertex agent, 10 campaigns, 56 blind responses. Proprietary model won 68% overall, 77% on logic-heavy themes.",
            },
            {
              title: "Expert scoring",
              body: "PM, MD lead, and Marketing lead rated 21 test campaigns 1–10. Average: 8.95/10 — \"ready for autonomous deployment.\"",
            },
            {
              title: "Speed & cost",
              body: "Search time: 1 min → 15 sec. Result fidelity: often-unmet minimums → 87%+ met. Cost per query: $0.50 → under $0.07.",
            },
          ]}
        />
      </Section>

      <Section kicker="Validation, stage 2" title="Then prove parity in production, with a real A/B test" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          24,455 experiment users vs. 24,278 control, 20 live slots, 2-week duration. Randomization
          checked clean (no Sample Ratio Mismatch, p = 0.423) with adequate statistical power.
        </p>
        <div className="mt-6">
          <DataTable
            columns={["KPI", "Result"]}
            rows={[
              ["Campaign click / add-to-cart / purchase ratio", "No statistically significant difference (p = 0.076–0.982)"],
              ["Secondary KPIs", "No statistically significant difference (p = 0.174–0.839)"],
              ["SKU mix", "AI used fewer SKUs but more diverse categories, at comparable theme relevancy"],
            ]}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          Hypothesis validated: AI-curated campaigns performed at parity with human-curated ones —
          clearing the bar to hand over full autonomy on live homepage slots.
        </p>
      </Section>

      <Section kicker="Rollout" title="Refining relevance before full integration" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          Post-test, low-thematic-relevance items sat at 9.17% (all-levels) / 0.76% (critical). I
          tested 3 refinement algorithms — the winning version (new data types added) cut that to
          2.64% / 1.21%, the most effective of the three, and shipped as the production algorithm.
          Merchandisers now launch a campaign by filling one row in a shared sheet; the system
          handles selection and hourly refresh from there.
        </p>
        <ImagePlaceholder
          label="Screenshots — 4 live AI-generated campaigns, Campaign Copilot UI"
          aspect="mt-8 aspect-[16/9]"
        />
      </Section>

      <Section>
        <PullQuote>You name the theme. AI does the rest.</PullQuote>
      </Section>
    </>
  );
}
