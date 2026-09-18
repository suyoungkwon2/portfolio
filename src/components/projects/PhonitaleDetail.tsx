import { DataTable } from "@/components/project/DataTable";
import { ImagePlaceholder } from "@/components/project/ImagePlaceholder";
import { PullQuote } from "@/components/project/PullQuote";
import { Section } from "@/components/project/Section";
import { StatGrid } from "@/components/project/Stat";

// Phonitale is a published-research case study — the story is "identify
// a real gap in prior work, build a specialized pipeline instead of a
// bigger LLM prompt, and prove it matches human-level recall." Leads
// with the publication + headline result, walks the pipeline with a
// worked example (most concrete way to explain phonological mnemonics),
// then closes on the 3-way human study.
export function PhonitaleDetail() {
  return (
    <>
      <Section kicker="Result" title="Published at EMNLP 2025, matching human-authored recall" wide>
        <p className="text-base leading-relaxed text-ink-muted">
          Learners acquiring vocabulary across <strong className="text-ink">typologically
          distant language pairs</strong> (like English↔Korean) can&apos;t rely on simple sound-alike
          tricks — the grammar, syllable structure, and phoneme sets are too different. I designed
          an NLP pipeline that automatically generates phonologically grounded mnemonics for this
          case, and ran the human study that validated it.
        </p>
        <div className="mt-10">
          <StatGrid
            stats={[
              { value: "EMNLP 2025", label: "Main Conference, published & presented" },
              { value: "0.609", label: "PhoniTale generation-recall score" },
              { value: "0.590", label: "Human-expert (KSS) benchmark score" },
              { value: "51", label: "Participants across 3 test conditions" },
            ]}
          />
        </div>
      </Section>

      <Section kicker="Problem" title="Prior automated methods don't transfer across languages" wide>
        <DataTable
          columns={["Prior work", "Limitation"]}
          rows={[
            ["Transphoner (2014)", "Rule-based similarity — only generates keywords, not full mnemonics"],
            ["SmartPhone (2023)", "Reuses Transphoner's keywords; LLM only handles sentence generation"],
            ["OGR (2024)", "Heavily LLM-dependent, high hallucination risk, only tested on English targets"],
          ]}
        />
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          English → Korean specifically breaks these approaches: English is linear, Korean uses 2D
          syllable blocks; Korean forbids consonant clusters English relies on; and some English
          phonemes (like /θ/) don&apos;t exist in Korean at all.
        </p>
      </Section>

      <Section kicker="How it works" title="Transliteration → Segmentation → Keyword Match → Cue" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          Instead of asking an LLM to invent a mnemonic from scratch, PhoniTale finds real
          native-language words that already sound like the target word, then has the LLM weave
          them into one memorable sentence.
        </p>
        <div className="mt-8 rounded-2xl border border-line p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
            Worked example — &ldquo;Squander&rdquo;
          </p>
          <ol className="mt-4 flex flex-col gap-3 text-sm text-ink-muted">
            <li>
              <span className="font-display text-ink">1. Transliteration</span> — English IPA{" "}
              <code className="text-accent">/skˈwɑndər/</code> → closest Korean sounds{" "}
              <code className="text-accent">/sɯkʰwantʌ/</code>
            </li>
            <li>
              <span className="font-display text-ink">2. Segmentation</span> — split into valid
              Korean syllables: <code className="text-accent">/sɯ/ /kʰwan/ /tʌ/</code>
            </li>
            <li>
              <span className="font-display text-ink">3. Keyword match</span> — find real Korean
              words per segment: 세관 (customs), 더 (more)
            </li>
            <li>
              <span className="font-display text-ink">4. Cue generation</span> — an LLM weaves
              them into a sentence: <em>&ldquo;세관에서 시간을 더 낭비했다&rdquo;</em> (&ldquo;I wasted more
              time at customs&rdquo;) — sound and meaning reinforce each other.
            </li>
          </ol>
        </div>
        <ImagePlaceholder
          label="Diagram — segmentation model architecture (BiLSTM encoder + boundary predictor)"
          aspect="mt-8 aspect-[16/9]"
        />
      </Section>

      <Section kicker="Evaluation" title="Matched human-expert recall, beat prior automated SOTA" wide>
        <p className="text-sm leading-relaxed text-ink-muted">
          51 Korean-native adults were split into 3 groups of 17: <strong className="text-ink">KSS</strong>{" "}
          (human-expert mnemonics), <strong className="text-ink">OGR</strong> (prior automated
          state-of-the-art), and <strong className="text-ink">PHT</strong> (PhoniTale). Each group
          learned words, then was tested on recognition and generation recall.
        </p>
        <div className="mt-6">
          <DataTable
            columns={["Group", "Recognition", "Generation"]}
            rows={[
              ["KSS — human expert", "0.721", "0.590"],
              ["OGR — prior SOTA", "0.690", "0.539"],
              ["PHT — PhoniTale", "0.698", "0.609"],
            ]}
            highlightRow={2}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          PhoniTale significantly outperformed the prior automated approach and reached recall
          comparable to human-authored study aids — while being fully automated and scalable to
          any language pair.
        </p>
      </Section>

      <Section>
        <PullQuote attribution="Suyoung Kwon, Sana Kang, Myeongseok Gwon, Jaewook Lee, Andrew Lan, Bhiksha Raj, Rita Singh — EMNLP 2025">
          Memorizing foreign words shouldn&apos;t feel like torture.
        </PullQuote>
      </Section>
    </>
  );
}
