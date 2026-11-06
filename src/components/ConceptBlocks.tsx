"use client";

import { motion } from "framer-motion";
import { Reveal } from "./MotionUI";

const MEDIA = {
  field: "/media/casque-camera2.webp",
  soil: "/media/6515384.avif",
  hero: "/media/37994133_1906085183029326_2323955092459356160_o.jpg",
};
const ease = [0.22, 1, 0.36, 1] as const;

export function FreinsRiposte() {
  const rows = [
    {
      id: "F1",
      hear: "Encore un gadget tech",
      riposte: "Preuves sécurité + normes. AirGo se vend comme équipement, pas comme jouet.",
    },
    {
      id: "F2",
      hear: "Trop cher pour un casque",
      riposte: "129,90 € payable en 4× — et −50 % via plateforme partenaire pour les livreurs.",
    },
    {
      id: "F3",
      hear: "Je ne fais pas confiance à l'app",
      riposte: "Transparence data, alerts utiles, partenariats assurances crédibles.",
    },
    {
      id: "F4",
      hear: "Le casque n'est pas obligatoire",
      riposte: "Valoriser le risque urbain réel et le confort design au quotidien.",
    },
  ];

  return (
    <div className="mt-12 space-y-3">
      {rows.map((r, i) => (
        <Reveal key={r.id} delay={i * 0.06}>
          <motion.div
            className="grid overflow-hidden rounded-2xl border border-white/12 md:grid-cols-12"
            style={{ background: "rgba(8,12,10,0.45)", backdropFilter: "blur(14px)" }}
            whileHover={{ borderColor: "rgba(240,193,75,0.45)" }}
          >
            <div className="flex items-center border-b border-white/10 px-5 py-5 md:col-span-1 md:border-b-0 md:border-r md:justify-center">
              <span className="display text-2xl text-[var(--gold)]">{r.id}</span>
            </div>
            <div className="border-b border-white/10 px-6 py-5 md:col-span-5 md:border-b-0 md:border-r md:py-7">
              <p className="text-sm text-white/40">Il entend</p>
              <p className="mt-2 text-xl text-white/75 md:text-2xl">« {r.hear} »</p>
            </div>
            <div className="px-6 py-5 md:col-span-6 md:py-7">
              <p className="text-sm text-[var(--gold)]">Notre réponse</p>
              <p className="mt-2 text-xl font-semibold text-white md:text-2xl">{r.riposte}</p>
            </div>
          </motion.div>
        </Reveal>
      ))}
    </div>
  );
}

export function ValeurEcart() {
  const rows = [
    { c: "Lecture produit", classiq: "Protection seule", sport: "Performance", us: "Sécurité + signal" },
    { c: "Tech", classiq: "Absente", sport: "Parfois", us: "Lumière · clignotants · collision" },
    { c: "Image", classiq: "Fonctionnel", sport: "Sport", us: "Urbain désirable" },
    { c: "Canal", classiq: "Sport retail", sport: "Specialty", us: "Flottes · site · Decathlon" },
    { c: "Confiance", classiq: "Norme", sport: "Marque", us: "Éprouvé par les pros" },
  ];

  return (
    <div className="mt-14 grid gap-8 lg:grid-cols-12">
      <Reveal className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] lg:col-span-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MEDIA.hero} alt="Casque AirGo" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <p className="display text-3xl text-white md:text-4xl">Éprouvé par ceux qui roulent le plus</p>
        </div>
      </Reveal>
      <div className="lg:col-span-7">
        <Reveal>
          <p className="text-base text-white/70 md:text-lg">
            Casques classiques = protection. Marques sport = performance. AirGo = équipement de
            sécurité professionnel, d&apos;abord prouvé par les livreurs.
          </p>
        </Reveal>
        <div className="mt-6 space-y-3">
          {rows.map((r, i) => (
            <Reveal key={r.c} delay={i * 0.05}>
              <div className="rounded-2xl border border-white/12 px-5 py-5" style={{ background: "rgba(8,12,10,0.5)", backdropFilter: "blur(12px)" }}>
                <p className="text-base font-semibold text-white md:text-lg">{r.c}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-white/5 px-2 py-3 text-white/45">Classique<br /><span className="mt-1 block text-white/70">{r.classiq}</span></div>
                  <div className="rounded-lg bg-white/5 px-2 py-3 text-white/45">Sport<br /><span className="mt-1 block text-white/70">{r.sport}</span></div>
                  <div className="rounded-lg bg-[var(--gold)]/15 px-2 py-3 text-[var(--gold)]">AirGo<br /><span className="mt-1 block font-semibold">{r.us}</span></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrixSpine() {
  const offers = [
    {
      name: "AirGo",
      price: "129,90 €",
      text: "Payable en 4 fois. Casque connecté — lumière, clignotants, collision. Concurrentiel vs 100–180 €.",
      hero: true,
    },
    {
      name: "Via plateforme partenaire",
      price: "~65 €",
      text: "La plateforme de livraison prend en charge la moitié du prix pour ses livreurs.",
      hero: false,
    },
    {
      name: "Flottes & sociétés",
      price: "Vente directe",
      text: "Vente directe aux sociétés de livraison et plateformes partenaires.",
      hero: false,
    },
    {
      name: "Grand public",
      price: "Retail",
      text: "Site AirGo, magasins vélo et Decathlon — une fois le produit éprouvé par les pros.",
      hero: false,
    },
  ];

  return (
    <div className="mt-14">
      <div className="relative space-y-6 pl-2 md:space-y-8 md:pl-0">
        <motion.div
          className="absolute bottom-6 left-[1.15rem] top-6 origin-top w-px bg-gradient-to-b from-[var(--gold)] via-white/25 to-transparent md:left-1/2 md:-translate-x-px"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
        />
        {offers.map((o, i) => (
          <motion.div
            key={o.name}
            className={`relative grid items-center gap-4 md:grid-cols-2 ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}
            initial={{ opacity: 0, y: 64, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: o.hero ? 1.02 : 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, delay: i * 0.12, ease }}
          >
            <motion.div
              className={`rounded-[1.5rem] border p-7 md:p-10 ${o.hero ? "border-[var(--gold)]/55 bg-[var(--gold)]/12" : "border-white/12 bg-black/40"}`}
              style={{ backdropFilter: "blur(14px)" }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <p className="text-sm text-white/45">Offre 0{i + 1}</p>
              <h3 className={`display mt-3 text-white ${o.hero ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}>{o.name}</h3>
              <p className={`mt-3 font-semibold text-[var(--gold)] ${o.hero ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`}>{o.price}</p>
              <p className="mt-5 text-base text-white/75 md:text-lg">{o.text}</p>
            </motion.div>
            <div className="hidden md:block" />
            <motion.span
              className="absolute left-[0.85rem] top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[var(--gold)] shadow-[0_0_18px_rgba(240,193,75,0.8)] md:left-1/2 md:-translate-x-1/2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 300, damping: 16 }}
            />
          </motion.div>
        ))}
      </div>
      <Reveal>
        <p className="mt-12 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/8 px-6 py-6 text-base leading-relaxed text-white/85 md:text-lg">
          Prix ancré à 129,90 € (4×) — dans la fourchette concurrente 100–180 €. Le levier volume
          passe par le partenaire plateforme (−50 % livreurs) puis le retail grand public.
        </p>
      </Reveal>
    </div>
  );
}

export function CanauxCascade() {
  const channels = [
    "Vente directe aux sociétés de livraison.",
    "Plateformes partenaires (dont −50 % pour leurs livreurs).",
    "Site AirGo — vente directe.",
    "Magasins vélo — grand public.",
    "Decathlon — grand public, une fois le produit éprouvé.",
  ];

  return (
    <div className="mt-8 space-y-3">
      {channels.map((t, i) => (
        <Reveal key={t} delay={i * 0.06}>
          <motion.div
            className="rounded-2xl border border-white/12 px-5 py-5"
            style={{ width: `${100 - i * 8}%`, background: `rgba(240,193,75,${0.14 - i * 0.02})`, backdropFilter: "blur(10px)" }}
            whileHover={{ x: 8 }}
          >
            <div className="flex gap-4">
              <span className="display text-2xl text-[var(--gold)]">0{i + 1}</span>
              <p className="pt-1 text-base text-white/90 md:text-lg">{t}</p>
            </div>
          </motion.div>
        </Reveal>
      ))}
    </div>
  );
}

export function RseGauge() {
  const pillars = [
    ["Éco-conception", "Matériaux et durée de vie"],
    ["Sécurité", "Moins d'accidents visibles"],
    ["Inclusion", "Offres flottes & collectivités"],
    ["Sobriété", "Électronique utile, pas gadget"],
  ];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/15">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={MEDIA.soil} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative px-6 py-14 md:px-12 md:py-20">
        <Reveal>
          <p className="eyebrow">Durabilité &amp; RSE</p>
          <h2 className="display mt-4 max-w-3xl text-4xl text-white md:text-5xl">
            Mobilité douce, innovation responsable.
          </h2>
        </Reveal>
        <p className="mt-8 max-w-2xl text-lg text-white/75 md:text-xl">
          La durabilité n&apos;est pas un sticker. Écoconception, utilité réelle de la tech, et
          partenariats qui réduisent le risque urbain.
        </p>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(([a, b], i) => (
            <Reveal key={a} delay={0.08 * i}>
              <div className="rounded-2xl border border-white/15 bg-black/45 p-6 backdrop-blur-md">
                <p className="display text-2xl text-[var(--gold)] md:text-3xl">{a}</p>
                <p className="mt-3 text-base text-white/80">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DecisionsBoard() {
  const decisions = [
    "Cible prioritaire : professionnels de la livraison (vélo / trottinette).",
    "Cible suivante : grand public urbain, une fois le produit éprouvé par les pros.",
    "Positionnement : équipement de sécurité professionnel, éprouvé par ceux qui roulent le plus.",
    "Prix 129,90 € en 4× · distribution flottes + site + magasins vélo / Decathlon · partenaire plateforme −50 %.",
    "Ambassadeurs : de vrais livreurs qui partagent leur quotidien (persona Pierre, Marseille).",
  ];

  return (
    <div className="mt-12 grid gap-4 md:grid-cols-2">
      {decisions.map((t, i) => (
        <Reveal key={t} delay={i * 0.07} className={i === 4 ? "md:col-span-2" : ""}>
          <motion.div
            className="relative overflow-hidden rounded-[1.5rem] border border-white/15 p-7 md:p-9"
            style={{ background: "rgba(8,12,10,0.55)", backdropFilter: "blur(16px)" }}
            whileHover={{ y: -4, borderColor: "rgba(240,193,75,0.5)" }}
          >
            <span className="pointer-events-none absolute -right-2 -top-4 display text-[7rem] leading-none text-white/[0.06]">0{i + 1}</span>
            <p className="text-sm text-[var(--gold)]">Décision 0{i + 1}</p>
            <p className="relative mt-5 text-xl text-white md:text-2xl">{t}</p>
          </motion.div>
        </Reveal>
      ))}
    </div>
  );
}
