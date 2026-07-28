"use client";

import { motion } from "motion/react";
import SpecRunner from "./SpecRunner";

const EASE = [0.05, 0.7, 0.1, 1] as const;

export default function Hero() {
  return (
    <section
      id="hero"
      className="trace-grid relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pb-16 pt-28"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, ease: EASE }}
            className="font-mono text-xs text-faint"
          >
            test.describe(<span className="text-trace">&apos;Bruno Bacelar&apos;</span>, () =&gt;
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.64, delay: 0.1, ease: EASE }}
            className="mt-5 text-5xl leading-[1.05] tracking-tight sm:text-7xl"
          >
            I build AI that
            <br />
            <em className="font-display italic text-pass">ships to production.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.22, ease: EASE }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
          >
            AI Solutions Engineer. Twenty years in software, the last eight building the test
            frameworks that catch what breaks before your users do. Now I build the AI agents,
            automations, and production systems that replace manual work entirely.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.34, ease: EASE }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <a
              href="#work"
              className="rounded-md bg-text px-6 py-3 font-mono text-sm font-medium text-ink transition-transform duration-200 [transition-timing-function:cubic-bezier(0.2,0,0,1)] hover:-translate-y-0.5"
            >
              see the evidence
            </a>
            <a
              href="#contact"
              className="rounded-md border border-line px-6 py-3 font-mono text-sm text-muted transition-colors duration-200 hover:border-faint hover:text-text"
            >
              run a project by me
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.64, delay: 0.28, ease: EASE }}
        >
          <SpecRunner />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-6 left-5 font-mono text-[11px] text-faint"
        aria-hidden
      >
        scroll to run the pipeline ↓
      </motion.p>
    </section>
  );
}
