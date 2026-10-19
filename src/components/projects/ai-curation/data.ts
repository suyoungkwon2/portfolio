// Themes and products for the AI Curation case study
// (docs/projects/ai-curation-web-spec.md). Product photos are cropped from
// the real Kurly campaign screens in the portfolio PDF; names are shortened
// English versions of their listings, prices as on the app.

const DIR = "/images/ai-curation/products";

export type Product = {
  id: string;
  src?: string;
  // Stand-in tile when there's no photo.
  emoji?: string;
  name: string;
  price: string;
  category: Category;
};

export const CATEGORIES = ["Snacks", "Desserts", "Drinks", "Bakery", "Ice Cream"] as const;
export type Category = (typeof CATEGORIES)[number];

const p = (
  id: string,
  name: string,
  price: string,
  category: Category,
  extra: Partial<Product> = {},
): Product => ({ id, src: `${DIR}/${id}.webp`, name, price, category, ...extra });

export const PRODUCTS = {
  snack: [
    p("snack-1", "Rice Cake Squares, 2 Kinds", "₩12,150", "Desserts"),
    p("snack-2", "[Leesungdang] Red Bean Walnut Mochi, 10 pcs", "₩17,500", "Desserts"),
    p("snack-3", "[Brown Nut] Real Almond Bread, 350 g", "₩6,900", "Bakery"),
    p("snack-4", "[Samlip] Matcha Milk Cream Bun, 3 pcs", "₩4,950", "Bakery"),
    p("snack-5", "Toast for Cheese Crackers", "₩8,900", "Snacks"),
    p("snack-6", "Milk Mochi, 6 pcs", "₩9,800", "Desserts"),
  ],
  chinese: [
    p("chinese-1", "[Mokran] Jjamppong for Two", "₩13,775", "Snacks"),
    p("chinese-2", "[Mokran] Jjajangmyeon for Two", "₩9,281", "Snacks"),
    p("chinese-3", "[Nibong Naebong] Cream Jjamppong", "₩8,900", "Snacks"),
    p("chinese-4", "[Mokran] White Jjamppong for Two", "₩14,500", "Snacks"),
    p("chinese-5", "Spicy Seafood Noodle Soup", "₩10,900", "Snacks"),
    p("chinese-6", "Mala Noodles, 2 Kinds", "₩11,800", "Snacks"),
  ],
  matcha: [
    p("matcha-1", "[Teazen] Brown Rice Matcha Tea, 10 sticks", "₩9,900", "Drinks"),
    p("matcha-2", "Black Sesame Matcha Injeolmi, 7 pcs", "₩12,900", "Desserts"),
    p("matcha-3", "[Namyang] Matcha Latte Milk, 190 mL × 24", "₩25,340", "Drinks"),
    p("matcha-4", "[Häagen-Dazs] Green Tea Pint Collection", "₩11,900", "Ice Cream"),
    p("matcha-5", "Japanese Matcha Candy Mix", "₩8,500", "Snacks"),
    p("matcha-6", "Matcha Wafer Cookies", "₩6,900", "Snacks"),
  ],
  yearend: [
    p("yearend-1", "[Paul] Christmas Stollen, 350 g", "₩35,100", "Bakery"),
    p("yearend-2", "Christmas Stollen, 465 g", "₩29,700", "Bakery"),
    p("yearend-3", "[Bread Time] Pandoro, 130 g", "₩8,910", "Bakery"),
    p("yearend-4", "[Knotted] Cream Donuts, 7 Kinds", "₩9,000", "Desserts"),
    p("yearend-5", "Gingerbread Cookie Box", "₩15,900", "Snacks"),
    p("yearend-6", "Egg Tarts, 4 pcs", "₩12,500", "Desserts"),
  ],
} satisfies Record<string, Product[]>;

export type Theme = { emoji: string; title: string; products: Product[] };

// The page's hero object is MATCHA: it's typed in the hero, searched in 08,
// judged in 09, added to the sheet in 12 and goes live on the homepage.
export const MATCHA: Theme = {
  emoji: "🍵",
  title: "Matcha Core: Trending Now",
  products: PRODUCTS.matcha,
};
export const SNACK: Theme = {
  emoji: "🍫",
  title: "The Ultimate Snack Drop",
  products: PRODUCTS.snack,
};
export const CHINESE: Theme = {
  emoji: "🔥",
  title: "Spicy Chinese Takeout Vibe",
  products: PRODUCTS.chinese,
};
export const YEAR_END: Theme = {
  emoji: "🎄",
  title: "The Sweetest Year-End Vibe",
  products: PRODUCTS.yearend,
};
// The campaign that stopped being looked after (01, 04, 05).
export const HOLIDAY: Theme = {
  emoji: "🎄",
  title: "Aesthetic Holiday Prep is On",
  products: PRODUCTS.yearend,
};

// The hero's title list, in the order they're typed: matcha last.
export const HERO_THEMES = [SNACK, CHINESE, YEAR_END, MATCHA];

// The Copilot's sites. Selecting a site with no sub-category searches all of
// it (Beta 2.1); Kurly Now was added in 2.2.
export const SITES = ["Market", "Beauty", "Now"] as const;
export type Site = (typeof SITES)[number];
export const SITE_CATEGORIES: Record<Site, readonly string[]> = {
  Market: CATEGORIES,
  Beauty: ["Skincare", "Makeup", "Hair & Body", "Fragrance"],
  Now: CATEGORIES,
};

// The columns behind each 08 result row, after the Copilot's real result
// table (user manual): sales and GMV are weekly averages over the last two
// weeks, “In campaign” names another live campaign the product is already in.
export type CopilotDetail = {
  listPrice: number;
  sales: number;
  stock: number;
  // Content GMV covers every deal under the content, so it's ≥ the deal's.
  contentDeals: number;
  campaign: string;
  supplier: string;
  released: string;
  master: string;
  deal: string;
  content: string;
  // Also sold on Kurly Now.
  now: boolean;
};
export type CopilotRow = Product & CopilotDetail;

// One row from Kurly's own search for 말차 (matcha), in its order: photo,
// name, price and list price as listed (October 2026), names in English.
// Sales, stock, codes, dates and campaigns are illustrative; the supplier
// stands in with the brand.
const k = (
  no: number,
  name: string,
  price: number,
  listPrice: number,
  category: Category,
  supplier: string,
  sales: number,
  stock: number,
  released: string,
  now: boolean,
  { campaign = "", contentDeals = 1 }: { campaign?: string; contentDeals?: number } = {},
): CopilotRow => ({
  id: `kurly-${no}`,
  src: `${DIR}/kurly-${no}.webp`,
  name,
  price: `₩${price.toLocaleString("en-US")}`,
  category,
  listPrice,
  sales,
  stock,
  contentDeals,
  campaign,
  supplier,
  released,
  master: `MK${String(no % 1e7).padStart(10, "0")}`,
  deal: String(11e6 + (no % 1e6)),
  content: String(no),
  now,
});

// 08's Copilot results for “Matcha Core: Trending Now”.
export const COPILOT_RESULTS: CopilotRow[] = [
  k(
    5097763,
    "[Osulloc] Organic Premium Matcha, 40 g",
    23000,
    23000,
    "Drinks",
    "Osulloc",
    418,
    1260,
    "2021-11-17",
    true,
    { contentDeals: 1.3 },
  ),
  k(
    1000812428,
    "[Super Matcha] Ceremonial Organic Sweet Matcha Zero",
    11900,
    12900,
    "Drinks",
    "Super Matcha",
    236,
    880,
    "2022-07-05",
    true,
    { campaign: "Zero Sugar, Full Flavor" },
  ),
  k(
    1000812431,
    "[Super Matcha] Ceremonial Organic Pure Matcha",
    13800,
    14900,
    "Drinks",
    "Super Matcha",
    352,
    940,
    "2022-07-05",
    false,
  ),
  k(
    5052090,
    "[Hora] Jeju Matcha Powder, 300 g",
    7900,
    7900,
    "Drinks",
    "Hora",
    611,
    1720,
    "2020-05-08",
    true,
    { campaign: "Home Café Basics" },
  ),
  k(
    1001618200,
    "[Magpie & Tiger] Matcha, 40 g, 3 Kinds",
    23000,
    23000,
    "Drinks",
    "Magpie & Tiger",
    94,
    310,
    "2024-01-22",
    false,
    { contentDeals: 1.5 },
  ),
  k(
    1000958551,
    "[Market O] Matcha Brownie, 240 g",
    5010,
    5280,
    "Bakery",
    "Market O",
    1240,
    2380,
    "2022-09-14",
    true,
  ),
  k(
    1001920577,
    "[Super Matcha] Latte Sticks, 20 g × 8",
    10100,
    10900,
    "Drinks",
    "Super Matcha",
    128,
    460,
    "2025-02-18",
    false,
    { campaign: "Home Café Basics" },
  ),
  k(
    1002071360,
    "[Lotte] Binch Premier Matcha, 204 g",
    5350,
    5950,
    "Snacks",
    "Lotte Wellfood",
    486,
    1530,
    "2025-05-27",
    true,
  ),
  k(
    1001382646,
    "[Orion] Choco Pie Matcha Chocolat, 408 g",
    4800,
    4800,
    "Snacks",
    "Orion",
    732,
    2010,
    "2023-06-12",
    true,
    { campaign: "Snack Drawer Refill" },
  ),
  k(
    1001599390,
    "[Orion] Choco Songi Matcha Cake, 144 g",
    2720,
    2720,
    "Snacks",
    "Orion",
    547,
    1640,
    "2024-02-26",
    false,
  ),
  k(
    1001733621,
    "[Jardin] Ceremonial Matcha, 3 Kinds",
    8400,
    12900,
    "Drinks",
    "Jardin",
    203,
    720,
    "2024-07-08",
    false,
    { contentDeals: 1.4 },
  ),
  k(
    1001762237,
    "[Binggrae] Bungeo Ssamanco Matcha, 150 mL × 5",
    7000,
    7000,
    "Ice Cream",
    "Binggrae",
    389,
    980,
    "2024-08-19",
    true,
    { campaign: "Summer Ice Cream Week" },
  ),
  k(
    1002071356,
    "[Lotte] Ghana Premium Langue de Chat Matcha, 91 g",
    4080,
    4080,
    "Snacks",
    "Lotte Wellfood",
    264,
    1110,
    "2025-05-27",
    false,
  ),
  k(
    1001584220,
    "[Namyang] Matcha-emong, 2 Kinds",
    4980,
    5680,
    "Drinks",
    "Namyang Dairy Products",
    455,
    1380,
    "2024-01-30",
    true,
    { contentDeals: 1.2 },
  ),
  k(
    1002450808,
    "[Baekmidang] Matcha Ice Cream Mini Cups, 90 mL × 3",
    8900,
    11700,
    "Ice Cream",
    "Baekmidang",
    172,
    540,
    "2026-03-09",
    false,
  ),
  k(
    1002529756,
    "[Crown] Matcha Heim First Leaf Edition, 284 g",
    6990,
    6990,
    "Snacks",
    "Crown Confectionery",
    96,
    820,
    "2026-08-04",
    false,
  ),
  k(
    1002098864,
    "[Languly] Uji Matcha Cream Sandwich, 127.2 g",
    4030,
    4480,
    "Snacks",
    "Languly",
    318,
    760,
    "2025-07-14",
    false,
  ),
  k(
    1001591012,
    "[Neighbor Tongtong] Matcha Choco Chewy Bread, 180 g",
    5500,
    5500,
    "Bakery",
    "Neighbor Tongtong",
    684,
    1150,
    "2023-12-04",
    true,
    { campaign: "Bakery Picks for Breakfast" },
  ),
  k(
    1002185948,
    "[Knotted] Matcha Latte Roll Cake, 390 g",
    20900,
    20900,
    "Desserts",
    "Knotted",
    87,
    140,
    "2025-10-20",
    false,
  ),
  k(
    1001733667,
    "[YOZM] Low-Sugar Matcha Greek Yogurt, 100 g",
    4050,
    4500,
    "Desserts",
    "YOZM",
    1020,
    1890,
    "2024-07-08",
    true,
    { campaign: "Zero Sugar, Full Flavor" },
  ),
  k(
    1002096106,
    "[Lotte] ABC Choco Cookie Matcha, 130 g",
    5100,
    5100,
    "Snacks",
    "Lotte Wellfood",
    241,
    930,
    "2025-06-30",
    false,
  ),
  k(
    1001626480,
    "[Tealicious] Rooibos Matcha Milk Tea, 500 mL",
    7500,
    7500,
    "Drinks",
    "Tealicious",
    146,
    220,
    "2024-03-25",
    false,
  ),
  k(
    1001968214,
    "[Nokchawon] Jeju Matcha Latte, 18 g × 10",
    6990,
    6990,
    "Drinks",
    "Nokchawon",
    274,
    1060,
    "2025-03-31",
    false,
  ),
  k(
    1002158458,
    "[Dailyon] Matcha Latte Enzyme & Probiotics, 30 Sticks",
    10900,
    30000,
    "Drinks",
    "Dailyon",
    66,
    480,
    "2025-09-08",
    false,
  ),
  k(
    5054498,
    "[HBAF] Jeju Matcha Almonds, 190 g",
    6990,
    7990,
    "Snacks",
    "HBAF",
    593,
    1470,
    "2021-12-27",
    true,
  ),
  k(
    1002070553,
    "[Orion] Topping Matcha Blossom, 43 g",
    1440,
    1440,
    "Snacks",
    "Orion",
    431,
    1300,
    "2025-05-26",
    false,
  ),
  k(
    1001449240,
    "[Lotte Wellfood] Matcha Ice Cream, 160 mL, 2 Kinds",
    1400,
    1400,
    "Ice Cream",
    "Lotte Wellfood",
    808,
    2600,
    "2023-08-21",
    true,
    { contentDeals: 1.6 },
  ),
  k(
    1000951588,
    "[Super Matcha] Ceremony Set: Pocket, Whisk and Bowl",
    75900,
    75900,
    "Drinks",
    "Super Matcha",
    21,
    60,
    "2022-10-11",
    false,
  ),
  k(
    1002129158,
    "[Osulloc] Matcha Plus, 5 g × 10, 3 Kinds",
    12000,
    12000,
    "Drinks",
    "Osulloc",
    117,
    390,
    "2025-08-11",
    false,
    { contentDeals: 1.3 },
  ),
  k(
    1001031993,
    "[Super Matcha] Ceremonial Matcha Pocket Gift Set",
    36100,
    38900,
    "Drinks",
    "Super Matcha",
    39,
    150,
    "2023-01-16",
    false,
  ),
];

// The homepage feed (04 and 12), after Kurly's app: each campaign is a
// titled row of product cards.
export type HomeItem = {
  id: string;
  src?: string;
  emoji?: string;
  name: string;
  price: string;
  // Struck-through list price and the discount, when on sale.
  was?: string;
  off?: string;
  coupon?: string;
};
export type HomeSection = { title: string; sub: string; items: HomeItem[] };

const APP = "/images/ai-curation/app";

// 04's homepage, as it stood for weeks: the same three campaigns.
export const STALE_SECTIONS: HomeSection[] = [
  {
    title: "Enjoy lightly with low sugar",
    sub: "From bread to sauce without feeling heavy",
    items: [
      {
        id: "lowsugar-1",
        name: "[Vivid Kitchen] Low Sugar Chicken Breast Burrito 9 Types, 2 Pack (Choose 1)",
        price: "₩10,900",
      },
      {
        id: "lowsugar-2",
        name: "[Cafe Amoje] Low Sugar Poke Salad 5 Types (Choose 1)",
        price: "₩14,900",
        was: "₩16,900",
        off: "11%",
        coupon: "11% OFF Coupon",
      },
      {
        id: "lowsugar-3",
        name: "[Sempio] Sunjak Low Sugar Adlay Tea",
        price: "₩7,480",
        was: "₩9,980",
        off: "25%",
        coupon: "25% OFF Coupon",
      },
    ],
  },
  {
    title: "Autumn gourmet travel",
    sub: "7 additional coupon benefits",
    items: [
      {
        id: "gourmet-1",
        name: "[Hanpot] Daejeon-style Spicy Squid and Tofu Stir-fry for 2",
        price: "₩7,800",
      },
      {
        id: "gourmet-2",
        name: "[Doryang] Iron Delivery Box Chef Lim Tae-hoon’s Seafood Jjamppong",
        price: "₩7,100",
        was: "₩7,900",
        off: "10%",
        coupon: "10% OFF Coupon",
      },
      {
        id: "gourmet-3",
        name: "[Kurly Hotel] Stay + Breakfast",
        price: "₩24,500",
        was: "₩28,800",
        off: "15%",
      },
    ],
  },
  {
    title: "This week’s special fruit deals",
    sub: "From Shinano Gold to Cherry Tomatoes",
    items: [
      { id: "fruit-1", name: "Highland Fresh Apples 1.3kg", price: "₩20,900" },
      {
        id: "fruit-2",
        name: "[KF365] Sweet and Sour Jeju Tangerine 1.5kg",
        price: "₩11,900",
        was: "₩15,900",
        off: "25%",
        coupon: "25% OFF Coupon",
      },
      {
        id: "fruit-3",
        name: "[Weekend Special] Golden Apple",
        price: "₩12,900",
        was: "₩19,900",
        off: "35%",
        coupon: "35% OFF Coupon",
      },
    ],
  },
].map((s) => ({ ...s, items: s.items.map((it) => ({ ...it, src: `${APP}/${it.id}.webp` })) }));

// One of the AI's campaigns as a homepage row.
export const toSection = (theme: Theme, sub: string, products = theme.products): HomeSection => ({
  title: theme.title,
  sub,
  items: products,
});
