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
    id: "secu",
    tab: "Sécurité",
    title: "Équipement de sécurité professionnel",
    body: "Éprouvé par ceux qui roulent le plus — les livreurs. Éclairage, clignotants, collision : la tech doit tenir le rythme pro, pas l'image gadget.",
    image: "/media/casque-camera2.webp",
  },
  {
    id: "design",
    tab: "Design",
    title: "Identité urbaine forte",
    body: "Associer protection et style. AirGo doit être désirable dans la rue, pas seulement « technique ».",
    image: "/media/37994133_1906085183029326_2323955092459356160_o.jpg",
  },
  {
    id: "confiance",
    tab: "Confiance",
    title: "Ambassadeurs livreurs",
    body: "De vrais livreurs qui partagent leur quotidien. Partenaire plateforme : −50 % du prix pour ses livreurs.",
    image: "/media/6515369.avif",
  },
  {
    id: "marche",
    tab: "Marché",
    title: "Pros d'abord, grand public ensuite",
    body: "Cible prioritaire : pros livraison vélo / trottinette. Puis grand public urbain via magasins vélo et Decathlon.",
    image: "/media/7056522.avif",
  },
];

export default function ZoneSwiper() {
  const [active, setActive] = useState(1);

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Territoire</p>
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
              animate={{ flexGrow: open ? 7.5 : 1, flexBasis: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.7 }}
              aria-expanded={open}
            >
              <motion.div className="absolute inset-0 bg-white" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.35 }} />
              <motion.div className="absolute inset-0" animate={{ opacity: open ? 1 : 0 }} transition={{ duration: 0.4 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pad.image} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
              </motion.div>
              <motion.div className="absolute inset-0 z-10 flex items-center justify-center" animate={{ opacity: open ? 0 : 1 }}>
                <span className="text-[11px] font-semibold tracking-[0.35em] uppercase text-black/55" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  {pad.tab}
                </span>
              </motion.div>
              <motion.div
                className="relative z-10 flex h-full flex-col justify-center px-8 py-10 md:px-14"
                animate={{ opacity: open ? 1 : 0, x: open ? 0 : -24 }}
                style={{ pointerEvents: open ? "auto" : "none" }}
              >
                <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/55">{pad.tab}</p>
                <h3 className="display mt-4 max-w-md text-3xl text-white md:text-5xl">{pad.title}</h3>
                <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/80 md:text-[15px]">{pad.body}</p>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
