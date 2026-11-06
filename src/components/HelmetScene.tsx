"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, Sparkles } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const PARTS: Record<string, string> = {
  shell: "Coque — design urbain & protection",
  light: "Éclairage intelligent — s'adapte à la luminosité",
  blink: "Clignotants intégrés — changement de direction",
  crash: "Détection de collision — alerte app mobile",
  all: "Casque AirGo — sécurité × design × connecté",
};

function HelmetModel({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const blinkL = useRef<THREE.MeshStandardMaterial>(null);
  const blinkR = useRef<THREE.MeshStandardMaterial>(null);

  const shellGeo = useMemo(() => {
    // Silhouette casque vélo — allongée, pas une bulle
    const g = new THREE.SphereGeometry(1, 64, 40, 0, Math.PI * 2, 0, Math.PI * 0.52);
    g.scale(1.15, 0.78, 1.45);
    g.translate(0, 0.08, 0.06);
    g.computeVertexNormals();
    return g;
  }, []);

  const visorGeo = useMemo(() => {
    const g = new THREE.BoxGeometry(1.15, 0.32, 0.48);
    g.translate(0, -0.02, 0.78);
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current && selected === "all") {
      group.current.rotation.y = Math.sin(t * 0.3) * 0.18;
      group.current.rotation.x = 0.08 + Math.sin(t * 0.22) * 0.04;
    }
    if (led.current) {
      led.current.emissiveIntensity = 0.55 + Math.sin(t * 4) * 0.4;
    }
    const b = 0.35 + Math.max(0, Math.sin(t * 6.5)) * 1.1;
    if (blinkL.current) blinkL.current.emissiveIntensity = selected === "blink" ? 1.3 : b;
    if (blinkR.current) blinkR.current.emissiveIntensity = selected === "blink" ? 1.3 : b;
  });

  const hi = (id: string) => (selected === id ? "#f0c14b" : undefined);

  return (
    <group ref={group} position={[0, -0.1, 0]} scale={1.05}>
      {/* Coque principale — forme casque */}
      <mesh
        geometry={shellGeo}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect("shell");
        }}
      >
        <meshStandardMaterial
          color={hi("shell") || "#1a1f22"}
          roughness={0.38}
          metalness={0.55}
        />
      </mesh>

      {/* Bande supérieure mate */}
      <mesh position={[0, 0.42, -0.04]} scale={[1.02, 0.38, 1.12]} castShadow>
        <sphereGeometry args={[0.78, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.38]} />
        <meshStandardMaterial
          color={hi("shell") || "#0d1012"}
          roughness={0.7}
          metalness={0.18}
        />
      </mesh>

      {/* Aérations */}
      {[-0.32, -0.12, 0.12, 0.32].map((x, i) => (
        <mesh key={i} position={[x, 0.48, 0.18]} rotation={[0.55, 0, 0]}>
          <boxGeometry args={[0.1, 0.028, 0.48]} />
          <meshStandardMaterial color="#050607" roughness={0.92} />
        </mesh>
      ))}

      {/* Visière / front */}
      <mesh
        geometry={visorGeo}
        rotation={[0.35, 0, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect("shell");
        }}
      >
        <meshStandardMaterial
          color="#2a3540"
          roughness={0.12}
          metalness={0.85}
          transparent
          opacity={0.78}
        />
      </mesh>

      {/* Front lip */}
      <mesh position={[0, -0.02, 0.92]} rotation={[0.22, 0, 0]}>
        <boxGeometry args={[1.08, 0.08, 0.16]} />
        <meshStandardMaterial color="#111418" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Éclairage avant */}
      <mesh
        position={[0, 0.12, 1.05]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("light");
        }}
      >
        <boxGeometry args={[0.48, 0.1, 0.08]} />
        <meshStandardMaterial
          ref={led}
          color={hi("light") || "#f0c14b"}
          emissive="#f0c14b"
          emissiveIntensity={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Clignotants G/D */}
      {([-1, 1] as const).map((side) => (
        <mesh
          key={side}
          position={[side * 0.88, 0.02, 0.28]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("blink");
          }}
        >
          <boxGeometry args={[0.13, 0.18, 0.11]} />
          <meshStandardMaterial
            ref={side < 0 ? blinkL : blinkR}
            color={hi("blink") || "#ff6b35"}
            emissive="#ff6b35"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Module caméra / collision arrière */}
      <mesh
        position={[0, 0.14, -0.92]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("crash");
        }}
      >
        <boxGeometry args={[0.32, 0.18, 0.2]} />
        <meshStandardMaterial color="#12161a" roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh
        position={[0, 0.14, -1.05]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("crash");
        }}
      >
        <cylinderGeometry args={[0.08, 0.09, 0.06, 16]} />
        <meshStandardMaterial
          color={hi("crash") || "#3d8f5c"}
          emissive="#3d8f5c"
          emissiveIntensity={selected === "crash" ? 0.95 : 0.35}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Feu rouge arrière */}
      <mesh position={[0, -0.02, -0.98]}>
        <boxGeometry args={[0.28, 0.08, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.85} />
      </mesh>

      {/* Jugulaire */}
      <mesh position={[0, -0.58, 0.22]} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[0.62, 0.032, 12, 40, Math.PI * 0.95]} />
        <meshStandardMaterial color="#2a2e32" roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.82, 0.3]}>
        <boxGeometry args={[0.16, 0.09, 0.055]} />
        <meshStandardMaterial color="#3a4046" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Pads oreilles */}
      {([-1, 1] as const).map((s) => (
        <mesh key={s} position={[s * 0.8, -0.2, 0.06]} rotation={[0, 0, s * 0.35]}>
          <capsuleGeometry args={[0.1, 0.18, 4, 8]} />
          <meshStandardMaterial color="#15191c" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function HelmetScene({
  className = "",
  label = "Casque AirGo 3D — orbit / clic",
}: {
  className?: string;
  label?: string;
}) {
  const [selected, setSelected] = useState("all");

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [2.4, 1.5, 3.4], fov: 36 }}
        dpr={[1, 1.5]}
        shadows
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={["#070b09"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 5, 2]} intensity={1.35} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#8899aa" />
        <spotLight position={[0, 3, 4]} intensity={0.55} color="#f0c14b" />
        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.22}>
          <HelmetModel selected={selected} onSelect={setSelected} />
        </Float>
        <ContactShadows position={[0, -1.15, 0]} opacity={0.4} scale={8} blur={2.5} />
        <Sparkles count={22} scale={[4.5, 2.8, 4.5]} size={1.4} color="#f0c14b" speed={0.3} />
        <OrbitControls enablePan={false} minDistance={2.6} maxDistance={7} />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
        <p className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold)]">{label}</p>
        <p className="mt-2 text-sm text-white/85">{PARTS[selected] ?? PARTS.all}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["shell", "light", "blink", "crash"] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={`pointer-events-auto rounded-full border px-3 py-1 text-[10px] tracking-wider uppercase ${
                selected === id
                  ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                  : "border-white/25 text-white/70"
              }`}
              onClick={() => setSelected(selected === id ? "all" : id)}
            >
              {id === "shell" ? "Coque" : id === "light" ? "Lumière" : id === "blink" ? "Clignotants" : "Collision"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
