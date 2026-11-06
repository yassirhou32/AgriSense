"use client";

import dynamic from "next/dynamic";
import LiveLab from "./LiveLab";
import LazyMount from "./LazyMount";
import { SceneFreins, SceneWaveStrip } from "./SectionScenes";
import { ActEnter } from "./ActChapter";

const SensorScene = dynamic(() => import("./SensorScene"), { ssr: false });
const CurveField3D = dynamic(() => import("./CurveField3D"), { ssr: false });

const freins = [
  ["F1. Prix / ROI", "Encore un boîtier cher", "Essentiel 890 € + fiche ROI"],
  ["F2. Complexité", "Pas le temps d'apprendre", "Écran 3 feux + 90 jours"],
  ["F3. Data", "Qui voit mes parcelles ?", "Propriété à l'exploitant"],
  ["F4. Preuve", "Ça marche sur mon sol ?", "12 fermes pilotes locales"],
];

const roadmap = [
  ["Preuve", "M1–M6", "12 fermes, 1 cave, UX 3 feux"],
  ["Ancrage", "M7–M14", "3 caves, 2 BD, Insight, 180 clients"],
  ["Extension", "M15–M24", "Aude / P.-O., Pack Cave, 450 exploitations"],
];

export default function CaseDeepDive() {
  return (
    <>
      <SceneWaveStrip />

      <section className="relative px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <ActEnter sound="whoosh">
            <p className="eyebrow">Objet</p>
            <h2 className="display mt-4 text-4xl text-white md:text-5xl">
              Inspecter le capteur.
            </h2>
            <p className="lede mt-5">
              Tournez, zoomez, cliquez une pièce. Objet de soutenance — pas une
              illustration.
            </p>
          </ActEnter>
          <ActEnter sound="tick">
            <div className="panel-strong overflow-hidden">
              <LazyMount className="h-[400px] md:h-[460px]" minHeight={400}>
                <SensorScene
                  className="h-full w-full"
                  showTerrain
                  interactive
                  label="Orbit · zoom · clic"
                />
              </LazyMount>
            </div>
          </ActEnter>
        </div>
      </section>

      <section className="relative px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12">
            <ActEnter className="lg:col-span-7" sound="whoosh">
              <p className="eyebrow">Freins</p>
              <h2 className="display mt-4 text-4xl text-white md:text-5xl">
                Quatre freins. Quatre leviers.
              </h2>
            </ActEnter>
            <ActEnter className="lg:col-span-5" sound="tick">
              <SceneFreins />
            </ActEnter>
          </div>
          <ActEnter className="mt-10" sound="none">
            <div className="panel-strong overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[14px]">
                <thead>
                  <tr className="border-b border-white/15 text-[11px] uppercase tracking-[0.18em] text-white/40">
                    <th className="px-5 py-4">Frein</th>
                    <th className="px-5 py-4">Terrain</th>
                    <th className="px-5 py-4">Levier</th>
                  </tr>
                </thead>
                <tbody>
                  {freins.map(([f, hear, lever]) => (
                    <tr key={f} className="border-t border-white/10">
                      <td className="px-5 py-4 font-semibold text-[var(--gold)]">{f}</td>
                      <td className="px-5 py-4 text-white/70">{hear}</td>
                      <td className="px-5 py-4 text-white">{lever}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ActEnter>
        </div>
      </section>

      <section id="courbes" className="relative px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <ActEnter sound="chime" className="mb-8">
            <p className="eyebrow">Signal sol</p>
            <h2 className="display mt-3 text-4xl text-white md:text-5xl">
              Simuler la reco 3 feux.
            </h2>
          </ActEnter>
          <LazyMount minHeight={400}>
            <CurveField3D />
          </LazyMount>
        </div>
      </section>

      <section id="lab" className="relative px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <ActEnter sound="whoosh" className="mb-8">
            <p className="eyebrow">Business lab</p>
            <h2 className="display mt-3 text-4xl text-white md:text-5xl">
              Tester les hypothèses 24 mois.
            </h2>
            <p className="lede mt-4 max-w-2xl">
              Clients, Insight, prix Essentiel, eau : les courbes réagissent. Utile
              en oral.
            </p>
          </ActEnter>
          <LiveLab />
        </div>
      </section>

      <SceneWaveStrip />

      <section className="relative px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ActEnter sound="chime">
            <p className="eyebrow">24 mois</p>
            <h2 className="display mt-4 text-4xl text-white md:text-5xl">
              Preuve → Ancrage → Extension
            </h2>
          </ActEnter>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {roadmap.map(([phase, when, items], i) => (
              <ActEnter key={phase} sound="tick">
                <div className="panel-strong relative min-h-[210px] p-8">
                  <span className="display absolute right-6 top-5 text-5xl text-white/10">
                    0{i + 1}
                  </span>
                  <p className="eyebrow !text-[10px]">{when}</p>
                  <h3 className="display mt-4 text-3xl text-white">{phase}</h3>
                  <p className="mt-4 text-[15px] text-white/70">{items}</p>
                </div>
              </ActEnter>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
