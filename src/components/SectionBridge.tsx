"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useSound } from "./Soundscape";

/**
 * Passage vivant entre sections — vagues continues, spring soft, bien visible.
 */
export default function SectionBridge({
  from,
  to,
  index,
}: {
  from: string;
  to: string;
  index: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const played = useRef(false);
  const { chime, unlocked } = useSound();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 42,
    damping: 26,
    mass: 0.7,
  });

  const clipR = useTransform(smooth, [0.05, 0.52], [100, 0]);
  const clipPath = useTransform(clipR, (v) => `inset(0 ${v}% 0 0)`);
  const opacity = useTransform(smooth, [0.04, 0.22, 0.78, 0.96], [0, 1, 1, 0]);
  const scale = useTransform(smooth, [0.08, 0.42], [0.92, 1]);
  const y = useTransform(smooth, [0.1, 0.42], [48, 0]);
  const line = useTransform(smooth, [0.16, 0.52], [0, 1]);
  const fromOp = useTransform(smooth, [0.12, 0.38], [0.18, 0.55]);
  const toScale = useTransform(smooth, [0.22, 0.52], [0.9, 1]);
  const waveOp = useTransform(smooth, [0.1, 0.4, 0.88], [0.35, 1, 0.4]);
  const parallaxY = useTransform(smooth, [0, 1], [40, -60]);
  const dotLeft = useTransform(line, [0, 1], ["0%", "100%"]);
  const glow = useTransform(smooth, [0.2, 0.5], [0.35, 0.85]);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (!unlocked || played.current) return;
      if (v > 0.35 && v < 0.6) {
        played.current = true;
        chime();
      }
    });
  }, [scrollYProgress, unlocked, chime]);

  return (
    <section
      ref={ref}
      className="relative z-20 flex h-[92vh] min-h-[420px] items-center justify-center overflow-hidden"
    >
      <motion.div className="absolute inset-0 bg-[#040704]" style={{ clipPath }} />

      {/* Halo gold qui respire */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          opacity: glow,
          background:
            "radial-gradient(circle, rgba(240,193,75,0.28) 0%, rgba(42,107,69,0.12) 42%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Couche basse — vagues lentes */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[-8%] h-[68%]"
        style={{ opacity: waveOp, y: parallaxY }}
      >
        <motion.div
          className="flex h-full w-[300%]"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
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
                fill="rgba(42,107,69,0.32)"
                d="M0,224L60,208C120,192,240,160,360,154C480,149,600,171,720,186C840,203,960,213,1080,197C1200,181,1320,139,1380,117L1440,96L1440,320L0,320Z"
              />
              <path
                fill="rgba(240,193,75,0.14)"
                d="M0,256L80,240C160,224,320,192,480,181C640,171,800,181,960,197C1120,213,1280,235,1360,245L1440,256L1440,320L0,320Z"
              />
            </svg>
          ))}
        </motion.div>
      </motion.div>

      {/* Couche milieu — plus rapide, plus gold */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[-2%] h-[48%]"
        style={{ opacity: waveOp }}
      >
        <motion.div
          className="flex h-full w-[300%]"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
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
                fill="rgba(240,193,75,0.2)"
                d="M0,160L80,176C160,192,320,224,480,218C640,213,800,171,960,154C1120,139,1280,149,1360,154L1440,160L1440,320L0,320Z"
              />
            </svg>
          ))}
        </motion.div>
      </motion.div>

      {/* Lignes contour — respiration wavy haut */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[16%] h-36 overflow-hidden"
        style={{ opacity: waveOp }}
      >
        <motion.svg
          className="absolute left-0 top-0 h-full w-[200%]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <path
            fill="none"
            stroke="rgba(240,193,75,0.55)"
            strokeWidth="1.8"
            d="M0,60 C80,20 160,100 240,55 S400,10 480,65 S640,110 720,50 S880,15 960,70 S1120,95 1200,55"
          />
          <path
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.1"
            d="M0,75 C100,45 200,105 300,70 S500,35 600,80 S800,100 900,55 S1100,40 1200,65"
          />
          <path
            fill="none"
            stroke="rgba(42,107,69,0.45)"
            strokeWidth="1.3"
            d="M0,45 C90,70 180,20 270,50 S450,90 540,40 S720,10 810,55 S990,85 1080,45 S1160,30 1200,40"
          />
        </motion.svg>
      </motion.div>

      {/* Points flottants — vie */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: waveOp }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-[var(--gold)]"
            style={{
              left: `${18 + i * 16}%`,
              top: `${28 + (i % 3) * 14}%`,
            }}
            animate={{
              y: [0, -18 - i * 4, 0],
              opacity: [0.2, 0.85, 0.2],
              scale: [1, 1.45, 1],
            }}
            transition={{
              duration: 3.2 + i * 0.45,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.35,
            }}
          />
        ))}
      </motion.div>

      <motion.div className="relative z-10 max-w-4xl px-6 text-center" style={{ opacity, scale, y }}>
        <motion.p
          className="text-[11px] font-semibold tracking-[0.42em] uppercase text-[var(--gold)]"
          animate={{ letterSpacing: ["0.38em", "0.48em", "0.38em"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          Passage {index}
        </motion.p>

        <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-14">
          <motion.span
            className="display text-2xl text-white/40 md:text-4xl"
            style={{ opacity: fromOp }}
          >
            {from}
          </motion.span>

          <div className="relative flex h-10 w-32 items-center md:w-56">
            <motion.div
              className="h-[2px] w-full origin-left rounded-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
              style={{ scaleX: line }}
            />
            <motion.span
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gold)] shadow-[0_0_28px_rgba(240,193,75,0.85)]"
              style={{ left: dotLeft }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.span
            className="display text-4xl text-white md:text-6xl"
            style={{ scale: toScale }}
          >
            {to}
          </motion.span>
        </div>

        <motion.p
          className="mt-14 text-[10px] tracking-[0.4em] uppercase text-white/45"
          animate={{ opacity: [0.3, 0.95, 0.3], y: [0, 8, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          Continuer
        </motion.p>
      </motion.div>
    </section>
  );
}
