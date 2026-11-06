"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "down" | "left" | "right" | "scale" | "blur";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  from = "up",
}: RevealProps) {
  const map = {
    up: { y: 48, x: 0, scale: 1, filter: "blur(0px)" },
    down: { y: -40, x: 0, scale: 1, filter: "blur(0px)" },
    left: { y: 0, x: 56, scale: 1, filter: "blur(0px)" },
    right: { y: 0, x: -56, scale: 1, filter: "blur(0px)" },
    scale: { y: 20, x: 0, scale: 0.92, filter: "blur(0px)" },
    blur: { y: 24, x: 0, scale: 1, filter: "blur(12px)" },
  }[from];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...map }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Glass({
  children,
  className = "",
  dark = false,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  hover?: boolean;
}) {
  return (
    <motion.div
      className={`glass-card ${dark ? "glass-card-dark" : ""} ${className}`}
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      transition={{ duration: 0.35, ease }}
    >
      {children}
    </motion.div>
  );
}

export function SectionFrame({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative px-5 py-20 md:px-10 md:py-28 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="relative mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) =>
    `${prefix}${v.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(() => {
    return display.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
  }, [display]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
      <motion.div
        className="orb orb-a"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-b"
        animate={{ x: [0, -50, 30, 0], y: [0, 40, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="mask-fade overflow-hidden border-y border-white/10 py-4">
      <div className="marquee-track gap-10">
        {doubled.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="whitespace-nowrap text-[11px] tracking-[0.28em] uppercase text-white/55"
          >
            {t}
            <span className="mx-5 text-[#d4a017]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
