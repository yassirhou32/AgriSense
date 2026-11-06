"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type SeriesKey = "humidite" | "temp" | "nutriments";

type Feu = {
  level: "vert" | "orange" | "rouge";
  label: string;
  detail: string;
  color: string;
};

/** Logique 3 feux réaliste (brief) — humidité + chaleur + nutriments */
function computeFeu(h: number, t: number, n: number): Feu {
  const stressChaleur = t >= 32 && h < 50;
  const stressSec = h < 28 || (h < 35 && t >= 28);
  const stressNutri = n < 30 && h < 45;
  const veille =
    h < 48 || (h < 55 && t >= 27) || n < 38 || (t >= 30 && h < 58);

  if (stressSec || (stressChaleur && h < 40) || (stressNutri && h < 38)) {
    return {
      level: "rouge",
      label: "Feu rouge — irriguer maintenant",
      detail: `Humidité ${h}% critique${t >= 30 ? ` · chaleur ${t}°C` : ""}${n < 35 ? ` · nutriments bas (${n})` : ""}. Reco immédiate.`,
      color: "#ef4444",
    };
  }
  if (veille || stressChaleur) {
    return {
      level: "orange",
      label: "Feu orange — surveiller sous 24 h",
      detail: `Zone de veille : humidité ${h}%, temp ${t}°C, nutriments ${n}. Pas d'urgence, mais planifier.`,
      color: "#f0c14b",
    };
  }
  return {
    level: "vert",
    label: "Feu vert — pas d'irrigation aujourd'hui",
    detail: `Sol confortable (${h}%). Temp ${t}°C · nutriments ${n}. Maintenir le suivi.`,
    color: "#4ade80",
  };
}

function LiveCurve({
  color,
  amp,
  freq,
  phase,
  yOffset,
  active,
}: {
  color: string;
  amp: number;
  freq: number;
  phase: number;
  yOffset: number;
  active: boolean;
}) {
  const positions = useMemo(() => new Float32Array(96 * 3), []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const ampRef = useRef(amp);
  const freqRef = useRef(freq);
  const activeRef = useRef(active);
  const yRef = useRef(yOffset);
  ampRef.current = amp;
  freqRef.current = freq;
  activeRef.current = active;
  yRef.current = yOffset;

  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 1,
        linewidth: 2,
      }),
    [color]
  );
  const lineObj = useMemo(() => new THREE.Line(geo, mat), [geo, mat]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const a = ampRef.current;
    const f = freqRef.current;
    const on = activeRef.current;
    const yo = yRef.current;
    mat.opacity = on ? 1 : 0.22;
    for (let i = 0; i < 96; i++) {
      const u = i / 95;
      const x = (u - 0.5) * 4.6;
      // Amplitude / fréquence lues depuis les refs → curseurs = courbes tout de suite
      const y =
        yo +
        Math.sin(u * Math.PI * f + phase + t * 0.7) * a +
        Math.sin(u * Math.PI * f * 2.15 + phase * 1.3 + t * 0.35) * a * 0.28;
      const z =
        Math.cos(u * Math.PI * 1.35 + phase + t * 0.28) * (on ? 0.62 : 0.22);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return <primitive object={lineObj} />;
}

function Scene({
  humidite,
  temp,
  nutriments,
  focus,
}: {
  humidite: number;
  temp: number;
  nutriments: number;
  focus: SeriesKey | "all";
}) {
  // Mapping fort et lisible (les curseurs se voient vraiment)
  const hAmp = 0.15 + (humidite / 100) * 1.15;
  const hFreq = 0.7 + (humidite / 100) * 2.4;
  const tAmp = 0.12 + (temp / 42) * 1.05;
  const tFreq = 0.8 + (temp / 42) * 2.1;
  const nAmp = 0.1 + (nutriments / 100) * 0.95;
  const nFreq = 0.55 + (nutriments / 100) * 2.0;

  return (
    <>
      <color attach="background" args={["#070b09"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={0.85} />
      <gridHelper args={[7, 14, "#2a6b45", "#152018"]} position={[0, -1.45, 0]} />
      <LiveCurve
        color="#4ade80"
        amp={hAmp}
        freq={hFreq}
        phase={0}
        yOffset={0.55}
        active={focus === "all" || focus === "humidite"}
      />
      <LiveCurve
        color="#d4a017"
        amp={tAmp}
        freq={tFreq}
        phase={1.15}
        yOffset={0}
        active={focus === "all" || focus === "temp"}
      />
      <LiveCurve
        color="#60a5fa"
        amp={nAmp}
        freq={nFreq}
        phase={2.05}
        yOffset={-0.55}
        active={focus === "all" || focus === "nutriments"}
      />
      <OrbitControls
        enablePan={false}
        minDistance={3.2}
        maxDistance={9}
        autoRotate={focus === "all"}
        autoRotateSpeed={0.4}
      />
    </>
  );
}

export default function CurveField3D() {
  const [humidite, setHumidite] = useState(42);
  const [temp, setTemp] = useState(24);
  const [nutriments, setNutriments] = useState(55);
  const [focus, setFocus] = useState<SeriesKey | "all">("all");

  const feu = computeFeu(humidite, temp, nutriments);

  const metrics = [
    {
      key: "humidite" as const,
      label: "Humidité sol",
      val: humidite,
      set: setHumidite,
      unit: "%",
      color: "#4ade80",
      min: 10,
      max: 90,
    },
    {
      key: "temp" as const,
      label: "Température",
      val: temp,
      set: setTemp,
      unit: "°C",
      color: "#d4a017",
      min: 8,
      max: 42,
    },
    {
      key: "nutriments" as const,
      label: "Nutriments",
      val: nutriments,
      set: setNutriments,
      unit: " idx",
      color: "#60a5fa",
      min: 10,
      max: 95,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div
        className="space-y-5 rounded-[1.5rem] border border-white/15 p-6 lg:col-span-4"
        style={{ background: "rgba(8,12,10,0.55)", backdropFilter: "blur(18px)" }}
      >
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]">
            Signal sol 3D
          </p>
          <h3 className="display mt-2 text-3xl text-white">Données parcelle</h3>
          <p className="mt-2 text-base text-white/60">
            Ajuste humidité, température et nutriments. La recommandation 3 feux suit.
          </p>
        </div>

        {metrics.map((m) => {
          const on = focus === m.key || focus === "all";
          return (
            <div
              key={m.key}
              className={`rounded-2xl border p-3.5 transition ${
                focus === m.key
                  ? "border-white/35 bg-white/10"
                  : on
                    ? "border-white/12 bg-white/[0.04]"
                    : "border-transparent opacity-40"
              }`}
            >
              <button
                type="button"
                onClick={() => setFocus(focus === m.key ? "all" : m.key)}
                className="mb-2 flex w-full items-center justify-between text-left"
              >
                <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: m.color }}>
                  {m.label}
                </span>
                <span className="display text-lg text-white">
                  {m.val}
                  {m.unit}
                </span>
              </button>
              <input
                type="range"
                min={m.min}
                max={m.max}
                value={m.val}
                onChange={(e) => {
                  m.set(Number(e.target.value));
                  setFocus(m.key);
                }}
                className="w-full cursor-pointer accent-[var(--gold)]"
                aria-label={m.label}
              />
            </div>
          );
        })}

        <div
          className="rounded-2xl border p-4"
          style={{
            borderColor: `${feu.color}55`,
            background: `${feu.color}14`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: feu.color, boxShadow: `0 0 14px ${feu.color}` }}
            />
            <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: feu.color }}>
              Recommandation · 3 feux
            </p>
          </div>
          <p className="display mt-3 text-xl text-white">{feu.label}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/55">{feu.detail}</p>
        </div>
      </div>

      <div
        className="h-[380px] overflow-hidden rounded-[1.5rem] border border-white/15 p-0 md:h-[460px] lg:col-span-8"
        style={{ background: "#070b09" }}
      >
        <Canvas camera={{ position: [0, 1.35, 5.4], fov: 42 }} dpr={[1, 1.5]}>
          <Scene
            humidite={humidite}
            temp={temp}
            nutriments={nutriments}
            focus={focus}
          />
        </Canvas>
      </div>
    </div>
  );
}
