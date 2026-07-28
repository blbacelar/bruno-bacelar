import Reveal from "./Reveal";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-28">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="font-mono text-xs text-faint">
            beforeAll(<span className="text-trace">&apos;the person&apos;</span>)
          </p>
          <h2 className="mt-3 text-4xl leading-tight sm:text-5xl">
            Twenty years of{" "}
            <em className="font-display italic text-pass">finding what breaks.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              I wrote my first line of production code in Brazil more than two decades ago. Since
              then I have been a developer, a consultant, and for the last eight years the person
              teams call when their test suite is flaky, slow, or missing entirely. These days I
              spend most of that instinct on AI agents and automation instead, catching what an
              agent gets wrong before it ships, not just what a human gets wrong.
            </p>
            <p>
              I am based in Canada, work in English and Portuguese, and I am at my best in the gap
              between building fast and building something that still works in a year: real
              testing, real reliability, not a demo that happens to work once.
            </p>
            <p>
              Outside of work I write psychological thrillers under a pen name. It turns out that
              hunting plot holes and hunting bugs are the same skill, and I cannot switch either
              one off.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <Reveal>
          <p className="font-mono text-xs text-faint">
            test(<span className="text-trace">&apos;hire bruno&apos;</span>, async () =&gt; ...)
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-6xl">
            Your suite is failing?{" "}
            <em className="font-display italic text-pass">Good.</em>{" "}
            That means there is something worth fixing.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted">
            I take on AI agent and automation engineering, integration work, and advisory on
            bringing AI into real production workflows. English or Portuguese, remote-first.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:bruno@bacelardigital.tech"
              className="rounded-md bg-pass px-6 py-3 font-mono text-sm font-medium text-ink transition-transform duration-200 [transition-timing-function:cubic-bezier(0.2,0,0,1)] hover:-translate-y-0.5"
            >
              npm start conversation
            </a>
            <a
              href="https://www.linkedin.com/in/blbacelar"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line px-6 py-3 font-mono text-sm text-muted transition-colors duration-200 hover:border-faint hover:text-text"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/blbacelar"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line px-6 py-3 font-mono text-sm text-muted transition-colors duration-200 hover:border-faint hover:text-text"
            >
              GitHub
            </a>
          </div>
        </Reveal>
      </div>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            afterAll(() =&gt; <span className="text-pass">thanks for reading</span>)
          </p>
          <p>
            © 2026 Bruno Bacelar · Next.js 15, Tailwind 4, Motion · no template was harmed
          </p>
        </div>
      </footer>
    </section>
  );
}
