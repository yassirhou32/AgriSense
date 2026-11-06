"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Silhouette casque vélo urbain — pas une sphère / bulle */
function MiniHelmet() {
  const group = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const blinkL = useRef<THREE.MeshStandardMaterial>(null);
  const blinkR = useRef<THREE.MeshStandardMaterial>(null);

  const shellGeo = useMemo(() => {
    // Coque allongée type casque (pas une boule)
    const g = new THREE.SphereGeometry(1, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.52);
    g.scale(1.05, 0.72, 1.35);
    g.translate(0, 0.05, 0.05);
    g.computeVertexNormals();
    return g;
  }, []);

  const visorGeo = useMemo(() => {
    const g = new THREE.BoxGeometry(1.05, 0.28, 0.42);
    g.translate(0, -0.02, 0.72);
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.65;
      group.current.rotation.x = 0.15 + Math.sin(t * 0.45) * 0.1;
    }
    if (led.current) led.current.emissiveIntensity = 0.8 + Math.sin(t * 4) * 0.45;
    const b = 0.4 + Math.max(0, Math.sin(t * 7)) * 1.2;
    if (blinkL.current) blinkL.current.emissiveIntensity = b;
    if (blinkR.current) blinkR.current.emissiveIntensity = b;
  });

  return (
    <Float speed={1.8} floatIntensity={0.45} rotationIntensity={0.12}>
      <group ref={group} scale={0.95} position={[0, -0.15, 0]}>
        {/* Coque principale */}
        <mesh geometry={shellGeo} castShadow>
          <meshStandardMaterial color="#1a1f22" roughness={0.38} metalness={0.55} />
        </mesh>

        {/* Bande supérieure mate */}
        <mesh position={[0, 0.38, -0.05]} scale={[0.95, 0.35, 1.05]}>
          <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <meshStandardMaterial color="#0d1012" roughness={0.65} metalness={0.2} />
        </mesh>

        {/* Aérations — lisibles comme un casque */}
        {[-0.28, -0.1, 0.1, 0.28].map((x, i) => (
          <mesh key={i} position={[x, 0.42, 0.15]} rotation={[0.55, 0, 0]}>
            <boxGeometry args={[0.09, 0.025, 0.42]} />
            <meshStandardMaterial color="#050607" roughness={0.9} />
          </mesh>
        ))}

        {/* Visière / front */}
        <mesh geometry={visorGeo} rotation={[0.35, 0, 0]}>
          <meshStandardMaterial
            color="#2a3540"
            roughness={0.12}
            metalness={0.85}
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* Front lip */}
        <mesh position={[0, -0.05, 0.85]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[1.0, 0.07, 0.14]} />
          <meshStandardMaterial color="#111418" roughness={0.4} metalness={0.4} />
        </mesh>

        {/* LED avant large */}
        <mesh position={[0, 0.08, 0.98]}>
          <boxGeometry args={[0.42, 0.09, 0.07]} />
          <meshStandardMaterial
            ref={led}
            color="#f0c14b"
            emissive="#f0c14b"
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Clignotants latéraux saillants */}
        {([-1, 1] as const).map((side) => (
          <group key={side} position={[side * 0.78, 0.0, 0.25]}>
            <mesh>
              <boxGeometry args={[0.12, 0.16, 0.1]} />
              <meshStandardMaterial
                ref={side < 0 ? blinkL : blinkR}
                color="#ff6b35"
                emissive="#ff6b35"
                emissiveIntensity={0.7}
              />
            </mesh>
          </group>
        ))}

        {/* Module caméra / collision arrière */}
        <mesh position={[0, 0.12, -0.85]}>
          <boxGeometry args={[0.28, 0.16, 0.18]} />
          <meshStandardMaterial color="#12161a" roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.12, -0.96]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
          <meshStandardMaterial color="#3d8f5c" emissive="#3d8f5c" emissiveIntensity={0.55} />
        </mesh>

        {/* Feu rouge arrière */}
        <mesh position={[0, -0.02, -0.92]}>
          <boxGeometry args={[0.26, 0.07, 0.05]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.85} />
        </mesh>

        {/* Jugulaire */}
        <mesh position={[0, -0.55, 0.2]} rotation={[0.15, 0, 0]}>
          <torusGeometry args={[0.55, 0.028, 10, 40, Math.PI * 0.95]} />
          <meshStandardMaterial color="#2a2e32" roughness={0.55} />
        </mesh>
        {/* Boucle */}
        <mesh position={[0, -0.78, 0.28]}>
          <boxGeometry args={[0.14, 0.08, 0.05]} />
          <meshStandardMaterial color="#3a4046" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Pads oreilles */}
        {([-1, 1] as const).map((s) => (
          <mesh key={s} position={[s * 0.72, -0.22, 0.05]} rotation={[0, 0, s * 0.35]}>
            <capsuleGeometry args={[0.09, 0.16, 4, 8]} />
            <meshStandardMaterial color="#15191c" roughness={0.6} />
          </mesh>
        ))}

        <Sparkles count={12} scale={[2.2, 1.4, 2.6]} size={1.4} speed={0.35} color="#f0c14b" />
      </group>
    </Float>
  );
}

export default function TravelingHelmet() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 28,
    damping: 32,
    mass: 0.9,
  });

  // Parcours uniquement dans les gouttières (jamais au centre → n'écrase pas le texte)
  const x = useTransform(
    smooth,
    [0, 0.1, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.9, 1],
    ["88vw", "90vw", "-6vw", "-8vw", "89vw", "91vw", "-7vw", "-5vw", "88vw", "90vw"]
  );
  const y = useTransform(
    smooth,
    [0, 0.1, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.9, 1],
    ["18vh", "62vh", "22vh", "68vh", "16vh", "64vh", "20vh", "70vh", "28vh", "48vh"]
  );
  const scale = useTransform(
    smooth,
    [0, 0.2, 0.5, 0.8, 1],
    [0.78, 0.88, 0.82, 0.9, 0.75]
  );
  // Opacité douce + dips sur zones texte denses
  const opacity = useTransform(
    smooth,
    [0, 0.03, 0.12, 0.22, 0.35, 0.5, 0.65, 0.8, 0.92, 0.99],
    [0, 0.7, 0.55, 0.72, 0.5, 0.7, 0.48, 0.68, 0.4, 0.2]
  );
  const rotateZ = useTransform(
    smooth,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [-6, 4, -5, 6, -4, 2]
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[15] hidden xl:block will-change-transform"
      style={{ left: 0, top: 0, x, y, scale, opacity, rotateZ }}
    >
      <div className="relative h-[170px] w-[190px] 2xl:h-[200px] 2xl:w-[230px]">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(240,193,75,0.14) 0%, transparent 68%)",
          }}
          animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="h-full w-full bg-transparent">
          <Canvas
            dpr={[1, 1.4]}
            camera={{ position: [0.2, 0.55, 3.1], fov: 34 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.65} />
            <directionalLight position={[4, 5, 3]} intensity={1.5} />
            <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#8899aa" />
            <spotLight position={[0, 3, 4]} intensity={0.7} color="#f0c14b" />
            <MiniHelmet />
          </Canvas>
        </div>
      </div>
    </motion.div>
  );
}
