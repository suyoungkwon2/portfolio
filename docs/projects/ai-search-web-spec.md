# AI Search Case Study — Web Build Spec (for Claude Code)

> 이 문서 하나로 AI Search 케이스 스터디 페이지를 구현할 수 있도록 정리한 명세입니다.
> 화면 카피(영문)는 **그대로 사용**하고, 한국어는 구현 지시·연출 설명입니다.
> 기준일: 2026-10-15 · 작성자: Su Young (Mel) Kwon

---

## 0. Claude Code에게 — 먼저 읽을 것

1. **레포를 먼저 파악하세요.** 프레임워크, 라우팅, 기존 `/work/*` 케이스 스터디 페이지 구조, 스타일 방식(CSS/Tailwind 등), 이미 설치된 애니메이션 라이브러리, 콘텐츠 파일(`src/content/works.ts`, `docs/SPEC.md`, 프로젝트 콘텐츠 md 폴더)을 확인한 뒤 그 컨벤션을 따르세요.
2. **현재 `/work/ai-search/` 페이지의 구성(PDF 슬라이드 이미지 나열 방식)은 무시하고 이 명세로 새로 만듭니다.** 단, 사이트 공통 헤더/푸터/네비게이션, 이전·다음 프로젝트 링크 같은 공통 요소는 유지하세요.
3. **새 의존성은 최소화.** 이미 쓰는 라이브러리가 있으면 그것을 쓰고, 없다면 CSS + `IntersectionObserver`로 먼저 해결하세요. 스크롤 연동 장면이 너무 복잡해지면 경량 라이브러리 하나(예: GSAP ScrollTrigger 또는 Motion) 도입을 제안하고 이유를 설명한 뒤 진행하세요.
4. **에셋은 아직 없습니다.** §6 Asset Manifest의 파일명으로 placeholder(회색 박스 + 파일명 + 설명 라벨)를 만들어 두고, 실제 파일이 들어오면 교체만 하면 되도록 구현하세요.
5. **숫자와 사실은 이 문서에 있는 것만 사용하세요.** 새로운 수치·인용·고객 발언을 만들지 마세요. 말풍선 문구는 §2의 연출용 예시만 사용합니다.
6. **카피를 임의로 다듬지 마세요.** 레이아웃상 너무 길면 바꾸지 말고 TODO로 표시해 보고하세요.
7. 작업 순서 제안: (1) 정적 레이아웃 + 전체 카피 → (2) 공통 컴포넌트 → (3) 섹션별 모션 → (4) 인터랙티브 2개 → (5) reduced-motion·모바일·성능 점검.

---

## 1. 목표와 스토리

- **목표**: 채용 담당자·디자인/PM 리더가 끝까지 스크롤하게 만드는 스토리텔링 케이스 스터디. 슬라이드 나열이 아니라 하나의 이야기.
- **독자**: 영어권 채용 담당자, 프로덕트·디자인 리더. 기술 세부는 원하는 사람만 펼쳐 보게.
- **핵심 장치 — "Follow one typo"**: 검색어 **`cabage`**(cabbage 오타)가 페이지 전체를 관통하는 주인공입니다.
  - Hero에서 실패 → 01에서 혼자 튕겨 나옴 → 04에서 좌절 → 07에서 처음 양배추를 찾음 → 08에서 시스템 경로를 따라 이동 → 12에서 장바구니에 담김.
  - 보조 등장 검색어 **`granma padano`**(Grana Padano 치즈 오타, 실제 쿼리 표기 그대로 사용): 04의 마지막 좌절 장면, 07A 데이터 소스 비교, 07B 데모에서 웃음 포인트.
- **스토리 아크 (5막)**

| 막 | 섹션 | 독자가 느껴야 할 것 |
| --- | --- | --- |
| Setup | Hero · 01 Context · 02 Impact · 03 R&R | 무엇을 해냈는지 먼저 안다 (스포일러) |
| Conflict | 04 User Problem · 05 Company's Problem | 고객도 회사도 막혔다 |
| Turn | 06 Define · 07 PoC Approach | 다시 만들지 않고 "덧붙이기"로 방향 전환. **07B가 페이지 클라이맥스** |
| Proof | 08 System Architecture · 09 A/B Test | 정말 안전하고, 정말 효과가 있다 |
| Payoff | 10 Integration · 11 Monitoring · 12 Business Impact | 스케일, 투명성, 매출 |

---

## 2. 전역 디자인 · 모션 규칙

### 2.1 레이아웃 공통
- **Chapter Nav**: 데스크톱에서 좌측 고정. 12개 섹션 이름(01 Context … 12 Business Impact) + 현재 위치 하이라이트 + 진행 바. 클릭 시 해당 섹션으로 스크롤. 모바일에서는 상단 얇은 진행 바만.
- **Section Header**: 작은 대문자 라벨(`01 CONTEXT`) + 헤드라인 1문장. 헤드라인만 훑어 내려도 이야기가 읽혀야 합니다.
- **Body**: 1인칭, 한 문단 2~3문장, 굵게 표시된 구절만 강조.
- **강조색**: 한 가지만. 성공·After·핵심 수치에만 사용. 실패/No Result는 채도를 뺀 회색 톤. 사이트에 이미 정의된 강조색이 있으면 그것을 우선 사용.
- 글씨체: 사이트 케이스 스터디 규칙을 따름. 헤드라인·숫자는 Aspekta(`font-display`), 본문은 Inter. Instrument Serif는 쓰지 않음.
- 카피에 em dash(—) 금지. en dash(–)는 날짜·숫자 범위에만.

### 2.2 모션 타입 (명세 전체에서 이 라벨을 사용)
| 라벨 | 의미 | 구현 가이드 |
| --- | --- | --- |
| `▶ Scroll scene` | 화면 일부를 sticky로 고정하고 스크롤 진행도에 따라 내용이 단계적으로 바뀜 | 섹션 높이 = 단계 수 × 약 80–100vh. 단계 전환 300–600ms, ease-out |
| `▶ Video` | 무음 자동재생 루프 화면 녹화 | `muted autoplay loop playsinline`, 포스터 이미지 필수, MP4+WebM, 10초 이내, 화면 밖이면 일시정지 |
| `▶ Interactive` | 독자가 직접 누르는 요소 | 페이지 전체에 **2개만**: 07B Query Demo, 08 Flow Diagram |
| `Count-up` | 숫자 카운트업 | 뷰포트 진입 시 1회, 800–1200ms |

### 2.3 접근성 · 성능
- `prefers-reduced-motion: reduce` → 모든 scroll scene은 **최종 상태의 정지 화면**으로, 영상은 포스터 이미지로, count-up은 최종값으로 즉시 표시.
- 모든 영상·이미지에 대체 텍스트. 인터랙티브는 키보드로 조작 가능(Tab/Enter/Space), 포커스 표시.
- 영상은 lazy load, 첫 화면(Hero) 영상만 우선 로드.
- 모바일(≤ 768px): sticky 장면은 세로로 쌓인 정적 단계로 풀어도 됩니다. 가로 스크롤 금지.
- 말풍선(이모지 + 문장)은 **실제 인터뷰 인용이 아닌 연출**입니다. 따옴표 인용 스타일과 구분되는 스타일(예: 이모지 + 이탤릭, 반투명 버블)로 표현하세요.

---

## 3. 공통 컴포넌트 제안

| 컴포넌트 | 쓰이는 곳 | 설명 |
| --- | --- | --- |
| `ChapterNav` | 전역 | §2.1 |
| `SectionHeader` | 모든 섹션 | label + headline |
| `StickyScene` | 01, 04, 05, 06, 09, 10, 11, 12 | 단계 배열을 받아 스크롤 진행도로 단계 전환 |
| `PhoneFrame` | Hero, 04, 07B, 09 | 휴대폰 프레임 안에 영상/이미지. 04와 07B는 **같은 크기·같은 위치**여야 함 (Before/After 대응) |
| `ThoughtBubble` | 04, 07B, 11 | 이모지 + 짧은 문장, 연출용 스타일 |
| `MetricCounter` | 02, 04, 09, 12 | from → to 또는 단일값, count-up |
| `ProcessStrip` | 06, 09, 10 | `Discover → Define → PoC → CEO Decision → Integration → Deliver`, 상태: done / current / upcoming. CEO Decision은 다이아몬드(게이트) 모양 |
| `QueryDemo` | 07B | §5.7 |
| `DataSourceShowdown` | 07A | §5.7 |
| `FlowDiagram` | 08 | §5.8 |
| `Expandable` | 06 KPI, 08 상세 아키텍처 | 접힘 기본 |

---

## 4. 페이지 구조 (위에서 아래로)

```
Hero
01 Context
02 Impact
03 R&R
04 User Problem
05 Company's Problem
06 Define
07 PoC Approach  (A: How it works / B: Try it yourself ← 클라이맥스)
08 System Architecture
09 A/B Test & Result
10 Improve & Integration
11 Monitoring
12 Business Impact
Outro
```

---

## 5. 섹션별 명세

각 섹션: **목적 → 카피(그대로 사용) → 미디어/모션 → 구현 메모**

### 5.0 Hero
- **목적**: "오타 하나가 매출을 날렸다"는 사건을 3초 만에 보여주고 스크롤을 유도.
- **Layout**: 좌측 텍스트, 우측 `PhoneFrame` 영상. 모바일은 영상이 위.
- **Copy**
  - Chips: `AI Transformation` · `Commerce` · `A/B Validated`
  - Headline: **AI Search: Recovering Lost Revenue**
  - Tagline: “Just type it out. We’ll find what you need.”
  - Body: On Kurly, one typo could end a shopping trip. I led an AI search that catches what the old engine missed, so every search can lead to a cart.
  - Meta row: `Period` May–Aug 2024 · `Role` AI Product Manager · `Team` AI PM (me), 1 ML Engineer, 1 Backend Engineer · `Org` Kurly
  - Scroll cue: Follow one typo ↓
- **Media**: `▶ Video` `hero-cabage-loop` (6초 루프): 검색창에 “cabage” 한 글자씩 타이핑 → “No products found” → 되감기듯 돌아감 → 양배추 상품들이 **Beta 라벨**과 함께 등장.

### 5.1 01 Context
- **목적**: 검색이 가장 중요한 매출 채널이라는 것 하나만.
- **Copy**
  - Label: `01 CONTEXT`
  - Headline: **Search Was Kurly’s Biggest Sales Channel**
  - Body: Kurly is Korea’s dawn-delivery unicorn with **3.5M monthly users**. For them, the search bar is the front door: it drives more revenue than any other part of the app.
- **Motion**: `▶ Scroll scene` — 중앙에 검색창 고정. 스크롤할수록 검색어 칩(`milk`, `strawberries`, `salmon` …)이 빗방울처럼 검색창으로 빨려 들어가 장바구니 아이콘으로 바뀜. 마지막 `cabage` 칩만 회색으로 튕겨 나가며 다음 섹션을 예고.
- **메모**: 칩 검색어는 일반 식료품 예시이며 실제 데이터라고 표기하지 않습니다.

### 5.2 02 Impact
- **목적**: 결과 스포일러 + 외부 검증(Google).
- **Copy**
  - Label: `02 IMPACT`
  - Headline: **From Dead Ends to Discoveries**
  - Metrics (`MetricCounter`, count-up):
    1. **6.80% → 0.22%** · No-Result Search Rate
    2. **58.60% → 60.14%** · Search Click-Through Rate
    3. **₩5B (~$3.6M)** · New Monthly Revenue from Former Dead Ends
  - Google card (4번째, 더 넓은 카드):
    - Title: **Featured at Google Cloud Summit Seoul 2024**
    - Body: Google selected this project as a leading enterprise case of AI innovation on GCP. Kurly’s CEO presented it on stage, and I built the presentation.
    - CTA: Watch the talk → `https://youtu.be/qv0YMg7kwuM?si=km0mZKGjRI3rPVdX&t=2333`
  - Sub line: Live in production 2 months after the PoC.
- **Media**: `▶ Video` `summit-stage-clip` (무대 장면 5초 무음 루프). 카드 클릭 시 YouTube 타임스탬프로 새 탭.

### 5.3 03 R&R
- **Copy**
  - Label: `03 R&R`
  - Headline: **A Three-Person Team, a Company-Wide Change**
  - Card 1 · Strategy: Defined the problem and set the project scope. Proposed a simple rule: **AI steps in only when the old search finds nothing**, so we could ship without touching what already worked. Pitched the plan to the CEO and won approval for the rollout.
  - Card 2 · Execution: Designed the system architecture with the engineers, built a demo page to choose the right data source, wrote the data schema, designed the A/B test and KPIs, designed and built the monitoring dashboard, and led QA through launch.
  - Card 3 · UX: Designed the **“Beta” notice** that tells shoppers which results come from AI, so a new kind of result felt honest, not confusing.
  - Card 4 · Alignment: Kept the CEO, search engineering, merchandising and marketing teams, and Google Cloud on the same page.
  - Team line: AI PM (me) · 1 ML Engineer · 1 Backend Engineer
- **Motion**: 카드 4개가 차례로 진입. UX 카드가 나타날 때 실제 검색 결과 화면 위에 Beta 라벨이 "톡" 붙는 짧은 모션(`beta-label-ui`).
- **메모**: 카드마다 아이콘 대신 산출물 썸네일 사용(아키텍처 도 `arch-thumb`, 대시보드 `dashboard-thumb`, Beta UI `beta-label-ui`, 정렬 카드는 아이콘 허용).

### 5.4 04 User Problem
- **목적**: 나쁜 검색 경험의 Before. 예시 목록이 아니라 **한 고객의 좌절 여정**.
- **Copy**
  - Hook (단독 화면, 큰 헤드라인): They knew exactly what they wanted. Search told them it didn’t exist.
  - Label: `04 USER PROBLEM`
  - Headline: **Shoppers Were Punished for Tiny Mistakes**
  - Body: The old engine only accepted exact matches. A typo, an extra space, or a different word for the same thing meant **an empty page**. Shoppers had to guess the “right” spelling, try again, or simply leave.
- **Motion**: `▶ Scroll scene` — `PhoneFrame` 고정, 4단계. 단계마다 검색어 타이핑 → 매번 “No products found”. 옆 `ThoughtBubble`이 점점 지쳐감.

| Step | Type | Query | Bubble |
| --- | --- | --- | --- |
| 1 | Misspelling | `cabage` | 🤔 Huh, no cabbage today? |
| 2 | Spacing | `ca bbage` | 😕 Maybe I typed it wrong… |
| 3 | Synonym | `lettuce` | 😤 I know you sell this. |
| 4 | Foreign word | `granma padano` | 🙄 Forget it. → 앱 화면이 닫히는 모션 |

  - Closing stat (큰 숫자): In these searches, only **3.83%** of shoppers clicked anything.
    - 작은 주석: Control group of the A/B test, No-Result searches.
  - Kicker: The shopper wasn’t wrong. **The search engine was too strict.**
- **메모**: Step 3의 의미는 "같은 상품이 다른 이름으로 등록되어 못 찾음". 07B에서 **같은 프레임, 같은 위치**로 After가 나옵니다.

### 5.5 05 Company's Problem
- **목적**: "고쳐야 하는데, 고칠 사람이 없다"는 딜레마. 해법은 섞지 않음.
- **Copy**
  - Label: `05 COMPANY’S PROBLEM`
  - Headline: **A Leak Everyone Saw, and No One Could Fix**
  - Part A · The leak: Every day, **6–7% of searches** hit a dead end. Each one cost us twice: a frustrated shopper, and a sale lost on our biggest revenue channel.
  - Part B · The bottleneck: Everyone knew the search engine needed a rebuild. But the search team had **no capacity to spare**, so the fix kept getting pushed back with no date in sight.
  - Kicker: We couldn’t wait for a new engine. So I asked a different question. ↓
- **Motion**
  - Part A `▶ Scroll scene`: `Search Request → Legacy Exact-Match Engine → Daily Leakage → Dual Negative Impact` 파이프라인. 검색어 알갱이가 흐르다 일부가 새어 나가 바닥에 회색 동전으로 쌓임. 01의 `cabage`도 여기 있음.
  - Part B `▶ Scroll scene`: 로드맵 위 “Search Engine Rebuild” 카드가 스크롤할수록 오른쪽으로 밀려나 화면 밖으로 사라짐.

### 5.6 06 Define
- **목적**: 질문 → 반전 → 규칙. 하나의 sticky 장면, 3단계, 화면 약 3개 분량. 길어지지 않게.
- **Copy & Motion** (`▶ Scroll scene`, 3 steps)
  - Label: `06 DEFINE`
  - Step 1 (질문): How might we turn “No Results” into results, **without rebuilding the search engine**?
    - 모션: 문장 전체 표시 → 스크롤하면 “without rebuilding the search engine”만 밝게, 나머지는 흐려짐.
  - Step 2 (반전): The opening: Kurly’s whole catalog already lived on **Google Cloud** (BigQuery, Vertex AI). We didn’t need a new engine. We could **add an AI layer** on top.
    - 모션: 막힌 벽 옆으로 GCP 아이콘들이 길을 이음. “Rebuild”에 취소선 → “Add”로 교체.
  - Step 3 (규칙): Three rules the AI had to follow:
    - **Only on failure** · AI runs only when the old search finds nothing.
    - **Same business rules** · Every AI result respects Kurly’s business and inventory policies.
    - **Narrow scope first** · Typos, spacing, and synonyms only.
  - `ProcessStrip` (섹션 하단, 얇게): 현재 = Define.
  - `Expandable` · How we’d measure success:
    - Shopper — No-Result Rate, Click-Through Rate, Add-to-Cart Rate, Purchase Rate
    - Business — Cart Value, Purchase Value, Revenue per Search, Profit Margin, AI API Cost

### 5.7 07 PoC Approach

#### Part A · How it works
- **Copy**
  - Label: `07 POC APPROACH`
  - Headline: **Teaching Search to Understand, Not Just Match**
  - Card 1 · Engine: Vertex AI Search blends text matching with **meaning-based (embedding) search**, and plugs straight into the data Kurly already had.
  - Card 2 · Data (핵심 결정, 가장 크게): **Crawl the website, or feed it clean data?**
    - Body: The fastest route was letting the AI crawl Kurly’s product pages. But we couldn’t control what a crawler would pick up, and messy data means unreliable results. Instead of guessing, I built a **quick demo page** that showed three results side by side for any query: today’s Kurly search, web-crawled data, and our own **structured product data** from BigQuery. Structured data won clearly, so we built on it.
    - Schema (작게): Title, description, sales status, related keywords and more, each set as searchable, indexable, or retrievable.
  - Card 3 · Tuning: We fine-tuned the model with query-product pairs from Kurly’s own collections, so it learned **how Kurly shoppers talk**.
- **`DataSourceShowdown`** (`▶ Video` 또는 정적 3열 재현)
  - 입력창에 `granma padano` → 3열 동시 표시: `Kurly search`(빈 결과) | `Web crawling`(덜 정확한 결과) | `Structured data`(치즈가 정확히 나옴).
  - 오른쪽 열에만 **Winner** 하이라이트(강조색 테두리 + 라벨).
  - 에셋: `datasource-showdown` (Gradio 데모 녹화). 없으면 3열 placeholder 카드로 구현.

#### Part B · Try it yourself (페이지 클라이맥스)
- **Copy**
  - Headline: **Same Typos. This Time, Real Results.**
  - Caption: Qualitative checks showed clearly better results for all five query types. That was enough to ask for a full A/B test.
- **`QueryDemo`** (`▶ Interactive`)
  - 04와 **같은 `PhoneFrame` 크기·위치**. 위에 검색어 칩 5개.
  - 칩 클릭 → 검색어 타이핑 → Before(“No products found”)가 0.5초 보였다가 → After(AI 결과 + Beta 라벨)로 전환.
  - 구현: 칩마다 미리 녹화한 영상 1개를 교체 재생하는 방식이면 충분.
  - 데이터:

```json
[
  { "id": "misspelling", "label": "cabage",        "type": "Misspelling",  "video": "demo-cabage",        "bubble": "😊 There it is." },
  { "id": "spacing",     "label": "ca bbage",      "type": "Spacing",      "video": "demo-ca-bbage",      "bubble": "😊 There it is." },
  { "id": "synonym",     "label": "lettuce",       "type": "Synonym",      "video": "demo-lettuce",       "bubble": "😮 Oh, that’s what it’s called." },
  { "id": "foreign",     "label": "granma padano", "type": "Foreign word", "video": "demo-granma-padano", "bubble": "😮 Oh, that’s what it’s called." },
  { "id": "contextual",  "label": "TODO",          "type": "Contextual",   "video": "demo-contextual",    "bubble": "😊 There it is." }
]
```

  - 기본 선택: `cabage`. 키보드 접근 가능(칩 = 버튼 그룹, `aria-pressed`).
  - `contextual` 칩의 검색어는 미정(TODO) — 확정 전까지 칩을 숨기거나 비활성 처리.

### 5.8 08 System Architecture
- **목적**: "기존 검색을 건드리지 않았다".
- **Copy**
  - Label: `08 SYSTEM ARCHITECTURE`
  - Headline: **AI Only Steps In When Search Fails**
  - Body: Every search still goes to the old engine first. Only an empty result calls the AI, after two quick checks. If the AI also finds nothing, or responds too slowly, the shopper sees the original screen. **Nothing breaks if the AI is down.**
  - `Expandable` · See the full architecture → `arch-vertex-full`, `arch-sequence` 이미지 (라이트박스)
- **`FlowDiagram`** (`▶ Interactive`, SVG)
  - 토글: `milk` / `cabage`. 선택한 검색어가 점이 되어 경로를 따라 이동.
  - `milk`: Results found? → **yes** → Show legacy results (끝)
  - `cabage`: 아래까지 내려가 강조색 박스 **AI Search Result view**에 도착.
  - 노드와 엣지 (정확히 이대로):

```
N1  Search request
N2  Legacy search (exact match)
D1  Results found?                 (diamond)
N3  Show legacy results            (D1 yes → N3)
N4  Multi-section result check     (D1 no / "No Result" → N4)
N5  Blocklisted query check
N6  Call Vertex AI Search API
D2  AI results ≥ 1?                (diamond)
N7  Legacy No-Result view          (D2 no → N7)
N8  AI Search Result view          (D2 yes → N8, 강조색)

Edges: N1→N2→D1, D1→N3 (yes), D1→N4 (no), N4→N5→N6→D2, D2→N7 (no), D2→N8 (yes)
Layout: 메인 경로 세로 1열(N1…N8), N3와 N7은 오른쪽 열
```

  - reduced-motion: 점 이동 없이 선택 경로만 하이라이트.

### 5.9 09 A/B Test & Result
- **Copy**
  - Label: `09 A/B TEST`
  - Headline: **Would Shoppers Actually Click on AI Results?**
  - Hypothesis: AI search will turn No-Result moments into meaningful results and lift search conversion.
  - Setup chips: All customers (3.5M MAU) · 50 / 50 split · 2 weeks
  - Result headline: **Hypothesis Validated, Across Every KPI**
  - Caption: Shoppers who used to hit an empty page clicked **about 7x more often**. The CEO approved full integration.
- **Media**: `▶ Video` `ab-split-screen` — 왼쪽 Control(“No products found”), 오른쪽 Experiment(AI 결과), 같은 검색어 동시 입력.
- **Motion**: `▶ Scroll scene` (줌아웃 2단계)
  1. No-Result 검색만 크게: CTR **3.83% → 26.50%** (04의 3.83%를 여기서 회수하는 것이 포인트)
  2. 줌아웃하며 전체 표 등장
- **표 (정확히 이 값)**

| Scope | Metric | Control | AI Search |
| --- | --- | --- | --- |
| No-Result searches | Click-Through Rate | 3.83% | **26.50%** |
| No-Result searches | No-Result Rate | 99.98% | **2.93%** |
| All searches | Click-Through Rate | 58.60% | **60.14%** |
| All searches | No-Result Rate | 6.80% | **0.22%** |

- `ProcessStrip`: PoC = done, CEO Decision = current → 섹션 끝에서 done.

### 5.10 10 Improve & Integration
- **목적**: PoC를 실제 제품으로. 12의 “−30%” 근거. 한 장면으로 압축.
- **Copy**
  - Label: `10 INTEGRATION`
  - Headline: **Built for Millions, and for the Bill**
  - Body: A test can afford surprises; production can’t. I led the build of a **proxy server** between Kurly and Vertex AI that decides when the AI is worth calling.
  - Cards:
    - **Block** · Filters unlisted brands, profanity, medical terms, and abnormal or malicious queries.
    - **Fall back** · A circuit breaker shows the original screen if the AI is too slow.
    - **Reuse** · Caches results per keyword for 12 hours, cutting repeat AI calls by **up to 30%**.
- **Motion**: `▶ Scroll scene` — 검색어 점들이 프록시 서버로 들어와 일부는 캐시에서 바로 반환, 일부는 블록리스트에서 멈춤, 나머지만 Vertex AI로. 우측 상단 “AI calls” 카운터가 덜 올라감. (비율은 연출용이며 수치로 표기하지 않음)
- `ProcessStrip`: Integration = current.

### 5.11 11 Monitoring
- **Copy**
  - Label: `11 MONITORING`
  - Headline: **Everyone Could See What AI Search Was Doing**
  - Part A · Transparency: During the A/B test and rollout, I didn’t want results hiding in a PM’s slides. I designed and built a **Looker dashboard** so the CEO, engineers, and business teams could all watch the same numbers in real time.
    - Panels: Daily AI Search Stats · Top AI Queries · Caching Rate · Anomaly Search Rate
  - Part B · A window into demand: Failed searches are customers telling us what they want. A daily **Slack bot** sends merchandisers and marketers the search queries losing the most clicks, so they can **spot new trends and unmet demand** fast.
- **Media**
  - Part A: `▶ Video` `dashboard-pan` (대시보드 천천히 패닝, 내부 숫자 블러).
  - Part B: `▶ Scroll scene` — `slack-bot` 메시지가 알림처럼 뜨고, 아래로 `ThoughtBubble` 🧐 Why is everyone searching for this? (연출용)

### 5.12 12 Business Impact
- **목적**: 02의 숫자를 다시, "그래서 회사에 무엇이 남았나"로 마무리. 대시보드 언급 없음.
- **Motion (오프닝)**: `▶ Scroll scene` — Hero의 `cabage`가 마지막으로 등장 → 양배추가 장바구니에 톡 담기고 → 장바구니 아이콘이 매출 카운터로 변신.
- **Copy**
  - Label: `12 BUSINESS IMPACT`
  - Headline: **One Typo at a Time, ₩5B a Month**
  - Hero number (가장 크게, count-up): **₩5B (~$3.6M)** · New monthly revenue from searches that used to end in nothing
  - Supporting metrics (한 줄 4개):
    - **6.80% → 0.22%** · No-Result Rate
    - **58.60% → 60.14%** · Search Click-Through Rate
    - **−30%** · AI Search Operating Cost vs. Pilot
    - **2 months** · From PoC to Full Production
  - Closing band · **Google Cloud Summit Seoul 2024**: Google featured this project as a leading enterprise case of AI on GCP. Kurly’s CEO told the story on stage, and I built the presentation. — 버튼: Watch the talk
- **Visual**: 배경에 상승 곡선 하나, 스크롤에 맞춰 그려짐(SVG stroke-dashoffset). 02에서는 짧은 영상, 여기서는 무대 사진(`summit-stage-photo`) 가로 전체 띠 + 링크로 변주.
- **TODO**: ₩5B 아래 측정 범위 주석 한 줄(문구 확정 전까지 비워 둠).

### 5.13 Outro
- Reflection (선택, 2문장, **문구 TODO** — 작성자 확정 전까지 숨김)
- Related links:
  - Kurly Tech Blog → `https://helloworld.kurly.com/blog/vertex-ai-search-nr/`
  - Google Cloud Summit 2024 talk → `https://youtu.be/qv0YMg7kwuM?si=km0mZKGjRI3rPVdX&t=2333`
  - PDF version → 기존 사이트의 PDF 경로 재사용
- 이전·다음 프로젝트: 사이트 공통 하단 내비게이션(기존 순서)만 사용. Outro에 별도 다음 편 카드는 두지 않음.

---

## 6. Asset Manifest

에셋 폴더는 레포 컨벤션을 따르세요(예: `public/images/ai-search/`, `public/videos/ai-search/`). 아래 id로 파일명을 만들고, 없으면 placeholder를 표시합니다.

| id | 종류 | 사용 섹션 | 내용 | 상태 |
| --- | --- | --- | --- | --- |
| `hero-cabage-loop` | video + poster | Hero | cabage 타이핑 → No result → AI 결과 + Beta | 녹화 필요 |
| `summit-stage-clip` | video + poster | 02 | 발표 영상 무대 5초 (발표자: Kurly CEO, 발표 자료는 본인 제작) | 추출 필요 |
| `summit-stage-photo` | image | 12 | 무대 사진 | 보유(PDF) |
| `beta-label-ui` | image | 03, 07B | Beta 안내 UI 스크린샷 | 확보 필요 |
| `arch-thumb` | image | 03 | 아키텍처 썸네일 | PDF p.26 |
| `dashboard-thumb` | image | 03 | 대시보드 썸네일 | PDF p.27 |
| `nr-cabage`, `nr-ca-bbage`, `nr-lettuce`, `nr-granma-padano` | image or video | 04 | 각 검색어의 No result 화면 | 녹화/재현 필요 |
| `datasource-showdown` | video + poster | 07A | Gradio 3열 비교 (granma padano) | 녹화/재현 필요 |
| `demo-cabage`, `demo-ca-bbage`, `demo-lettuce`, `demo-granma-padano`, `demo-contextual` | video + poster | 07B | Before → After 전환 | 녹화 필요 |
| `arch-vertex-full`, `arch-sequence` | image | 08 (expandable) | 상세 아키텍처·시퀀스 | PDF p.26 |
| `ab-split-screen` | video + poster | 09 | Control vs Experiment | 녹화/재현 필요 |
| `dashboard-pan` | video + poster | 11 | Looker 대시보드 패닝(숫자 블러) | 녹화 필요 |
| `slack-bot` | image | 11 | 트렌드 슬랙봇 메시지 | PDF p.27 |

---

## 7. 수치와 출처 (이 값 외 사용 금지)

| 수치 | 의미 | 출처 |
| --- | --- | --- |
| 3.5M | Kurly MAU | 프로젝트 콘텐츠 md |
| 6–7% | 하루 검색 중 No Result 비율 (프로젝트 이전) | md, Kurly 기술 블로그 |
| 6.80% → 0.22% | 전체 검색 No-Result Rate (A/B Control → AI) | md |
| 58.60% → 60.14% | 전체 검색 CTR | md |
| 3.83% → 26.50% | No-Result 검색 CTR | md |
| 99.98% → 2.93% | No-Result 검색 내 NRR | md |
| about 7x | 26.50 ÷ 3.83 ≈ 6.9 | 계산 |
| ₩5B (~$3.6M) | 이전 No-Result 검색에서 나온 월 신규 매출 | suyoungkwon.com/work/ai-search 10s Summary (작성자 확정) |
| −30% / up to 30% | 프록시 캐싱으로 줄인 AI 호출·운영비 (파일럿 대비) | md, CV |
| 12 hours | 키워드별 캐시 유지 시간 | md |
| 2 months | PoC → 전체 적용 | md |
| 2 weeks, 50/50 | A/B 기간·분할 | md |
| May–Aug 2024 | 프로젝트 기간 | md (작성자 확정) |

**사용 금지**: 174x revenue lift, 35.52x ROI (작성자가 과장으로 판단해 퇴역). +17,357% 등 퍼센트 성장률은 이 페이지에 쓰지 않습니다.

---

## 8. 완료 기준 (Acceptance Criteria)

- [ ] 모든 섹션 카피가 이 문서와 글자 단위로 일치 (TODO 제외)
- [ ] Chapter Nav가 현재 섹션을 정확히 표시, 클릭 이동 동작
- [ ] 04와 07B의 `PhoneFrame` 크기·위치가 동일해 Before/After가 대응됨
- [ ] `QueryDemo`, `FlowDiagram` 키보드 조작 가능
- [ ] `prefers-reduced-motion`에서 모든 모션이 정지 상태 최종 화면으로 대체
- [ ] 모바일 375px에서 가로 스크롤 없음, 모든 텍스트 가독
- [ ] 영상 lazy load, 화면 밖 일시정지, 포스터 표시
- [ ] 에셋 미보유 항목은 id가 적힌 placeholder로 표시
- [ ] Lighthouse 성능·접근성 점수 확인 후 결과 보고
- [ ] 작업 완료 시 TODO 목록과 미확보 에셋 목록을 요약 보고

## 9. 미정 사항 (TODO)

1. `contextual` 데모 검색어 (PDF p.26 정성 검증 예시에서 선택 예정)
2. Outro reflection 문구
3. ₩5B 측정 범위 주석 문구
4. 모든 녹화 에셋 (§6)
