"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const INSIGHT_MRR = 19; // € / mois / abonné
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex justify-between gap-3 text-xs tracking-wide">
        <span className="uppercase text-white/50">{label}</span>
        <span className="display text-base text-[var(--gold)]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-[var(--gold)]"
      />
      {hint ? <p className="mt-1.5 text-[10px] text-white/35">{hint}</p> : null}
    </label>
  );
}

const tipStyle = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 12,
  fontSize: 12,
  background: "rgba(8,12,10,0.94)",
  color: "#fff",
  backdropFilter: "blur(12px)",
};

/**
 * Modèle réaliste (brief) :
 * - Ramp clients → cible M24
 * - CA mois = (nouveaux × pack) + (parc × abo% × 19 €)
 * - Freins = fonctions des leviers (pas de random)
 */
export default function LiveLab() {
  const [clients, setClients] = useState(180);
  const [abo, setAbo] = useState(30);
  const [pack, setPack] = useState(890);
  const [water, setWater] = useState(18);

  const months = useMemo(() => {
    const rows: {
      mois: string;
      clients: number;
      nouveaux: number;
      ca: number;
      hardware: number;
      recurring: number;
      eau: number;
    }[] = [];
    let prev = 0;
    for (let m = 1; m <= 24; m++) {
      // Courbe d'adoption type S légère (réaliste go-to-market)
      const t = m / 24;
      const progress = Math.pow(t, 0.82);
      const cum = Math.round(clients * progress);
      const nouveaux = Math.max(0, cum - prev);
      const hardware = nouveaux * pack;
      const recurring = cum * (abo / 100) * INSIGHT_MRR;
      const ca = Math.round(hardware + recurring);
      // Preuve eau : monte vers la médiane choisie (pas au-delà)
      const eau = Math.round(water * (0.55 + 0.45 * t));
      rows.push({
        mois: `M${m}`,
        clients: cum,
        nouveaux,
        ca,
        hardware: Math.round(hardware),
        recurring: Math.round(recurring),
        eau,
      });
      prev = cum;
    }
    return rows;
  }, [clients, abo, pack, water]);

  /** Intensité frein 0–100 : plus haut = plus bloquant. 100% piloté par les sliders. */
  const freins = useMemo(() => {
    const prixRoi = clamp(
      38 +
        (pack - 690) / 7.5 + // prix ↑ → frein ↑
        (pack > 1000 ? 8 : 0) +
        (water < 12 ? 12 : 0) - // faible preuve eau → ROI moins crédible
        (water - 18) * 1.15, // eau ↑ → frein prix ↓
      18,
      96
    );

    const complexite = clamp(
      58 +
        (abo - 30) * 0.4 + // plus d'Insight = plus de perception “outil”
        (clients > 350 ? 6 : 0),
      42,
      88
    );

    const data = clamp(
      42 + clients / 22 + abo * 0.28, // volume + cloud Insight
      28,
      94
    );

    const preuve = clamp(
      92 -
        water * 1.85 - // économie d'eau = preuve
        Math.min(clients, 220) / 18 +
        (clients > 400 ? 18 : 0) + // cible irréaliste → “pas prouvé”
        (pack > 1100 ? 6 : 0),
      16,
      96
    );

    return [
      { name: "Prix / ROI", impact: Math.round(prixRoi) },
      { name: "Complexité", impact: Math.round(complexite) },
      { name: "Data", impact: Math.round(data) },
      { name: "Preuve locale", impact: Math.round(preuve) },
    ];
  }, [clients, abo, pack, water]);

  /** Capteur : humidité / stress liés à l'économie d'eau (hypothèse), pas du random. */
  const pulse = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const phase = i / 13;
      // Plus water est haut, plus l'humidité “cible” est maîtrisée (moins de stress)
      const stress = clamp(28 - water * 0.55, 6, 22);
      const humidite = clamp(55 - stress + Math.sin(phase * Math.PI * 2) * 4, 28, 72);
      const temp = 17 + Math.cos(phase * Math.PI * 2) * 2.2 + (pack > 1000 ? 0.4 : 0);
      const signal = clamp(68 + water * 0.35 + Math.sin(phase * Math.PI * 3) * 6, 45, 98);
      return {
        t: `J${i + 1}`,
        humidite: Math.round(humidite * 10) / 10,
        temp: Math.round(temp * 10) / 10,
        signal: Math.round(signal),
      };
    });
  }, [water, pack]);

  const ca24 = months[23]?.ca ?? 0;
  const caYear = months.slice(0, 12).reduce((s, r) => s + r.ca, 0);
  const caCumul24 = months.reduce((s, r) => s + r.ca, 0);
  const chartData = months.filter((_, i) => i % 2 === 1 || i === 0 || i === 23);

  const reading = useMemo(() => {
    const worst = [...freins].sort((a, b) => b.impact - a.impact)[0];
    let headline: string;
    if (pack > 1050) {
      headline = `À ${pack} €, la marge monte mais le frein prix reste fort (${freins[0].impact}/100).`;
    } else if (pack < 780) {
      headline = `À ${pack} €, l'adoption est plus facile. Surveiller la marge.`;
    } else if (water < 12) {
      headline = `−${water}% d'eau est trop bas pour être crédible. Frein preuve : ${freins[3].impact}/100.`;
    } else if (water > 28) {
      headline = `−${water}% d'eau est ambitieux. Rester dans −12 à −30 %.`;
    } else if (clients > 420) {
      headline = `${clients} clients à 24 mois est très haut. Objectif réaliste près de 450 si le canal coop tient.`;
    } else {
      headline = `Autour de ${pack} €, le positionnement tient. Frein principal : ${worst.name}.`;
    }
    const body = `${clients} clients, ${abo}% d'abonnés Insight. CA année 1 : ${(caYear / 1000).toFixed(0)} k€. CA mensuel à M24 : ${(ca24 / 1000).toFixed(1)} k€. Cumul 24 mois : ${(caCumul24 / 1000).toFixed(0)} k€.`;
    return { headline, body };
  }, [abo, ca24, caCumul24, caYear, clients, freins, pack, water]);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div
        className="space-y-6 rounded-[1.5rem] border border-white/15 p-6 md:p-8 lg:col-span-4"
        style={{
          background: "rgba(8,12,10,0.55)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]">
            Lab interactif
          </p>
          <h3 className="display mt-2 text-3xl text-white">Modifie les hypothèses</h3>
          <p className="mt-2 text-base text-white/60">
            Les courbes, le CA et les freins se mettent à jour tout de suite.
          </p>
        </div>
        <Slider
          label="Clients à 24 mois"
          value={clients}
          min={80}
          max={600}
          step={10}
          unit=""
          onChange={setClients}
        />
        <Slider
          label="Taux abonnement Insight"
          value={abo}
          min={10}
          max={55}
          step={1}
          unit=" %"
          onChange={setAbo}
        />
        <Slider
          label="Prix pack Essentiel"
          value={pack}
          min={690}
          max={1290}
          step={20}
          unit=" €"
          onChange={setPack}
        />
        <Slider
          label="Économie d'eau médiane"
          value={water}
          min={8}
          max={32}
          step={1}
          unit=" %"
          onChange={setWater}
        />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/45">CA cumulé Y1</p>
            <p className="display mt-1 text-2xl text-[#7dce9a]">{(caYear / 1000).toFixed(0)} k€</p>
          </div>
          <div className="rounded-2xl border border-[var(--gold)]/25 bg-[var(--gold)]/10 p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/45">CA mensuel M24</p>
            <p className="display mt-1 text-2xl text-[var(--gold)]">{(ca24 / 1000).toFixed(1)} k€</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:col-span-8">
        <div
          className="rounded-[1.5rem] border border-white/15 p-5 md:p-6"
          style={{ background: "rgba(8,12,10,0.5)", backdropFilter: "blur(16px)" }}
        >
          <p className="mb-4 text-sm tracking-[0.2em] uppercase text-white/45">
            Scénario sol
          </p>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pulse}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ab0a0" }} stroke="#4a5c50" />
                <YAxis tick={{ fontSize: 10, fill: "#9ab0a0" }} stroke="#4a5c50" />
                <Tooltip contentStyle={tipStyle} />
                <Line type="monotone" dataKey="humidite" name="Humidité %" stroke="#4ade80" strokeWidth={2} dot={false} isAnimationActive animationDuration={500} />
                <Line type="monotone" dataKey="temp" name="Temp. °C" stroke="#d4a017" strokeWidth={2} dot={false} isAnimationActive animationDuration={500} />
                <Line type="monotone" dataKey="signal" name="Signal" stroke="#7dce9a" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive animationDuration={500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-[1.5rem] border border-white/15 p-5 md:p-6"
          style={{ background: "rgba(8,12,10,0.5)", backdropFilter: "blur(16px)" }}
        >
          <p className="mb-4 text-sm tracking-[0.2em] uppercase text-white/45">
            Projection clients & CA — 24 mois
          </p>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a017" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#d4a017" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="mois" tick={{ fontSize: 10, fill: "#9ab0a0" }} stroke="#4a5c50" />
                <YAxis tick={{ fontSize: 10, fill: "#9ab0a0" }} stroke="#4a5c50" />
                <Tooltip
                  contentStyle={tipStyle}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (name === "CA (€)") return [`${n.toLocaleString("fr-FR")} €`, name];
                    return [n, name];
                  }}
                />
                <Area type="monotone" dataKey="clients" name="Clients" stroke="#4ade80" fill="url(#gClients)" strokeWidth={2} isAnimationActive animationDuration={600} />
                <Area type="monotone" dataKey="ca" name="CA (€)" stroke="#d4a017" fill="url(#gCa)" strokeWidth={2} isAnimationActive animationDuration={600} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="rounded-[1.5rem] border border-white/15 p-5 md:p-6"
            style={{ background: "rgba(8,12,10,0.5)", backdropFilter: "blur(16px)" }}
          >
            <p className="mb-4 text-sm tracking-[0.2em] uppercase text-white/45">
              Intensité des freins
            </p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={freins} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ab0a0" }} />
                  <YAxis type="category" dataKey="name" width={84} tick={{ fontSize: 10, fill: "#9ab0a0" }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Bar dataKey="impact" name="Intensité" fill="#d4a017" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={450} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div
            className="rounded-[1.5rem] border border-[var(--gold)]/35 p-5 md:p-6"
            style={{ background: "rgba(240,193,75,0.06)", backdropFilter: "blur(16px)" }}
          >
            <p className="text-sm tracking-[0.2em] uppercase text-[var(--gold)]">
              Lecture
            </p>
            <p className="display mt-4 text-2xl leading-snug text-white">{reading.headline}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">{reading.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
