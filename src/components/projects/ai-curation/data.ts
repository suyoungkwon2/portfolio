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

// 08's Copilot results for “Matcha Core: Trending Now”.
export const COPILOT_RESULTS: Product[] = [
  PRODUCTS.matcha[2],
  PRODUCTS.matcha[3],
  PRODUCTS.matcha[0],
  PRODUCTS.snack[3],
  PRODUCTS.matcha[1],
  PRODUCTS.matcha[5],
  PRODUCTS.matcha[4],
  {
    id: "matcha-bar",
    emoji: "🍦",
    name: "Matcha Ice Cream Bar, 4 pcs",
    price: "₩6,400",
    category: "Ice Cream",
  },
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
