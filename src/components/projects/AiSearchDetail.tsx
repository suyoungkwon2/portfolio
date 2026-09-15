import { DataTable } from "@/components/project/DataTable";
import { ImagePlaceholder } from "@/components/project/ImagePlaceholder";
import { PullQuote } from "@/components/project/PullQuote";
import { Section } from "@/components/project/Section";
import { StatGrid } from "@/components/project/Stat";

// AI Search is the clearest "PM drives business impact" story of the
// set: a bounded PoC, validated with a rigorous A/B test, then hardened
// for production. Leads hard with the revenue/ROI headline (the site
// owner explicitly confirmed these as the numbers to lead with), keeps
// the percentage figures as secondary detail per that same guidance.
export function AiSearchDetail() {
  return (
    <>
      <Section kicker="Result" title="174x revenue lift, 35.5x return on investment">
        <p className="text-base leading-relaxed text-ink-muted">
          6–7% of daily searches on Kurly&apos;s e-commerce platform (3.5M MAU) returned{" "}
          <strong className="text-ink">zero results</strong> — a direct revenue leak, since search
          drives the largest share of purchases. With the search engineering team unable to
          rebuild the core engine, I scoped a bounded AI layer on top of it: only intercept when
          the legacy engine already failed.
        </p>
        <div className="mt-10">
          <StatGrid
            stats={[
              { value: "174x", label: "Revenue lift from recovered search events" },
              { value: "35.5x", label: "Return on investment (margin ÷ API cost)" },
              { value: "6.8% → 0.22%", label: "No-result rate, legacy vs. post-launch" },
              { value: "3.5M MAU", label: "A/B test population, 5:5 split" },
            ]}
          />
        </div>
      </Section>

      <Section kicker="Solution" title="Only fire when the legacy engine already gave up" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          The legacy search used exact lexical matching — a single typo, extra space, or synonym
          (&ldquo;Cabage,&rdquo; &ldquo;Ca bbage,&rdquo; &ldquo;Lettuce&rdquo;) returned nothing. Google Vertex AI Search, layered on
          top of Kurly&apos;s existing GCP data, could interpret intent instead of just matching
          strings — without touching the legacy engine at all.
        </p>
        <div className="mt-6 rounded-2xl border border-line p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
            Conditional trigger flow
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Search request → legacy search runs → <em>only if No Result</em> → check
            multi-section results & blocklist → call Vertex AI → serve AI results if any match,
            else fall back to the legacy no-result view. Every AI result still respects existing
            inventory and business rules.
          </p>
        </div>
      </Section>

      <Section kicker="Validation" title="A 2-week, 5:5 A/B test across the entire user base" wide>
        <DataTable
          columns={["Metric", "Before", "After"]}
          rows={[
            ["No-Result Rate (no-result cases)", "99.98%", "2.93%"],
            ["Click-Through Rate (no-result cases)", "3.83%", "26.50%"],
            ["No-Result Rate (whole search)", "6.80%", "0.22%"],
            ["Click-Through Rate (whole search)", "58.60%", "60.14%"],
          ]}
        />
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          Hypothesis validated across every KPI. Off that near-zero no-result baseline, downstream
          revenue metrics moved by extreme multiples — purchase revenue +17,357%, add-to-cart
          count +16,710% — legitimate lift, but reported here as supporting detail behind the
          headline 174x / 35.5x figures above.
        </p>
      </Section>

      <Section kicker="Production hardening" title="From PoC to safe, cost-controlled infrastructure" wide>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-base font-medium text-ink">Cost control</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              A proxy server caches search results per keyword for 12 hours, cutting redundant
              Vertex AI calls by up to 30% and reducing SaaS spend by 30.82%.
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-medium text-ink">Safety</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Query validation, blocklist enforcement (unlisted brands, profanity, medical terms),
              and circuit-breaker logic against response-time overruns.
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          Shipped a Looker dashboard for real-time KPI monitoring and a daily Slack bot surfacing
          top declining-CTR queries to the merchandising team. Deployment: PoC to full-scale
          adoption in 2 months. Presented as a GCP innovation case study on stage at{" "}
          <strong className="text-ink">Google Cloud Summit Seoul 2024</strong>.
        </p>
        <ImagePlaceholder
          label="Screenshots — before/after search result, Looker dashboard, Google Cloud Summit stage"
          aspect="mt-8 aspect-[16/9]"
        />
      </Section>

      <Section>
        <PullQuote>Just type it out. We&apos;ll find what you need.</PullQuote>
      </Section>
    </>
  );
}
