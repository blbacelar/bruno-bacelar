# Bruno Bacelar Portfolio v2

Personal portfolio built with Next.js 15. The visual concept is a diagnostic/test-runner interface where each section mirrors QA workflows: pipeline stages, passing suites, and project traces.

Live site: https://bruno-bacelar.vercel.app

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion runtime)
- Lenis smooth scroll

## Project Structure

```
app/
  globals.css        # Design tokens, theme, global effects
  layout.tsx         # Metadata, fonts, root layout
  page.tsx           # Section composition

components/
  Pipeline.tsx       # Sticky CI-style stage progress + scroll bar
  Hero.tsx           # Intro and animated headline
  SpecRunner.tsx     # Self-verifying test terminal animation
  Work.tsx           # Case studies rendered as trace cards
  Stack.tsx          # Skills rendered as passing suites
  AboutContact.tsx   # About section, CTA, and footer
  Reveal.tsx         # Reusable reveal-on-view animation
  SmoothScroll.tsx   # Lenis setup with reduced-motion handling
```

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Available Scripts

```bash
npm run dev      # Start local dev server
npm run build    # Build production bundle
npm run start    # Run production server
```

## Design Notes

- Visual language is driven by semantic QA status tokens defined in `app/globals.css`.
- Typography uses Instrument Serif, Schibsted Grotesk, and JetBrains Mono.
- Motion respects `prefers-reduced-motion` in both global styles and smooth scroll behavior.

## Deployment

Deploy as a standard Next.js app on Vercel:

```bash
npm run build
```

Then deploy through Vercel Git integration or the Vercel CLI.
