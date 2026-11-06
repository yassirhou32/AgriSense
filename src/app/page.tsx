"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import IntroGate from "@/components/IntroGate";
import OccitanieMap from "@/components/OccitanieMap";
import LazyMount from "@/components/LazyMount";
import LiveLab from "@/components/LiveLab";
import Hero from "@/components/Hero";
import { SceneFreins, SceneSignal } from "@/components/SectionScenes";
import { SmoothProgress, Reveal, CountUp } from "@/components/MotionUI";
import { OpenPhoto } from "@/components/CinematicBlocks";
import SectionBridge from "@/components/SectionBridge";
import MissionBrief from "@/components/MissionBrief";
import ZoneSwiper from "@/components/ZoneSwiper";
import GlassCard from "@/components/GlassCard";
import {
  FreinsRiposte,
  ValeurEcart,
  PrixSpine,
  CanauxCascade,
  RseGauge,
  DecisionsBoard,
} from "@/components/ConceptBlocks";

const SensorScene = dynamic(() => import("@/components/SensorScene"), { ssr: false });
const CurveField3D = dynamic(() => import("@/components/CurveField3D"), { ssr: false });

const MEDIA = {
  vineyard: "/media/vineyard.jpg",
  field: "/media/field.jpg",
  hands: "/media/hands.jpg",
  soil: "/media/soil.jpg",
  grapes: "/media/grapes.jpg",
};

export default function Home() {
  return (
    <IntroGate>
      <SmoothProgress />

      <main className="relative">
        {/* NAV */}
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10">
          <a href="#top" className="text-[12px] font-bold tracking-[0.35em] uppercase text-white">
            AgriSense
          </a>
          <nav className="hidden gap-6 text-[10px] font-semibold tracking-[0.22em] uppercase text-white/70 md:flex">
            {[
              ["#mission", "Mission"],
              ["#zone", "Zone"],
              ["#valeur", "Valeur"],
              ["#prix", "Prix"],
              ["#rse", "RSE"],
              ["#lab", "Lab"],
            ].map(([h, l]) => (
              <a key={h} href={h} className="hover:text-[var(--gold)]">
                {l}
              </a>
            ))}
          </nav>
        </header>

        <Hero />

        <SectionBridge index="01" from="Accueil" to="Mission" />

        <MissionBrief />

        <SectionBridge index="02" from="Mission" to="Zone" />

        {/* ——— ZONE (Word contrainte geo) ——— full bleed différent */}
        <section id="zone" className="relative">
          <div className="relative h-[70vh] min-h-[420px] overflow-hidden">
            <motion.img
              src={MEDIA.vineyard}
              alt="Occitanie viticole"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6 }}
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 flex items-end px-5 pb-16 md:px-10">
              <Reveal className="mx-auto w-full max-w-7xl">
                <p className="eyebrow">Zone retenue</p>
                <h2 className="display mt-3 max-w-3xl text-4xl text-white md:text-6xl">
                  Hérault &amp; Gard — pas la Beauce, pas la Bretagne.
                </h2>
              </Reveal>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-5 py-20 md:px-10">
            <ZoneSwiper />

            <div className="mt-20">
              <Reveal>
                <p className="eyebrow mb-6">Carte interactive</p>
              </Reveal>
              <OccitanieMap />
            </div>
          </div>
        </section>

        <SectionBridge index="03" from="Zone" to="Segments" />

        {/* ——— SEGMENTS (Word Q1) ——— horizontal scroll = différent */}
        <section id="segments" className="relative px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Segments d&apos;adoption</p>
              <h2 className="display mt-4 max-w-3xl text-4xl text-white md:text-5xl">
                Qui a le plus fort potentiel ?
              </h2>
              <p className="lede mt-4 max-w-2xl">
                Pas les early adopters (déjà Weenat / Sencrop). Le volume : viticulteur
                pragmatique, peu digital, marqué par 2022–2023.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <GlassCard
                index="01"
                label="Segment S1 · Priorité 1"
                title="Viticulteurs 15–80 ha AOC/IGP"
                body="Stress hydrique + qualité millésime. Canal : technicien de cave. Pas les early adopters déjà équipés Weenat / Sencrop — le volume pragmatique."
                items={[
                  "Stress hydrique & millésime",
                  "Canal technicien de cave",
                  "Cible volume S1",
                ]}
              />
              <GlassCard
                index="02"
                label="Segment S2 · Priorité 1 bis"
                title="Arboriculture"
                body="Irrigation déjà en place. Même offre, discours agronomique adapté. Extension naturelle une fois la preuve viticole posée."
                items={[
                  "Irrigation déjà structurée",
                  "Même offre AgriSense",
                  "Discours agronomique adapté",
                ]}
              />
              <GlassCard
                index="03"
                label="Segment S3 · Priorité 2"
                title="Grandes cultures"
                body="ROI plus long. Après la preuve viticole seulement (M15+). Pas d'attaque frontale en année 1."
                items={[
                  "ROI plus long",
                  "Après preuve viti · M15+",
                  "Pas d'attaque année 1",
                ]}
              />
            </div>

            {/* Persona Marc — même langage glass */}
            <div className="mt-8 grid gap-5 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <OpenPhoto src={MEDIA.hands} alt="Terrain" caption="Persona S1" side="left" />
              </Reveal>
              <div className="lg:col-span-7">
                <GlassCard
                  index="04"
                  label="Profil type · Persona S1"
                  title="Marc, 47 ans — 32 ha"
                  body="Costières, adhérent coopérative. Peu d'apps. En 2022, deux tours d'eau mal calés > coût d'un pack Essentiel. Il n'achète pas sur le web. Il achète si son technicien dit qu'un voisin a gagné ~20 % d'eau sans perdre en degré. Industrialiser ce scénario."
                  items={[
                    "Costières · adhérent coopératif",
                    "Preuve voisin > discours produit",
                    "Industrialiser le scénario Marc",
                  ]}
                  className="min-h-[440px] h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ——— FREINS (Word contrainte) ——— glass comme segments */}
        <section className="relative px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-end gap-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <p className="eyebrow">Freins à l&apos;adoption</p>
                <h2 className="display mt-4 text-4xl text-white md:text-5xl">
                  Au moins deux freins.
                  <br />
                  <span className="text-[var(--gold)]">Nous en traitons quatre.</span>
                </h2>
              <p className="lede mt-5 max-w-xl">
                Ce qu&apos;il entend, et ce que l&apos;on répond.
              </p>
              </Reveal>
              <Reveal className="lg:col-span-5" delay={0.1}>
                <SceneFreins />
              </Reveal>
            </div>

            <FreinsRiposte />
          </div>
        </section>

        <SectionBridge index="04" from="Freins" to="Valeur" />

        {/* ——— VALEUR — concept écart concurrentiel ——— */}
        <section id="valeur" className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Proposition de valeur unique</p>
              <h2 className="display mt-4 max-w-4xl text-4xl text-white md:text-6xl">
                Une reco d&apos;irrigation fiable, locale, lisible en dix secondes —
                avec la preuve que l&apos;eau baisse sans casser la récolte.
              </h2>
            </Reveal>

            <ValeurEcart />

            <Reveal className="mt-14">
              <LazyMount
                className="h-[380px] overflow-hidden rounded-[1.5rem] border border-white/15 md:h-[440px]"
                minHeight={380}
              >
                <SensorScene
                  className="h-full w-full"
                  showTerrain
                  interactive
                  label="Capteur 3D — orbit / zoom / clic"
                />
              </LazyMount>
            </Reveal>
          </div>
        </section>

        <SectionBridge index="05" from="Valeur" to="Prix & canaux" />

        {/* ——— PRIX — échelle d'entrée + cascade canaux ——— */}
        <section id="prix" className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Prix · Distribution · Communication</p>
              <h2 className="display mt-4 text-4xl text-white md:text-6xl">
                Accessibilité et rentabilité.
              </h2>
            </Reveal>

            <PrixSpine />

            <div className="mt-20 grid gap-12 lg:grid-cols-2">
              <div>
                <Reveal>
                  <p className="eyebrow">Canaux (du plus crédible)</p>
                </Reveal>
                <CanauxCascade />
              </div>
              <Reveal delay={0.1}>
                <p className="eyebrow">Ton de communication</p>
                <p className="display mt-6 text-3xl text-white md:text-4xl">
                  Concret. Respectueux du métier.
                </p>
                <p className="mt-5 text-white/65">
                  On évite « révolutionnez votre exploitation ». On privilégie les chiffres
                  d&apos;une parcelle réelle et le témoignage d&apos;un technicien. Pas de discours
                  IA / big data à ce stade.
                </p>
                <div className="mt-8">
                  <SceneSignal />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <SectionBridge index="06" from="Prix" to="RSE" />

        {/* ——— RSE — fourchette honnête ——— */}
        <section id="rse" className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <RseGauge />
          </div>
        </section>

        {/* ——— PLAN 24 MOIS + KPI ——— */}
        <section className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Plan d&apos;action &amp; indicateurs</p>
              <h2 className="display mt-4 text-4xl text-white md:text-5xl">
                Preuve → Ancrage → Extension
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-0 md:grid-cols-3">
              {[
                ["01", "Preuve", "M1–M6", "12 fermes, 1 cave, UX 3 feux", "Preuves locales"],
                ["02", "Ancrage", "M7–M14", "3 caves, 2 BD, Insight", "180 clients"],
                ["03", "Extension", "M15–M24", "Aude / P.-O., Pack Cave", "450 exploitations"],
              ].map((r, i) => (
                <Reveal key={r[1]} delay={i * 0.1}>
                  <div className="relative min-h-[260px] border border-white/15 p-8 md:border-l-0 md:first:border-l">
                    <span className="display text-6xl text-white/10">{r[0]}</span>
                    <p className="eyebrow mt-2">{r[2]}</p>
                    <h3 className="display mt-2 text-3xl text-white">{r[1]}</h3>
                    <p className="mt-4 text-white/65">{r[3]}</p>
                    <p className="mt-6 text-sm text-[var(--gold)]">{r[4]}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {[
                [180, "", "Clients M12"],
                [450, "", "Clients M24"],
                [30, "%", "Abo Insight"],
                [3, "", "Caves Y1"],
                [18, "%", "Eau médiane"],
                [35, "", "NPS pilotes"],
              ].map(([n, s, l], i) => (
                <Reveal key={String(l)} delay={i * 0.05}>
                  <p className="display text-3xl text-[var(--gold)] md:text-4xl">
                    <CountUp to={n as number} suffix={s as string} />
                  </p>
                  <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/45">{l}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge index="07" from="Plan 24 mois" to="Lab" />

        {/* ——— LAB ——— */}
        <section id="lab" className="relative bg-black/50 px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Outil de soutenance</p>
              <h2 className="display mt-4 text-4xl text-white md:text-5xl">
                Lab interactif — hypothèses 24 mois
              </h2>
            </Reveal>
            <div className="mt-10">
              <LiveLab />
            </div>
            <Reveal className="mt-16">
              <p className="eyebrow mb-6">Signal sol 3D</p>
              <LazyMount minHeight={400}>
                <CurveField3D />
              </LazyMount>
            </Reveal>
          </div>
        </section>

        <SectionBridge index="08" from="Lab" to="Décisions" />

        {/* ——— DÉCISIONS — verdict board ——— */}
        <section className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Synthèse — décisions maintenant</p>
              <h2 className="display mt-4 max-w-3xl text-4xl text-white md:text-6xl">
                Le produit ne se vend pas tout seul.
              </h2>
              <p className="lede mt-5 max-w-2xl">
                Ce qui se vend : une preuve locale portée par quelqu&apos;un que
                l&apos;agriculteur écoute déjà.
              </p>
            </Reveal>
            <DecisionsBoard />
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative px-5 pb-28 md:px-10">
          <Reveal>
            <div className="mx-auto max-w-4xl border border-white/15 bg-black/60 px-8 py-16 text-center backdrop-blur-md md:px-16">
              <p className="eyebrow">Équipe conseil</p>
              <h2 className="display mt-4 text-4xl text-white md:text-5xl">
                HOUARI · HANINI · Lila
              </h2>
              <p className="mt-4 text-white/55">Polytech Marseille — Cours commun</p>
              <a href="mailto:contact@agrisense.demo" className="btn-gold mt-10">
                Demander une démo
              </a>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-white/10 px-5 py-6 text-[10px] tracking-[0.2em] uppercase text-white/35 md:flex md:justify-between md:px-10">
          <span>AgriSense — contenu aligné étude de cas / rapport</span>
          <span className="mt-2 block md:mt-0">Sources : Agreste · DRAAF · FranceAgriMer</span>
        </footer>
      </main>
    </IntroGate>
  );
}
