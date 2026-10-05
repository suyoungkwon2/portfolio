import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { PageChain } from "@/components/PageChain";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

// Same GA4 property as the previous Jekyll site, so traffic history carries
// over. Only production builds report, so local dev visits stay out of it.
const GA_ID = "G-B2Z4J55FNK";

export const metadata: Metadata = {
  metadataBase: new URL("https://suyoungkwon.com"),
  // Every page keeps this tab title; pages set only their own description.
  title: "Mel Suyoung Kwon",
  description:
    "Suyoung (Mel) Kwon, a Product Manager building healthcare, education, and AI products with measurable business impact.",
  icons: { icon: "/images/logo_mk_small.png", apple: "/images/logo_mk_small.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // data-scroll-behavior: page changes jump straight to the top instead of
  // smooth-scrolling there (globals.css keeps smooth for in-page links).
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Manrope everywhere: the body font and font-display both point at
          it (globals.css sets body's font from --font-sans, so the variable
          is what has to change). Case study pages switch back to Inter and
          Aspekta (work/[slug]). */}
      <body className="antialiased [--font-display:var(--font-manrope)] [--font-sans:var(--font-manrope)]">
        <Sidebar />
        {/* Layout units for page headlines and the landing hero, from lg up.
            --u is 1% of the content width (capped; 320px is the sidebar plus
            the page gutters). --f, the type unit, follows --u but changes
            more slowly, so type shrinks less than the layout on narrower
            screens. */}
        <div className="lg:pl-60 lg:[--f:calc(2.5px+var(--u)*0.78)] lg:[--u:min(calc((100vw-320px)/100),14.5px)]">
          <PageChain>{children}</PageChain>
        </div>
      </body>
      {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
