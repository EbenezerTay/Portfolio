"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { Canvas, useFrame, advance, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  Lightformer,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { Robot as RobotSVG } from "@/components/Robot";

/* ------------------------------------------------------------------ */
/* Shared state read every frame (no React re-renders)                 */
/* ------------------------------------------------------------------ */

type Shared = {
  look: { x: number; y: number };
  lastMove: number;
  hovered: boolean;
  coreHovered: boolean;
  reduceMotion: boolean;
  /** Colour the glow is fading towards */
  target: THREE.Color;
  /** Live glow colour this frame (read by every glowing part) */
  color: THREE.Color;
};

const ACCENT = "#34d399";

/** Colours the chest core cycles through. */
export const ROBOT_PALETTE = [
  { name: "Emerald", hex: "#34d399" },
  { name: "Cyan", hex: "#22d3ee" },
  { name: "Violet", hex: "#a78bfa" },
  { name: "Pink", hex: "#f472b6" },
  { name: "Amber", hex: "#fbbf24" },
  { name: "Red", hex: "#f87171" },
] as const;

const STORAGE_KEY = "robot-core-colour";

function useMaterials() {
  return useMemo(
    () => ({
      // Glossy white ceramic armour panels
      shell: new THREE.MeshPhysicalMaterial({
        color: "#eef1f5",
        roughness: 0.28,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
      }),
      // Brushed gunmetal joints and actuators
      joint: new THREE.MeshStandardMaterial({
        color: "#3a4452",
        roughness: 0.32,
        metalness: 0.9,
      }),
      // Matte carbon under-structure
      carbon: new THREE.MeshStandardMaterial({
        color: "#161c24",
        roughness: 0.55,
        metalness: 0.5,
      }),
      // Black glass sensor visor
      visor: new THREE.MeshPhysicalMaterial({
        color: "#020407",
        roughness: 0.04,
        metalness: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
      }),
      glow: new THREE.MeshStandardMaterial({
        color: ACCENT,
        emissive: ACCENT,
        emissiveIntensity: 1.25,
        toneMapped: false,
      }),
    }),
    [],
  );
}

type Mats = ReturnType<typeof useMaterials>;

/* ------------------------------------------------------------------ */
/* Body parts                                                          */
/* ------------------------------------------------------------------ */

function Hand({ m, side }: { m: Mats; side: number }) {
  return (
    <group>
      <RoundedBox args={[0.22, 0.22, 0.12]} radius={0.05} smoothness={3} position={[0, -0.1, 0]} material={m.joint} />
      {[-0.075, 0, 0.075].map((x) => (
        <RoundedBox key={x} args={[0.055, 0.17, 0.07]} radius={0.025} smoothness={3} position={[x * 1.15, -0.28, 0.01]} rotation={[0, 0, x * -1.6]} material={m.carbon} />
      ))}
      <RoundedBox args={[0.06, 0.13, 0.07]} radius={0.025} smoothness={3} position={[side * -0.13, -0.15, 0.05]} rotation={[0, 0, side * 0.5]} material={m.carbon} />
    </group>
  );
}

type ArmRefs = {
  upper: React.RefObject<THREE.Group | null>;
  fore: React.RefObject<THREE.Group | null>;
  wrist: React.RefObject<THREE.Group | null>;
};

function Arm({ m, side, refs }: { m: Mats; side: number; refs: ArmRefs }) {
  return (
    <group ref={refs.upper} position={[side * 0.88, 1.24, 0]}>
      <mesh material={m.joint}>
        <sphereGeometry args={[0.18, 32, 32]} />
      </mesh>
      <RoundedBox args={[0.27, 0.58, 0.3]} radius={0.12} smoothness={4} position={[0, -0.38, 0]} material={m.shell} />
      <mesh position={[0, -0.38, 0]} material={m.carbon}>
        <cylinderGeometry args={[0.1, 0.1, 0.64, 16]} />
      </mesh>
      <group ref={refs.fore} position={[0, -0.74, 0]}>
        <mesh material={m.joint}>
          <sphereGeometry args={[0.13, 32, 32]} />
        </mesh>
        <RoundedBox args={[0.25, 0.56, 0.28]} radius={0.11} smoothness={4} position={[0, -0.36, 0]} material={m.shell} />
        <RoundedBox args={[0.04, 0.3, 0.02]} radius={0.01} position={[side * 0.13, -0.36, 0.08]} material={m.glow} />
        <mesh position={[0, -0.69, 0]} material={m.joint}>
          <sphereGeometry args={[0.085, 24, 24]} />
        </mesh>
        <group ref={refs.wrist} position={[0, -0.72, 0]}>
          <Hand m={m} side={side} />
        </group>
      </group>
    </group>
  );
}

function Leg({ m, side }: { m: Mats; side: number }) {
  return (
    <group position={[side * 0.3, 1.78, 0]}>
      <mesh material={m.joint}>
        <sphereGeometry args={[0.17, 32, 32]} />
      </mesh>
      <RoundedBox args={[0.34, 0.72, 0.38]} radius={0.14} smoothness={4} position={[0, -0.42, 0]} material={m.shell} />
      <group position={[0, -0.85, 0]}>
        <mesh material={m.joint}>
          <sphereGeometry args={[0.15, 32, 32]} />
        </mesh>
        <RoundedBox args={[0.18, 0.18, 0.08]} radius={0.04} position={[0, 0, 0.14]} material={m.carbon} />
        <RoundedBox args={[0.31, 0.68, 0.35]} radius={0.13} smoothness={4} position={[0, -0.4, 0]} material={m.shell} />
        <RoundedBox args={[0.2, 0.5, 0.12]} radius={0.05} smoothness={3} position={[0, -0.38, -0.17]} material={m.carbon} />
        <mesh position={[0, -0.76, 0]} material={m.joint}>
          <sphereGeometry args={[0.1, 24, 24]} />
        </mesh>
        <RoundedBox args={[0.36, 0.16, 0.6]} radius={0.07} smoothness={4} position={[0, -0.85, 0.09]} material={m.carbon} />
        <RoundedBox args={[0.3, 0.06, 0.2]} radius={0.03} position={[0, -0.76, 0.26]} material={m.shell} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Robot                                                               */
/* ------------------------------------------------------------------ */

function RobotModel({
  shared,
  onCoreClick,
  onCoreHover,
  onBodyClick,
  onBodyHover,
}: {
  shared: React.MutableRefObject<Shared>;
  onCoreClick: () => void;
  onCoreHover: (v: boolean) => void;
  onBodyClick: () => void;
  onBodyHover: (v: boolean) => void;
}) {
  const m = useMaterials();
  const pulseRing = useRef<THREE.Mesh>(null);
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const chest = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const ring = useRef<THREE.MeshStandardMaterial>(null);
  const coreMesh = useRef<THREE.Group>(null);
  const left = { upper: useRef<THREE.Group>(null), fore: useRef<THREE.Group>(null), wrist: useRef<THREE.Group>(null) };
  const right = { upper: useRef<THREE.Group>(null), fore: useRef<THREE.Group>(null), wrist: useRef<THREE.Group>(null) };

  const blink = useRef({ next: 2, until: 0 });
  const wave = useRef({ next: 2.2, start: -10 });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = shared.current;
    const still = s.reduceMotion;
    const k = 1 - Math.exp(-delta * 5);
    const lerp = (obj: THREE.Object3D | null, axis: "x" | "y" | "z", to: number, f = k) => {
      if (obj) obj.rotation[axis] += (to - obj.rotation[axis]) * f;
    };

    // Entrance: rise and settle
    const intro = still ? 1 : 1 - Math.pow(1 - Math.min(1, t / 1.4), 3);
    if (root.current) {
      root.current.position.y = -0.4 * (1 - intro) + (still ? 0 : Math.sin(t * 1.6) * 0.012);
      root.current.scale.setScalar(0.92 + 0.08 * intro);
    }

    // Where to look: cursor, or idly glance around when the cursor is still
    const idle = performance.now() - s.lastMove > 3500;
    const lookX = still ? 0 : idle ? Math.sin(t * 0.45) * 0.55 : s.look.x;
    const lookY = still ? 0 : idle ? Math.sin(t * 0.3) * 0.2 : s.look.y;

    // Breathing + weight shift
    if (chest.current && !still) chest.current.scale.y = 1 + Math.sin(t * 1.6) * 0.012;
    lerp(torso.current, "y", lookX * 0.28);
    lerp(torso.current, "z", still ? 0 : Math.sin(t * 0.7) * 0.018);

    // Head tracks with a little lag
    lerp(head.current, "y", lookX * 0.55, k * 1.4);
    lerp(head.current, "x", lookY * 0.32 + (s.hovered ? -0.06 : 0), k * 1.4);
    lerp(head.current, "z", -lookX * 0.06, k);

    // Blink; eyes widen when hovered
    if (eyes.current) {
      if (!still && t > blink.current.next) {
        blink.current.until = t + 0.12;
        blink.current.next = t + 2.2 + Math.random() * 3.5;
      }
      const blinking = t < blink.current.until;
      const target = blinking ? 0.1 : s.hovered ? 1.5 : 1;
      eyes.current.scale.y += (target - eyes.current.scale.y) * (blinking ? 0.7 : k);
    }

    // Fade every glowing part towards the chosen colour
    s.color.lerp(s.target, Math.min(1, delta * 4));
    for (const mat of [m.glow, core.current, ring.current]) {
      if (!mat) continue;
      mat.color.copy(s.color);
      mat.emissive.copy(s.color);
    }

    // Glow pulse; the core brightens and grows a little when pointed at
    const pulse = still ? 1.3 : 1.25 + Math.sin(t * 2.4) * 0.35;
    if (core.current) core.current.emissiveIntensity = pulse + (s.coreHovered ? 0.6 : 0);
    if (ring.current) ring.current.emissiveIntensity = 1.1 + Math.sin(t * 1.2) * 0.25;
    if (pulseRing.current) {
      const phase = still ? 0.3 : (t * 0.7) % 1;
      pulseRing.current.scale.setScalar(1 + phase * 0.9);
      const mat = pulseRing.current.material as THREE.MeshBasicMaterial;
      mat.color.copy(s.color);
      mat.opacity = (1 - phase) * (s.coreHovered ? 0.9 : 0.6);
    }
    if (coreMesh.current) {
      const target = s.coreHovered ? 1.18 : 1;
      coreMesh.current.scale.setScalar(coreMesh.current.scale.x + (target - coreMesh.current.scale.x) * k * 2);
    }

    // Left arm: relaxed, slight swing
    lerp(left.upper.current, "z", -0.1 + (still ? 0 : Math.sin(t * 1.6) * 0.02));
    lerp(left.upper.current, "x", still ? 0 : Math.sin(t * 0.8) * 0.05);
    lerp(left.fore.current, "x", -0.22);

    // Right arm: wave on a timer, and continuously while hovered
    if (!still && t > wave.current.next && t - wave.current.start > 2.8) {
      wave.current.start = t;
      wave.current.next = t + 7 + Math.random() * 4;
    }
    const wt = t - wave.current.start;
    const waving = !still && (s.hovered || wt < 2.6);
    if (waving) {
      const swing = Math.sin(t * 7);
      lerp(right.upper.current, "z", 1.22 + swing * 0.05, k * 2);
      lerp(right.upper.current, "x", -0.08, k * 2);
      lerp(right.fore.current, "z", 1.78 + swing * 0.3, Math.min(1, k * 3));
      lerp(right.fore.current, "x", 0, k * 2);
      lerp(right.wrist.current, "z", Math.sin(t * 7 - 0.7) * 0.28, Math.min(1, k * 3));
    } else {
      lerp(right.upper.current, "z", 0.1 + (still ? 0 : Math.sin(t * 1.6 + 1) * 0.02), k * 1.4);
      lerp(right.upper.current, "x", still ? 0 : Math.sin(t * 0.8 + 1) * 0.05, k);
      lerp(right.fore.current, "z", 0, k * 1.4);
      lerp(right.fore.current, "x", -0.22, k);
      lerp(right.wrist.current, "z", 0, k);
    }
  });

  const stop = (e: ThreeEvent<PointerEvent | MouseEvent>) => e.stopPropagation();

  return (
    <group
      ref={root}
      onClick={(e) => {
        stop(e);
        onBodyClick();
      }}
      onPointerOver={(e) => {
        stop(e);
        onBodyHover(true);
      }}
      onPointerOut={() => onBodyHover(false)}
    >
      {/* Platform */}
      <mesh position={[0, -0.07, 0]} material={m.carbon}>
        <cylinderGeometry args={[1.2, 1.28, 0.14, 64]} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.12, 0.018, 16, 96]} />
        <meshStandardMaterial ref={ring} color={ACCENT} emissive={ACCENT} emissiveIntensity={1.1} toneMapped={false} />
      </mesh>

      <Leg m={m} side={-1} />
      <Leg m={m} side={1} />

      {/* Pelvis */}
      <RoundedBox args={[0.96, 0.34, 0.56]} radius={0.12} smoothness={4} position={[0, 1.9, 0]} material={m.carbon} />
      <RoundedBox args={[0.5, 0.22, 0.1]} radius={0.05} position={[0, 1.88, 0.28]} material={m.shell} />

      {/* Upper body pivots at the waist */}
      <group ref={torso} position={[0, 2.05, 0]}>
        <mesh position={[0, 0.12, 0]} material={m.joint}>
          <cylinderGeometry args={[0.3, 0.34, 0.24, 32]} />
        </mesh>
        {/* Segmented abdomen */}
        <RoundedBox args={[0.84, 0.44, 0.52]} radius={0.12} smoothness={4} position={[0, 0.4, 0]} material={m.carbon} />
        {[0.32, 0.46].map((y) => (
          <RoundedBox key={y} args={[0.7, 0.05, 0.05]} radius={0.02} position={[0, y, 0.25]} material={m.joint} />
        ))}

        <group ref={chest} position={[0, 0.98, 0]}>
          <RoundedBox args={[1.38, 0.96, 0.76]} radius={0.26} smoothness={5} material={m.shell} />
          {/* Chest core: click to change the robot's colour */}
          <group
            ref={coreMesh}
            position={[0, 0.06, 0.37]}
            onClick={(e) => {
              stop(e);
              onCoreClick();
            }}
            onPointerOver={(e) => {
              stop(e);
              onCoreHover(true);
            }}
            onPointerOut={(e) => {
              stop(e);
              onCoreHover(false);
            }}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]} material={m.joint}>
              <cylinderGeometry args={[0.2, 0.2, 0.06, 48]} />
            </mesh>
            <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 48]} />
              <meshStandardMaterial ref={core} color={ACCENT} emissive={ACCENT} emissiveIntensity={1.3} toneMapped={false} />
            </mesh>
            {/* Pulsing ring: "this is pressable" */}
            <mesh ref={pulseRing} position={[0, 0, 0.06]}>
              <ringGeometry args={[0.21, 0.235, 64]} />
              <meshBasicMaterial
                color={ACCENT}
                transparent
                opacity={0.6}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
            </mesh>
            {/* Label pointing at the core; follows the robot as it moves */}
            <Html position={[0, 0, 0.06]} zIndexRange={[15, 0]} style={{ pointerEvents: "none" }}>
              <CoreHint onClick={onCoreClick} />
            </Html>
          </group>
          {/* Vents */}
          {[-0.46, 0.46].map((x) => (
            <group key={x} position={[x, -0.2, 0.37]}>
              {[0, 0.07, 0.14].map((y) => (
                <RoundedBox key={y} args={[0.2, 0.03, 0.03]} radius={0.01} position={[0, y, 0]} material={m.carbon} />
              ))}
            </group>
          ))}
          {/* Shoulder armour */}
          {[-1, 1].map((side) => (
            <RoundedBox key={side} args={[0.44, 0.3, 0.54]} radius={0.12} smoothness={4} position={[side * 0.8, 0.36, 0]} rotation={[0, 0, side * -0.25]} material={m.shell} />
          ))}
        </group>

        <Arm m={m} side={-1} refs={left} />
        <Arm m={m} side={1} refs={right} />

        {/* Neck */}
        {[1.52, 1.6].map((y) => (
          <mesh key={y} position={[0, y, 0]} material={m.joint}>
            <cylinderGeometry args={[0.13, 0.15, 0.07, 24]} />
          </mesh>
        ))}

        {/* Head */}
        <group ref={head} position={[0, 1.66, 0]}>
          <RoundedBox args={[0.88, 0.76, 0.82]} radius={0.24} smoothness={5} position={[0, 0.4, 0]} material={m.shell} />
          <RoundedBox args={[0.76, 0.36, 0.12]} radius={0.1} smoothness={4} position={[0, 0.43, 0.38]} material={m.visor} />
          <group ref={eyes} position={[0, 0.44, 0.45]}>
            <RoundedBox args={[0.15, 0.08, 0.02]} radius={0.03} position={[-0.16, 0, 0]} material={m.glow} />
            <RoundedBox args={[0.15, 0.08, 0.02]} radius={0.03} position={[0.16, 0, 0]} material={m.glow} />
          </group>
          {/* Jaw */}
          <RoundedBox args={[0.5, 0.12, 0.3]} radius={0.05} position={[0, 0.08, 0.24]} material={m.carbon} />
          {/* Ear sensors */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.46, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
              <mesh material={m.joint}>
                <cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />
              </mesh>
              <mesh position={[0, side * 0.045, 0]} material={m.glow}>
                <cylinderGeometry args={[0.07, 0.07, 0.015, 32]} />
              </mesh>
            </group>
          ))}
          {/* Crest fin */}
          <RoundedBox args={[0.08, 0.1, 0.46]} radius={0.03} position={[0, 0.82, -0.04]} material={m.carbon} />
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* "Tap to change colour" label                                        */
/* ------------------------------------------------------------------ */

function CoreHint({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="hidden items-center sm:flex"
      style={{ transform: "translate(-100%, -50%)", paddingRight: 14 }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClick}
        className="pointer-events-auto flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#0d1117]/85 px-2.5 py-1 font-mono text-[0.68rem] text-slate-200 shadow-lg backdrop-blur transition hover:border-white/25"
      >
        <span className="flex gap-[3px]">
          {ROBOT_PALETTE.map((c) => (
            <span
              key={c.hex}
              className="h-[6px] w-[6px] rounded-full"
              style={{ background: c.hex }}
            />
          ))}
        </span>
        tap to change colour
      </button>
      {/* Leader line to the core */}
      <span className="h-px w-5 bg-gradient-to-r from-white/20 to-white/60 sm:w-8" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Aura: beam, scanner rings, floor ripples, glow, orbiting particles  */
/* ------------------------------------------------------------------ */

const BLUE = "#82aaff";

const beamVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uColor2;
  varying vec2 vUv;
  void main() {
    float fade = pow(1.0 - vUv.y, 2.2);
    // Shimmering vertical streaks drifting around the beam
    float streaks = 0.55 + 0.45 * sin(vUv.x * 90.0 + uTime * 1.5) * sin(vUv.x * 37.0 - uTime * 0.8);
    // Bands of energy travelling upward
    float bands = 0.75 + 0.25 * sin(vUv.y * 14.0 - uTime * 1.6);
    float a = fade * streaks * bands * (0.85 + 0.15 * sin(uTime * 2.0));
    vec3 col = mix(uColor, uColor2, vUv.y);
    gl_FragColor = vec4(col, a * 0.14);
  }
`;

function makeGlowTexture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.45)");
  grad.addColorStop(0.6, "rgba(255,255,255,0.1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Aura({
  shared,
  accent,
  lite,
}: {
  shared: React.MutableRefObject<Shared>;
  accent: string;
  lite: boolean;
}) {
  const glowTex = useMemo(makeGlowTexture, []);
  const beamUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(ACCENT) },
      uColor2: { value: new THREE.Color(BLUE) },
    }),
    [],
  );
  const scanRings = useRef<(THREE.Mesh | null)[]>([]);
  const ripples = useRef<(THREE.Mesh | null)[]>([]);
  const glowBack = useRef<THREE.Sprite>(null);
  const glowCore = useRef<THREE.Sprite>(null);

  const additive = {
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  } as const;

  useFrame((state) => {
    const t = shared.current.reduceMotion ? 1 : state.clock.elapsedTime;
    const boost = shared.current.hovered ? 1.3 : 1;
    const col = shared.current.color;
    beamUniforms.uTime.value = t;
    beamUniforms.uColor.value.copy(col);
    for (const ref of [glowBack, glowCore]) {
      if (ref.current) (ref.current.material as THREE.SpriteMaterial).color.copy(col);
    }
    for (const mesh of [...scanRings.current, ...ripples.current]) {
      if (mesh) (mesh.material as THREE.MeshBasicMaterial).color.copy(col);
    }

    // Scanner rings sweep up the body and fade out at the top
    scanRings.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t * 0.18 + i) % 1;
      ring.position.y = 0.15 + phase * 4.3;
      ring.scale.setScalar(1.05 - phase * 0.25);
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.sin(Math.PI * phase) * 0.35 * boost;
    });

    // Floor ripples expand outward
    ripples.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t * 0.25 + i) % 1;
      ring.scale.setScalar(1 + phase * 0.9);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.3 * boost;
    });

    // Breathing glow
    if (glowBack.current) {
      const m = glowBack.current.material as THREE.SpriteMaterial;
      m.opacity = (0.2 + Math.sin(t * 1.4) * 0.05) * boost;
    }
    if (glowCore.current) {
      const m = glowCore.current.material as THREE.SpriteMaterial;
      m.opacity = (0.3 + Math.sin(t * 2.4) * 0.08) * boost;
    }

  });

  return (
    <group>
      {/* Soft glow behind the whole robot */}
      <sprite ref={glowBack} position={[0, 2.3, -1.4]} scale={[6.5, 7, 1]}>
        <spriteMaterial map={glowTex} color={ACCENT} opacity={0.32} {...additive} />
      </sprite>
      {/* Hot glow behind the chest core */}
      <sprite ref={glowCore} position={[0, 3.1, 0.2]} scale={[1.4, 1.4, 1]}>
        <spriteMaterial map={glowTex} color={ACCENT} opacity={0.5} {...additive} />
      </sprite>

      {/* Holographic beam rising from the platform */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[1.0, 1.12, 4.6, 96, 1, true]} />
        <shaderMaterial
          vertexShader={beamVertex}
          fragmentShader={beamFragment}
          uniforms={beamUniforms}
          side={THREE.DoubleSide}
          {...additive}
        />
      </mesh>

      {/* Scanner rings */}
      {[0].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            scanRings.current[i] = el;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[1.08, 0.012, 12, 128]} />
          <meshBasicMaterial color={i === 1 ? BLUE : ACCENT} opacity={0} {...additive} />
        </mesh>
      ))}

      {/* Floor ripples */}
      {[0].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            ripples.current[i] = el;
          }}
          position={[0, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1.16, 1.2, 128]} />
          <meshBasicMaterial color={ACCENT} opacity={0} side={THREE.DoubleSide} {...additive} />
        </mesh>
      ))}

      <Sparkles count={lite ? 10 : 22} scale={[4.4, 4.8, 2.4]} position={[0, 2.4, -0.5]} size={1.8} speed={0.2} opacity={0.45} color={accent} />
    </group>
  );
}

function RimLight({ shared }: { shared: React.MutableRefObject<Shared> }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (light.current) light.current.color.copy(shared.current.color);
  });
  return <pointLight ref={light} position={[-3, 3, -2]} intensity={14} color={ACCENT} distance={10} />;
}

type SceneProps = {
  shared: React.MutableRefObject<Shared>;
  accent: string;
  /** Phones: cheaper shadows, fewer particles */
  lite: boolean;
  onCoreClick: () => void;
  onCoreHover: (v: boolean) => void;
  onBodyClick: () => void;
  onBodyHover: (v: boolean) => void;
};

function Scene({ shared, accent, lite, ...handlers }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 6, 5]} intensity={1.8} />
      <RimLight shared={shared} />
      <pointLight position={[3, 1.5, -2]} intensity={10} color="#82aaff" distance={10} />
      {/* Local studio environment for reflections: no network fetch */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-5, 2, 2]} rotation-y={Math.PI / 3} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color={ACCENT} position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[3, 5, 1]} />
      </Environment>

      <group position={[0, -2.25, 0]}>
        <RobotModel shared={shared} {...handlers} />
        <ContactShadows
          position={[0, 0.01, 0]}
          scale={4}
          blur={2.4}
          far={3}
          opacity={0.6}
          resolution={lite ? 128 : 256}
          frames={lite ? 1 : Infinity}
          color="#000000"
        />
        <Aura shared={shared} accent={accent} lite={lite} />
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Fallbacks                                                           */
/* ------------------------------------------------------------------ */

function FlatFallback() {
  return (
    <div className="absolute bottom-16 left-1/2">
      <RobotSVG className="-translate-x-1/2" />
    </div>
  );
}

class GLBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Public component: fills its (relative) parent                        */
/* ------------------------------------------------------------------ */

export function Robot3D() {
  return (
    <GLBoundary fallback={<FlatFallback />}>
      <Robot3DInner />
    </GLBoundary>
  );
}

function Robot3DInner() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const shared = useRef<Shared>({
    look: { x: 0, y: 0 },
    lastMove: 0,
    hovered: false,
    coreHovered: false,
    reduceMotion: false,
    target: new THREE.Color(ACCENT),
    color: new THREE.Color(ACCENT),
  });
  const [hovered, setHovered] = useState(false);
  const [coreHovered, setCoreHovered] = useState(false);
  const [colourIndex, setColourIndex] = useState(0);
  const colourRef = useRef(0);
  const [toast, setToast] = useState<string | null>(null);
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inView, setInView] = useState(true);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  // Restore the visitor's last colour
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY));
      if (Number.isInteger(saved) && saved > 0 && saved < ROBOT_PALETTE.length) {
        setColourIndex(saved);
        colourRef.current = saved;
        shared.current.target.set(ROBOT_PALETTE[saved].hex);
        shared.current.color.set(ROBOT_PALETTE[saved].hex);
      }
    } catch {
      /* storage unavailable: keep default */
    }
  }, []);

  const cycleColour = () => {
    // Read from the ref so rapid clicks each advance one step
    const next = (colourRef.current + 1) % ROBOT_PALETTE.length;
    colourRef.current = next;
    setColourIndex(next);
    shared.current.target.set(ROBOT_PALETTE[next].hex);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore */
    }
    setToast(ROBOT_PALETTE[next].name);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  };

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  useEffect(() => {
    setWebgl(hasWebGL());
    shared.current.reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.3;
      shared.current.look.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
      shared.current.look.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
      shared.current.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "100px",
    });
    if (wrapRef.current) io.observe(wrapRef.current);

    // Dev-only hook so automated checks can render frames when rAF is paused.
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __robotAdvance?: (t: number) => void }).__robotAdvance = (t) =>
        advance(t);
    }

    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  const setHover = (v: boolean) => {
    shared.current.hovered = v;
    setHovered(v);
  };
  const setCoreHover = (v: boolean) => {
    shared.current.coreHovered = v;
    setCoreHovered(v);
  };

  const accent = ROBOT_PALETTE[colourIndex].hex;
  const bubble = toast
    ? { lead: "core \u2192", text: toast }
    : coreHovered
      ? { lead: touch ? "tap the core" : "click the core", text: "to change my colour" }
      : { lead: "beep boop.", text: `${touch ? "tap" : "click"} me to ask about Ebenezer \u2192` };

  if (webgl === false) return <FlatFallback />;

  const bubbleOn = hovered || coreHovered || toast !== null;

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      style={{ cursor: coreHovered || hovered ? "pointer" : undefined }}
    >
      {/* Speech bubble */}
      <motion.div
        initial={false}
        animate={{ opacity: bubbleOn ? 1 : 0, y: bubbleOn ? 0 : 6 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute left-2 top-6 z-10 w-max max-w-[15rem] rounded-xl border border-ai-border bg-ai-surface/90 px-3.5 py-2.5 font-mono text-[0.75rem] leading-snug text-slate-200 shadow-ai-strong backdrop-blur sm:left-6"
        aria-hidden
      >
        <span style={{ color: accent }}>{bubble.lead}</span> {bubble.text}
      </motion.div>

      {/* Phone version of the colour hint (no room beside the robot) */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={cycleColour}
        className="absolute bottom-1 left-1/2 z-10 flex min-h-[36px] max-w-[calc(100%-1rem)] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#0d1117]/85 px-3 py-1.5 font-mono text-[0.68rem] text-slate-200 shadow-lg backdrop-blur sm:hidden"
      >
        <span className="flex gap-[3px]">
          {ROBOT_PALETTE.map((c) => (
            <span key={c.hex} className="h-[6px] w-[6px] rounded-full" style={{ background: c.hex }} />
          ))}
        </span>
        tap the core to change colour
      </button>

      {/* Keyboard / screen-reader equivalents of clicking the robot */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        <button
          type="button"
          onClick={cycleColour}
          className="sr-only rounded-md border border-ai-border bg-ai-surface px-3 py-1.5 font-mono text-xs text-slate-200 focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-ai-accent-soft/60"
        >
          Change robot colour (now {ROBOT_PALETTE[colourIndex].name})
        </button>
        <Link
          href="/ask"
          className="sr-only rounded-md border border-ai-border bg-ai-surface px-3 py-1.5 font-mono text-xs text-slate-200 focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-ai-accent-soft/60"
        >
          Ask the AI about Ebenezer
        </Link>
      </div>
      <span className="sr-only" aria-live="polite">
        {toast ? `Robot colour changed to ${toast}` : ""}
      </span>

      {webgl && (
        <Canvas
          frameloop={inView ? "always" : "never"}
          dpr={touch ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 0.5, 11.8], fov: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onPointerMissed={() => {
            setHover(false);
            setCoreHover(false);
          }}
          aria-hidden
        >
          <Suspense fallback={null}>
            <Scene
              shared={shared}
              accent={accent}
              lite={touch}
              onCoreClick={cycleColour}
              onCoreHover={setCoreHover}
              onBodyClick={() => router.push("/ask")}
              onBodyHover={setHover}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

export default Robot3D;
