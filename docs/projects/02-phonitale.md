---
title: "PhoniTale — AI-powered Mnemonic Foreign Vocab Learning"
section: Healthcare / Education
pdf_pages: 7-10
---

# PhoniTale

**Subtitle:** AI-powered Mnemonic Foreign Vocab Learning
**Tagline (pull quote):** "Memorizing foreign words shouldn't feel like torture."

## Chips

- **Domain (green):** Education
- **Problem (red):** Learning Language
- **Tech (blue):** NLP, AI

## Role & Team

- **My role:** Project Management, AI Research, Evaluation Design, Platform Design/Dev, Data Analysis
- **Type:** NLP Research
- **Team (portfolio, p.7):** Sana Kang, Myeongseok Gwon, Jaewook Lee
- **Full author list (CV / paper credit, equal contributions marked \*):** Sana Kang\*, Myeongseok Gwon\*, Su Young Kwon\*, Jaewook Lee, Andrew Lan, Bhiksha Raj, Rita Singh
- **Academic home:** CMU Language Technology Institute (Independent Research, Advisors: Prof. Rita Singh, Prof. Bhiksha Raj)

## Timeline

- Duration: Mar – Jun 2025 (CV: "Language Technology Institute, Carnegie Mellon University, Mar 2025 – Jun 2025"; portfolio p.7 says "Mar - May 2025" — 1-month difference, minor)
- Result: **EMNLP 2025 Main Conference** (Empirical Methods in Natural Language Processing), 30th anniversary — Suzhou, China, Nov 4–9, 2025; poster presentation.

## Background

- **Motivation:** foreign vocabulary is a persistent, universal learning pain point (illustrated with GRE/IELTS/TOEFL/TOEIC/K-SAT test-prep books) — highlights need for more effective learning methods.
- **Inspiration:** classic mnemonic devices (e.g., "My Very Excellent Mother Just Served Us Nachos" for planet order) link unrelated concepts to enhance long-term recall via associative effects.
- **Market opportunity:** Global English Language Learning Market — $29.48B (2024) → $63.34B (2031 est.), CAGR 10.08%. Global English Proficiency Test Market — $2.8B → $7.8B, CAGR 14.76%. (Source cited in deck: Verified Market Research.)

## Problem

Second-language learners face a unique challenge acquiring vocabulary from **typologically distant language pairs** (e.g., English↔Korean) — very different grammar, syllable structure, and phoneme inventories make direct phonetic mnemonics hard to generate automatically.

### Literature review (gaps identified)

| Prior work | Limitation |
|---|---|
| Transphoner (Savva et al., 2014) | Rule-based similarity; only keyword generation |
| SmartPhone (Lee et al., 2023) | Simple reuse of "Transphoner" for keywords; LLM-based sentence generation only |
| Overgenerate-and-Rank / OGR (Lee et al., 2024) | Highly dependent on LLM performance; only explored English-target mnemonics |

### Key linguistic challenges (English → Korean)

- Different Grammar: English is linear; Korean uses 2D syllable blocks.
- Syllable Structure: Korean forbids consonant clusters (extra vowels needed, e.g. "str").
- Missing Sounds: some English phonemes (e.g. /θ/) don't exist in Korean.
- Phonemic Contrasts: different ways of distinguishing consonants.

## Goal / Approach

**Korean Keyword Mnemonic:** link a new L2 (second-language) word to a similar-sounding L1 (native-language) word, then generate a memorable story connecting them.
Example: German "Flasche" (bottle) → English sound-alike "Flashy" → *"Imagine a very flashy bottle that stands out from the rest."*

Compared to OGR (older SOTA, relies heavily on LLMs for everything, focused on similar language pairs, higher hallucination risk), PhoniTale uses **specialized modules for sound analysis**, is designed for typologically distant languages, and has lower hallucination risk.

### Pipeline: "How PhoniTale Hears" — cross-lingual phonological alignment

**Transliteration → Segmentation → Keyword Match → Cue Generation**

1. Transliteration: converts the L2 word's sound into the closest L1 sounds.
2. Segmentation: divides the new L1-adapted sound sequence into valid L1 syllables.
3. Keyword Match: finds L1 dictionary words matching the sound segments (via a Korean Words DB).
4. Cue Generation: an LLM weaves the L1 keywords into a memorable sentence.

Architecture module trace example (L2 word "Squander"): en2ipa → L2 IPA `/skˈwɑndər/` → Cross-lingual IPA Transliteration → L1 IPA `/sɯkʰwantʌ/` → Segmentation → L1 syllable segments (`/sɯ/ /kʰwan/ /tʌ/`) → Keyword Matching → L1 Keyword Set (세관 /segwan/, 더 /tʌ/) → Verbal Cue Generation → "세관에서 시간을 더 낭비했다."

### Model training (sound-boundary / segmentation model)

Input: English IPA + Korean IPA + Korean syllable boundary labels → Tokenization → Embedding Layer → BiLSTM Encoder → Projection Layer (English/Korean embeddings) + Boundary Predictor → combined loss (Contrastive Loss, Hard Negative Loss, Boundary Loss, First Token Loss) → Backpropagation / parameter update.

## Evaluation

- **Objective:** validate PhoniTale by (1) demonstrating superiority over OGR (prior automated SOTA) and (2) achieving recall effectiveness comparable to human-authored mnemonics (KSS).
- **Participants:** 167 Korean-native adults recruited (university communities + LinkedIn) → screened with a 12-word self-report vocabulary test → 51 eligible → randomly assigned to 3 groups of N=17: **KSS** (human expert), **OGR** (older SOTA), **PHT** (PhoniTale, their model).
- **Procedure:** Instruction → [Learning → Testing (Recognition → Generation)] × 3 sets → Survey. Learning: memorize 12 words/set in 30s with audio, Korean keyword sequence, and verbal cue. Testing: type the Korean definition (Recognition) or the English word (Generation) within 30s. Survey: rate each mnemonic on Helpfulness, Coherence, Imageability (preference score).
- **Result — Correctness Score (Recognition / Generation):** KSS 0.721 / 0.590, OGR 0.690 / 0.539, PHT 0.698 / 0.609. **PHT significantly outperformed OGR and achieved comparable recall accuracy to KSS (human-authored).**

### Key contributions (as stated in deck)

1. Novel learning system for typologically distant languages.
2. Specialized pipeline outperforms purely LLM-based methods.
3. Achieves performance comparable to human-authored mnemonics.
4. A scalable way to create high-quality learning aids automatically.

## Visuals present in the PDF

- p.7: PhoniTale logo/brand mark, web-app screenshot of the learning flow ("Round 2 | Learning" — word "ingenious", keyword tagging), EMNLP poster-session photo.
- p.8: test-prep book stack photo, mnemonic illustration (mnemonic solar system example), market-size bar charts (learning market, test market).
- p.9: full model architecture diagrams (pipeline stages, training block diagram), IPA alignment heatmap, segmentation example ("Renumerate"/"Autopsy").
- p.10: web UI screenshots (Learning / Recognition / Generation / Survey screens), bar chart of correctness scores by group, "Key Contribution" cloud graphic.

## Links (from legacy-jekyll)

- Paper: ["PhoniTale: Phonologically Grounded Mnemonic Generation for Typologically Distant Language Pairs"](https://aclanthology.org/2025.emnlp-main.1299/) — ACL Anthology
- Poster (Google Drive)
- Slide (Google Drive)
- Evaluation Web: [phonitale.com](https://phonitale.com/)

## Notes / open questions

- Minor date discrepancy: portfolio PDF says "Mar - May 2025", CV says "Mar 2025 – Jun 2025." Use CV as primary (more authoritative for employment/research-period accuracy) unless the user corrects it.
- ✅ Resolved: site owner confirmed the legacy-jekyll `date` field (2025-10-01) should be ignored — it doesn't match either duration above and appears to be an arbitrary "site feature date," not meaningful project/publication info.
