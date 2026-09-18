import { DataTable } from "@/components/project/DataTable";
import { ImagePlaceholder } from "@/components/project/ImagePlaceholder";
import { PullQuote } from "@/components/project/PullQuote";
import { Section } from "@/components/project/Section";
import { StatGrid } from "@/components/project/Stat";

// AsleepTrack is a platformization story: best-in-class AI that no one
// could actually integrate, turned into a packaged B2B product. Leads
// with the revenue outcome, proves the "world's-best AI" claim with the
// benchmark table (the most credible artifact in the source deck), then
// covers the platform shape and client traction.
export function AsleepTrackDetail() {
  return (
    <>
      <Section kicker="Result" title="$70K MRR — the company's first B2B revenue line" wide>
        <p className="text-base leading-relaxed text-ink-muted">
          Asleep had built the most accurate non-contact sleep-tracking AI available — but no
          corporate client could integrate the raw model without months of custom engineering. I
          led the team that packaged it into AsleepTrack: a unified API/SDK/Dashboard platform
          that any client could plug in.
        </p>
        <div className="mt-10">
          <StatGrid
            stats={[
              { value: "$70K MRR", label: "First B2B revenue line, launched from zero" },
              { value: "3 months", label: "From launch to first signed clients" },
              { value: "8,500", label: "Daily active users at 4 months post-launch" },
              { value: "0.80", label: "Accuracy — best of any tracker on the market" },
            ]}
          />
        </div>
      </Section>

      <Section kicker="Why it worked" title="World's №1 non-contact sleep-tracking accuracy" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          Benchmarked head-to-head against wearables from Amazon, Samsung, Fitbit, and Apple, using
          only a smartphone microphone:
        </p>
        <div className="mt-6">
          <DataTable
            columns={["Rank", "Product", "Type", "Accuracy", "Macro F1"]}
            rows={[
              ["1", "AsleepTrack", "Non-contact audio", "0.800", "0.77"],
              ["2", "Amazon Halo Rise", "Motion sensing", "0.663", "0.62"],
              ["3", "Galaxy Watch", "Watch", "0.649", "0.58"],
              ["4", "Fitbit Sense", "Watch", "0.646", "0.58"],
              ["5", "Apple Watch", "Watch", "0.564", "0.49"],
            ]}
            highlightRow={0}
          />
        </div>
      </Section>

      <Section kicker="Platform" title="API, SDK, Dashboard, and Docs — one integration surface" wide>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "API",
              body: "Tracking results, sleep sessions, user management, and usage metrics behind one interface.",
            },
            {
              title: "SDK",
              body: "Handles audio recording, preprocessing, and API calls — clients ship with a fraction of the integration work.",
            },
            {
              title: "Dashboard",
              body: "Usage monitoring, real-time sleep data, and billing in one client-facing view.",
            },
            {
              title: "Developer docs",
              body: "Integration guides, a sample app, and a sleep-knowledge wiki, published bilingually on ReadMe.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-line bg-paper-2/50 p-5">
              <h3 className="font-display text-sm font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          Pricing was usage-based &mdash; clients pay only for successful analysis sessions, lowering
          the barrier to a first pilot.
        </p>
        <ImagePlaceholder
          label="Diagram — system architecture (client SDK ↔ API/AI engine ↔ dashboard & dev portal)"
          aspect="mt-8 aspect-[16/9]"
        />
      </Section>

      <Section kicker="Traction" title="Client adoption across consumer electronics and telecom" wide>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-base font-medium text-ink">Live integrations</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              SK Telecom (personal AI assistant), LG Electronics (sleep-stage-based A/C control),
              algocare (nutrient management), Navien (sleep-stage-based mattress temperature
              control).
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-medium text-ink">Pipeline health</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              As of month 12: 8 enterprises at first meeting → 10 in PoC → 5 under contract → 3
              launched → 2 scaling up — a funnel with real depth behind the headline clients.
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          I ran the roadmap (MoSCoW + RICE prioritization) across a stakeholder group spanning
          Business, Marketing, Medical, AI, and Engineering, and represented the platform
          externally at CES and HIMSS.
        </p>
      </Section>

      <Section>
        <PullQuote>Expand your service horizons with sleep integration.</PullQuote>
      </Section>
    </>
  );
}
