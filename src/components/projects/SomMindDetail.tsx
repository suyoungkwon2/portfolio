import { ImagePlaceholder } from "@/components/project/ImagePlaceholder";
import { ProcessSteps } from "@/components/project/ProcessSteps";
import { PullQuote } from "@/components/project/PullQuote";
import { Section } from "@/components/project/Section";
import { StatGrid } from "@/components/project/Stat";

// SomMind is a 0->1 regulated product: PM + clinical program design +
// regulatory strategy in one role. The story is "patient research →
// certified clinical product," so this leads with the regulatory
// milestone (the hardest-won, most credibility-bearing outcome), then
// moves through research → the 4-week program → final features.
export function SomMindDetail() {
  return (
    <>
      <Section kicker="Result" title="From patient interviews to a certified clinical trial" wide>
        <p className="text-base leading-relaxed text-ink-muted">
          CBT-i is the gold-standard, drug-free treatment for chronic insomnia — but cost and
          access barriers push patients toward medication instead. I owned product, clinical
          program design, and regulatory strategy for SomMind, a mobile CBT-i program built with
          Seoul National University Bundang Hospital, from the first patient interview through
          certified clinical trial approval.
        </p>
        <div className="mt-10">
          <StatGrid
            stats={[
              { value: "GMP", label: "SaMD certification secured" },
              { value: "K-FDA", label: "Clinical trial plan approved" },
              { value: "4 weeks", label: "Structured CBT-i program length" },
              { value: "26", label: "Sleep metrics tracked per user" },
            ]}
          />
        </div>
      </Section>

      <Section kicker="Research" title="Six patient interviews surfaced three access barriers" wide>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Logistical inaccessibility",
              body: "Weekly in-person hospital visits caused treatment inconsistency and drop-off.",
            },
            {
              title: "Adherence fatigue",
              body: "Paper sleep diaries felt tedious — a compulsion that lowered rather than raised adherence.",
            },
            {
              title: "Therapist shortage",
              body: "Too few qualified CBT-i therapists exist to meet patient demand at any scale.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-base font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          Competitor review (Sleepio, PillowRx) found the same pattern from a different angle:
          cognitively overloaded content, dated UX, and web-only access — none solved for
          adherence.
        </p>
      </Section>

      <Section kicker="Program design" title="A 4-week prescribed CBT-i journey" wide>
        <ProcessSteps
          steps={[
            {
              title: "Week 1 — Commencement",
              body: "Pre-treatment assessment, app onboarding, Sleep Restriction Therapy launch.",
            },
            {
              title: "Week 2 — Foundation",
              body: "Stimulus control + sleep hygiene education, relaxation training begins.",
            },
            {
              title: "Week 3 — Deepening",
              body: "Cognitive therapy layered on top of hygiene and relaxation modules.",
            },
            {
              title: "Week 4 — Consolidation",
              body: "Relapse prevention and final assessment, alongside daily sleep-diary tracking throughout.",
            },
          ]}
        />
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          Target users met DSM-5 insomnia criteria (Insomnia Severity Index ≥ 8, Beck Depression
          Inventory &lt; 29). Content was built as ~7-minute animated micro-lessons rather than long
          reading — designed for adherence, including for older users less comfortable with dense
          app UIs.
        </p>
      </Section>

      <Section kicker="Final product" title="Four feature pillars" wide>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "Dynamic prescription",
              body: "Personalized Time-in-Bed targets update weekly from the user's own diary data.",
            },
            {
              title: "Structured micro-learning",
              body: "Short animated lessons (~7 min avg) hold concentration better than long-form content.",
            },
            {
              title: "Objective data tracking",
              body: "26 sleep metrics captured automatically — score, efficiency, latency, sleep stages, snoring.",
            },
            {
              title: "Proactive nudging",
              body: "Context-aware reminders reinforce adherence at the moments patients are most likely to drop off.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-line bg-paper-2/50 p-5">
              <h3 className="font-display text-sm font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
        <ImagePlaceholder
          label="Screenshots — onboarding, weekly prescription, micro-learning player, sleep report"
          aspect="mt-8 aspect-[16/9]"
        />
      </Section>

      <Section>
        <PullQuote>Healthy sleep starts with a healthy mind.</PullQuote>
      </Section>
    </>
  );
}
