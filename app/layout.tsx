import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bruno Bacelar · I break software for a living",
  description:
    "Senior QA Automation Architect. 20+ years in software, 8 building test frameworks that catch what everyone else ships. Playwright, Cypress, TypeScript, AI-assisted QA.",
  metadataBase: new URL("https://bruno-bacelar.vercel.app"),
  openGraph: {
    title: "Bruno Bacelar · QA Automation Architect",
    description:
      "The portfolio that tests itself. Playwright, Cypress, TypeScript, AI-assisted QA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Schibsted+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
