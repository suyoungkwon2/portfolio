---
title: "AI Search — Enhancing Search Experience & Driving Sales"
section: AI / Business
pdf_pages: 24-27
---

# AI Search

**Subtitle:** Enhancing Search Experience & Driving Sales
**Tagline (pull quote):** "Just type it out. We'll find what you need."

## Chips

- **Domain (green):** Commerce
- **Problem (red):** Search UX
- **Tech (blue):** Vector Search, AI

## Role & Team

- **My role:** Product Management, A/B Test Design, CEO Communication, QA
- **Type:** AI Transformation
- **Team:** ML Engineer, BE Engineer
- **Org:** Kurly (presented at Google Cloud Summit Seoul 2024)

## Timeline

**Duration: May – Aug 2024.** (Confirmed by site owner — the portfolio PDF's "2025" was a typo; the CV's Kurly "AI Product Manager" tenure of Mar 2024 – Dec 2024 and legacy-jekyll's `year`/`date` fields of 2024 are correct.)

## Overview

Addressed a critical customer pain point and revenue leak: a **6–7% rate of "No Result" (NR) searches** on Kurly's e-commerce platform. Leveraging existing GCP infrastructure, the team rapidly built a PoC using **Google Vertex AI Search**, accurately interpreting complex user intent (including misspellings and synonyms) while bypassing existing engineering resource constraints. A successful 5:5 A/B test on 3.5M MAU validated the approach (**6.6%p reduction in NR search rate**); full system integration resulted in a **174x revenue lift** from the improved search events.

## Background

- **About Kurly:** unicorn e-commerce platform, pioneer of Korea's "dawn delivery" model, ~3.5M MAU.
- **Problem:** the legacy search engine relied on lexical exact-match logic, rejecting minor linguistic nuances (misspellings, synonyms, spacing) → 6–7% of daily search queries categorized as "No Result" → dual negative impact: poor user experience + significant revenue leakage (search is the single largest revenue driver).
- **Organizational context:** severe capacity constraints within the search engineering team meant a fundamental search-engine overhaul was indefinitely postponed ("Engineering Bottleneck"). My role: drive rapid AI transformation initiatives and capture business value despite the bottleneck.
- **Technical context:** the entire product catalog and operational data were already harmonized on GCP (BigQuery, Vertex AI), enabling rapid AI-service integration.

## Process

**Discover → Define → PoC → [CEO Decision Making] → Integration → Deliver**

### Define
- **Long-term goal:** improve Kurly's search performance. **Short-term goal:** validate baseline performance and immediate impact of AI search. **Project objective:** enhance search experience & drive financial uplift.
- **Verification scope:** eliminate "No Result" cases from minor lexical errors and semantic gaps (e.g., misspellings like "Cabage", spacing errors like "Ca bbage", synonyms like "Lettuce").
- **Functional requirement:** AI search is invoked *only* when the legacy search returns a "No Result" status.
- **Policy adherence:** AI results must respect all existing business and inventory policies.
- **KPIs:** User behavior — No Result Rate (NRR), Click-Through Rate (CTR), Add-to-Cart Conversion Rate (ATC CVR), Purchase Conversion Rate (CVR). Financial — Total Cart Value, Total Purchase Value, Revenue per Search (RPS), Estimated Profit Margin, AI API Call Cost.

### PoC Develop
- **AI engine:** Vertex AI Search — combines text matching + embedding similarity for large-scale search; chosen for seamless integration with Kurly's existing GCP services (e.g. BigQuery).
- **Data & schema prep (RAG):** proprietary data schema with fields (Title, Description, Product URL, Product Number, Sales Status, Related Keywords) each flagged Searchable / Indexable / Retrievable as appropriate.
- **Tuning & optimization:** fine-tuned embedding vectors using query–corpus pairs derived from internal product collections, to embed Kurly's unique domain context beyond simple text matching.
- **Conditional trigger flow:** Search Request → Execute Legacy Search → (if NR) → check Multi-Section Result → check Blocklisted Query → Call Vertex AI API (if AI Search Result count ≥ 1, serve AI Search Result View; otherwise fall back to Legacy NR view).
- **Qualitative validation** confirmed dramatically enhanced results across: Misspelling, Spacing Errors, Synonym, Foreign Language, and Contextual Search query types.

### A/B Test
- **Hypothesis:** introducing Google AI Search will provide meaningful results for "No Result" cases, improving search-related CVRs and customer satisfaction.
- **Target:** entire customer base (3.5M MAU), 50% control / 50% experiment, 2-week duration.
- **Result: Hypothesis Validated** — positive metric performance across all KPIs.
- **No-Result case analysis:** extreme lift in key conversion metrics (e.g., CTR 3.83% → 26.50%); drastic drop in NRR (99.98% → 2.93%).
- **Whole case analysis:** improvement in overall key conversion metrics (e.g., CTR 58.60% → 60.14%); significant drop in NRR (6.80% → 0.22%).

### Integration (production readiness)
- Ensured production safety (result-suppression rules, failure-response system) and cost efficiency (minimizing duplicate keyword costs, filtering malicious query attempts).
- **Proxy Server** implementation: Kurly's Elasticache syncs with a Kurly Data layer (Airflow/BigQuery/Blocklist Sheet); the Proxy Server checks the blocklist/cache, calls Vertex AI Search API only when there's no cached result, and forwards logs via Kafka → BigQuery.
- **History caching:** caches search results per keyword for 12 hours → minimizes redundant Vertex AI API calls by up to 30%.
- Query validation (filters abnormal/malicious queries), blocklist enforcement (unlisted brands, profanity, medical terms), and failure mitigation (circuit-breaker logic for response-time overruns).
- **Daily Trend Insight Delivery Bot:** delivered daily via Slack to the Merchandiser/Marketing team — top/last 30 search queries ranked by CTR decline, to swiftly identify emerging product trends and unmet search demand.

## Metrics / Outcomes

- Built a centralized **Looker dashboard** for real-time KPI monitoring (Daily AI Search Statistics, Top AI Search Query List, Daily Query Caching Rate, Daily Anomaly Search Rate).
- **Deployment:** 2 months from PoC to full-scale adoption.
- **No-Result Elimination:** 6.8% → 0.22% (residual attributed to business rules preserving service integrity).
- **Return on Investment:** 35.52x (average margin per product ÷ API fee per purchase).
- **SaaS $ cost reduction:** 30.82% (result of proxy-server caching).
- **Revenue & purchase growth**, Legacy No-Result (Jun 2024) vs. Post-AI-System (Nov 2024): Add to Cart Count +16,710%, Add to Cart Value +18,906%, Purchase Count +15,519%, Purchase Revenue +17,357%. User behavior: Click-Through Rate +592%, Add-to-Cart Conversion Rate +1,166%, Purchase Conversion Rate +1,391%.
- Featured as a leading enterprise case of GCP-driven AI innovation at **Google Cloud Summit Seoul 2024** (personally presented on stage).

## Visuals present in the PDF

- p.24: conference-stage photo (presenting at Google Cloud Summit), before/after mobile search-result screenshots ("granma padano" — "No products found" vs. AI-suggested cheese products).
- p.25: Kurly brand photo, problem-flow diagram (Search Function → Legacy Search Engine → Daily 6–7% Leakage → Dual Negative Impact), organizational-bottleneck illustration, GCP tech-stack icons, process-flow diagram, before/after mobile screenshots ("cabbbage").
- p.26: Vertex AI Search architecture diagram, data-schema table, system sequence diagram, conditional-trigger flowchart, qualitative-validation example screenshots (misspelling/spacing/synonym/foreign-language/contextual queries), A/B test line charts (CTR/ATC CVR/CVR/NRR for No-Result and Whole-Case analyses).
- p.27: Proxy Server architecture diagram, Looker dashboard screenshots, daily trend-bot Slack screenshot, revenue/growth metric tables, Google Cloud Summit stage photos.

## Links (from legacy-jekyll)

- [Developer Blog](https://helloworld.kurly.com/blog/vertex-ai-search-NR/)
- [Google Cloud Summit 2024 — "Next Commerce: Curation and AI" (YouTube)](https://youtu.be/qv0YMg7kwuM?si=km0mZKGjRI3rPVdX&t=2333)

## Notes / open questions

- ✅ Resolved (revised Sep 2026): site owner retired the **174x revenue lift** / **35.52x ROI** headline figures as overstated; the site now leads with no-result rate 6.80% → 0.22%, CTR 58.60% → 60.14%, and operating costs 30% below pilot-stage levels (resume wording). The p.27 percentage figures (e.g. +17,357% purchase revenue) are legitimate multiplier effects off a near-zero "No Result" legacy baseline but should stay secondary/supporting, not the headline.
