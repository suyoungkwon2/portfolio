---
title: "AI Curation — AI-Driven Scaling of Themed Campaigns"
section: AI / Business
pdf_pages: 28-31
---

# AI Curation

**Subtitle:** AI-Driven Scaling of Themed Campaigns
**Tagline (pull quote):** "You name the theme. AI does the rest."

## Chips

- **Domain (green):** Commerce
- **Problem (red):** Work Efficiency
- **Tech (blue):** Vector Search, AI

## Role & Team

- **My role:** Product Management, A/B Test Design, UX Research, CEO Communication, QA
- **Type:** AI Transformation, Automation
- **Team:** ML Engineer, BE Engineer
- **Org:** Kurly

## Timeline

**Duration: Jun – Dec 2024.** (Confirmed by site owner — the portfolio PDF's "2025" was a typo; the CV's Kurly "AI Product Manager" tenure of Mar 2024 – Dec 2024 and legacy-jekyll's `date` field of 2024-12-01 are correct.)

## Overview

Addressed a critical operational bottleneck at Kurly: limited merchandiser (MD) staff capacity hindered the manual management and scaling of high-value promotional campaigns. The solution was an **AI-powered curation & automation system** — merchandisers simply input a theme, and the AI autonomously selects the optimal product mix and manages continuous updates. Rigorous validation included an internal AI Copilot tool (for fidelity) and a major A/B test (confirming performance parity with manual curation). The system is a proven success, autonomously operating ~200 themed campaigns and now managing **25% of the most critical promotional slots on the homepage**.

## Background

- **Kurly's brand value chain:** Core Value (premium quality & reliable delivery) → Kurly's Pick (curated selection of best products) → Customer Loyalty (deep trust in Kurly's standards).
- **What is a "Campaign":** a key sales funnel tied to specific themes, events, or seasons; drives customer discovery backed by Kurly's reputation; **40K+ SKUs** showcased across hundreds of campaigns (homepage structure: Promotional Banners, Limited-Time Offers, Best Sellers, Special Campaigns, **Themed Campaigns**).
- **Problem & motivation:** Operational Bottleneck (reduced MD staff capacity → inconsistent campaign management); Inconsistent Management (rapid product-status changes → outdated content → missed sales); Scaling Limitation (manual process cannot sustain hundreds of campaigns; unmet customer expectation for diverse curation).
- **Strategic context:** this project is explicitly the **first milestone** in a broader roadmap toward a fully personalized Kurly homepage (Mission: fully personalized homepage; Goal: maximize space efficiency & customer response; Strategy: prioritize product exposure by individual affinity) — shown as "AI Curation" = Project 1 of a 9-project visional roadmap.

## Process

**Discover → Define → Develop → [CEO Decision Making] → Integration**

### Discover
- **Employee interviews:** 8 employees from Merchandising & Marketing teams (junior to senior), mapping the end-to-end campaign workflow to identify high-impact points for AI/automation.
- **Pain points identified along the workflow** (Trend Search → Concept Definition → Product Discovery → Product Selection → Enough SKU Count? → Campaign Proposal → Campaign Approval → System Registration → Campaign Operation): tiresome manual product-display sequencing, difficult out-of-stock/low-SKU monitoring, insufficient SKUs forcing a concept re-definition loop, cumbersome manual sales-data verification, labor-intensive product-to-concept matching.
- **Key insights:** Efficiency (minimize theme-product matching time), Data-driven decision (single-view access to core data), Display quality (automatic product prioritization/ranking), Consistency (real-time product-list updates).

### Define
- **Goals:** Internal Efficiency (automate manual workflow, boost MD efficiency) and Customer Experience (offer diverse, high-quality campaigns to enhance product discovery).
- **Key features:** Autonomous Product Discovery by Theme; Near Real-Time List Refresh (1-hour cadence).
- **Strategic roadmap:** 1. AI PoC (internal copilot tool → achieve human-expert curation fidelity) → 2. Validation (large-scale A/B test → validate performance parity with manual campaigns) → 3. Integration (full system integration → deploy AI autonomy on core homepage slots).

### Develop — Internal Copilot ("Campaign Copilot", built with Gradio)
- **Target users:** MD & Marketing teams (accessible company-wide). **Operation period:** 8 weeks (pre-A/B test), with 6 iterations based on user feedback.
- **Key modules:** Product Discovery (analyzes intent to recommend optimal SKUs), Integrated Data View (comprehensive contextual product data), Refinement Controls (search scope, validation strictness, mandatory keywords, category filtering), Output Management (result sorting, CSV export).
- **Algorithm:** Campaign Theme Input → Query Refinement & Action Translation → Generate 10 Candidate Products/Keywords (k iterations) → Candidate Product List → Similar Product Expansion (via GCP) → Ranking Logic → Candidate Prioritization Score → Filtering → Final Product List.

### Copilot Evaluation
- **Internal A/B test** to select the preferred search-AI model for copilot integration: Model A (proprietary algorithm, GPT-4o) vs Model B (GCP Vertex agent) — 10 campaigns, randomized selection, 56 total responses across C-Level/Marketing/MD/Data teams. **Result: Model A won 68% overall, 77% on logic-intensive themes.**
- **Qualitative satisfaction:** expert panel (PM, MD lead, Marketing lead) evaluated 21 test campaigns on a 1–10 Likert scale. **Average score: 8.95/10** — "high satisfaction across most themes; ready for autonomous deployment."
- **Technical improvement** (Initial → Final version): Search speed avg 1 minute → avg 15 seconds; Result fidelity: "minimum conditions often unmet" → 87%+ minimum conditions met; Cost per query: avg $0.50 → avg <$0.07.

### A/B Test (production validation)
- **Objective:** quantitatively validate AI curation quality for the final integration decision. **Hypothesis:** AI-curated campaigns achieve performance parity with human curation.
- **Methodology:** compare AI-curated vs. human-curated performance, fixing exposure slot & theme. **Target:** Experiment group 24,455 users vs. Control group 24,278 users. **Conditions:** 20 utilized slots, min. 30 SKUs per campaign, daily theme rotation, 2-week duration.
- **Result confidence checks:** AA test showed no significant difference (test reliability confirmed); no Sample Ratio Mismatch (p = 0.423, successful randomization); adequate statistical power (Power 0.8, α 0.05, MDE 0.004).
- **Result: Hypothesis Validated.** No statistically significant difference in primary KPIs (Campaign Click/Add-to-Cart/Purchase User Ratio, all normalized ~100, p-values 0.076–0.982) or secondary KPIs (p-values 0.174–0.839).
- **Specific insight:** AI curations used fewer SKUs but showed more diverse categories, with comparable theme relevancy; relevance in top slots is the primary driver of CTR.

### Integration
- **Post-test refinement** to reduce low-quality (low thematic relevance) items. Initial rate: 9.17% all-levels, 0.76% critical. Tested 3 versions: v1 (increased verification count) → critical 0.64% / all-levels 8.72%; **v2 (added new data types, selected) → critical 1.21% / all-levels 2.64%, most effective reduction**; v3 (v1+v2 integrated) → worse (critical 1.56% / all-levels 4.08%). **Conclusion: implement v2 algorithm for full system integration.**
- **System flow:** User ↔ Campaign Management Sheet (Google Sheet, CRUD) → Business Logic / AI Model → Kurly Frontend/Backend + CRM, with a Monitoring feedback loop.
- **How to use (for MDs):** open Google Sheet → input campaign data (title, subtitle, start/end date, etc.) → instant campaign launch.

## Metrics / Outcomes

- **Operational Autonomy:** displayed on **25% of critical homepage slots**; scaled to **200+ autonomous campaigns**; achieved full AI autonomy for themed-campaign management; drastically reduced operational man-hours.
- **AI Future Foundation:** achieved performance parity with human experts; delivered high CVR/CTR with zero human labor; laid the cornerstone for full homepage personalization (per the 9-project roadmap).

## Visuals present in the PDF

- p.28: mobile screenshots of 4 AI-generated themed campaigns ("The Ultimate Snack Drop," "Spicy Chinese Takeout Vibe," "Matcha Core: Trending Now," "The Sweetest Year-End Vibe") shown branching from an "AI" node.
- p.29: Kurly brand photo, homepage-structure diagram, campaign-workflow flowchart with painpoint annotations, visional-roadmap diagram (9-project pyramid).
- p.30: Campaign Copilot UI screenshot (Gradio app), algorithm flowchart, evaluation-result tables.
- p.31: A/B test result tables (primary/secondary KPIs), low-quality-item refinement table, system-flow diagram, impact/achievement bullet summary.

## Links (from legacy-jekyll)

- News: ["AI Revolutionizes Grocery Shopping: Kurly's Full-Scale Implementation from Recommendations to Search Optimization"](https://economist.co.kr/article/view/ecn202502140048)
- News: ["The Rise of Hyper-Personalization: Active Adoption of AI-Based Product Recommendations in Retail"](https://www.viva100.com/article/20250216500401)

## Notes / open questions

- The two press links above are dated Feb 2025, which is *after* the CV's stated Kurly end date (Dec 2024) — this is consistent with a news article being published after the initiative launched/scaled, not necessarily proof either way on the 2024-vs-2025 project-duration question. Worth noting if the user wants to reconcile precisely.
