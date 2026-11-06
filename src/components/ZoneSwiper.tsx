"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Pad = {
  id: string;
  tab: string;
  title: string;
  body: string;
  image: string;
};

const PADS: Pad[] = [
  {
    id: "climat",
    tab: "Climat",
    title: "Pression climatique",
    body: "Sécheresses et arrêtés d'irrigation récurrents. Hérault & Gard : le stress hydrique rend le signal capteur immédiatement utile.",
    image: "/media/field.jpg",
  },
  {
    id: "parcelle",
    tab: "Parcelle",
    title: "Valeur parcelle",
    body: "AOC / IGP : un investissement sous 1 000 € se justifie. Priorité Pic-Saint-Loup, Larzac, Costières — preuve terrain d'abord.",
    image: "/media/vineyard.jpg",
  },
  {
    id: "reseau",
    tab: "Réseau",
    title: "Prescription",
    body: "Caves, chambres, CIVAM, salon SITEVI. Sans le canal coopératif, les volumes chutent d'environ 50 %.",
    image: "/media/hands.jpg",
  },
  {
    id: "marche",
    tab: "Marché",
    title: "Hypothèses explicites",
    body: "6 500–8 000 exploitations viti. Cible 3 ans : 1 200–1 800. Panier 1 100–1 400 €. Marché local 1,5–2,5 M€. H2 : 180 clients à 12 mois / 450 à 24 mois.",
    image: "/media/grapes.jpg",
  },
];

/**
 * Swipe pad type capture — pastilles blanches verticales,
 * hover = une s'ouvre, les autres se ferment.
 */
export default function ZoneSwiper() {
  const [active, setActive] = useState(1);

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Zone</p>
      </div>

      <div
        className="flex h-[min(72vh,560px)] gap-2 md:gap-3"
        onMouseLeave={() => setActive(1)}
      >
        {PADS.map((pad, i) => {
          const open = active === i;
          return (
            <motion.button
              key={pad.id}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`relative overflow-hidden rounded-[2rem] text-left outline-none md:rounded-[2.5rem] ${
                open ? "cursor-default" : "cursor-pointer"
              }`}
              animate={{
                flexGrow: open ? 7.5 : 1,
                flexBasis: 0,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.7 }}
              aria-expanded={open}
              aria-label={pad.tab}
            >
              {/* Fermé = pastille blanche */}
              <motion.div
                className="absolute inset-0 bg-white"
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.35 }}
              />

              {/* Ouvert = image + overlay */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: open ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pad.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
              </motion.div>

              {/* Label vertical (fermé) */}
              <motion.div
                className="absolute inset-0 z-10 flex items-center justify-center"
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.25 }}
              >
                <span
                  className="text-[11px] font-semibold tracking-[0.35em] uppercase text-black/55"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {pad.tab}
                </span>
              </motion.div>

              {/* Contenu ouvert */}
              <motion.div
                className="relative z-10 flex h-full flex-col justify-center px-8 py-10 md:px-14 md:py-12"
                animate={{
                  opacity: open ? 1 : 0,
                  x: open ? 0 : -24,
                }}
                transition={{ duration: 0.4, delay: open ? 0.08 : 0 }}
                style={{ pointerEvents: open ? "auto" : "none" }}
              >
                <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/55">
                  {pad.tab}
                </p>
                <h3 className="display mt-4 max-w-md text-3xl leading-[1.05] text-white md:text-5xl">
                  {pad.title}
                </h3>
                <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/80 md:text-[15px]">
                  {pad.body}
                </p>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
