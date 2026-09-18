import { DataTable } from "@/components/project/DataTable";
import { ImagePlaceholder } from "@/components/project/ImagePlaceholder";
import { PullQuote } from "@/components/project/PullQuote";
import { Section } from "@/components/project/Section";
import { StatGrid } from "@/components/project/Stat";

// SleepVice is a lean 3-person 0->1 story with a novel interaction
// surface (voice, not screen). The narrative hinge is the two-round
// usability test — v1 exposed real friction, v2's fixes measurably
// worked — so this leads with the partnership outcome, then walks
// straight to that before/after, which is the most convincing artifact.
export function SleepViceDetail() {
  return (
    <>
      <Section kicker="Result" title="Korea's first official Amazon collaboration startup" wide>
        <p className="text-base leading-relaxed text-ink-muted">
          A 3-person task force — business development, engineering, and me on product & voice
          design — built an Alexa Skill that layers Asleep&apos;s sleep-tracking AI onto the Amazon
          Echo, giving real-time voice feedback and environmental control based on sleep stage.
        </p>
        <div className="mt-10">
          <StatGrid
            stats={[
              { value: "1st", label: "Official Amazon-partnered startup in Korea" },
              { value: "CES 2022", label: "Joint exhibition at the Alexa booth" },
              { value: "200+", label: "Media & press features" },
              { value: "88%", label: "Task completion, 2nd usability test (from 83%)" },
            ]}
          />
        </div>
      </Section>

      <Section kicker="Why Alexa" title="A market entry chosen on evidence, not default" wide>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "Market dominance",
              body: "The most widely adopted digital assistant in the US smart-home market.",
            },
            {
              title: "Technical accessibility",
              body: "The Skills platform kept third-party development barriers low for a 3-person team.",
            },
            {
              title: "Ecosystem scale",
              body: "Alexa was already integrated into 30,000+ devices across 150 product types.",
            },
            {
              title: "Validated demand",
              body: "Sleep & mindfulness skills were already among Alexa's most successful categories.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-base font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          Securing the partnership itself took direct outreach to the Alexa Fund and Alexa
          Startups teams — the plan was explicit: launch as a 3rd-party Skill, then earn a path to
          becoming a native Alexa feature.
        </p>
      </Section>

      <Section kicker="Iteration" title="Usability testing rewrote the voice design twice" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          Round 1 (N=5) surfaced a clear pattern: the assistant was informative but robotic.
          Verbatim feedback: <em>&ldquo;insightful and straightforward, but not humorous and
          human-like&rdquo;</em> and <em>&ldquo;interaction is too long to listen to in the
          morning.&rdquo;</em>
        </p>
        <div className="mt-6">
          <DataTable
            columns={["Metric", "1st test", "2nd test", "Change"]}
            rows={[
              ["Task completion rate", "83%", "88%", "+5pp"],
              ["Flow", "54", "70", "+16"],
              ["Preference", "54", "66", "+12"],
              ["Content", "76", "83", "+7"],
              ["Device purchase intent (/5)", "2.2", "3.2", "+1.0"],
            ]}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          The v2 rewrite followed three explicit rules — <strong className="text-ink">be
          concise</strong> (shorter response segments), <strong className="text-ink">be
          friendly</strong> (SSML-driven tone variation), <strong className="text-ink">be
          helpful</strong> (contextual guidance added) — and every headline metric moved up in
          response, at the modest cost of ease-of-use and utterance-recognition scores.
        </p>
      </Section>

      <Section kicker="Product" title="Voice-first sleep coaching, plus real-world light control" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          Beyond tracking and reporting, SleepVice drove a Philips Hue-connected lighting sequence
          synced to sleep stage — gradually dimming at sleep onset, dark through the night, then
          brightening before a data-driven wake time. Example exchange:{" "}
          <em>&ldquo;Can you recommend the best sleep time for me?&rdquo;</em> →{" "}
          <em>&ldquo;Sleep from 6hr 30min to 7hr 20min&rdquo;</em>, generated from the user&apos;s own
          REM patterns.
        </p>
        <ImagePlaceholder
          label="Mockup — Alexa device with voice-response speech bubble, light-control sequence"
          aspect="mt-8 aspect-[16/9]"
        />
      </Section>

      <Section>
        <PullQuote>Personal sleep coach right by your pillow.</PullQuote>
      </Section>
    </>
  );
}
