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

const HelmetScene = dynamic(() => import("@/components/HelmetScene"), { ssr: false });
const CurveField3D = dynamic(() => import("@/components/CurveField3D"), { ssr: false });
const TravelingHelmet = dynamic(() => import("@/components/TravelingHelmet"), { ssr: false });

const MEDIA = {
  heroHelmet: "/media/37994133_1906085183029326_2323955092459356160_o.jpg",
  product: "/media/casque-camera2.webp",
  city: "/media/6515384.avif",
  night: "/media/6515369.avif",
  commute: "/media/7056522.avif",
  lifestyle: "/media/6480926.avif",
  hands: "/media/hands.jpg",
};

export default function Home() {
  return (
    <IntroGate>
      <SmoothProgress />
      <TravelingHelmet />

      <main className="relative">
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10">
          <a href="#top" className="text-[12px] font-bold tracking-[0.35em] uppercase text-white">
            AirGo
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

        <section id="zone" className="relative">
          <div className="relative h-[70vh] min-h-[420px] overflow-hidden">
            <motion.img
              src={MEDIA.city}
              alt="Mobilité urbaine casque connecté"
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
                  Métropoles françaises — mobilité douce densifiée.
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

        <section id="segments" className="relative px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Segments d&apos;adoption</p>
              <h2 className="display mt-4 max-w-3xl text-4xl text-white md:text-5xl">
                Qui a le plus fort potentiel ?
              </h2>
              <p className="lede mt-4 max-w-2xl">
                Cible prioritaire : les professionnels de la livraison à vélo ou trottinette.
                Ensuite le grand public urbain, une fois le produit éprouvé par les pros.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <GlassCard
                index="01"
                label="Cible prioritaire"
                title="Pros de la livraison"
                body="Indépendants et entreprises — vélo ou trottinette. Ils roulent le plus, la nuit, sous pression. Premier terrain de preuve."
                items={["Indépendants", "Flottes entreprises", "Vélo & trottinette"]}
              />
              <GlassCard
                index="02"
                label="Cible suivante"
                title="Grand public urbain"
                body="Ouvert une fois le produit éprouvé par les pros. Canal magasins vélo et Decathlon, crédibilisé par l'usage intensif."
                items={["Après preuve pro", "Magasins vélo", "Decathlon"]}
              />
              <GlassCard
                index="03"
                label="Positionnement"
                title="Équipement pro"
                body="Un équipement de sécurité professionnel, éprouvé par ceux qui roulent le plus — pas un gadget lifestyle."
                items={["Sécurité pro", "Preuve d'usage", "Crédibilité rue"]}
              />
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <OpenPhoto src={MEDIA.commute} alt="Livreur urbain casque" caption="Persona · Pierre" side="left" />
              </Reveal>
              <div className="lg:col-span-7">
                <GlassCard
                  index="04"
                  label="Persona · Carte d'expérience"
                  title="Pierre, 27 ans — livreur VAE"
                  body="Livreur à vélo électrique à Marseille, six soirs par semaine. Il veut être vu, rester libre, et un casque qui tient le rythme pro — pas un objet gadget."
                  items={["Marseille · 6 soirs / semaine", "VAE livraison", "Besoin : visible & durable"]}
                  className="min-h-[440px] h-full"
                />
              </div>
            </div>
          </div>
        </section>

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
                <p className="lede mt-5 max-w-xl">Ce qu&apos;il entend, et ce que l&apos;on répond.</p>
              </Reveal>
              <Reveal className="lg:col-span-5" delay={0.1}>
                <SceneFreins />
              </Reveal>
            </div>
            <FreinsRiposte />
          </div>
        </section>

        <SectionBridge index="04" from="Freins" to="Valeur" />

        <section id="valeur" className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Proposition de valeur</p>
              <h2 className="display mt-4 max-w-4xl text-4xl text-white md:text-6xl">
                Un équipement de sécurité professionnel, éprouvé par ceux qui roulent le plus.
              </h2>
            </Reveal>
            <ValeurEcart />
            <Reveal className="mt-14">
              <LazyMount
                className="h-[380px] overflow-hidden rounded-[1.5rem] border border-white/15 md:h-[440px]"
                minHeight={380}
              >
                <HelmetScene className="h-full w-full" label="Casque AirGo 3D — orbit / clic" />
              </LazyMount>
            </Reveal>

            {/* Galerie produit — annexes visuelles (exigence brief) */}
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [MEDIA.product, "Produit — commandes & caméra"],
                [MEDIA.heroHelmet, "Design — coque connectée"],
                [MEDIA.night, "Usage nuit — visibilité"],
                [MEDIA.commute, "Trajet urbain — preuve d'usage"],
              ].map(([src, cap], i) => (
                <Reveal key={cap} delay={i * 0.05}>
                  <div className="overflow-hidden rounded-2xl border border-white/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={cap} className="h-44 w-full object-cover" />
                    <p className="bg-black/70 px-4 py-3 text-[11px] tracking-[0.18em] uppercase text-white/55">
                      {cap}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SWOT — exigence Word */}
        <section className="relative px-5 py-20 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Annexe · SWOT</p>
              <h2 className="display mt-4 text-4xl text-white md:text-5xl">Forces, faiblesses, opportunités, menaces.</h2>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[
                ["Forces", "Preuve pro (livreurs) · tech utile · prix 129,90 € en 4×"],
                ["Faiblesses", "Risque image gadget · dépendance batterie · notoriété jeune marque"],
                ["Opportunités", "Flottes livraison · plateforme -50 % · Decathlon / magasins vélo"],
                ["Menaces", "Concurrents 100–180 € · réglementation · méfiance data"],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.06}>
                  <div
                    className="rounded-2xl border border-white/15 p-6"
                    style={{ background: "rgba(8,12,10,0.5)", backdropFilter: "blur(14px)" }}
                  >
                    <p className="display text-2xl text-[var(--gold)]">{t}</p>
                    <p className="mt-3 text-base text-white/75">{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge index="05" from="Valeur" to="Prix & canaux" />

        <section id="prix" className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Prix · Distribution · Communication</p>
              <h2 className="display mt-4 text-4xl text-white md:text-6xl">
                129,90 € — payable en 4 fois.
              </h2>
              <p className="lede mt-4 max-w-2xl">
                Casques connectés concurrents entre 100 et 180 € environ. Partenaire clé : une
                plateforme de livraison qui prend en charge la moitié du prix pour ses livreurs.
              </p>
            </Reveal>
            <PrixSpine />
            <div className="mt-20 grid gap-12 lg:grid-cols-2">
              <div>
                <Reveal>
                  <p className="eyebrow">Distribution</p>
                </Reveal>
                <CanauxCascade />
              </div>
              <Reveal delay={0.1}>
                <p className="eyebrow">Campagne & ambassadeurs</p>
                <p className="display mt-6 text-3xl text-white md:text-4xl">
                  « Sois vu. Reste libre. »
                </p>
                <p className="mt-5 text-white/65">
                  Ambassadeurs : de vrais livreurs qui partagent leur quotidien. Preuve terrain
                  avant le grand public. Partenaire plateforme : −50 % pour ses livreurs.
                </p>
                <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={MEDIA.lifestyle}
                    alt="Visuel campagne AirGo"
                    className="h-56 w-full object-cover md:h-72"
                  />
                  <div className="bg-black/60 px-5 py-4">
                    <p className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold)]">
                      Visuel campagne
                    </p>
                    <p className="mt-2 text-sm text-white/70">
                      Annexes rapport : persona, SWOT, visuels produit.
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <SceneSignal />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <SectionBridge index="06" from="Prix" to="RSE" />

        <section id="rse" className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <RseGauge />
          </div>
        </section>

        <section className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Plan d&apos;action 6 mois</p>
              <h2 className="display mt-4 text-4xl text-white md:text-5xl">
                Preuve → Confiance → Scale
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-0 md:grid-cols-3">
              {[
                ["01", "Preuve", "M1–M2", "Pilote livreurs (Marseille & métropoles), mesure usage intensif", "Éprouvé par les pros"],
                ["02", "Confiance", "M3–M4", "Partenaire plateforme −50 % + ambassadeurs livreurs", "Crédibilité terrain"],
                ["03", "Scale", "M5–M6", "Grand public : site AirGo, magasins vélo, Decathlon", "Volume national"],
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
              <Reveal>
                <p className="display text-3xl text-[var(--gold)] md:text-4xl">
                  <CountUp to={2} />
                </p>
                <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/45">Villes pilotes</p>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="display text-3xl text-[var(--gold)] md:text-4xl">50%</p>
                <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/45">Pris en charge partenaire</p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="display text-3xl text-[var(--gold)] md:text-4xl">4×</p>
                <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/45">Paiement échelonné</p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="display text-3xl text-[var(--gold)] md:text-4xl">129,90€</p>
                <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/45">Prix AirGo</p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="display text-3xl text-[var(--gold)] md:text-4xl">
                  <CountUp to={6} />
                </p>
                <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/45">Soirs / sem. · Pierre</p>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="display text-3xl text-[var(--gold)] md:text-4xl">
                  <CountUp to={6} />
                </p>
                <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/45">Mois de plan</p>
              </Reveal>
            </div>
          </div>
        </section>

        <SectionBridge index="07" from="Plan 6 mois" to="Lab" />

        <section id="lab" className="relative bg-black/50 px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Outil de soutenance</p>
              <h2 className="display mt-4 text-4xl text-white md:text-5xl">
                Lab interactif — hypothèses lancement
              </h2>
            </Reveal>
            <div className="mt-10">
              <LiveLab />
            </div>
            <Reveal className="mt-16">
              <p className="eyebrow mb-6">Signal casque</p>
              <LazyMount minHeight={400}>
                <CurveField3D />
              </LazyMount>
            </Reveal>
          </div>
        </section>

        <SectionBridge index="08" from="Lab" to="Décisions" />

        <section className="relative px-5 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">Synthèse — décisions maintenant</p>
              <h2 className="display mt-4 max-w-3xl text-4xl text-white md:text-6xl">
                L&apos;innovation ne se vend pas toute seule.
              </h2>
              <p className="lede mt-5 max-w-2xl">
                Ce qui se vend : un équipement pro, éprouvé par les livreurs, à 129,90 € — puis
                le grand public une fois la preuve faite.
              </p>
            </Reveal>
            <DecisionsBoard />
          </div>
        </section>

        <footer className="border-t border-white/10 px-5 py-6 text-[10px] tracking-[0.2em] uppercase text-white/35 md:flex md:justify-between md:px-10">
          <span>AirGo — contenu aligné étude de cas marketing innovation</span>
          <span className="mt-2 block md:mt-0">
            Sources : ADEME · Sécurité Routière · Observatoire Mobilité
          </span>
        </footer>
      </main>
    </IntroGate>
  );
}
