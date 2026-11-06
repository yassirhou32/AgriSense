"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSound } from "./Soundscape";

type Zone = {
  id: string;
  name: string;
  tag: string;
  text: string;
  cx: number;
  cy: number;
  hint: string;
};

const ZONES: Zone[] = [
  {
    id: "paris",
    name: "Paris & IDF",
    tag: "Priorité 1 · Densité",
    text: "Plus forte densité de mobilité douce et de livreurs. Terrain idéal pour preuve d'usage et partenariats flottes.",
    cx: 48,
    cy: 28,
    hint: "Volume + visibilité nationale",
  },
  {
    id: "lyon",
    name: "Lyon",
    tag: "Priorité 1 · Mix urbain",
    text: "Réseau cyclable structuré, navetteurs et last-mile. Bon terrain pour tester le positionnement sécurité × design.",
    cx: 58,
    cy: 42,
    hint: "Mix cyclistes / livreurs",
  },
  {
    id: "marseille",
    name: "Marseille",
    tag: "Priorité 1 · Persona Pierre",
    text: "Terrain du persona : Pierre, 27 ans, livreur VAE six soirs par semaine. Preuve d'usage intensif et ambassadeurs livreurs.",
    cx: 62,
    cy: 58,
    hint: "Persona + ambassadeurs",
  },
  {
    id: "bordeaux",
    name: "Bordeaux",
    tag: "Priorité 2 · Image",
    text: "Ville cyclable et image lifestyle : utile pour ancrer le design urbain et les partenariats locaux.",
    cx: 32,
    cy: 52,
    hint: "Design & lifestyle",
  },
];

export default function OccitanieMap() {
  const [active, setActive] = useState("paris");
  const [pulse, setPulse] = useState(0);
  const zone = ZONES.find((z) => z.id === active) ?? ZONES[0];
  const { zoneTone, speakZone, unlocked, unlock } = useSound();

  const select = (id: string) => {
    const z = ZONES.find((x) => x.id === id) ?? ZONES[0];
    setActive(id);
    setPulse((n) => n + 1);
    zoneTone(id);
    speakZone(`${z.name}. ${z.text}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="panel-strong relative overflow-hidden p-4 md:p-6 lg:col-span-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/45">
            Carte villes — clique un nom
          </p>
          {!unlocked && (
            <button type="button" onClick={() => void unlock()} className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] hover:underline">
              Activer le son ▶
            </button>
          )}
        </div>
        <svg viewBox="0 0 100 70" className="h-auto w-full" role="img" aria-label="Villes cibles AirGo">
          <defs>
            <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a3d28" />
              <stop offset="100%" stopColor="#0d1a12" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="100" height="70" fill="#050805" />
          <motion.path
            d="M22,18 C35,10 55,12 70,20 C82,28 88,42 84,54 C78,64 60,68 42,66 C28,64 16,52 14,38 C12,26 16,20 22,18 Z"
            fill="url(#land)"
            stroke="rgba(240,193,75,0.35)"
            strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />
          <text x="8" y="12" fill="rgba(255,255,255,0.45)" fontSize="2.4">
            FRANCE URBAINE
          </text>

          {ZONES.map((z) => (
            <line key={`l-${z.id}`} x1="50" y1="40" x2={z.cx} y2={z.cy} stroke={active === z.id ? "rgba(240,193,75,0.55)" : "rgba(255,255,255,0.08)"} strokeWidth="0.25" />
          ))}
          <circle cx="50" cy="40" r="1.4" fill="#f0c14b" filter="url(#glow)" />

          {ZONES.map((z) => {
            const on = active === z.id;
            return (
              <g key={z.id} className="cursor-pointer" onClick={() => select(z.id)} role="button" tabIndex={0} aria-label={`Écouter ${z.name}`} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") select(z.id); }}>
                <rect x={z.cx - 4} y={z.cy - 6} width={Math.max(22, z.name.length * 2)} height={10} fill="transparent" />
                {on && (
                  <motion.circle key={`ring-${pulse}-${z.id}`} cx={z.cx} cy={z.cy} r={3} fill="none" stroke="#f0c14b" strokeWidth="0.4" initial={{ r: 2, opacity: 0.9 }} animate={{ r: 9, opacity: 0 }} transition={{ duration: 0.85 }} />
                )}
                <motion.circle cx={z.cx} cy={z.cy} r={on ? 3.2 : 2.2} fill={on ? "#f0c14b" : "#3d8f5c"} filter="url(#glow)" animate={{ r: on ? [2.6, 3.5, 2.6] : 2.2 }} transition={{ duration: 1.8, repeat: on ? Infinity : 0 }} />
                <text x={z.cx + 4} y={z.cy - 2} fill={on ? "#fff" : "rgba(255,255,255,0.55)"} fontSize="2.3" fontWeight={on ? 700 : 400} style={{ pointerEvents: "none" }}>
                  {z.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="lg:col-span-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={zone.id}
            className="panel-strong flex h-full flex-col p-7"
            initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4 }}
          >
            <p className="eyebrow">{zone.tag}</p>
            <h3 className="display mt-4 text-3xl text-white">{zone.name}</h3>
            <p className="mt-5 flex-1 text-[15px] leading-relaxed text-white/75">{zone.text}</p>
            <button type="button" onClick={() => select(zone.id)} className="mt-6 border-t border-white/15 pt-5 text-left">
              <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold)]">Voix · recliquer</p>
              <p className="mt-2 text-sm text-white/55">{zone.hint}</p>
            </button>
            <div className="mt-6 flex gap-2">
              {ZONES.map((z) => (
                <button key={z.id} type="button" onClick={() => select(z.id)} className={`h-2 flex-1 transition ${active === z.id ? "bg-[var(--gold)]" : "bg-white/15 hover:bg-white/30"}`} aria-label={z.name} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
