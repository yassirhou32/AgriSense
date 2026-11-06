"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSound } from "./Soundscape";

const r3 = (n: number) => Math.round(n * 1000) / 1000;

const TICKS = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  const major = i % 4 === 0;
  const r1 = major ? 46.2 : 47;
  const r2 = 48.2;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return {
    i,
    major,
    x1: r3(50 + r1 * c),
    y1: r3(50 + r1 * s),
    x2: r3(50 + r2 * c),
    y2: r3(50 + r2 * s),
  };
});

const NODE_POS = [0, 1, 2, 3].map((i) => {
  const angle = (i * 90 - 90) * (Math.PI / 180);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: r3(50 + 42 * c), y: r3(50 + 42 * s), x2: r3(50 + 42 * c), y2: r3(50 + 42 * s) };
});

const BRIEFS = [
  {
    id: "01",
    title: "Cible",
    line: "Pros livraison d'abord",
    detail: "Priorité : professionnels de la livraison à vélo ou trottinette. Ensuite le grand public urbain.",
  },
  {
    id: "02",
    title: "Positionnement",
    line: "Équipement de sécurité pro",
    detail: "Éprouvé par ceux qui roulent le plus — pas un gadget. Persona : Pierre, livreur VAE à Marseille.",
  },
  {
    id: "03",
    title: "Mix 4P",
    line: "129,90 € · flottes · Decathlon",
    detail: "Prix en 4×, vente directe sociétés et plateformes, site AirGo, magasins vélo et Decathlon.",
  },
  {
    id: "04",
    title: "Lancement",
    line: "Partenaire −50 % · ambassadeurs",
    detail: "Plateforme qui prend en charge la moitié du prix. Ambassadeurs : de vrais livreurs.",
  },
];

export default function MissionBrief() {
  const [locked, setLocked] = useState<string | null>(null);
  const [spin, setSpin] = useState(true);
  const { speakZone, tick, unlocked, unlock } = useSound();
  const active = BRIEFS.find((b) => b.id === locked) ?? null;

  const select = (id: string) => {
    const b = BRIEFS.find((x) => x.id === id);
    if (!b) return;
    setLocked(id);
    setSpin(false);
    if (!unlocked) void unlock();
    tick();
    speakZone(`Mandat ${b.id}. ${b.line}. ${b.detail}`);
  };

  return (
    <section id="mission" className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute right-[-10%] top-1/2 h-[90vmin] w-[90vmin] -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(240,193,75,0.16) 0%, rgba(42,107,69,0.1) 35%, transparent 68%)",
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <p className="eyebrow">Mission confiée · Briefing live</p>
            <h2 className="display mt-4 text-4xl text-white md:text-6xl">
              Quatre verrous.
              <br />
              <span className="text-[var(--gold)]">Un mandat AirGo.</span>
            </h2>
            <p className="lede mt-6 max-w-md">
              Clique un verrou pour lire le mandat à voix haute.
            </p>

            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  className="mt-10 border-l-2 border-[var(--gold)] pl-5"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                >
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--gold)]">
                    Verrou {active.id} · {active.title}
                  </p>
                  <p className="display mt-3 text-2xl text-white md:text-3xl">{active.line}</p>
                  <p className="mt-4 text-white/70">{active.detail}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setLocked(null);
                      setSpin(true);
                    }}
                    className="mt-6 text-[10px] tracking-[0.28em] uppercase text-white/50 hover:text-[var(--gold)]"
                  >
                    Relâcher l&apos;orbite →
                  </button>
                </motion.div>
              ) : (
                <motion.p key="hint" className="mt-10 text-sm text-white/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Choisis un verrou
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative lg:col-span-7">
            <OrbitPad spin={spin && !locked} locked={locked} onSelect={select} active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

function OrbitPad({
  spin,
  locked,
  onSelect,
  active,
}: {
  spin: boolean;
  locked: string | null;
  onSelect: (id: string) => void;
  active: (typeof BRIEFS)[number] | null;
}) {
  const rot = useMotionValue(0);
  const spring = useSpring(rot, { stiffness: 32, damping: 20, mass: 0.75 });
  const raf = useRef<number | null>(null);
  const sweep = useSpring(0, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (!spin) {
      if (raf.current) cancelAnimationFrame(raf.current);
      return;
    }
    let last = performance.now();
    const loop = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      rot.set((rot.get() + dt * 22) % 360);
      sweep.set((sweep.get() + dt * 55) % 360);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [spin, rot, sweep]);

  useEffect(() => {
    if (!locked) return;
    const idx = BRIEFS.findIndex((b) => b.id === locked);
    rot.set((270 - idx * 90 + 360) % 360);
  }, [locked, rot]);

  const sweepRot = useTransform(sweep, (v) => v);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[680px]">
      <div
        className="absolute inset-[4%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(12,18,12,0.92) 0%, rgba(5,8,5,0.88) 55%, rgba(5,8,5,0.55) 100%)",
          boxShadow:
            "0 0 0 1px rgba(240,193,75,0.35), 0 0 60px rgba(240,193,75,0.18), inset 0 0 80px rgba(0,0,0,0.65)",
        }}
      />
      <svg className="pointer-events-none absolute inset-[6%] h-[88%] w-[88%]" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0c14b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#3d8f5c" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {TICKS.map((t) => (
          <line key={t.i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? "rgba(240,193,75,0.7)" : "rgba(255,255,255,0.25)"} strokeWidth={t.major ? 0.45 : 0.22} />
        ))}
        <circle cx="50" cy="50" r="48.5" fill="none" stroke="url(#ringGold)" strokeWidth="1.1" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(240,193,75,0.45)" strokeWidth="0.55" strokeDasharray="3.5 2.2" />
      </svg>

      <motion.div className="pointer-events-none absolute inset-[6%]" style={{ rotate: sweepRot }}>
        <div
          className="absolute left-1/2 top-1/2 h-[48%] w-[48%] origin-bottom-left"
          style={{
            background: "conic-gradient(from 0deg at 0% 100%, rgba(240,193,75,0.35), transparent 55deg)",
            transform: "translate(-0%, -100%)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full md:h-44 md:w-44"
        style={{
          background: "radial-gradient(circle at 40% 35%, #1a2a1c 0%, #050805 70%)",
          border: "2px solid rgba(240,193,75,0.85)",
        }}
        animate={{
          boxShadow: active
            ? ["0 0 0 6px rgba(240,193,75,0.15), 0 0 50px rgba(240,193,75,0.45)", "0 0 0 10px rgba(240,193,75,0.22), 0 0 80px rgba(240,193,75,0.65)", "0 0 0 6px rgba(240,193,75,0.15), 0 0 50px rgba(240,193,75,0.45)"]
            : ["0 0 0 4px rgba(240,193,75,0.1), 0 0 35px rgba(240,193,75,0.25)", "0 0 0 7px rgba(240,193,75,0.18), 0 0 55px rgba(240,193,75,0.4)", "0 0 0 4px rgba(240,193,75,0.1), 0 0 35px rgba(240,193,75,0.25)"],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[var(--gold)]">Mandat</span>
        <span className="display mt-1 text-xl text-white md:text-2xl">AirGo</span>
      </motion.div>

      <motion.div className="absolute inset-[10%]" style={{ rotate: spring }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(240,193,75,0.55)" strokeWidth="0.7" strokeDasharray="1.2 1.8" />
          {BRIEFS.map((b, i) => (
            <line key={i} x1="50" y1="50" x2={NODE_POS[i].x2} y2={NODE_POS[i].y2} stroke={locked === b.id ? "rgba(240,193,75,0.85)" : "rgba(240,193,75,0.22)"} strokeWidth={locked === b.id ? 0.7 : 0.35} />
          ))}
        </svg>
        {BRIEFS.map((b, i) => (
          <OrbitNode key={b.id} b={b} x={NODE_POS[i].x} y={NODE_POS[i].y} on={locked === b.id} dim={!!(locked && locked !== b.id)} counterRot={spring} onSelect={() => onSelect(b.id)} />
        ))}
      </motion.div>
    </div>
  );
}

function OrbitNode({
  b, x, y, on, dim, counterRot, onSelect,
}: {
  b: (typeof BRIEFS)[number];
  x: number;
  y: number;
  on: boolean;
  dim: boolean;
  counterRot: ReturnType<typeof useSpring>;
  onSelect: () => void;
}) {
  const inv = useTransform(counterRot, (v) => -v);
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0"
      style={{ left: `${x}%`, top: `${y}%`, rotate: inv, opacity: dim ? 0.3 : 1 }}
      whileHover={{ scale: 1.1 }}
      aria-label={`Brief ${b.id} ${b.title}`}
    >
      <motion.div
        className={`flex min-w-[8.5rem] flex-col items-center gap-1 rounded-full px-4 py-2.5 md:min-w-[9.5rem] ${on ? "bg-[var(--gold)] text-black" : "bg-[#0a100c]/95 text-white"}`}
        style={{
          border: on ? "2px solid #f0c14b" : "1.5px solid rgba(240,193,75,0.55)",
          boxShadow: on ? "0 0 28px rgba(240,193,75,0.65)" : "0 0 12px rgba(240,193,75,0.2)",
        }}
      >
        <span className={`text-[11px] font-bold tracking-[0.25em] ${on ? "text-black/65" : "text-[var(--gold)]"}`}>{b.id}</span>
        <span className="text-[12px] font-semibold whitespace-nowrap md:text-[13px]">{b.title}</span>
      </motion.div>
    </motion.button>
  );
}
