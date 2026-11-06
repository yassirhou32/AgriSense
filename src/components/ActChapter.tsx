"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { useSound } from "./Soundscape";

/** Chapitre d'acte — son + reveal à l'entrée */
export function ActEnter({
  children,
  className = "",
  sound = "whoosh",
}: {
  children: React.ReactNode;
  className?: string;
  sound?: "whoosh" | "chime" | "tick" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const { whoosh, chime, tick, unlocked } = useSound();
  const played = useRef(false);

  useEffect(() => {
    if (!inView || played.current || !unlocked) return;
    played.current = true;
    if (sound === "whoosh") whoosh();
    if (sound === "chime") chime();
    if (sound === "tick") tick();
  }, [inView, unlocked, sound, whoosh, chime, tick]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ActLabel({ act, title }: { act: string; title: string }) {
  return (
    <div className="mb-8 flex items-end gap-5">
      <span className="display text-5xl text-[var(--gold)] md:text-7xl">{act}</span>
      <div className="mb-2 h-px flex-1 bg-gradient-to-r from-[var(--gold)]/60 to-transparent" />
      <p className="mb-2 text-[11px] font-semibold tracking-[0.35em] uppercase text-white/50">
        {title}
      </p>
    </div>
  );
}
