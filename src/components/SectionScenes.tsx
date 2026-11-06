"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import LazyMount from "./LazyMount";

function GoldFog() {
  return (
    <>
      <color attach="background" args={["#030805"]} />
      <fog attach="fog" args={["#030805", 3, 9]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 4, 2]} intensity={1} color="#ffe6b0" />
    </>
  );
}

/** Trois orbites = 3 choix du cadrage */
function TriadOrbit() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.y = s.clock.getElapsedTime() * 0.35;
    g.current.rotation.x = Math.sin(s.clock.getElapsedTime() * 0.4) * 0.15;
  });
  const nodes = useMemo(
    () =>
      [0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * 1.15, Math.sin(a * 2) * 0.25, Math.sin(a) * 1.15);
      }),
    []
  );
  return (
    <group ref={g}>
      <mesh>
        <torusGeometry args={[1.15, 0.012, 8, 96]} />
        <meshBasicMaterial color="#f0c14b" transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.01, 8, 96]} />
        <meshBasicMaterial color="#2a6b45" transparent opacity={0.5} />
      </mesh>
      {nodes.map((p, i) => (
        <mesh key={i} position={p.toArray()}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color={i === 0 ? "#f0c14b" : "#4ade80"}
            emissive={i === 0 ? "#f0c14b" : "#2a6b45"}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#0a1610" emissive="#f0c14b" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

/** Radar / scan zone Occitanie */
function RadarSweep() {
  const sweep = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (sweep.current) sweep.current.rotation.z = -t * 1.4;
    if (rings.current) rings.current.rotation.z = t * 0.15;
  });
  return (
    <group rotation={[Math.PI / 2.4, 0, 0]}>
      <group ref={rings}>
        {[0.5, 0.9, 1.3, 1.7].map((r) => (
          <mesh key={r}>
            <torusGeometry args={[r, 0.01, 6, 80]} />
            <meshBasicMaterial color="#f0c14b" transparent opacity={0.25} />
          </mesh>
        ))}
      </group>
      <mesh ref={sweep} position={[0, 0, 0.02]}>
        <circleGeometry args={[1.7, 48, 0, Math.PI * 0.35]} />
        <meshBasicMaterial color="#f0c14b" transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {[
        [0.7, 0.4],
        [-0.9, 0.6],
        [0.3, -1.0],
        [-0.5, -0.7],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.04]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#f0c14b" emissive="#f0c14b" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Mini pyramide contours — segments / offre */
function ContourPyramidMini({ spin = 0.25 }: { spin?: number }) {
  const g = useRef<THREE.Group>(null);
  const tiers = useMemo(
    () =>
      (
        [
          [1.6, 0.16, 0],
          [1.2, 0.14, 0.18],
          [0.85, 0.14, 0.34],
          [0.55, 0.14, 0.5],
          [0.3, 0.18, 0.66],
        ] as const
      ).map(([size, h, y]) => {
        const geo = new THREE.BoxGeometry(size, h, size);
        return { y, geo, edges: new THREE.EdgesGeometry(geo) };
      }),
    []
  );
  useFrame((s) => {
    if (g.current) {
      g.current.rotation.y = s.clock.getElapsedTime() * spin;
      g.current.position.y = Math.sin(s.clock.getElapsedTime() * 0.8) * 0.06;
    }
  });
  return (
    <group ref={g}>
      {tiers.map((tier, i) => (
        <group key={i} position={[0, tier.y - 0.35, 0]}>
          <mesh geometry={tier.geo}>
            <meshBasicMaterial color="#1a4d32" transparent opacity={0.07} depthWrite={false} />
          </mesh>
          <lineSegments geometry={tier.edges}>
            <lineBasicMaterial color="#f0c14b" transparent opacity={0.55 + i * 0.08} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

/** Ruban de vagues 3D — séparateur vivant */
function WaveRibbon3D() {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGold: { value: new THREE.Color("#f0c14b") },
      uDeep: { value: new THREE.Color("#06140c") },
    }),
    []
  );
  useFrame((s) => {
    uniforms.uTime.value = s.clock.getElapsedTime();
    if (mesh.current) mesh.current.rotation.x = -Math.PI / 2.5;
  });
  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[8, 2.2, 64, 24]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        vertexShader={`
          uniform float uTime;
          varying float vW;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 p = position;
            float w = sin(p.x * 2.2 + uTime * 1.6) * 0.18 + cos(p.x * 1.1 - uTime) * 0.1;
            p.z += w;
            vW = w;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uGold;
          uniform vec3 uDeep;
          varying float vW;
          varying vec2 vUv;
          void main() {
            vec3 c = mix(uDeep, uGold, 0.25 + vW * 1.2 + vUv.x * 0.2);
            float a = 0.55 * smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
            gl_FragColor = vec4(c, a);
          }
        `}
      />
    </mesh>
  );
}

/** Noyau signal — CTA / contact */
function SignalCore() {
  const core = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (!core.current) return;
    core.current.rotation.y = t * 0.5;
    core.current.rotation.z = Math.sin(t * 0.7) * 0.2;
  });
  return (
    <group ref={core}>
      {[0.4, 0.7, 1.05].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, i * 0.6]}>
          <torusGeometry args={[r, 0.012, 8, 80]} />
          <meshBasicMaterial color="#f0c14b" transparent opacity={0.55 - i * 0.12} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.28, 1]} />
        <meshStandardMaterial
          color="#0a1610"
          emissive="#f0c14b"
          emissiveIntensity={0.55}
          wireframe
        />
      </mesh>
    </group>
  );
}

/** Helix freins — 4 points qui montent */
function FreinHelix() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.y = s.clock.getElapsedTime() * 0.4;
  });
  return (
    <group ref={g}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 2.2, 8]} />
        <meshBasicMaterial color="#f0c14b" transparent opacity={0.35} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        const y = -0.8 + i * 0.45;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.7, y, Math.sin(a) * 0.7]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial
              color="#f0c14b"
              emissive="#f0c14b"
              emissiveIntensity={0.45}
              wireframe={i % 2 === 1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Frame({
  children,
  camera = [0, 0.4, 3.4] as [number, number, number],
  height = 280,
}: {
  children: React.ReactNode;
  camera?: [number, number, number];
  height?: number;
}) {
  return (
    <LazyMount minHeight={height} className="panel-strong overflow-hidden" rootMargin="80px">
      <div style={{ height }} className="w-full">
        <Canvas
          dpr={[1, 1.25]}
          camera={{ position: camera, fov: 40 }}
          gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
        >
          <GoldFog />
          {children}
        </Canvas>
      </div>
    </LazyMount>
  );
}

export function SceneCadrage() {
  return (
    <Frame height={300} camera={[0, 0.2, 3.6]}>
      <TriadOrbit />
    </Frame>
  );
}

export function SceneRadar() {
  return (
    <Frame height={300} camera={[0, 1.2, 3.2]}>
      <RadarSweep />
    </Frame>
  );
}

export function ScenePyramid() {
  return (
    <Frame height={300} camera={[0, 0.5, 3.5]}>
      <ContourPyramidMini />
    </Frame>
  );
}

export function SceneWaveStrip() {
  return (
    <LazyMount minHeight={120} className="overflow-hidden border-y border-white/10" rootMargin="60px">
      <div className="h-[120px] w-full">
        <Canvas dpr={[1, 1.2]} camera={{ position: [0, 1.4, 3.2], fov: 35 }}>
          <GoldFog />
          <WaveRibbon3D />
        </Canvas>
      </div>
    </LazyMount>
  );
}

export function SceneFreins() {
  return (
    <Frame height={280} camera={[0, 0.1, 3.4]}>
      <FreinHelix />
    </Frame>
  );
}

export function SceneSignal() {
  return (
    <Frame height={260} camera={[0, 0.15, 3.2]}>
      <SignalCore />
    </Frame>
  );
}
