---
title: "M.A.R.S — Re-Engineering Clinical Workflow with GenAI"
section: Healthcare / Education
pdf_pages: 3-6
---

# M.A.R.S (Medical Auto-documentation with Real-world Structuring)

**Subtitle:** Re-Engineering Clinical Workflow with GenAI
**Tagline (pull quote):** "Get time back. Move care forward."

## Chips

- **Domain (green):** Medical
- **Problem (red):** Clinical Documentation
- **Tech (blue):** NLP, AI

## Role & Team

- **My role:** Team Leader, Project Management, AI Research, Prompt Engineering, Data Analysis
- **Type:** NLP Research / Datathon
- **Team (confirmed by site owner):** 4 people total — site owner (Project Managing), 2 LLM Engineers, 1 Psychiatry Professor as clinical advisor. Named teammates on the cover page (Sana Kang, Myeongseok Gwon, Jeongkyeong Hong) fill the 3 non-PM roles, but which name maps to which specific role (LLM Engineer vs. clinical advisor) is not specified.
- **Org / venue:** Datathon hosted by Seoul National University Bundang Hospital (SNUBH), in partnership with KAIST College of Business.

## Timeline

- Preliminary round: 10 days
- Final round: 17 days
- Overall project window (per portfolio "Duration" field): Sep – Oct 2025
- Award announcement: Oct 2025 (per CV: "Excellence Award, LLM Clinical Note Datathon, Seoul National University Bundang Hospital — Oct 2025")

## Background / Problem

- **Documentation Burden:** physicians manually synthesize vast, unstructured clinical data into standardized discharge summaries, consuming up to ~30% of their work time.
- **Critical Korean Medical Strike:** a prolonged national medical dispute drove an 86.7% resignation rate among residents, acutely worsening the workload on remaining staff since Feb 2024.
- **Decreasing Documentation Quality:** the combined effect of documentation burden + staffing crisis led to declining documentation fidelity and compromised patient-safety handoffs.

## Competition Structure

| Round | Task | Data | Duration | Constraints | Result |
|---|---|---|---|---|---|
| Preliminary | 1. Generate Brief Hospital Course, 2. Generate Radiology Impression, 3. ICD Code Prediction | MIMIC-IV, MIMIC-IV-Note Dataset | 10 days | — | 🥇 1st Place (1/100) |
| Final (this case study's focus) | Generate a comprehensive discharge summary using real-world clinical data | Actual data from 400 patients, Seoul National University Bundang Hospital | 17 days | No external internet access (Jupyter-only), no external downloads, usage restricted to designated models/limited libraries | 🥈 2nd Place (2/10) |

## Process

**Discover → Define → Develop → Evaluation** (four-stage process, shown explicitly on p.4)

### Discover
- Literature Review across ~20 papers on automated clinical text generation, medical data processing, clinical data analysis (dataset bias/fairness issues, MIMIC-IV structure, hallucination risk in summarization, etc.)
- SNUBH Clinical Data Comprehension: deep structural analysis of admission notes, progress notes, consultation notes/replies (fields like Chief Complaint, Present Illness, Past History, Review of System, Physical Exam, Assessment, Careplan), plus a Key Abbreviation dictionary (CC, PMHx/PHx, PI, ROS, PE, etc.) and an Item/Section Relationship map to preserve clinical logic and output coherence.

### Define
- **Goals:** Clinical Fidelity & Structure (mandatory format adherence), Accuracy & Consistency (factual alignment, no hallucination), Efficiency & Utility (optimized output, practical deployment), Fairness & Ethics (minimized bias, ensured equity).
- **Technical Problem & Strategy** (two tracks):
  - *Data Complexity Challenges:* Unstructured Data & Variability → Data Standardization; Multi-Contextual Data in Single Item → Core Classification/Extraction (rule-based filtering); Excessive Redundancy & Noise → Compression & Noise Reduction.
  - *Clinical Domain Challenges:* Uncontrolled Hallucination Risk → Clinically Fact-Grounded Generation (rigorous data cleansing, diverse prompt guardrails); Lack of Performance Metrics → Clinician & LLM Judge Evaluation; Department-Specific Needs → Dynamic Prompting per Department.

### Develop — Final Architecture
Three-module pipeline: **Preprocessing → Prompt → Postprocessing**

- **Module 1 (Preprocessing):** Duplication & Noise Reduction (merge redundant records), Clinical Signal-Based Text Segmentation (segment by S/O/P clinical signals), Patient Corpus Construction (unify distributed patient files into one temporal context).
- **Module 2 (Prompt):** 3 chained prompts — Prompt 1 (Main: Role Assign → Guiding Principle → Jargon Definition → Task Specification), Prompt 2 (JSON Formatting), Prompt 3 (Patient Summary). Design principles: Dynamic Prompt Segmentation (per department), Role Assignment, Guiding Principles (behavioral guardrails), Clinical Jargon Definition, Prompt Section Positioning (causal/temporal logic), Multi-step Prompting.
- **Module 3 (Postprocessing):** Structured Document Generation (JSON → human-readable text with headers), Date Format Standardization (→ YYYY-MM-DD), Special Character & Noise Removal.
- Result example shown: a full discharge summary for a Nephrology patient (Admission History & Summary, Hospital Course, Outcome & Discharge Summary, Test Results, Patient Summary).

### Evaluation
- **Clinician Qualitative Evaluation:** subjective satisfaction survey (2 rounds, Likert 1–5) across Gastroenterology, Cardiology, Nephrology, Neurosurgery. Metrics: Factual Accuracy, Internal Consistency, Clinical Utility, Clarity & Conciseness, Guideline Compliance. Department averages rose across the two rounds (e.g. Gastroenterology 3.0→3.4, Cardiology 3.6→3.8, Nephrology 3.8→3.6, Neurosurgery 3.8→4.0); overall average **3.55 → 3.70**.
- **LLM Judge Quantitative Evaluation:** compared against one ground-truth summary per department. Final system performance (mean / std dev / min / max): Quality Score 2.917 / 0.289 / 2 / 3; Clinical Clarity Score 3.167 / 0.389 / 3 / 4; Conciseness Score 3.750 / 0.452 / 3 / 4; Hallucination Score 3.250 / 0.754 / 2 / 4.

## Visuals present in the PDF (for future asset sourcing)

- p.3: award ceremony photo (2nd place trophy, "M.A.R.S. 의무기록 생성 데이터톤" banner), a stylized discharge-summary document mockup ("Clinical Notes").
- p.4: competition kickoff/award photo, MIMIC-IV data-relationship mind-map diagram, 4-stage process flow diagram, team-composition illustration (cloud of avatar icons).
- p.5: goal "cloud" diagram (4 goals), two Problem→Strategy tables, data-structure tables (Admission/Progress/Consultation Note fields), abbreviation table, inter-item/inter-section relationship diagrams.
- p.6: architecture diagram (Preprocessing/Input/Output/Postprocessing blocks with 3 prompts), 2 detailed module tables, a full discharge-summary result example, department satisfaction table, LLM-judge score table.

## Links (from legacy-jekyll, not yet re-verified against the PDF)

- News: ["KAIST College of Business Wins Excellence Award at 'M.A.R.S. Medical Record Generation Datathon'"](https://www.joongang.co.kr/article/25379464)
- KAIST LinkedIn post (team announcement)

## Notes / open questions

- ✅ Resolved: site owner confirmed team composition (4 total: Project Managing + 2 LLM Engineers + 1 Psychiatry Professor as clinical advisor). Exact name-to-role mapping among the 3 named teammates is not needed for the site copy.
- See root README.md in this folder for cross-project date-field discrepancies.
