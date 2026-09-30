import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import "./globals.css";

// Same GA4 property as the previous Jekyll site, so traffic history carries
// over. Only production builds report, so local dev visits stay out of it.
const GA_ID = "G-B2Z4J55FNK";

export const metadata: Metadata = {
  metadataBase: new URL("https://suyoungkwon.com"),
  title: "Suyoung Kwon | Product Manager",
  description:
    "Suyoung (Mel) Kwon, a Product Manager building healthcare, education, and AI products with measurable business impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
      {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
