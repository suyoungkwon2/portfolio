---
title: "SomMind — Digital Therapeutic App for Severe Insomnia"
section: Healthcare / Education
pdf_pages: 15-19
---

# SomMind

**Subtitle:** Digital Therapeutic App for Severe Insomnia
**Tagline (pull quote):** "Healthy sleep starts with a healthy mind."

## Chips

- **Domain (green):** Digital Health
- **Problem (red):** Insomnia
- **Tech (blue):** Digital Therapeutics, CBT-i

## Role & Team

- **My role:** Team Leader, Product Management, Clinical Program Design, Clinical Trial Design, Regulatory Management, Vendor Management
- **Type:** Mobile Product, New Business
- **Team:** Medical Director, Product Designer, FE/BE/QA Engineer, Contents Writer
- **Org:** Asleep (in collaboration with Seoul National University Bundang Hospital)
- **Certification:** KFDA E0606.02; GMP certification for the SaMD (Software as a Medical Device)

## Timeline

- **Headline duration (confirmed by site owner — use project duration, not broader role tenure): Jun 2022 – Mar 2023.**
- For reference only: CV role tenure ("DTx PM / DTx Team Lead, UX Team Lead") spans Sep 2021 – Mar 2023, which includes pre-SomMind DTx groundwork before this specific app's build phase started — do not use this as the case-study date range.

## Overview

Tackles **untreated chronic insomnia**. Despite CBT-i (Cognitive Behavioral Therapy for Insomnia) being the most effective, drug-free treatment, significant accessibility barriers force patients to over-rely on pharmacotherapy. SomMind provides a systemic DTx (Digital Therapeutics) solution to dramatically lower the barrier to entry and scale CBT-i protocols — engineered as a human-centered mobile app using friendly animation and intuitive UX to maximize patient adherence and therapeutic efficacy.

**Result:** Asleep secured GMP certification for the SaMD and received K-FDA approval for the clinical trial plan, entering the clinical trial phase.

## Background / Problem

- **Growing Public Health Crisis:** insomnia prevalence is steadily increasing (chart: rising insomnia-patient count, 2014–2022, source noted as a Korean health-data chart in the deck), escalating into a socioeconomic concern.
- **Absence of Standard Care:** CBT-i is the reported gold standard, but cost/logistical barriers limit patient access.
- **Resulting Chronicization:** the treatment gap causes over-reliance on sedative medication → drug misuse, dependency, chronicization of insomnia.

**Essential glossary:** CBT-i (Cognitive Behavioral Therapy for Insomnia — trains patients to self-manage sleep issues), DTx (Digital Therapeutics — evidence-based "prescription app"), SaMD (Software as a Medical Device — requires regulatory approval like FDA before clinical use).

**Business objective:** Enhance Corporate Credibility (secure DTx certification), Validate Clinical Efficacy (clinically validated program as an R&D asset), Establish Market Leadership (leading SaMD manufacturer in the emerging Korean DTx market).

## Process

**Initiative → Discover → Define → Develop → Deliver** (with a Define↔Develop iteration loop)

### Discover
- **Patient Interviews:** 6 Korean adults (ages 30–65) with past/current CBT-i experience. Pain points: (1) Logistical Inaccessibility — weekly hospital visits cause treatment inconsistency/drop-off; (2) Adherence Fatigue — paper sleep diaries feel tedious, causing psychological compulsion and lower adherence; (3) Systemic Supply Shortage — severe shortage of qualified CBT-i therapists fails to meet demand.
- **Market/Competitor Research:** Sleepio (US) and PillowRx (KR). Limitations found: Cognitive Overload (overly long/unengaging content), Usability & Adherence Barriers (outdated, complex UX/UI), Accessibility Constraints (web-only access).
- **Adherence Design Research:** persona and journey-mapping materials to identify strategies maximizing adherence and efficacy.

### Define
- **Target user:** adults aged 20–65 meeting DSM-5 Insomnia Disorder criteria (ISI ≥ 8 Insomnia Severity Index, BDI < 29 Beck Depression Inventory).
- **Goal reframe (As-Is → DTx → To-Be SomMind):** Logistical Burden → Mobile Application → Simplified Convenience (anytime, anywhere); Supply Shortage → Structured Program → Universal Access; Adherence Challenge → Timely Intervention → Actionable Guidance (prompted actions in the moment); Monolithic Approach → Personalized CBT-i → Individualized Fit.
- **Core values:** Clinical Fidelity, Personalization, Inclusive Usability (UX for middle-aged and senior users).
- **Contents strategy:** Micro-Learning Design (prevent cognitive overload via short-form animation), Structured Learning Path (maximize learning efficacy via systematic modules), Engagement Design (sustain motivation via various motivational devices).

### Develop
- **4-week clinical program:** Prescription → Week 1 (Commencement: pre-treatment assessment, SomMind intro, SRT launch) → Week 2 (Foundation: SRT/SCT/SHE, relaxation training) → Week 3 (Deepening: cognitive therapy, SHE, relaxation) → Week 4 (Consolidation: SHE, relaxation, relapse prevention, final assessment). Therapy types: SRT (Sleep Restriction Therapy), SCT (Stimulus Control Therapy), SHE (Sleep Hygiene Education), plus Behavioral/Relaxation/Cognitive Therapy — with daily sleep-diary completion throughout.
- **Contents production:** guerrilla interviews (N=21); spec: 11 videos, 5–10 min each, animated, horizontal format. Content principles: Agentic, Beneficial, Encouraging, Accessible. Voice principles: Clear, Trustworthy, Calm, Warm. Production pipeline: Scripting → Storyboarding → Final Animation.
- **Information architecture:** App Main → Home / Learning / Sleep Diary / My Page, each with sub-trees (e.g. Sleep Diary → Weekly Sleep Report → Sleep Efficiency, Time in Bed, Total Sleep Time, Quality of Sleep, Sleep Window, Sleep Disturbances).
- **System architecture:** React Native app client on AWS Cloud — Cognito (user mgmt), API Gateway (domain routing), S3 (video distribution), plus Admin/Batch(Jenkins)/SomMind API servers, Aurora MySQL database, ElastiCache global memory cache.
- **Wireframe/design process:** Sketch (validate core flows/IA) → Wireframe (functional layout/UX flow) → Design (finalize visual design, usability, brand experience).

### Usability Test
- N=6, age groups 25–40(2)/41–55(2)/56–70(2), recruited for insomnia experience or high interest in sleep problems.
- Methodology: Figma prototype, 14 customer jobs covering 35 checkpoints, Think Aloud + Observation.
- Findings — Sleep Prescription: As-Is had ambiguous labels/irrelevant feedback → To-Be redesigned for clarity-first, cognitive-flow redesign. Learning: As-Is caused misinterpretation of lesson-completion status → To-Be fixed static content positioning.

## Final Product — Key Features

- **Dynamic Prescription:** Personalized TIB (Time in Bed) — weekly prescription updates based on daily diary progress; Goal Setting (wake/sleep goals linked to notifications); Motivational UX (encouraging copywriting, intuitive status visualization).
- **Structured Micro-Learning:** ~7-minute average animated videos for high concentration/retention; relatable characters (doctor/character) and intuitive animation for trust and immersion.
- **Objective Data Tracking:** Easy Sleep Diary (intuitive UI, automated calculations); Informative Sleep Reports; **26 tracked sleep metrics** (Sleep Score, Total Sleep Time, Time in Bed, Sleep Efficiency, Sleep/Wake/Wakeup Latency, Time in Wake/Light/Deep/REM, various ratios, Sleep Cycle count/time, Snoring Stages/Ratio/Count/Loudness, etc.).
- **Proactive Nudging:** Context-Aware Alerts (timely sleep-hygiene/diary reminders); Adherence Reinforcement (friendly messaging to increase treatment adherence).

## Metrics / Outcomes

- Secured **GMP certification** for the SaMD.
- Received **K-FDA approval** for the clinical trial plan (Cert: KFDA E0606.02).
- Program officially entered the clinical trial phase.

## Visuals present in the PDF

- p.15: GMP + Asleep badges, SomMind app screenshots (onboarding, weekly sleep goal, learning module), app icon/wordmark.
- p.16: essential-glossary table, insomnia illustration + rising-patient-count chart, patient-interview pain-point list, competitor screenshots (Sleepio/PillowRx), adherence-research persona/journey collage.
- p.17: target-user/eligibility table, As-Is→DTx→To-Be funnel diagram, core-value ovals, contents-strategy table, 4-week clinical-program table, content-production spec + scripting/storyboarding/animation stills.
- p.18: information-architecture tree, system-architecture (AWS) diagram, wireframe/design evolution screenshots (sketch → wireframe → final design), usability-test methodology + As-Is/To-Be comparison screens.
- p.19: final-product feature screenshots (dashboard, prescription card, micro-learning player), sleep-diary/sleep-report/metrics charts, proactive-nudge chat mockups.

## Links (from legacy-jekyll)

- ["CBT-i DTx Introduction Slide"](https://drive.google.com/file/d/1Pq8vjPSfQrwcYdiOhIpOvGTcVKvJTh6Q/view) — "\<Sleep, Tech, Life\> Symposium" presentation materials

## Notes / open questions

- ✅ Resolved: site owner confirmed the case study should headline the project duration (Jun 2022 – Mar 2023), not the broader DTx-team role tenure.
- The PDF's SleepVice project (pages 20–23, Amazon Alexa voice app, "Alexa Startup Partner" result, Korea's first official Amazon collaboration startup) shares the same Asleep sleep-tracking AI core and Series B funding milestone mentioned here and in AsleepTrack, but SleepVice itself is out of scope per the 6-project brief. Flagging in case the user wants that overlap acknowledged or wants SleepVice folded in as a 7th case study later.
