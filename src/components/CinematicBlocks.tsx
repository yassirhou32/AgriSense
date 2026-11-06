"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Photo sticky cinéma — zoom + texte qui monte */
export function PhotoChapter({
  src,
  alt,
  eyebrow,
  title,
  children,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [1.2, 1, 1.06]);
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const textY = useTransform(scrollYProgress, [0.12, 0.48], [50, 0]);
  const textOp = useTransform(scrollYProgress, [0.12, 0.38], [0, 1]);
  const clip = useTransform(
    scrollYProgress,
    [0, 0.22],
    ["inset(12% 8% 12% 8%)", "inset(0% 0% 0% 0%)"]
  );

  return (
    <section ref={ref} className="relative h-[140vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <motion.img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ scale, y }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        <motion.div
          className="absolute inset-x-0 bottom-0 px-5 pb-16 md:px-10 md:pb-20"
          style={{ y: textY, opacity: textOp }}
        >
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display mt-4 max-w-4xl text-4xl text-white md:text-6xl">
              {title}
            </h2>
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Photo qui s'ouvre en rideau horizontal (style Ferrari reveal) */
export function OpenPhoto({
  src,
  alt,
  caption,
  side = "left",
}: {
  src: string;
  alt: string;
  caption?: string;
  side?: "left" | "right";
}) {
  return (
    <motion.figure
      className="relative overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.div
        className="relative min-h-[320px] md:min-h-[460px]"
        variants={{
          hidden: { clipPath: side === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
          show: { clipPath: "inset(0 0% 0 0%)" },
        }}
        transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          variants={{
            hidden: { scale: 1.2 },
            show: { scale: 1 },
          }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {caption && (
          <figcaption className="absolute bottom-0 left-0 p-6 md:p-8">
            <p className="display text-2xl text-white md:text-3xl">{caption}</p>
          </figcaption>
        )}
      </motion.div>
    </motion.figure>
  );
}

/** Pilier / borne entre sections — élément « debout » premium */
export function StandingGate({
  label,
  number,
}: {
  label: string;
  number: string;
}) {
  return (
    <div className="relative mx-auto flex max-w-7xl items-center gap-6 px-5 py-10 md:px-10">
      <motion.div
        className="flex h-28 w-14 flex-col items-center justify-between border border-white/20 bg-black/50 py-3 backdrop-blur-sm md:h-36 md:w-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="text-[10px] tracking-[0.2em] text-[var(--gold)]">{number}</span>
        <div className="h-10 w-px bg-gradient-to-b from-[var(--gold)] to-transparent" />
        <span className="rotate-180 text-[9px] tracking-[0.15em] uppercase text-white/40 [writing-mode:vertical-rl]">
          AgriSense
        </span>
      </motion.div>
      <motion.div
        className="h-px flex-1 origin-left bg-gradient-to-r from-white/30 via-[var(--gold)]/50 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.15 }}
      />
      <motion.p
        className="hidden text-[11px] font-semibold tracking-[0.3em] uppercase text-white/55 md:block"
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        {label}
      </motion.p>
    </div>
  );
}

export function SignalDivider() {
  return (
    <div className="relative mx-auto h-10 max-w-7xl px-5 md:px-10">
      <motion.div
        className="absolute left-5 right-5 top-1/2 h-px origin-left bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent md:left-10 md:right-10"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1 }}
      />
    </div>
  );
}

export function ArgumentCard({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      className="panel-strong group relative overflow-hidden p-7 md:p-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7 }}
      whileHover={{ y: -6 }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--gold)]/10 blur-2xl transition group-hover:bg-[var(--gold)]/20" />
      <p className="text-[11px] tracking-[0.3em] text-[var(--gold)]">{index}</p>
      <h3 className="display mt-4 text-2xl text-white md:text-3xl">{title}</h3>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/75">
        {children}
      </div>
    </motion.article>
  );
}

/** Bande wavy CSS décorative entre blocs (léger, vivant) */
export function WaveRibbon() {
  return (
    <div className="wave-ribbon relative h-16 overflow-hidden opacity-70 md:h-20" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-[200%] animate-wave-slide"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z"
          fill="rgba(240,193,75,0.08)"
        />
        <path
          d="M0,50 C200,10 400,70 600,50 C800,30 1000,70 1200,50"
          fill="none"
          stroke="rgba(240,193,75,0.35)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
