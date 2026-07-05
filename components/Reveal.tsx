"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/* Premium entrance: rise 20px + fade, MD3 emphasized decelerate.
   One consistent entry style across the whole site. */

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.56, delay, ease: [0.05, 0.7, 0.1, 1] }}
    >
      {children}
    </motion.div>
  );
}
