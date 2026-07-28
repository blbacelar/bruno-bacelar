"use client";

import { useEffect, useRef, useState } from "react";

/* The portfolio that tests itself.
   A Playwright-style spec run that verifies the claims on this page,
   line by line, on load. */

type Spec = { text: string; ms: number };

const SPECS: Spec[] = [
  { text: "renders hero without layout shift", ms: 23 },
  { text: "experience exceeds 20 years", ms: 4 },
  { text: "playwright and cypress expertise verified", ms: 112 },
  { text: "ships AI agents that catch their own mistakes", ms: 317 },
  { text: "ships CI pipelines developers actually trust", ms: 88 },
  { text: "fluent in English and Portuguese", ms: 12 },
  { text: "available for new engagements", ms: 1 },
];

const TOTAL = SPECS.reduce((sum, s) => sum + s.ms, 0);

export default function SpecRunner() {
  const [step, setStep] = useState(0);
  const done = step > SPECS.length;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setStep(SPECS.length + 1);
      return;
    }
    if (step > SPECS.length) return;
    const delay = step === 0 ? 500 : 340;
    const t = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div
      ref={ref}
      className="w-full max-w-xl rounded-lg border border-line bg-surface shadow-2xl shadow-black/40"
      role="img"
      aria-label={`Terminal running a test suite that verifies this portfolio. All ${SPECS.length} checks pass.`}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-fail/70" aria-hidden />
        <span className="size-2.5 rounded-full bg-flaky/70" aria-hidden />
        <span className="size-2.5 rounded-full bg-pass/70" aria-hidden />
        <span className="ml-2 font-mono text-[11px] text-faint">
          npx playwright test portfolio.spec.ts
        </span>
      </div>
      <div className="min-h-[248px] px-4 py-4 font-mono text-[12px] leading-6 sm:text-[13px]">
        <p className="text-muted">
          Running {SPECS.length} tests using 1 worker
        </p>
        {SPECS.map((spec, i) => {
          if (i >= step && step <= SPECS.length) {
            return i === step ? (
              <p key={spec.text} className="text-faint">
                <span className="pulse-soft text-flaky">●</span> {spec.text}
              </p>
            ) : null;
          }
          return (
            <p key={spec.text} className="text-muted">
              <span className="text-pass">✓</span> {spec.text}{" "}
              <span className="text-faint">({spec.ms}ms)</span>
            </p>
          );
        })}
        {done && (
          <p className="mt-2 text-pass">
            {SPECS.length} passed <span className="text-faint">({TOTAL}ms)</span> · portfolio
            verified<span className="caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-pass" aria-hidden />
          </p>
        )}
      </div>
    </div>
  );
}
