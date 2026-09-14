---
title: "SleepVice — Alexa Voice Application for Best Sleep Quality"
section: Healthcare / Education (bonus / 7th project — not in the original 6-project brief)
pdf_pages: 20-23
---

# SleepVice

**Subtitle:** Alexa Voice Application for Best Sleep Quality
**Tagline (pull quote):** "Personal sleep coach right by your pillow."

## Chips

- **Domain (green):** Smart Home
- **Problem (red):** Sleep Distress
- **Tech (blue):** Alexa, IoT, VUI

## Role & Team

- **My role:** Product Management, VUI Design, UX Research
- **Type:** VUI Application
- **Team:** Business Developer, Software Engineer (a lean 3-person task force per p.21: Business Development, PM & VUI Designer [my role], Software Engineer)
- **Org:** Asleep

## Timeline

- Portfolio "Duration" field: Jun 2021 – Jun 2022. **Result:** Alexa Startup Partner.
- ⚠️ This doesn't line up cleanly with the CV, which places "B2C App PM / Product Team" (the role that "co-developed the Sleepvice Amazon Alexa Skill") at **Apr 2021 – Sep 2021** — a narrower and earlier window than the portfolio's Jun 2021–Jun 2022. Possibly the portfolio duration includes post-launch partnership/maintenance work beyond the initial CV-dated role. Flag for the site owner to confirm which range to use.

## Overview

This project addressed the **chronic sleep distress of users** by leveraging Voice User Interface (VUI) as a novel interaction-design domain. The team developed a VUI application (Alexa Skill) integrating Asleep's world-class non-contact Sleep Tracking AI with the Amazon Alexa platform, providing real-time voice feedback and environmental control tailored to the user's sleep stage. The resulting technical and business success included securing status as **Korea's first official Amazon collaboration startup**, directly contributing to the company's Series B funding.

## Background

- **Growing Global Sleep Problem:** Global Sleep Care Market Size — $64B (2020) → $127B (2030 est.), CAGR 7.1%. Sleep Disorder in US: 50–70M suffer from a sleep disorder, 27% have trouble sleeping most nights, 68% struggle with sleep at least once a week (source cited: American Sleep Association, Consumer Reports) — "and it's rapidly increasing."
- **Multifactorial drivers of sleep quality:** ~200 factors identified by the medical community, grouped into Physical Health (comorbid conditions: obesity, hypertension, diabetes), Active Intervention (behavioral factors: exercise, mental, diet, hormone), and Passive Intervention (bedroom environment: light, air, sounds, beds).
- **Asleep's business objective:** Mission — AI-Powered Solutions for Better Sleep. Expand to: Smart Home Market (enable bedroom environment control — passive intervention) and Global Market (deliver scalable solutions addressing worldwide sleep distress).
- **Lean & autonomous task force:** a 3-person cross-functional core team, operating under a mandate of Full Autonomy & End-to-End Ownership with a high commitment to rapid delivery.

## Process

**Initiative → Discover → Define → Develop → Deliver** (with a Define↔Develop iteration loop)

### Discover
- **Market research (Global Smart Home Market):** Smart Speaker Market Size (global & US focus), Smart Speaker Platforms, Competitor Analysis of 3rd-Party Applications, Cross-Sector Opportunities (Smart Speaker & Healthcare), and Amazon Alexa specifically.
- **Why Alexa?** (1) Market Dominance — most widely adopted digital assistant in the US smart-home market; (2) Technical Accessibility — the "Skills" platform lowers third-party development barriers; (3) Ecosystem Scalability — integrated into 30,000 devices across 150 product types; (4) Validated Customer Needs — high success of existing Sleep & Mindfulness-related skills.
- **Securing the strategic partner:** a proactive partnership initiative (intensive outreach via LinkedIn/cold email) secured strategic support and collaboration with the Alexa Fund and Alexa Startups teams.

### Define
- **Business goal (dual-sided):** Asleep's goal — achieve successful global smart-home market entry, targeting a definitive global big-tech client use case. Amazon's goal — establish the Alexa speaker as the definitive bedroom companion, targeting increased speaker adoption via personalized sleep-management features.
- **Joint strategy:** launch as a 3rd-party Skill (co-design, co-develop, launch, promote) → aim to graduate into a 1st-party Feature (integrated into the core Alexa system).
- **VUI product goal:** Value Proposition — "Personalized Voice Sleep Coach" (seamless care before, during, and after sleep). Core Objectives — "High Sleep Quality & Daily Habit" (1. enhance the user's sleep quality, 2. become a daily habit-formation service).

### Develop — VUI Design
- **VUI glossary established:** Skill, Intent, Multi-turn, Slot, Utterance, Situation, Response, Prompt.
- **Survey for sleep awareness:** N=100, ages 25–34, investigating expected sleep metrics/features and usage context.
- **Key features:** Daily Sleep Analysis/Reporting, Gentle Contextual Smart Alarm, Sleep-Optimized Lighting Control.
- **Key user flow:** Call SleepVice → Start Sleep Recording → Set Alarm → [Sleep Tracking] → Stop Alarm/Recording → Report Sleep Data → Exit. Designed with a Graph UI (VUI diagram/flowchart), not a simple linear script.
- **Ver.1 core concept:** Information Richness (comprehensive AI analysis), Service Adherence (encourage lock-in via continuous engagement), Feature Discoverability (wide functional scope for seamless exploration).
- **VUI examples (scenario cards):** Sleep Recording Intent, Smart Alarm Intent, Sleep Report (Efficiency) Intent — each documented with example utterances, Alexa's response, and follow-up prompts.

### Ver.1 Usability Test
- **Purpose:** reveal friction points/confusing VUI flow, identify technical errors, understand target users' perception of the concept.
- **Participants:** N=5, ages 18–29(3)/30–44(2), native English speakers interested in sleep problems.
- **Methodology:** Figma-style prototype, Post-UT Survey, Interview; 5 tasks, 11 survey questions (Likert 1–7); Think Aloud, Observation, Wizard of Oz technique.
- **Task completion rate:** Task 1 (Report) 100%, Task 2 (Alarm) 80%, Task 3 (Recording) 90%, Task 4 (Recommendation) 90%, Task 5 (Specific Report) 56.6%.
- **Post-UT survey scores:** Content 76%, Likability 54%, Ease of Use 70%, Flow 54%, Utterance 83%.
- **Notable interview feedback:** *"Insightful and straightforward, but not humorous and human-like."* / *"Interaction is too long to listen to in the morning."* / *"Sometimes, interactions are irrelevant to what I want to continue."*

## Final Product

- **UT-based strategy (v2 refinement):** Be Concise (concise response segmentation, clear intent completion/focus), Be Friendly (SSML — Speech Synthesis Markup Language, response variation, more in-depth utterances), Be Helpful (added new information, welcome + contextual help).
- **Light Intervention Logic:** real-time, sleep-stage-based lighting control built on the Philips Hue API/SDK: recording-start→sleep-onset (3000K, gradual dim 30→10 lux); sleep onset onward (no light, 0 lux); 30 min before wake time (soft white 3000K, gradual brighten 0→250 lux); 30 min after waking (blue, H221/S100%/L56%, max 300 lux).
- **26 sleep metrics tracked** (same metric family as SomMind, plus snoring-specific metrics: Snoring Stages, Time in Snoring, Snoring Ratio/Count/Loudness).
- **Enlarged utterance set:** 12x expansion of utterance examples for enhanced VUX and conversational fidelity.
- **Optimized dialog management:** hybrid Graph UI + Frame UI approach for improved collection accuracy and VUX.
- **Key features:** Accurate Seamless Daily Sleep Tracking, Sleep-Stage-Optimized Smart Alarm, Personalized Optimal Sleep Time Recommendation, Real-time Sleep-Stage Smart Lighting Control.
- **Example conversations:** "Set smart alarm at 7AM" → confirms alarm; "Can you recommend the best sleep time for me?" → data-driven recommendation (e.g., "sleep from 6hr 30min to 7hr 20min" based on REM patterns); "How was my snoring last night?" → reports snoring frequency/duration; "Turn on smart light mode" → activates smart lighting.

## 2nd Usability Test

1. The 2nd version's usability satisfaction is higher than the 1st version's.
2. Participants' interest in purchasing a smart speaker improved.

- **Task Completion Rate:** 1st UT 83% → 2nd UT 88%.
- **Device Purchase Intent:** Before UT 2.2/5 → After UT 3.2/5.
- **Usability Satisfaction (1st UT → 2nd UT, difference):** Flow 54→70 (+16), Preference 54→66 (+12), Content 76→83 (+7), Ease of Use 70→67 (−3), Utterance 83→76 (−7).

## Metrics / Outcomes (Impact & Achievement)

- Secured Asleep's **1st Alexa Startup partnership in Korea**.
- Confirmed a **joint exhibition at the CES 2022 Alexa booth**.
- Achieved **200+ media and press exposures**.
- Acted as a **key factor in securing Series B funding** (chart shows relative Series A vs. Series B round sizes across 2021/2021/2022).

## Visuals present in the PDF

- p.20: Alexa + Asleep badges, SleepVice logo/wordmark, Alexa smart-speaker product photo with example voice-response speech bubbles ("Good morning, Andrew! Your total sleep score was 87 and sleep efficiency was 92%...").
- p.21: Global sleep-care market bar chart, US sleep-disorder statistics, sleep-quality-drivers icon groups (Physical Health/Active Intervention/Passive Intervention), Alexa device photo, "Why Alexa?" 4-point rationale, partnership-outreach icon row (alexa fund / alexa startups), business-goal/joint-strategy tables, VUI product-goal "cloud" diagrams.
- p.22: VUI glossary table, key-feature icon row, key-user-flow diagram, VUI diagram (graph UI flowchart), 3 scenario cards (Sleep Recording/Smart Alarm/Sleep Report Intents), usability-test methodology + task-completion table + post-UT survey table + quoted feedback.
- p.23: UT-based strategy ovals, light-intervention-logic table, 26-sleep-metrics list, enlarged-utterance/dialog-management illustrations, key-features 2x2 grid, example-conversation speech-bubble mockups, 2nd usability test result tables, business-impact photo collage (Alexa Startups logo, CES 2022 booth photos, press clipping, Series A/B funding circles).

## Links

None found in `legacy-jekyll/SleepVice.md` beyond its own front-matter tags (domain_tags: Smart Home; problem_tags: Sleep Distress; tech_tags: IoT, VUI) — no external links were captured on the old Jekyll site for this project.

## Notes / open questions

- **This is the 7th project from the PDF's table of contents, outside the original 6-project brief** (Healthcare/Education: MARS, Phonitale, SomMind; AI/Business: AI Search, AI Curation, AsleepTrack). It's included here at the site owner's request but is not yet assigned a site section/slot — confirm whether it becomes a 4th Healthcare/Education card, a "bonus" 7th card, or stays reference-only.
- **Duration discrepancy:** portfolio says Jun 2021–Jun 2022; CV's matching role period ("B2C App PM / Product Team") says Apr 2021–Sep 2021. Needs a decision on which range to use, similar to the SomMind duration question.
- Shares the same Asleep sleep-tracking AI core, Amazon-partnership milestone, and Series B funding contribution referenced in AsleepTrack and (for the Series B point) implicitly overlaps with SomMind's timeline — if both SomMind and SleepVice ship as separate case studies, watch for redundant "Series B" framing across cards.
