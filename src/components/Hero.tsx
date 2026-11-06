"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 48, damping: 28, mass: 0.65 });
  const opacity = useTransform(smooth, [0, 0.75], [1, 0]);
  const y = useTransform(smooth, [0, 1], [0, 120]);
  const scale = useTransform(smooth, [0, 1], [1, 0.94]);
  const waveY = useTransform(smooth, [0, 1], [0, -80]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* Voile doux pour lisibilité sans casser la vidéo */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-black/25 to-black/40" />

      {/* Halo gold vivant */}
      <motion.div
        className="pointer-events-none absolute -left-24 bottom-0 z-[2] h-[55vh] w-[55vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(240,193,75,0.18) 0%, transparent 68%)",
        }}
        animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Contours / vagues — même délire que les passages */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%]"
        style={{ y: waveY }}
      >
        <motion.div
          className="flex h-full w-[300%]"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1, 2].map((n) => (
            <svg
              key={n}
              className="h-full w-1/3 shrink-0"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                fill="rgba(42,107,69,0.22)"
                d="M0,224L80,208C160,192,320,160,480,165C640,171,800,213,960,218C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
              />
              <path
                fill="rgba(240,193,75,0.1)"
                d="M0,256L100,240C200,224,400,192,600,186C800,181,1000,203,1200,208C1300,211,1380,203,1440,197L1440,320L0,320Z"
              />
            </svg>
          ))}
        </motion.div>
      </motion.div>

      {/* Lignes contour haut — respiration */}
      <motion.svg
        className="pointer-events-none absolute left-0 top-[18%] z-[2] h-24 w-[200%] opacity-70"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <path
          fill="none"
          stroke="rgba(240,193,75,0.4)"
          strokeWidth="1.3"
          d="M0,40 C100,10 200,70 300,38 S500,8 600,42 S800,72 900,35 S1100,12 1200,40"
        />
        <path
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
          d="M0,55 C120,30 240,75 360,50 S600,20 720,55 S960,75 1080,40 S1160,35 1200,48"
        />
      </motion.svg>

      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-10 w-full px-5 pb-16 pt-28 md:px-10 md:pb-20"
      >
        <div className="mx-auto max-w-7xl">
          {/* Marque = signal hero */}
          <motion.p
            className="display text-[clamp(2.4rem,7vw,5.5rem)] leading-none tracking-tight text-white"
            initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease }}
          >
            AgriSense
          </motion.p>

          <motion.div
            className="mt-3 h-[2px] w-40 origin-left bg-gradient-to-r from-[var(--gold)] via-[var(--gold)]/60 to-transparent md:w-64"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.25, ease }}
          />

          <motion.p
            className="eyebrow mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
          >
            Étude de cas · Conseil innovation
          </motion.p>

          <h1 className="display mt-5 max-w-5xl text-[clamp(2.6rem,8.5vw,6.4rem)] leading-[0.92] text-white">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 48, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.45, ease }}
            >
              Lancer un capteur IoT
            </motion.span>
            <motion.span
              className="mt-1 block text-[var(--gold)]"
              initial={{ opacity: 0, y: 48, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.62, ease }}
            >
              sans se tromper de marché.
            </motion.span>
          </h1>

          <motion.p
            className="lede mt-7 max-w-xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease }}
          >
            Plan de lancement AgriSense sur une zone réelle — diagnostic, valeur, stratégie,
            indicateurs. Hypothèses explicites.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease }}
          >
            <a href="#mission" className="btn-gold">
              Voir la mission
            </a>
            <a href="#lab" className="btn-ghost">
              Simulateur 24 mois
            </a>
          </motion.div>

          {/* Scroll cue vivant */}
          <motion.div
            className="mt-16 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <motion.span
              className="block h-10 w-[1px] bg-gradient-to-b from-[var(--gold)] to-transparent"
              animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ originY: 0 }}
            />
            <motion.p
              className="text-[10px] tracking-[0.38em] uppercase text-white/45"
              animate={{ opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              Défiler
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
