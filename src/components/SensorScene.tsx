"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  Sparkles,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(7, 7, 48, 48);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(
        i,
        Math.sin(x * 1.1) * 0.07 + Math.cos(y * 1.3) * 0.05 + (Math.random() - 0.5) * 0.01
      );
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} geometry={geo} receiveShadow>
      <meshStandardMaterial color="#2a382f" roughness={0.95} metalness={0.04} />
    </mesh>
  );
}

/** Capteur style produit réel (proche Tripo) — 100% procédural */
function ProSensor({ selectedPart, onSelect }: { selectedPart: string; onSelect: (id: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current && selectedPart === "all") {
      group.current.rotation.y = Math.sin(t * 0.25) * 0.08;
    }
    if (led.current) {
      led.current.emissiveIntensity = 0.6 + Math.sin(t * 3) * 0.35;
    }
  });

  const highlight = (id: string) => (selectedPart === id ? "#d4a017" : undefined);

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {/* Probe shaft */}
      <mesh
        position={[0, -0.55, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect("probe");
        }}
      >
        <cylinderGeometry args={[0.038, 0.048, 1.15, 24]} />
        <meshStandardMaterial
          color={highlight("probe") || "#6b7a70"}
          metalness={0.75}
          roughness={0.28}
        />
      </mesh>
      {/* Tip */}
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.048, 0.28, 20]} />
        <meshStandardMaterial color="#c9a66b" metalness={0.85} roughness={0.18} />
      </mesh>
      {/* Ring marks on probe */}
      {[ -0.2, -0.45, -0.7 ].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[0.05, 0.008, 10, 24]} />
          <meshStandardMaterial color="#3d4a42" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Head housing */}
      <RoundedBox
        args={[0.72, 0.38, 0.48]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.22, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect("body");
        }}
      >
        <meshStandardMaterial
          color={highlight("body") || "#141c17"}
          metalness={0.35}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Screen */}
      <mesh
        position={[0, 0.24, 0.245]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("screen");
        }}
      >
        <planeGeometry args={[0.48, 0.22]} />
        <meshStandardMaterial
          color="#1a3d28"
          emissive={highlight("screen") || "#3d8f5c"}
          emissiveIntensity={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* 3 status LEDs */}
      {[
        ["#4ade80", -0.16],
        ["#d4a017", 0],
        ["#f87171", 0.16],
      ].map(([c, x]) => (
        <mesh key={c} position={[Number(x), 0.08, 0.25]}>
          <circleGeometry args={[0.028, 16]} />
          <meshStandardMaterial
            ref={c === "#4ade80" ? led : undefined}
            color={c}
            emissive={c}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* Antenna */}
      <group
        position={[0.26, 0.55, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("antenna");
        }}
      >
        <mesh>
          <cylinderGeometry args={[0.012, 0.014, 0.5, 12]} />
          <meshStandardMaterial
            color={highlight("antenna") || "#9aab9f"}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color="#d4a017" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Signal rings */}
      {[0.35, 0.52, 0.7].map((r, i) => (
        <SignalRing key={r} radius={r} delay={i * 0.4} />
      ))}
    </group>
  );
}

function SignalRing({ radius, delay }: { radius: number; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + delay;
    if (!ref.current) return;
    const s = 1 + (Math.sin(t * 1.8) + 1) * 0.08;
    ref.current.scale.setScalar(s);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.55 - ((Math.sin(t * 1.8) + 1) / 2) * 0.35;
  });
  return (
    <mesh ref={ref} position={[0.26, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.007, 8, 48]} />
      <meshStandardMaterial
        color="#d4a017"
        emissive="#d4a017"
        emissiveIntensity={0.5}
        transparent
        opacity={0.45}
      />
    </mesh>
  );
}

const PART_INFO: Record<string, string> = {
  all: "Capteur IoT AgriSense — clique une pièce",
  probe: "Sonde : humidité + température + nutriments",
  body: "Boîtier étanche — électronique LoRaWAN",
  screen: "Écran 3 feux — décision en 10 secondes",
  antenna: "Antenne longue portée — basse conso",
};

export default function SensorScene({
  className = "",
  showTerrain = true,
  interactive = false,
  label,
  clearBg = false,
}: {
  className?: string;
  showTerrain?: boolean;
  interactive?: boolean;
  label?: string;
  /** Fond transparent (héros / overlay vidéo) */
  clearBg?: boolean;
}) {
  const [part, setPart] = useState("all");
  const opaque = !clearBg;

  return (
    <div
      className={`relative ${className} ${interactive ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      {(interactive || label) && (
        <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[220px] border border-[#d4a017]/35 bg-[#0a100d]/90 px-3 py-2 text-[10px] tracking-wide text-[#d4a017]">
          <p className="uppercase tracking-[0.2em]">{label || "AgriSense 3D"}</p>
          {interactive && (
            <p className="mt-1 text-[11px] normal-case tracking-normal text-white/70">
              {PART_INFO[part]}
            </p>
          )}
        </div>
      )}
      <Canvas
        shadows={opaque}
        camera={{ position: [2.2, 1.15, 2.9], fov: 36 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: clearBg,
        }}
        onPointerMissed={() => interactive && setPart("all")}
      >
        {opaque && <color attach="background" args={["#0a100d"]} />}
        {opaque && <fog attach="fog" args={["#0a100d", 5, 12]} />}
        <ambientLight intensity={0.32} />
        <directionalLight
          position={[4, 8, 3]}
          intensity={1.35}
          color="#ffe6b8"
          castShadow={opaque}
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#6d9b7a" />
        <pointLight position={[0.5, 1.4, 1]} intensity={0.55} color="#d4a017" />
        {showTerrain && <Terrain />}
        <Float
          speed={interactive ? 0.5 : 1.1}
          rotationIntensity={interactive ? 0.04 : 0.1}
          floatIntensity={interactive ? 0.12 : 0.3}
        >
          <ProSensor
            selectedPart={interactive ? part : "all"}
            onSelect={(id) => interactive && setPart(id)}
          />
        </Float>
        <Sparkles count={clearBg ? 12 : 24} scale={4.5} size={1.8} speed={0.3} color="#d4a017" opacity={0.4} />
        {opaque && (
          <ContactShadows position={[0, -1.34, 0]} opacity={0.5} scale={8} blur={2.6} far={4} />
        )}
        {interactive && (
          <OrbitControls
            enablePan={false}
            minDistance={2.2}
            maxDistance={5.2}
            maxPolarAngle={Math.PI / 1.85}
            autoRotate={part === "all"}
            autoRotateSpeed={0.45}
          />
        )}
      </Canvas>
    </div>
  );
}
