import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bruno Bacelar · I ship AI that survives production",
  description:
    "AI Solutions Engineer. 20+ years in software, 8 building the test frameworks that catch what everyone else ships, now building the AI agents and automations that replace it. Claude, n8n, TypeScript, Supabase.",
  metadataBase: new URL("https://bruno-bacelar.vercel.app"),
  openGraph: {
    title: "Bruno Bacelar · AI Solutions Engineer",
    description:
      "The portfolio that tests itself. AI agents, automation, and production systems that hold up.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
