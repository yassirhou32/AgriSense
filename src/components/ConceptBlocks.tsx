"use client";

import { motion } from "framer-motion";
import { Reveal } from "./MotionUI";

const MEDIA = {
  field: "/media/field.jpg",
  soil: "/media/soil.jpg",
};

const ease = [0.22, 1, 0.36, 1] as const;

/** FREINS — Objection → Riposte */
export function FreinsRiposte() {
  const rows = [
    {
      id: "F1",
      hear: "Encore un boîtier cher",
      riposte: "Pack Essentiel à 890 € HT, avec une fiche ROI d'une page.",
    },
    {
      id: "F2",
      hear: "Pas le temps d'apprendre",
      riposte: "Écran 3 feux et accompagnement 90 jours. Décision en dix secondes.",
    },
    {
      id: "F3",
      hear: "Qui voit mes parcelles ?",
      riposte: "Contrat d'une page : les données restent à l'exploitant.",
    },
    {
      id: "F4",
      hear: "Ça marche sur mon sol ?",
      riposte: "12 fermes pilotes par appellation. La preuve vient du voisin.",
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

/** VALEUR — écart concurrentiel */
export function ValeurEcart() {
  const rows = [
    { c: "Prix d'entrée", meteo: "Abonnement", prem: "Élevé", us: "890 €" },
    { c: "Mesure du sol", meteo: "Partielle", prem: "Oui, chère", us: "Trio intégré" },
    { c: "Lecture", meteo: "Variable", prem: "Expert", us: "3 feux + 1 reco" },
    { c: "Canal", meteo: "Parfois", prem: "Faible", us: "Cave en priorité" },
    { c: "RSE", meteo: "Rare", prem: "Rare", us: "Fiche eau" },
  ];

  return (
    <div className="mt-14 grid gap-8 lg:grid-cols-12">
      <Reveal className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] lg:col-span-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MEDIA.field} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <p className="display text-3xl text-white md:text-4xl">
            Humidité · Température · Nutriments
          </p>
        </div>
      </Reveal>

      <div className="lg:col-span-7">
        <Reveal>
          <p className="text-base text-white/70 md:text-lg">
            Weenat et Sencrop couvrent surtout la météo parcelle. Les sondes premium restent
            chères. Voici où AgriSense se place.
          </p>
        </Reveal>
        <div className="mt-6 space-y-3">
          {rows.map((r, i) => (
            <Reveal key={r.c} delay={i * 0.05}>
              <div
                className="rounded-2xl border border-white/12 px-5 py-5"
                style={{ background: "rgba(8,12,10,0.5)", backdropFilter: "blur(12px)" }}
              >
                <p className="text-base font-semibold text-white md:text-lg">{r.c}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-white/5 px-2 py-3 text-white/45">
                    Météo
                    <div className="mt-1 text-white/70">{r.meteo}</div>
                  </div>
                  <div className="rounded-lg bg-white/5 px-2 py-3 text-white/45">
                    Premium
                    <div className="mt-1 text-white/70">{r.prem}</div>
                  </div>
                  <div className="rounded-lg bg-[var(--gold)]/15 px-2 py-3 text-[var(--gold)]">
                    AgriSense
                    <div className="mt-1 font-semibold">{r.us}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
            Ce qui compte : un matériel accessible, une reco lisible, une preuve locale, et un
            prescripteur que l&apos;agriculteur écoute déjà.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

/** PRIX — échelle animée (descend + grandit) */
export function PrixSpine() {
  const offers = [
    {
      name: "Essentiel",
      price: "890 € HT",
      text: "3 capteurs, gateway, application 3 feux.",
      hero: true,
    },
    {
      name: "Pro Parcelle",
      price: "2 190 € HT",
      text: "8 capteurs, alertes et historique.",
      hero: false,
    },
    {
      name: "Insight",
      price: "19 € / mois",
      text: "Recommandations et export RSE.",
      hero: false,
    },
    {
      name: "Pack Cave",
      price: "Sur devis",
      text: "Multi-adhérents et formation.",
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
            className={`relative grid items-center gap-4 md:grid-cols-2 ${
              i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
            }`}
            initial={{ opacity: 0, y: 64, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: o.hero ? 1.02 : 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, delay: i * 0.12, ease }}
          >
            <motion.div
              className={`rounded-[1.5rem] border p-7 md:p-10 ${
                o.hero
                  ? "border-[var(--gold)]/55 bg-[var(--gold)]/12"
                  : "border-white/12 bg-black/40"
              }`}
              style={{ backdropFilter: "blur(14px)" }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <p className="text-sm text-white/45">Offre 0{i + 1}</p>
              <h3
                className={`display mt-3 text-white ${
                  o.hero ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
                }`}
              >
                {o.name}
              </h3>
              <motion.p
                className={`mt-3 font-semibold text-[var(--gold)] ${
                  o.hero ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
                }`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.55 }}
              >
                {o.price}
              </motion.p>
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
          Coût usine Essentiel : 280–340 €. Marge brute environ 50 %. Seuil de rentabilité vers
          M16–M18 avec 180 clients et 30 % d&apos;abonnés. À 1 190 €, on perd le volume S1.
        </p>
      </Reveal>
    </div>
  );
}

/** CANAUX — cascade */
export function CanauxCascade() {
  const channels = [
    "Techniciens de caves — 3 partenaires la première année (Saint-Chinian, Pic-Saint-Loup, Costières).",
    "Chambre d'agriculture et CIVAM — journées techniques.",
    "Deux business developers terrain — fermes pilotes.",
    "SITEVI et portes ouvertes parcelle — résultats réels.",
    "Site web — témoignage et prise de rendez-vous uniquement.",
  ];

  return (
    <div className="mt-8 space-y-3">
      {channels.map((t, i) => {
        const width = 100 - i * 8;
        return (
          <Reveal key={t} delay={i * 0.06}>
            <motion.div
              className="rounded-2xl border border-white/12 px-5 py-5"
              style={{
                width: `${width}%`,
                background: `rgba(240,193,75,${0.14 - i * 0.02})`,
                backdropFilter: "blur(10px)",
              }}
              whileHover={{ x: 8 }}
            >
              <div className="flex gap-4">
                <span className="display text-2xl text-[var(--gold)]">0{i + 1}</span>
                <p className="pt-1 text-base text-white/90 md:text-lg">{t}</p>
              </div>
            </motion.div>
          </Reveal>
        );
      })}
    </div>
  );
}

/** RSE */
export function RseGauge() {
  const pillars = [
    ["Eau", "Moins de tours inutiles"],
    ["Intrants", "Fertilisation mieux calée"],
    ["Numérique", "Réseau LoRa sobre"],
    ["Inclusion", "Remise −12 % sous 15 ha"],
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
            Sobriété hydrique, sans promesse mensongère.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-end gap-4 md:gap-8">
            <p className="display text-[clamp(3rem,12vw,7rem)] leading-none text-[var(--gold)]">
              −12%
            </p>
            <div className="mb-4 h-px w-16 bg-white/30 md:mb-8 md:w-24" />
            <div>
              <p className="display text-[clamp(3rem,12vw,7rem)] leading-none text-white">−30%</p>
              <p className="mt-3 text-base text-white/60">selon les sols et les pratiques</p>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 max-w-2xl text-lg text-white/75 md:text-xl">
          Promettre −35 % d&apos;eau partout serait faux. On vise une baisse réelle, mesurée
          parcelle par parcelle.
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

/** DÉCISIONS */
export function DecisionsBoard() {
  const decisions = [
    "Figer Hérault et Gard. Pas de dispersion en année 1.",
    "Pack Essentiel à 890 € HT, avec l'écran 3 feux.",
    "Convention cave et 12 fermes pilotes avant toute campagne large.",
    "Contrat data d'une page : propriété, usage, non-revente.",
    "Pas de discours IA ou big data à ce stade.",
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
            <span className="pointer-events-none absolute -right-2 -top-4 display text-[7rem] leading-none text-white/[0.06]">
              0{i + 1}
            </span>
            <p className="text-sm text-[var(--gold)]">Décision 0{i + 1}</p>
            <p className="relative mt-5 text-xl text-white md:text-2xl">{t}</p>
          </motion.div>
        </Reveal>
      ))}
    </div>
  );
}
