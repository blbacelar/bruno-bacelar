"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";

type Status = "passed" | "running";

type Case = {
  client: string;
  role: string;
  title: string;
  body: string;
  tags: string[];
  status: Status;
  /* Trace segments: [label, % width, token color class] */
  trace: [string, number, string][];
};

const CASES: Case[] = [
  {
    client: "MCAP",
    role: "Framework rearchitecture",
    title: "One Cypress codebase, every lender brand",
    body: "Canada's largest independent mortgage finance company had a test suite splitting at the seams across lender brands. I rearchitected it into a single multi-lender Cypress framework: shared specs, per-lender configuration, hundreds of tests stabilized and running in Azure DevOps on every merge.",
    tags: ["Cypress", "TypeScript", "Azure DevOps"],
    status: "passed",
    trace: [
      ["audit", 22, "bg-trace"],
      ["rearchitect", 46, "bg-flaky"],
      ["stabilize", 32, "bg-pass"],
    ],
  },
  {
    client: "GLE",
    role: "Built from zero",
    title: "An API framework that enforces its own standards",
    body: "Greenfield API automation in .NET 8 with NUnit and xUnit, plus custom Roslyn analyzers that catch violations of the team's own conventions at compile time. The framework reviews your code before your reviewer does.",
    tags: [".NET 8", "NUnit / xUnit", "Roslyn analyzers"],
    status: "passed",
    trace: [
      ["design", 30, "bg-trace"],
      ["build", 45, "bg-flaky"],
      ["analyzers", 25, "bg-pass"],
    ],
  },
  {
    client: "QA Pilot",
    role: "AI agent, self-directed",
    title: "AI that writes the test cases nobody has time for",
    body: "A test case generator that reads your Jira tickets, Azure DevOps work items and GitHub pull requests, then drafts structured test cases on the Claude API. Built because every team I have joined had the same backlog of untested acceptance criteria.",
    tags: ["Claude API", "Next.js", "TypeScript"],
    status: "running",
    trace: [
      ["prototype", 40, "bg-trace"],
      ["integrations", 35, "bg-flaky"],
      ["beta", 25, "bg-pass"],
    ],
  },
  {
    client: "Diário de Bordo",
    role: "Independent project",
    title: "AI cost estimates you can actually trust",
    body: "A live app that helps families plan a move to Canada. The financial estimate feature blends AI-generated market pricing with deterministic, hand-coded government fee logic, so the numbers that matter most are never left to a model's guess. Real users, live today.",
    tags: ["Claude API", "Supabase", "Next.js"],
    status: "passed",
    trace: [
      ["design", 30, "bg-trace"],
      ["build", 40, "bg-flaky"],
      ["ship", 30, "bg-pass"],
    ],
  },
  {
    client: "Olea Connects",
    role: "Independent project",
    title: "A membership platform for Canadian nonprofits",
    body: "Full technical build for a nonprofit governance platform: Next.js, Supabase, auth, payments, and member management. Integrations to Attio and QuickBooks run on versioned outbox workers, so a failed sync retries safely instead of quietly losing data. Launching mid-August.",
    tags: ["Next.js", "Supabase", "Integrations"],
    status: "running",
    trace: [
      ["mvp", 38, "bg-trace"],
      ["members", 34, "bg-flaky"],
      ["launch", 28, "bg-pass"],
    ],
  },
];

function StatusBadge({ status }: { status: Status }) {
  if (status === "passed") {
    return (
      <span className="flex items-center gap-1.5 font-mono text-[11px] text-pass">
        <span className="size-1.5 rounded-full bg-pass" aria-hidden /> passed
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 font-mono text-[11px] text-flaky">
      <span className="pulse-soft size-1.5 rounded-full bg-flaky" aria-hidden /> running
    </span>
  );
}

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-28">
      <Reveal>
        <p className="font-mono text-xs text-faint">
          test.describe(<span className="text-trace">&apos;selected work&apos;</span>)
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Evidence,{" "}
          <em className="font-display italic text-pass">not adjectives.</em>
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Five engagements. Hover a card to see its trace: how each project moved from audit to
          green.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {CASES.map((c, i) => (
          <Reveal key={c.client} delay={(i % 2) * 0.08}>
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
              className="group flex h-full flex-col rounded-lg border border-line bg-surface p-6 transition-colors duration-300 hover:border-faint"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-xs text-muted">
                  {c.client} <span className="text-faint">· {c.role}</span>
                </p>
                <StatusBadge status={c.status} />
              </div>

              <h3 className="mt-4 text-xl leading-snug text-text">{c.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{c.body}</p>

              {/* Trace viewer bar: expands on hover like a Playwright trace timeline */}
              <div className="mt-6" aria-hidden>
                <div className="flex h-1.5 w-full gap-px overflow-hidden rounded-full bg-raise">
                  {c.trace.map(([label, width, color]) => (
                    <div
                      key={label}
                      style={{ width: `${width}%` }}
                      className={`${color} origin-left scale-x-0 opacity-40 transition-all duration-500 [transition-timing-function:cubic-bezier(0.05,0.7,0.1,1)] group-hover:scale-x-100 group-hover:opacity-90`}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[10px] text-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {c.trace.map(([label]) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {c.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-line px-2 py-1 font-mono text-[11px] text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
