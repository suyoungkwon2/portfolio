# AI Curation Case Study — Web Build Spec (for Claude Code)

> 이 문서 하나로 `/work/ai-curation/` 케이스 스터디 페이지를 새로 구현할 수 있도록 정리한 명세입니다.
> **화면에 들어가는 영문 카피는 그대로 사용**하고, 한국어는 구현 지시·연출 설명입니다.
> 기준일: 2026-10-17 · 작성자: Mel Suyoung Kwon

---

## 0. Claude Code에게 — 먼저 읽을 것

1. **레퍼런스는 이미 완성된 `/work/ai-search/` 페이지입니다.** 이 페이지의 코드(컴포넌트, 섹션 구조, 스타일 토큰, 모션 구현 방식)를 먼저 읽고, **같은 디자인 시스템과 컴포넌트를 재사용**하세요. 새 디자인을 만들지 마세요.
   - 재사용 대상 예: Hero 레이아웃과 폰 프레임, 섹션 라벨(`01 CONTEXT`), 사이드바의 프로젝트 섹션 목록, count-up 지표, 진행 바(Strategic Process 1–5 스텝), 전체 화면 훅 문장, 폰 + 속마음 말풍선 장면, Gradio 데모 재현 UI, 조직도 다이어그램, A/B Test 셋업 카드와 Control/Treatment 폰, Reflection 번호 카드, Prev/Next 링크.
2. **현재 `/work/ai-curation/` 페이지 구성(PDF 슬라이드 이미지 나열)은 무시하고 이 명세로 새로 만듭니다.** 사이트 공통 레이아웃(사이드바, 헤더, 푸터, Prev/Next)은 유지하세요. Prev는 AI Search, Next는 사이트 기존 순서를 따릅니다.
3. **새 의존성은 최소화.** AI Search 페이지에서 쓰는 방식(라이브러리 포함)을 그대로 쓰세요.
4. **에셋이 아직 없는 항목은** §6의 id로 placeholder(회색 박스 + id + 설명)를 만들어 두고, 파일이 들어오면 교체만 하면 되도록 구현하세요.
5. **숫자와 사실은 §7에 있는 것만 사용하세요.** 새 수치·인용·고객 발언을 만들지 마세요. 특히 "홈 화면 다양성이 몇 % 줄었다" 같은 수치는 **없습니다**. 만들지 마세요.
6. **카피를 임의로 다듬지 마세요.** 레이아웃상 너무 길면 바꾸지 말고 TODO로 남겨 보고하세요.
7. 작업 순서 제안: (1) 정적 레이아웃 + 전체 카피 → (2) AI Search 컴포넌트 재사용·확장 → (3) 섹션별 모션 → (4) 인터랙티브 → (5) reduced-motion·모바일·성능 점검.
8. 시작 전에 **재사용할 컴포넌트 목록과 새로 만들 컴포넌트 목록**을 먼저 보여주세요.

---

## 1. 목표와 스토리

- **독자**: 영어권 채용 담당자, PM·디자인·AI 리더. 기술 세부는 펼쳐 보게.
- **핵심 긴장**: *"Could AI pick like a Kurly MD?"* 큐레이션은 컬리가 파는 신뢰 그 자체라서, 목표는 사람을 **이기는 것이 아니라 사람과 구분되지 않는 것**이었습니다. 그래서 A/B 테스트의 "차이 없음"이 이 페이지의 승리 장면입니다.
- **주인공 오브젝트 — 테마 이름 한 줄: `Matcha Core: Trending Now`**
  AI Search의 `cabage`와 같은 역할입니다. 등장 위치:
  Hero(제목 리스트에 타이핑됨) → 08 Copilot 입력창 → 09 블라인드 테스트 → 12 Google Sheet 한 줄 → 12 홈 화면 After.
  보조 테마(같은 리스트에 함께 등장): `The Ultimate Snack Drop` · `Spicy Chinese Takeout Vibe` · `The Sweetest Year-End Vibe`.
- **Before / After 미러**: 04의 지루한 홈 화면 폰 장면(Mon/Wed/Fri)이 12에서 **같은 폰, 같은 위치, 같은 요일 구성**으로 다시 나와 After가 됩니다.
- **반전 두 개**: 10 "A tie was the win." / 11 "Two fixes, combined, made it worse."
- **진행 바(Strategic Process)**: 07에서 처음 깔고, 09·10·12에서 단계별로 불이 켜집니다.

| 막 | 섹션 | 독자가 느껴야 할 것 |
| --- | --- | --- |
| Setup | Hero · 01 · 02 · 03 | 무엇을 해냈는지 먼저 안다 |
| Conflict | 04 · 05 | 고객은 지루하고, 팀은 막혔다 |
| Listen | 06 · 07 | 일하는 사람에게서 답을 찾았다 |
| Earn trust | 08 · 09 · 10 | 내부 → 전문가 → 고객 순으로 신뢰를 쌓았다. **10이 클라이맥스** |
| Payoff | 11 · 12 · 13 | 다듬고, 넘기고, 다음 단계의 발판이 됐다 |

---

## 2. 전역 규칙

### 2.1 디자인 (AI Search 페이지와 동일)
- 밝은 테마: 흰 배경, 거의 검정 텍스트, 회색 본문, **남색 강조색 하나**(AI/After/Winner/핵심 수치에만).
- 헤드라인 Aspekta, 본문 Inter, 섹션 라벨 모노 대문자. 실제 값은 AI Search 코드의 토큰을 그대로 사용.
- 헤드라인은 Title Case, 결론형 또는 질문형. 본문은 1인칭, 한 문단 1–3문장, **굵게**는 한두 구절만.
- "Before/실패/정체" 상태는 채도를 뺀 회색, "After/AI" 상태는 강조색.

### 2.2 모션 라벨 (AI Search 명세와 동일한 의미)
| 라벨 | 의미 |
| --- | --- |
| `▶ Scroll scene` | sticky로 고정하고 스크롤 진행에 따라 단계 전환 |
| `▶ Video` | 무음 자동재생 루프, 포스터 필수, 화면 밖이면 일시정지 |
| `▶ Interactive` | 독자가 직접 조작. **이 페이지에는 3개만**: 08 Copilot 데모, 09 블라인드 픽, 10 "Can you tell?" |
| `Count-up` | 뷰포트 진입 시 1회 |

### 2.3 정직한 라벨 (반드시 지킬 것)
- 연출용 속마음 말풍선: 앞에 **`Illustrative thought:`** 표기 (AI Search와 동일 스타일).
- 인터뷰에서 들은 말을 다듬은 인용: 아래에 **`Paraphrased from interviews with the MD team.`** 표기. 따옴표 인용 스타일 사용 가능.
- 재현한 화면·데이터: **`Illustrative data. Internal figures have been changed.`**
- 04의 Mon/Wed/Fri 폰 장면: 캡션 **`Illustrative scene.`**

### 2.4 접근성·성능
- `prefers-reduced-motion: reduce` → 모든 scroll scene은 최종 상태 정지 화면, 영상은 포스터, count-up은 최종값.
- 인터랙티브는 키보드 조작 가능, 포커스 표시, `aria-pressed`/`aria-live`로 결과 안내.
- 모바일 375px에서 가로 스크롤 금지. sticky 장면은 세로로 쌓인 정적 단계로 풀어도 됩니다.

---

## 3. 페이지 구조와 섹션 id

```
Hero
01 CONTEXT                 #context
02 IMPACT                  #impact
03 ROLE AND RESPONSIBILITY #roles
(전체 화면 훅)
04 USER PROBLEM            #user-problem
05 COMPANY'S PROBLEM       #company-problem
06 EMPLOYEE INTERVIEW      #interview
07 DEFINE                  #define
08 INTERNAL COPILOT        #copilot
09 INTERNAL EVALUATION     #evaluation
10 A/B TEST                #ab-test
11 IMPROVEMENT             #improvement
12 INTEGRATION & IMPACT    #integration-impact
13 REFLECTION              #reflection
Prev / Next
```
사이드바의 AI Curation 하위 목록에 위 13개를 AI Search와 같은 방식으로 노출하세요.

---

## 4. 새로 필요한 컴포넌트 (AI Search에 없는 것)

| 컴포넌트 | 섹션 | 설명 |
| --- | --- | --- |
| `ThemeToCampaigns` | Hero | 제목 리스트 → AI 노드 → 4개 폰 기획전으로 퍼지는 애니메이션 |
| `HomepageStack` | 01 | 홈 화면 구좌 스택, Themed Campaigns 칸 하이라이트 + MD 아바타가 흐려짐 |
| `StaleHomeScene` | 04, 12 | 폰 고정, Mon/Wed/Fri 3단계. `variant="before" | "after"` 하나로 두 장면을 구현 (같은 크기·위치 보장) |
| `QuoteCard` | 05 | 인터뷰 다듬은 인용 + Paraphrased 라벨 |
| `WorkflowTrack` | 06 | 9단계 레일 + 아바타 이동 + 페인포인트 카드 + 5→2 되감기 루프 |
| `RoadmapGrid9` | 07, 12 | 9칸 로드맵, 1번 칸만 켜짐 → 12에서 ✓와 다음 칸으로 번짐 |
| `CopilotDemo` | 08 | Gradio Campaign Copilot 재현 (AI Search의 Gradio 데모 컴포넌트 확장) |
| `PipelineDots` | 08 | 알고리즘 플로우, 점이 이동하며 반복 구간을 몇 바퀴 돎 |
| `BlindPick` | 09 | 리스트 A/B 중 독자가 하나 고르면 결과 공개 |
| `ScoreDots` | 09 | 21개 점이 1–10 눈금에 떨어지고 평균선 8.95 |
| `ParityBars` | 10 | MD(100) vs AI 막대가 나란히 자라 거의 같은 높이에서 멈춤 |
| `CanYouTell` | 10 | 같은 테마 두 폰, 독자가 AI 쪽을 고르면 정답 공개 |
| `VersionRace` | 11 | v1/v2/v3 막대가 줄어들고 v3만 다시 튀어오름 |
| `SheetToHome` | 12 | Google Sheet 한 줄 타이핑 → 시트가 접히며 홈 화면 기획전 등장 |

---

## 5. 섹션별 명세

각 섹션: **카피(그대로 사용) → 미디어/모션 → 구현 메모**

### 5.0 Hero
- Chips: `AI Transformation` · `Commerce` · `A/B Validated`
- Title (2줄): **AI Curation: Scaling Themed Campaigns**
- Tagline: “You name the theme. AI does the rest.”
- Body: At Kurly, every themed campaign on the homepage was picked by hand. When the team behind them shrank, the homepage went stale. I led an AI system that turns a theme into a full campaign and keeps it fresh on its own.
- Meta grid
  - Period: Jun 2024 – Dec 2024
  - Role: AI Product Manager · UX Research · A/B Test Design · CEO Communication · QA
  - Team: AI PM (Me) · 1 ML Engineer · 1 Backend Engineer
  - Org: Kurly
- 외부 링크 없음 (기사 링크는 02 Impact에 둡니다).
- **Visual — `ThemeToCampaigns` (▶ 자동 재생 루프, AI Search Hero 폰 자리)**
  1. 제목 리스트 카드(`Title ✎`)에 4개 테마가 한 줄씩 타이핑됨. 마지막 줄 `Matcha Core: Trending Now`에서 커서가 깜빡임.
  2. 아래 `AI` 노드가 빛나며 점선 4갈래가 뻗어나감.
  3. 4개 폰 화면이 상품 사진으로 차르르 채워짐.
  - 상단 작은 라벨: AI Search의 `BEFORE/AFTER` 자리에 `THEME` → `CAMPAIGN`.
  - 참고 그래픽: 포트폴리오 PDF p.28.

### 5.1 01 CONTEXT
- Headline: **Curation Is What Kurly Sells**
- Body: Kurly built its brand on picks: customers trust that if Kurly shows a product, it’s worth buying. On the homepage, those picks live in **themed campaigns**, collections that merchandisers (MDs) build for a season, an event, or a mood, drawn from **40K+ products**.
- Sub-headline: **But the People Picking Were Getting Fewer**
- Sub-body: Every campaign was built and kept up by hand. As the MD team shrank, campaigns stopped being refreshed, and **the homepage started showing the same products again and again**.
- **▶ Scroll scene — `HomepageStack`**
  1. 홈 화면 구좌가 쌓임: Promotional Banners · Limited-Time Offers · Best Sellers · Special Campaigns · **Themed Campaigns**(강조색 하이라이트).
  2. Themed Campaigns 칸 안에서 테마 카드가 넘어감(예: “Aesthetic Holiday Prep is On”), 옆에 MD 아바타 여러 명.
  3. Sub-headline이 나올 때 아바타가 하나씩 흐려지며 사라지고, 테마 카드는 한 장에서 멈춘 채 회색으로 바래짐.
- 메모: AI Search 01의 "fact → But…" 두 박자 구조와 동일.

### 5.2 02 IMPACT
- Headline: **From Hand-Picked to Self-Running**
- Metrics (Count-up 3개, AI Search 02와 같은 레이아웃)
  1. **25%** · of Key Homepage Campaign Slots Run Fully by AI
  2. **200+** · Campaigns Run by AI
  3. **2 days / week** · of MD Time Saved
     - 각주(작게): Estimated from employee interviews.
- Sub line: In a 2-week A/B test, AI-curated campaigns performed **on par with campaigns picked by Kurly’s MDs**.
- **Card · Beyond the Homepage** (AI Search의 Google 카드 자리, 넓은 카드)
  - Title: **Other Teams Asked for It Too**
  - Body: After seeing the results, other teams wanted the same logic for their own spaces, from the search tab to **Beauty Kurly**. After I left Kurly, it launched on Beauty Kurly in 2025.
  - Visual: 홈 화면 기획전 아이콘에서 화살표가 `Search tab`, `Beauty Kurly` 두 칩으로 뻗어나감. Beauty Kurly 칩에만 체크 + `2025`.
- **Press row (카드 아래 작은 링크 2개)** — 라벨: `In the press`
  - Economist Korea (Feb 2025) → https://economist.co.kr/article/view/ecn202502140048
  - Viva100 (Feb 2025) → https://www.viva100.com/article/20250216500401
  - 링크 텍스트는 매체명 + 날짜만. 기사 제목은 한국어 원문이라 화면에 번역해 넣지 마세요.

### 5.3 03 ROLE AND RESPONSIBILITY
- Headline: **Turning an MD’s Craft into a System**
- Cards (AI Search와 같은 번호 리스트 형식)
  1. **Strategy** — Defined the problem from the interviews and set the plan: **give MDs an internal copilot first**, so they could trust the AI and help us improve it, then test it with customers, then launch. Framed it as the first step of a homepage personalization roadmap.
  2. **UX** — Interviewed **8 MDs and marketers** to map the campaign workflow. Designed the **Campaign Copilot UI** and the **Google Sheet** MDs use to launch campaigns, and trained MDs on every update with guides I wrote and kept up to date.
  3. **Execution** — Designed and ran the internal evaluations and the A/B test, worked with the ML engineer who built the curation algorithm, designed the system architecture that connected AI curation to Kurly’s **inventory and content management tools**, and led QA through launch.
  4. **Alignment** — Kept the CEO, the MD and marketing teams, and the data team on the same page, from model choice to rollout.
- **Org diagram** (AI Search와 같은 컴포넌트): `C-Level` → `AI PM (Me)`(강조) · `ML Engineer` · `BE Engineer` → `MD Team` · `Marketing Team` · `Data Team`.
  - MD Team → AI PM 방향 화살표를 한 번 굵게 강조(요청이 MD 팀에서 왔다는 05와 연결).

### 5.4 전체 화면 훅 (03과 04 사이, AI Search와 같은 두 박자 타이핑)
- Line 1: Customers came to Kurly to discover something new.
- Line 2: The homepage kept showing them the same things.

### 5.5 04 USER PROBLEM
- Headline: **The Homepage Stopped Surprising Anyone**
- Body 1: Kurly customers love the products its MDs pick for them, and **“the joy of discovery”** is one of the company’s goals.
- Body 2: But as campaigns went untouched, the homepage lost its variety: the same products stayed for weeks, sold-out items lingered, and **one campaign started to look a lot like the next**.
- **▶ Scroll scene — `StaleHomeScene variant="before"`** (폰 고정, 요일 탭이 넘어감, 캡션 `Illustrative scene.`)

| Step | Day | 화면 | 말풍선 (`Illustrative thought:`) |
| --- | --- | --- | --- |
| 1 | Mon | 테마 기획전, 상품 6개 | 🙂 Let’s see what’s new. |
| 2 | Wed | 같은 기획전·같은 상품, 1개에 `Sold out` 배지 | 😐 Didn’t I see this already? |
| 3 | Fri | 같은 상품, `Sold out` 3개, 옆 기획전에도 같은 상품(얇은 강조선으로 연결) | 🥱 Same old. |

  - Step 3 끝에서 손가락이 화면을 빠르게 휙 넘기고 지나감.
- Kicker: Kurly promised discovery. The homepage was delivering repetition.
- 메모: **수치 자리를 만들지 마세요.** 다양성 감소 수치는 없습니다. 근거는 05의 인터뷰 인용이 맡습니다.

### 5.6 05 COMPANY’S PROBLEM
- Headline: **Fewer Hands, the Same 40K+ Products**
- **Part A · Left on hold**
  - Body: Every campaign needed daily care as products sold out and sales shifted. With fewer MDs, that care stopped, and **outdated campaigns meant missed sales**.
  - `QuoteCard`: “We know it needs to be done. It’s just been on hold for a while. We’re blocked.” — 라벨: `Paraphrased from interviews with the MD team.`
  - ▶ Scroll scene: 기획전 카드 위로 먼지처럼 회색이 덮이고 `Sold out` 배지가 늘어남.
- **Part B · Hard to catch up**
  - Body: New MDs joined, but getting to know **40K+ products** well enough to curate takes time. Campaigns waited while they ramped up.
  - ▶ Scroll scene: 화면 가득 작은 상품 타일 벽, 그 앞에 신입 MD 아바타 하나. 스크롤할수록 타일이 늘어나 아바타가 점점 작아 보임.
- **Part C · The ask**
  - Body: Then the MD team came to us with a question:
  - `QuoteCard` (메시지 카드 형태, 톡 뜨는 모션): “A lot of our work is blocked right now. Is there anything we could automate?” — 라벨: `Paraphrased from interviews with the MD team.`
- **Turn**: But curation was Kurly’s core value. Handing homepage picks to a machine raised a real question: **could AI pick like a Kurly MD**, without costing customers’ trust?
- Kicker: So before building anything, I sat down with the people who do this every day. ↓

### 5.7 06 EMPLOYEE INTERVIEW
- Headline: **Where Does an MD’s Week Go?**
- Body: I interviewed **8 MDs and marketers**, from juniors to seniors, and mapped every step of building a campaign. The goal: find the steps that took the most time and could be handed to AI.
- **▶ Scroll scene — `WorkflowTrack`** (가로 레일, 스크롤에 따라 MD 아바타가 한 칸씩 이동, 막히는 칸마다 빨간 페인포인트 카드가 떨어짐)

| # | Step | Pain point (카드 문구, 그대로) |
| --- | --- | --- |
| 1 | Trend Search | — |
| 2 | Concept Definition | — |
| 3 | Product Discovery | 😩 Matching products to a concept by hand |
| 4 | Product Selection | 😩 Checking sales data one by one |
| 5 | Enough SKUs? | 😩 Not enough products → back to Concept Definition |
| 6 | Campaign Proposal | — |
| 7 | Campaign Approval | — |
| 8 | System Registration | 😩 Ordering every product slot by hand |
| 9 | Campaign Operation | 😩 Watching for sold-out and low-stock items |

  - Step 5: 화살표가 실제로 Step 2로 되감기고 아바타가 뒤로 끌려가는 루프 모션.
  - Step 1–5 위로 `⏳ Most time-consuming` 괄호가 그려짐. 자동화 가능한 칸(3, 4, 5, 8, 9)만 강조색 연한 틴트 + 범례 `Automation available`.
  - 페인포인트는 실제 인터뷰 결과라 라벨 불필요. 이모지만 연출.
- **Key insights (4 카드)** — 카드 제목 위에 작은 라벨 `So the system had to…`
  - **Save matching time** · Less time matching products to a theme
  - **Show data in one view** · Sales and stock side by side, not in separate tools
  - **Rank automatically** · Products ordered without hand sorting
  - **Stay up to date** · Lists that update themselves when stock changes

### 5.8 07 DEFINE
- **HMW (섹션 시작과 끝에 같은 문장, AI Search 06과 같은 북엔드)**
  How might we let an MD launch a campaign just by naming a theme, *without losing the quality of a hand-picked one*?
- **Goals**
  - **Internal efficiency** · Automate the manual workflow so MDs get their time back.
  - **Customer experience** · Offer more diverse, high-quality campaigns that bring back the joy of discovery.
- **Key features**
  - **Find products by theme** · Type a theme, get a ranked product list.
  - **Refresh every hour** · Sold-out or stale items are swapped out automatically.
- **The bar (크게 한 줄)**: AI didn’t have to beat our MDs. It had to be **as good as them**, so customers couldn’t tell the difference.
- **Strategic Process (AI Search의 진행 바 컴포넌트)**
  1. **AI PoC** · An internal copilot for MDs, to reach expert-level curation.
  2. **Validation** · A large A/B test on the homepage, to match hand-picked campaigns.
  3. **CEO Decision** · Bring the evidence to the CEO and get the go-ahead.
  4. **Integration** · Let AI run the core homepage slots.
- **Bigger picture (접힘 카드, `RoadmapGrid9`)**
  - Title: Project 1 of 9
  - Body: This was the first project on a roadmap I designed toward **a fully personalized homepage**.
  - 3줄: Mission · A fully personalized homepage / Goal · Get the most out of every slot / Strategy · Show products by each customer’s taste
  - 9칸 그리드에서 1번 칸 `AI Curation`만 켜짐. 나머지 칸 라벨은 `Project 2` … `Project 9` (실제 이름 넣지 말 것).
- 섹션 끝에 HMW 문장 반복.

### 5.9 08 INTERNAL COPILOT
- Headline: **Give the AI to MDs Before Giving It the Homepage**
- Body: Instead of putting AI straight on the homepage, I first gave it to the MDs as an internal tool, **Campaign Copilot**. It did two jobs at once: it saved them time right away, and every search they ran and rated **showed us how to make the AI better**.
- At a glance (칩 4개): `8 weeks before the A/B test` · `6 updates from MD feedback` · `Open to every employee` · `Tracked searches, speed, results, and satisfaction`
- **▶ Interactive — `CopilotDemo`** (AI Search의 Gradio 데모 재현 컴포넌트를 확장. 상단 `gradio` 로고, 제목 `Campaign Copilot`)
  - 왼쪽 입력: Theme Subject = `Matcha Core: Trending Now` (미리 채움) · Mandatory Keywords · Search Scope 슬라이더 · Validation Strictness 슬라이더 · Category 체크박스(Snacks, Desserts, Drinks …) · `Submit`
  - `Submit` → 오른쪽 결과 표가 한 줄씩 채워짐: 썸네일 · 상품명 · 가격. 말차 관련 상품(말차 라떼, 말차 아이스크림, 말차 쿠키 등) 8–10개.
  - 슬라이더를 움직이면 결과 개수만 바뀌는 가벼운 반응이면 충분. 실제 검색 로직 구현 불필요(정적 데이터).
  - 하단 캡션: `Illustrative data. Internal figures have been changed.`
- **How it works — `PipelineDots`** (작은 플로우, 테마가 점이 되어 이동)
  - Theme input → Refine the request → Generate 10 candidate products and keywords (repeats k times) → Expand to similar products → Rank → Filter → Final product list
  - 반복 구간은 점이 실제로 2–3바퀴 돎.
  - 캡션: Curation algorithm built by our ML engineer.
- **6 updates, one guide at a time**
  - Body: Every update came with an announcement and a short guide I wrote, so MDs always knew what changed and how to use it.
  - Visual: `v1 → v6` 눈금 6개 타임라인, 각 눈금에 작은 공지 카드 아이콘. 버전별 변경 내용 텍스트는 **넣지 마세요**(내용 미정). 마지막 눈금에서 09로 이어지는 화살표.

### 5.10 09 INTERNAL EVALUATION
- Headline: **Earning the MDs’ Trust, One Test at a Time**
- Body: Before asking customers to see AI picks, I needed proof that the people who know curation best trusted them. I ran three checks.
- **1 · Which AI? A blind test**
  - Body: Two models curated the same 10 themes: **Model A**, our own algorithm built on GPT-4o, and **Model B**, a Google Cloud Vertex agent. People from C-level, marketing, MD, and data teams picked the better list without knowing which was which. **Model A won 68% of 56 votes**, and **77%** on themes that needed more reasoning.
  - **▶ Interactive — `BlindPick`**: 테마 `Matcha Core: Trending Now`의 리스트 두 개(`List 1`, `List 2`)를 나란히. 질문: “Which list would you publish?” 독자가 하나 고르면 공개: 각 리스트가 Model A/B 중 무엇인지 + “Kurly employees picked Model A 68% of the time.” 리스트 내용은 연출용, 캡션 `Illustrative data.`
- **2 · Would experts ship it?**
  - Body: An expert panel, a PM, the MD lead, and the marketing lead, scored **21 test campaigns** from 1 to 10. The average was **8.95 / 10**, with high satisfaction across most themes.
  - Visual — `ScoreDots`: 21개 점이 1–10 눈금 위로 떨어져 쌓이고 평균선 `8.95`가 그어짐. **개별 점수 데이터는 없으므로** 점 배치는 평균 8.95가 되도록 만든 연출용이며 캡션 `Illustrative distribution. Average is actual.`
- **3 · Faster, more accurate, cheaper** (Before → After 3행, 숫자 count-up)

| Metric | First version | Final version |
| --- | --- | --- |
| Search speed | ~1 minute | ~15 seconds |
| Minimum conditions met | Often missed | 87%+ |
| Cost per query | ~$0.50 | under $0.07 |

- Kicker: The experts trusted it. Now the question was whether customers would. ↓
- 진행 바: `AI PoC` 완료, `Validation` 현재.

### 5.11 10 A/B TEST (클라이맥스)
- Headline: **Could Customers Tell the Difference?**
- Intro: To decide whether AI could run the homepage, I **designed a 2-week A/B test** around one question: would customers notice who did the picking?
- **Setup card (AI Search 09와 같은 컴포넌트)**
  - Objective · Validate AI curation quality before the final integration decision
  - Hypothesis · AI-curated campaigns perform **as well as** MD-curated ones
  - Method · Same homepage slot, same theme; only who picked the products changed
  - Target · 24,455 users (AI) vs 24,278 users (MD)
  - Conditions · 20 slots, at least 30 products per campaign, a new theme every day
  - Duration · 2 weeks
- **▶ Interactive — `CanYouTell`**: 테마 `The Sweetest Year-End Vibe` 폰 두 대를 나란히(라벨 `Campaign 1`, `Campaign 2`). 버튼 “This one was picked by AI”. 고르면 정답 공개 + “Customers couldn’t tell either.” 캡션 `Illustrative example.`
- **Trust the test (칩 3개, 클릭하면 펼침)**
  - A/A test · No difference between groups before the test
  - Sample ratio · Balanced (p = 0.423)
  - Power · 0.8 at α = 0.05, MDE 0.004
- Result headline: **Hypothesis Validated: No Significant Difference**
- **Visual — `ParityBars`** (지표마다 MD 막대 100과 AI 막대가 나란히 자라 거의 같은 높이에서 멈춤, p-value 작게)

| Primary KPI (MD = 100) | AI | p-value |
| --- | --- | --- |
| Campaign click user ratio | 101.7 | 0.076 |
| Campaign add-to-cart user ratio | 100.0 | 0.982 |
| Campaign purchase user ratio | 99.5 | 0.937 |

- Secondary KPIs (접힘, 같은 형식)

| Secondary KPI (MD = 100) | AI | p-value |
| --- | --- | --- |
| Add-to-cart value per user | 101.1 | 0.839 |
| Purchase value per user | 102.2 | 0.773 |
| Product clicks per user | 100.5 | 0.779 |
| Add-to-cart clicks per user | 96.5 | 0.174 |
| Purchases per user | 104.5 | 0.571 |

  - 표 아래: All metrics are indexed to the MD-curated group (= 100).
- **What AI did differently (인사이트 2개)**
  - AI campaigns used **fewer products but more diverse categories**, with similar theme relevance.
  - **Relevance in the top slots** drove clicks the most. → 11로 연결
- Kicker: A tie was the win. I took the results to the CEO and got approval to let AI run the slots.
- 진행 바: `Validation` 완료, `CEO Decision` 완료, `Integration` 현재.

### 5.12 11 IMPROVEMENT
- Headline: **Two Fixes, Combined, Made It Worse**
- Body: The A/B test showed the top slots matter most, so before the full rollout I went after **low-quality items**, products that didn’t really fit the theme. We graded them by severity, and I set one goal: **lower the overall share of low-quality items**.
- Starting point: **9.17%** of items were low-quality at any level, and **0.76%** were critical.
- **▶ Scroll scene — `VersionRace`** (버전별 막대가 줄어들고, v3만 내려가다가 다시 튀어오름)

| Version | What changed | All levels | Critical |
| --- | --- | --- | --- |
| Start | — | 9.17% | 0.76% |
| v1 | More verification passes | 8.72% | 0.64% |
| **v2 ✅** | **Added new data types** | **2.64%** | 1.21% |
| v3 | v1 + v2 together | 4.08% | 1.56% |

  - 막대 차트의 주 지표는 **All levels**. Critical은 작은 보조 숫자로.
  - v3 반등 순간 말풍선: 🤔 `Illustrative thought:` Wait, why?
- Turn: The obvious move was to combine both fixes. **It made things worse.**
- Decision: Critical items were rare to begin with, so the bigger win was cutting low-quality items overall. **v2 alone brought them from 9.17% to 2.64%**, so v2 went live.
- 메모: v2의 critical 비율이 시작점보다 높은 점(0.76% → 1.21%)을 숨기지 말고 표에 그대로 둡니다. Decision 문장이 그 이유를 설명합니다.

### 5.13 12 INTEGRATION & IMPACT
- Headline: **Name a Theme, Get a Live Campaign**
- Body: MDs already worked in spreadsheets, so I designed the launch to happen there. They add a campaign to **a Google Sheet**, and the AI fills it, ranks it, and refreshes it every hour on the live homepage. Behind it, I designed how the AI connects to Kurly’s **inventory and content management tools**, so every campaign stays in stock and on brand.
- **▶ Scroll scene — `SheetToHome` (주인공 회수)**
  1. Google Sheet 한 줄에 `Matcha Core: Trending Now`, 부제, 시작일, 종료일이 타이핑됨.
  2. 시트가 접히며 화살표 → **04와 같은 폰, 같은 위치**에 말차 기획전이 상품으로 채워지며 등장.
  3. `StaleHomeScene variant="after"`: 04의 Mon/Wed/Fri 탭을 다시 넘기면 이번엔 매일 다른 테마와 상품.
     - Mon: `Matcha Core: Trending Now` · Wed: `Spicy Chinese Takeout Vibe` · Fri: `The Ultimate Snack Drop`
     - Fri 말풍선(04의 🥱 자리): 😍 `Illustrative thought:` Oh, I didn’t know they had this.
- **How to launch (3 steps)**: 1 · Open the sheet · 2 · Add the campaign: title, subtitle, start and end dates · 3 · Done 🎉
- **System flow (작은 다이어그램)**: MD → Campaign Management Sheet → Business logic + AI model → Kurly frontend & backend (with inventory and content management) → Monitoring → back to MD
- **Impact (02 숫자 재등장, 더 크게)**
  - **25%** · of key homepage campaign slots run fully by AI
  - **200+** · campaigns run by AI
  - **2 days / week** · of MD time saved
  - **On par** · with hand-picked campaigns, with more diverse categories
- **Spreading out**: The same logic was requested for the search tab and for Beauty Kurly, and **went live on Beauty Kurly in 2025**, after I left.
- **The foundation (마지막 띠, `RoadmapGrid9` 재등장)**
  - Headline (작게): **The First Step Toward a Personal Homepage**
  - Body: Once campaigns could run themselves, the only limit on how many we could have was ideas. And with enough campaigns, plus a sense of each customer’s taste, the homepage could **show every customer the campaigns that fit them**.
  - 모션: 07의 9칸 그리드가 다시 열리고 1번 칸에 ✓, 빛이 2번 칸 이후로 번짐.

### 5.14 13 REFLECTION (AI Search와 같은 번호 카드 3개)
1. **Defining the Right Bar** — The goal was not to beat our MDs but to match them. Setting **parity as success** made a sensitive change, letting AI pick for a curation brand, something the company could say yes to.
2. **Trust Before Scale** — Putting AI in MDs’ hands first turned the people with the most at stake into the people **shaping it**. Their feedback made the model better, and their trust made the rollout possible.
3. **One Step in a Bigger Plan** — Framing this as Project 1 of a personalization roadmap kept every decision pointed somewhere. The Sheet, the hourly refresh, and the data it collects all **set up what comes next**.

---

## 6. Asset Manifest

에셋 경로는 AI Search 컨벤션을 따르세요(예: `public/images/ai-curation/...`). 없으면 placeholder.

| id | 종류 | 섹션 | 내용 | 상태 |
| --- | --- | --- | --- | --- |
| `product-*` | image | Hero, 04, 08, 09, 10, 12 | 기획전에 쓸 상품 사진 (말차, 스낵, 마라, 연말 디저트 등) | 확보 필요 (AI Search처럼 실제 상품 사진 사용) |
| `kurly-homepage-stack` | image or rebuilt UI | 01 | 홈 화면 구좌 구조 | UI로 재현 |
| `md-avatar` | svg | 01, 05, 06 | 단순한 MD 아바타 | 제작 |
| `logo-gradio` | image | 08 | AI Search 페이지 것을 재사용 | 보유 |
| `logo-google-sheets` | svg | 12 | 시트 아이콘 | 제작/확보 |
| `beauty-kurly-chip` | svg/text | 02, 12 | Beauty Kurly 표기 (로고 사용 가능 여부 확인 전에는 텍스트 칩) | 텍스트 |

그 외 모든 화면(Copilot, 폰 기획전, Google Sheet, 블라인드 리스트)은 **스크린샷이 아니라 HTML/CSS로 재현**합니다.

---

## 7. 수치와 사실 (이 값 외 사용 금지)

| 값 | 의미 | 출처 |
| --- | --- | --- |
| 40K+ | 컬리 SKU 수 | 포트폴리오 PDF, 작성자 확정 |
| 8 | 인터뷰한 MD·마케터 수 | 포트폴리오 |
| 25% | AI가 완전 운영하는 핵심 홈 화면 기획전 구좌 비율 | 포트폴리오 |
| 200+ | AI가 운영하는 기획전 수 | 포트폴리오 |
| 2 days / week | MD 시간 절감 (직원 인터뷰 기반 추정) | CV, 작성자 확정 |
| 8 weeks, 6 updates | Copilot 운영 기간, 업데이트 횟수 | 포트폴리오, 작성자 확정 |
| 10 themes, 56 votes, 68%, 77% | 모델 블라인드 테스트 | 포트폴리오 |
| 21 campaigns, 8.95 / 10 | 전문가 평가 | 포트폴리오 |
| 1 min → 15 s · often missed → 87%+ · $0.50 → <$0.07 | Copilot 기술 개선 | 포트폴리오 |
| 24,455 vs 24,278 · 20 slots · 30+ SKUs · daily rotation · 2 weeks | A/B 조건 | 포트폴리오 |
| p = 0.423 · Power 0.8 · α 0.05 · MDE 0.004 | A/B 신뢰도 | 포트폴리오 |
| §5.11 KPI 표 전체 | A/B 결과 (MD = 100 지수) | 포트폴리오 |
| 9.17/0.76 → v1 8.72/0.64 → v2 2.64/1.21 → v3 4.08/1.56 | 저품질 비율 (All / Critical) | 포트폴리오 |
| 1 hour | 리스트 자동 갱신 주기 | 포트폴리오 |
| Beauty Kurly, 2025 | 작성자 퇴사 후 확대 적용 | 작성자 확정 |
| Jun – Dec 2024 | 프로젝트 기간 | 작성자 확정 |

**사용 금지**: 홈 화면 다양성 감소율, 매출 증가율 등 위에 없는 모든 수치. Model A를 "proprietary"로 부르지 말고 **"our own algorithm built on GPT-4o"**로 표기. 알고리즘은 작성자가 아니라 **ML 엔지니어가 만든 것**으로 표기.

---

## 8. 완료 기준

- [ ] 모든 카피가 이 문서와 글자 단위로 일치
- [ ] AI Search 페이지와 같은 타이포·색·간격·사이드바 동작 (나란히 열었을 때 같은 시리즈로 보일 것)
- [ ] 04 `before`와 12 `after`의 폰 크기·위치·요일 탭이 동일
- [ ] 진행 바가 07 → 09 → 10 → 12에서 올바른 단계로 켜짐
- [ ] 인터랙티브 3개(CopilotDemo, BlindPick, CanYouTell) 키보드 조작 가능, 결과가 `aria-live`로 읽힘
- [ ] §2.3의 정직한 라벨이 모든 해당 위치에 있음
- [ ] `prefers-reduced-motion`에서 모든 모션이 최종 정지 화면으로 대체
- [ ] 모바일 375px 가로 스크롤 없음
- [ ] 미확보 에셋은 id가 적힌 placeholder
- [ ] 완료 시 TODO와 미확보 에셋 목록을 요약 보고
