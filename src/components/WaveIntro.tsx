"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

const LINES = [
  "Le sol parle.",
  "Peu l'entendent.",
  "AgriSense traduit.",
  "Preuve locale. Décision juste.",
];

const LEVEL_LABELS = [
  "Niveau 1 — Prescripteur",
  "Niveau 2 — Décision 3 feux",
  "Niveau 3 — Preuve locale",
  "Niveau 4 — Offre 890 €",
  "Niveau 5 — Scale Occitanie",
];

function LivingOcean({ open, boost }: { open: boolean; boost: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpen: { value: 0 },
      uBoost: { value: 1 },
      uGold: { value: new THREE.Color("#f0c14b") },
      uDeep: { value: new THREE.Color("#041109") },
      uMid: { value: new THREE.Color("#1f5a3a") },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uBoost.value = THREE.MathUtils.lerp(uniforms.uBoost.value, boost, 0.08);
    uniforms.uOpen.value = THREE.MathUtils.lerp(
      uniforms.uOpen.value,
      open ? 1 : 0,
      0.05
    );
    const o = open ? 1 : 0;

    if (mesh.current) {
      mesh.current.rotation.x = -Math.PI / 2.3 + Math.sin(t * 0.35) * 0.08;
      mesh.current.rotation.z = Math.sin(t * 0.22) * 0.06;
      mesh.current.position.y = -0.3 + Math.sin(t * 0.5) * 0.08 + o * -0.85;
      mesh.current.position.x = Math.sin(t * 0.18) * 0.15;
    }

    // Caméra vivante (balancement) puis plongée
    const swayX = Math.sin(t * 0.4) * 0.35;
    const swayY = 1.05 + Math.sin(t * 0.55) * 0.12;
    const targetZ = open ? 2.0 : 4.0 + Math.sin(t * 0.3) * 0.25;
    const targetY = open ? 1.85 : swayY;
    const targetX = open ? 0 : swayX;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.lookAt(
      Math.sin(t * 0.2) * 0.1 * (1 - o),
      open ? -0.55 : Math.sin(t * 0.35) * 0.08,
      0
    );
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -0.3, 0]}>
      <planeGeometry args={[16, 16, 128, 128]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        vertexShader={`
          uniform float uTime;
          uniform float uOpen;
          uniform float uBoost;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            vUv = uv;
            vec3 p = position;
            float b = uBoost;
            float w1 = sin(p.x * 1.6 + uTime * 1.8) * 0.34 * b;
            float w2 = cos(p.y * 2.0 + uTime * 1.35) * 0.26 * b;
            float w3 = sin((p.x + p.y) * 1.1 + uTime * 2.1) * 0.18 * b;
            float w4 = cos(p.x * 0.7 - uTime * 0.9) * sin(p.y * 0.8 + uTime) * 0.14 * b;
            float wave = (w1 + w2 + w3 + w4) * (1.0 - uOpen * 0.5);
            p.z += wave;
            float d = length(uv - 0.5);
            p.z -= smoothstep(0.12, 0.58, d) * uOpen * 1.6;
            // Clapotis latéral vivant
            p.x += sin(uTime * 0.7 + p.y) * 0.04 * b * (1.0 - uOpen);
            vWave = wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uOpen;
          uniform vec3 uGold;
          uniform vec3 uDeep;
          uniform vec3 uMid;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            float d = length(vUv - 0.5);
            float rip = 0.5 + 0.5 * sin(d * 34.0 - uTime * 3.2);
            float foam = smoothstep(0.12, 0.35, abs(vWave));
            vec3 col = mix(uDeep, uMid, vUv.y + vWave * 0.9);
            col = mix(col, uGold, rip * 0.22 + foam * 0.2 + (1.0 - d) * 0.1);
            float portal = smoothstep(0.45 - uOpen * 0.38, 0.1, d);
            col = mix(col, vec3(0.96, 0.93, 0.86), portal * uOpen);
            float alpha = 0.94 - uOpen * portal * 0.88;
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
}

function Rings({ open }: { open: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    const t = s.clock.getElapsedTime();
    const o = open ? 1 : 0;
    g.current.rotation.z = t * 0.28;
    g.current.rotation.x = Math.PI / 2.15 + Math.sin(t * 0.5) * 0.08;
    g.current.position.y = 0.15 + Math.sin(t * 0.7) * 0.1;
    g.current.scale.setScalar(1 + o * 2.1 + Math.sin(t * 1.2) * 0.03);
    g.current.children.forEach((c, i) => {
      const m = c as THREE.Mesh;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.55 - o * 0.55 - i * 0.07 + Math.sin(t * 2 + i) * 0.05);
      m.rotation.z = t * (0.15 + i * 0.08) * (i % 2 === 0 ? 1 : -1);
    });
  });
  return (
    <group ref={g} position={[0, 0.2, 0]}>
      {[1.0, 1.45, 1.95, 2.5].map((r) => (
        <mesh key={r}>
          <torusGeometry args={[r, 0.014, 8, 160]} />
          <meshBasicMaterial color="#f0c14b" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function DriftParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = Math.random() * 3 - 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.05;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < 80; i++) {
      const y = pos.getY(i) + Math.sin(t + i) * 0.002;
      pos.setY(i, y > 2.5 ? -0.5 : y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#f0c14b" transparent opacity={0.55} />
    </points>
  );
}

/**
 * Pyramide en contours (wireframe) — cohérente avec anneaux / vagues.
 * Ne masque pas l'océan ni le portail : volumes très transparents + arêtes or.
 */
const PYRAMID_TIERS = [
  { size: 2.05, h: 0.2, y: -0.15 },
  { size: 1.65, h: 0.18, y: 0.08 },
  { size: 1.25, h: 0.17, y: 0.28 },
  { size: 0.9, h: 0.16, y: 0.46 },
  { size: 0.55, h: 0.2, y: 0.64 },
];

function TierContour({
  size,
  h,
  y,
  active,
  current,
  open,
}: {
  size: number;
  h: number;
  y: number;
  active: boolean;
  current: boolean;
  open: boolean;
}) {
  const g = useRef<THREE.Group>(null);
  const fillMat = useRef<THREE.MeshBasicMaterial>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const p = useRef(0);

  const geo = useMemo(() => new THREE.BoxGeometry(size, h, size), [size, h]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);

  useFrame((s) => {
    if (!g.current) return;
    const t = s.clock.getElapsedTime();
    p.current = THREE.MathUtils.lerp(p.current, active ? 1 : 0, 0.09);
    const v = p.current;
    g.current.visible = v > 0.02;
    g.current.scale.setScalar(0.55 + v * 0.45);
    let yy = y * v + (1 - v) * (y - 0.5);
    if (current && !open) yy += Math.sin(t * 2.4) * 0.015;
    g.current.position.y = yy;

    if (fillMat.current) {
      fillMat.current.opacity = v * (open ? 0.02 : current ? 0.1 : 0.05);
    }
    if (lineMat.current) {
      lineMat.current.opacity = v * (open ? 0.12 : current ? 0.95 : 0.5);
    }
  });

  return (
    <group ref={g} position={[0, y, 0]}>
      <mesh geometry={geo}>
        <meshBasicMaterial
          ref={fillMat}
          color="#1a4d32"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          ref={lineMat}
          color="#f0c14b"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function RisingPyramid({
  levels,
  open,
}: {
  levels: number;
  open: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (!group.current) return;
    group.current.rotation.y = t * 0.18;
    // Monte légèrement hors de l'eau, sans couvrir le centre du portail
    group.current.position.y = open
      ? THREE.MathUtils.lerp(group.current.position.y, 1.6, 0.05)
      : -0.05 + Math.sin(t * 0.55) * 0.03;
    const targetScale = open ? 0.35 : 1;
    const sc = THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.05);
    group.current.scale.setScalar(sc);
  });

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      {PYRAMID_TIERS.map((tier, i) => (
        <TierContour
          key={i}
          {...tier}
          active={i < levels}
          current={i === levels - 1 && levels > 0}
          open={open}
        />
      ))}
      {/* Pointe contour — n'apparaît qu'au dernier niveau */}
      <mesh position={[0, 0.88, 0]} visible={levels >= 5 && !open}>
        <coneGeometry args={[0.1, 0.22, 4]} />
        <meshBasicMaterial
          color="#f0c14b"
          wireframe
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Scene({
  open,
  boost,
  levels,
}: {
  open: boolean;
  boost: number;
  levels: number;
}) {
  return (
    <>
      <color attach="background" args={["#030805"]} />
      <fog attach="fog" args={["#030805", 3.5, 11]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={1.15} color="#ffe6b0" />
      {/* Ordre : océan d'abord (toujours lisible), pyramide contours, anneaux par-dessus */}
      <LivingOcean open={open} boost={boost} />
      <RisingPyramid levels={levels} open={open} />
      <Rings open={open} />
      <DriftParticles />
    </>
  );
}

function TypeLine({ text, active }: { text: string; active: boolean }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!active) {
      setShown("");
      return;
    }
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [active, text]);

  if (!active && !shown) return null;

  return (
    <motion.p
      className="display text-[clamp(1.6rem,4.5vw,2.8rem)] leading-tight text-white"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: active ? 1 : 0.25, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {shown}
      {active && shown.length < text.length && (
        <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-[#f0c14b] align-middle">
          &nbsp;
        </span>
      )}
    </motion.p>
  );
}

/**
 * Entrée vivante : vagues amplifiées, caméra qui balance,
 * phrases tapées une à une, puis portail vers le domaine.
 */
export default function WaveIntro({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(-1);
  const [levels, setLevels] = useState(0);
  const [showBrand, setShowBrand] = useState(false);
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const [boost, setBoost] = useState(1);

  useEffect(() => {
    const t = [
      setTimeout(() => {
        setLine(0);
        setLevels(1);
        setBoost(1.15);
      }, 450),
      setTimeout(() => {
        setLine(1);
        setLevels(2);
        setBoost(1.3);
      }, 1700),
      setTimeout(() => {
        setLine(2);
        setLevels(3);
        setBoost(1.5);
      }, 3000),
      setTimeout(() => {
        setLine(3);
        setLevels(4);
        setBoost(1.65);
      }, 4300),
      setTimeout(() => {
        setLevels(5);
        setShowBrand(true);
        setBoost(1.85);
      }, 5600),
      setTimeout(() => {
        setOpen(true);
        setBoost(1.15);
      }, 7100),
      setTimeout(() => {
        setGone(true);
        onDone();
      }, 8700),
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  if (gone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[120] overflow-hidden bg-[#030805]"
      animate={{ opacity: open ? 0 : 1 }}
      transition={{ duration: 1.4, delay: open ? 0.55 : 0, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 1.4]}
          camera={{ position: [0, 1.25, 4.4], fov: 42 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <Scene open={open} boost={boost} levels={levels} />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35" />

      <button
        type="button"
        onClick={() => {
          setGone(true);
          onDone();
        }}
        className="absolute right-6 top-6 z-30 text-[11px] font-semibold tracking-[0.35em] uppercase text-white/60 hover:text-white"
      >
        Entrer
      </button>

      {/* Niveaux pyramide — UI latérale */}
      <div className="pointer-events-none absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 md:left-8 md:flex">
        {LEVEL_LABELS.map((label, i) => {
          const on = i < levels;
          const current = i === levels - 1;
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -16 }}
              animate={{
                opacity: on ? 1 : 0.2,
                x: on ? 0 : -8,
                scale: current ? 1.04 : 1,
              }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-3"
            >
              <div
                className="h-8 border border-[var(--gold)]/40 bg-[var(--gold)]/15 transition-all"
                style={{
                  width: `${56 - i * 8}px`,
                  opacity: on ? 1 : 0.25,
                  boxShadow: current ? "0 0 16px rgba(240,193,75,0.35)" : "none",
                }}
              />
              <span
                className={`text-[10px] tracking-[0.18em] uppercase ${
                  current ? "text-[#f0c14b]" : on ? "text-white/70" : "text-white/25"
                }`}
              >
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end px-6 pb-20 text-center md:pb-24">
        <motion.p
          className="mb-5 text-[11px] font-semibold tracking-[0.5em] uppercase text-[#f0c14b]"
          initial={{ opacity: 0 }}
          animate={{ opacity: line >= 0 ? 1 : 0 }}
        >
          Occitanie · Pyramide · Portail
        </motion.p>

        <div className="mb-7 flex min-h-[9rem] flex-col items-center justify-end gap-2 md:min-h-[10.5rem]">
          <AnimatePresence mode="wait">
            {LINES.map((text, i) =>
              line === i ? (
                <TypeLine key={text} text={text} active />
              ) : line > i ? (
                <motion.p
                  key={`done-${text}`}
                  className="display text-[clamp(1.05rem,2.8vw,1.5rem)] text-white/30"
                  initial={{ opacity: 0.55 }}
                  animate={{ opacity: 0.22 }}
                >
                  {text}
                </motion.p>
              ) : null
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showBrand && (
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <h1 className="display text-[clamp(3rem,11vw,7rem)] leading-none text-white">
                AgriSense
              </h1>
              <p className="mt-4 text-[13px] tracking-[0.28em] uppercase text-white/55">
                5 niveaux — le domaine s&apos;ouvre
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 z-20 h-[2px] bg-[#f0c14b]"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 8.4, ease: "linear" }}
      />
    </motion.div>
  );
}
