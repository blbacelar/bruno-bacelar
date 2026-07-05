import Reveal from "./Reveal";

/* The stack rendered as a test report. Suites, not skill bars.
   Nobody is "90% good at TypeScript". A suite either passes or it doesn't. */

const SUITES = [
  {
    suite: "E2E automation",
    tools: "Playwright · Cypress",
    note: "8 years, from first spec to framework governance",
  },
  {
    suite: "Languages",
    tools: "TypeScript · C# · SQL",
    note: "Typed everywhere. Untyped test code is a bug factory",
  },
  {
    suite: "API testing",
    tools: "REST · NUnit · xUnit · Postman",
    note: "Contract-first, environment-agnostic",
  },
  {
    suite: "CI/CD",
    tools: "Azure DevOps · GitHub Actions",
    note: "Pipelines with quality gates, not decoration",
  },
  {
    suite: "AI in QA",
    tools: "Claude API · test generation · agentic workflows",
    note: "The part of the stack that did not exist 3 years ago",
  },
  {
    suite: "Mobile",
    tools: "Appium · BDD / Gherkin",
    note: "Earlier chapter, still in the toolbox",
  },
];

export default function Stack() {
  return (
    <section id="stack" className="border-y border-line bg-surface/50">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <Reveal>
          <p className="font-mono text-xs text-faint">
            expect(stack).<span className="text-trace">toBeBattleTested</span>()
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Six suites,{" "}
            <em className="font-display italic text-pass">all green.</em>
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            No percentage bars. A capability either survives production or it does not.
          </p>
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-lg border border-line">
          {SUITES.map((row, i) => (
            <Reveal key={row.suite} delay={i * 0.04}>
              <div
                className={`grid grid-cols-1 gap-2 px-5 py-4 transition-colors duration-200 hover:bg-raise sm:grid-cols-[1fr_1.2fr_1.4fr_auto] sm:items-baseline sm:gap-6 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <p className="font-medium text-text">{row.suite}</p>
                <p className="font-mono text-xs text-muted">{row.tools}</p>
                <p className="text-sm text-faint">{row.note}</p>
                <p className="font-mono text-[11px] text-pass">✓ pass</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
