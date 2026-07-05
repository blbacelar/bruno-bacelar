"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

/* Scroll progress rendered as a CI pipeline.
   Each stage maps to a section. As you scroll past a section,
   its stage goes green, exactly like a build going through CI. */

const STAGES = [
  { id: "hero", label: "checkout" },
  { id: "work", label: "lint" },
  { id: "stack", label: "test" },
  { id: "about", label: "build" },
  { id: "contact", label: "deploy" },
];

export default function Pipeline() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [reached, setReached] = useState<Record<string, boolean>>({ hero: true });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setReached((r) => ({ ...r, [entry.target.id]: true }));
          }
        });
      },
      { rootMargin: "-30% 0px -30% 0px" }
    );
    STAGES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
        <a href="#hero" className="font-mono text-xs text-muted transition-colors hover:text-text">
          bacelar<span className="text-pass">@</span>ci
        </a>
        <nav aria-label="Pipeline stages" className="flex items-center gap-1 overflow-x-auto">
          {STAGES.map((stage, i) => {
            const done = reached[stage.id];
            return (
              <a
                key={stage.id}
                href={`#${stage.id}`}
                className="group flex shrink-0 items-center gap-1 font-mono text-[11px] tracking-wide"
              >
                <span
                  className={`transition-colors duration-300 ${
                    done ? "text-pass" : "text-faint"
                  } group-hover:text-text`}
                >
                  {done ? "✓" : "○"} {stage.label}
                </span>
                {i < STAGES.length - 1 && (
                  <span className="mx-1 hidden text-faint sm:inline" aria-hidden>
                    →
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>
      <motion.div
        aria-hidden
        className="h-px origin-left bg-pass"
        style={{ scaleX: progress }}
      />
    </div>
  );
}
