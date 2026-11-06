"use client";

import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Progress fluide type sites premium (pas un curseur 2D qui descend) */
export function SmoothProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });
  const width = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-white/5">
      <motion.div className="h-full bg-[var(--gold)] origin-left" style={{ width }} />
    </div>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  x = 0,
  y = 40,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y: y || 56, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  to,
  suffix = "",
  prefix = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });
  const spring = useSpring(0, { stiffness: 60, damping: 20 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p > 0.2) spring.set(to);
  });
  useEffect(() => spring.on("change", (n) => setV(Math.round(n))), [spring]);

  return (
    <span ref={ref}>
      {prefix}
      {v}
      {suffix}
    </span>
  );
}

/** Bande horizontale snap — sections vraiment différentes */
export function HScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}

export function HCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`min-w-[85%] snap-center sm:min-w-[55%] lg:min-w-[32%] ${className}`}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}
