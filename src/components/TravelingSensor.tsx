"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/** Capteur produit SVG premium qui voyage au fil du scroll (1 instance, léger). */
export default function TravelingSensor() {
  const { scrollYProgress } = useScroll();

  const x = useTransform(
    scrollYProgress,
    [0, 0.12, 0.28, 0.45, 0.62, 0.78, 1],
    ["72vw", "8vw", "70vw", "12vw", "68vw", "18vw", "55vw"]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.12, 0.28, 0.45, 0.62, 0.78, 1],
    ["22vh", "55vh", "30vh", "58vh", "28vh", "52vh", "35vh"]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-8, 6, -4, 10, -2]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.02, 0.88, 0.97],
    [0, 1, 1, 0.25]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.7, 1],
    [0.85, 1, 1.08, 0.95, 0.9]
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-40 hidden lg:block"
      style={{ x, y, rotate, opacity, scale }}
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(240,193,75,0.28),transparent_70%)]"
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg
          width="100"
          height="160"
          viewBox="0 0 92 148"
          fill="none"
          className="drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)]"
        >
          {/* Corps */}
          <rect
            x="18"
            y="18"
            width="56"
            height="36"
            rx="8"
            fill="url(#bodyGrad)"
            stroke="#f0c14b"
            strokeWidth="1.2"
          />
          {/* Écran */}
          <rect x="26" y="26" width="40" height="16" rx="2" fill="#0f2a1a" />
          <circle cx="34" cy="34" r="2.5" fill="#4ade80" />
          <circle cx="46" cy="34" r="2.5" fill="#f0c14b" />
          <circle cx="58" cy="34" r="2.5" fill="#f87171" />
          {/* Antenne */}
          <line
            x1="64"
            y1="18"
            x2="72"
            y2="4"
            stroke="#c5d0c8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="72" cy="4" r="3" fill="#f0c14b" />
          {/* Sonde */}
          <rect x="41" y="54" width="10" height="78" rx="4" fill="url(#probeGrad)" />
          <rect x="39" y="70" width="14" height="3" rx="1" fill="#3d4a42" />
          <rect x="39" y="90" width="14" height="3" rx="1" fill="#3d4a42" />
          <rect x="39" y="110" width="14" height="3" rx="1" fill="#3d4a42" />
          <path d="M41 132 L46 146 L51 132 Z" fill="#c9a66b" />
          {/* Anneaux signal */}
          <circle
            cx="72"
            cy="4"
            r="8"
            stroke="rgba(240,193,75,0.35)"
            strokeWidth="1"
            className="origin-center animate-ping"
          />
          <defs>
            <linearGradient id="bodyGrad" x1="18" y1="18" x2="74" y2="54">
              <stop stopColor="#2a3830" />
              <stop offset="1" stopColor="#121a16" />
            </linearGradient>
            <linearGradient id="probeGrad" x1="41" y1="54" x2="51" y2="132">
              <stop stopColor="#8a968c" />
              <stop offset="1" stopColor="#c9a66b" />
            </linearGradient>
          </defs>
        </svg>
        <p className="mt-2 text-center text-[9px] tracking-[0.25em] uppercase text-white/45">
          Capteur IoT
        </p>
      </div>
    </motion.div>
  );
}
