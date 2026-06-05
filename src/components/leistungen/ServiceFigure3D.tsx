"use client";

import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, SMAA, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import useInView from "@/components/leistungen/useInView";

type Variant = "web" | "jpp" | "seo" | "hosting";

/** Smairys Brand – warmes Amber/Kupfer (#d47115 Familie) */
const BRAND_AMBER = "#d47115";
const BRAND_GLOW = "#ffdcb8";
const BRAND_DEEP = "#6b3a12";

/** Smooth damping */
const damp = (v: number, t: number, k: number, dt: number) =>
  v + (t - v) * (1 - Math.exp(-k * dt));

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

/**
 * Edles „Smoked Amber Glass“ – kein kaltes Grau mehr.
 * Weniger Transmission (verhindert matschiges Durchscheinen auf True-Black),
 * starker Clearcoat, warme Attenuation + dezentes Emissive.
 */
function usePremiumSculptureMaterial(
  theme?: string
): THREE.MeshPhysicalMaterial {
  const isLight = theme === "light";

  const palette = useMemo(
    () => ({
      base: new THREE.Color(isLight ? "#3d2e1f" : "#fff3e6"),
      attenuation: new THREE.Color(isLight ? "#8b5a2b" : BRAND_AMBER),
      emissive: new THREE.Color(BRAND_AMBER),
      sheen: new THREE.Color(BRAND_GLOW),
    }),
    [isLight]
  );

  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: palette.base,
        metalness: isLight ? 0.18 : 0.42,
        roughness: 0.14,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        transmission: isLight ? 0.22 : 0.1,
        thickness: 1.4,
        ior: 1.52,
        attenuationColor: palette.attenuation,
        attenuationDistance: 2.8,
        emissive: palette.emissive,
        emissiveIntensity: isLight ? 0.025 : 0.07,
        sheen: 0.55,
        sheenRoughness: 0.28,
        sheenColor: palette.sheen,
        transparent: true,
        opacity: 1,
        envMapIntensity: isLight ? 1.15 : 1.75,
        reflectivity: 0.92,
      }),
    [palette, isLight]
  );

  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

/** Warmer Hintergrund-Glow – gibt Transmission etwas Edles zum Brechern. */
function WarmBackdrop() {
  return (
    <mesh position={[0, 0, -1.8]} scale={[4.5, 4.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={BRAND_DEEP} transparent opacity={0.35} />
    </mesh>
  );
}

/** Dezente Rand-Aura (Backside) – Kupfer-Kante statt grauer Silhouette. */
function EdgeAura({ variant }: { variant: Variant }) {
  const scale = variant === "hosting" ? 1.06 : 1.04;
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(BRAND_AMBER),
        transparent: true,
        opacity: 0.07,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => () => mat.dispose(), [mat]);

  return (
    <mesh scale={scale} material={mat}>
      <icosahedronGeometry args={[1.05, 1]} />
    </mesh>
  );
}

type PointerCaptureElement = Element & {
  setPointerCapture(id: number): void;
  releasePointerCapture(id: number): void;
};

function isPointerCaptureElement(
  el: Element | null
): el is PointerCaptureElement {
  return !!el && "setPointerCapture" in el && "releasePointerCapture" in el;
}

type SculptureProps = {
  variant: Variant;
  mat: THREE.MeshPhysicalMaterial;
  active: boolean;
  reduced: boolean;
};

function Sculpture({ variant, mat, active, reduced }: SculptureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [dragging, setDragging] = useState(false);
  const target = useRef<{ rx: number; ry: number }>({ rx: -0.2, ry: 0.0 });
  const lerped = useRef<{ rx: number; ry: number }>({ rx: -0.2, ry: 0.0 });

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;

    if (active && !reduced && !dragging) target.current.ry += dt * 0.25;

    lerped.current.rx = damp(lerped.current.rx, target.current.rx, 6, dt);
    lerped.current.ry = damp(lerped.current.ry, target.current.ry, 6, dt);

    g.rotation.set(lerped.current.rx, lerped.current.ry, 0);
  });

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const el = e.target as unknown as Element | null;
    if (isPointerCaptureElement(el)) {
      el.setPointerCapture(e.pointerId);
    }
    setDragging(true);
  };

  const endDrag = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const el = e.target as unknown as Element | null;
    if (isPointerCaptureElement(el)) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    setDragging(false);
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    const dx = e.movementX ?? 0;
    const dy = e.movementY ?? 0;
    target.current.ry += dx * 0.01;
    target.current.rx += dy * 0.01;
    target.current.rx = Math.max(-1.2, Math.min(0.6, target.current.rx));
  };

  const seg = 80;

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerMove={onPointerMove}
    >
      <EdgeAura variant={variant} />

      {variant === "web" && (
        <>
          <mesh material={mat}>
            <torusKnotGeometry args={[0.6, 0.16, seg, 14]} />
          </mesh>
          <mesh material={mat} position={[0, -0.62, 0]}>
            <torusGeometry args={[0.55, 0.06, 18, 100]} />
          </mesh>
        </>
      )}

      {variant === "jpp" && (
        <group>
          <mesh material={mat} position={[0, 0.22, 0]}>
            <boxGeometry args={[1.0, 0.12, 0.62]} />
          </mesh>
          <mesh material={mat} position={[0, 0.02, 0]}>
            <boxGeometry args={[1.18, 0.12, 0.82]} />
          </mesh>
          <mesh material={mat} position={[0, -0.18, 0]}>
            <boxGeometry args={[1.36, 0.12, 1.02]} />
          </mesh>
        </group>
      )}

      {variant === "seo" && (
        <group>
          <mesh material={mat}>
            <cylinderGeometry args={[0.1, 0.1, 1.5, 24]} />
          </mesh>
          <mesh material={mat} position={[0, 0.45, 0]}>
            <torusGeometry args={[0.2, 0.03, 16, 64]} />
          </mesh>
          <mesh material={mat} position={[0, -0.45, 0]}>
            <torusGeometry args={[0.24, 0.03, 16, 64]} />
          </mesh>
        </group>
      )}

      {variant === "hosting" && (
        <group>
          <mesh material={mat}>
            <octahedronGeometry args={[0.7, 0]} />
          </mesh>
          <mesh material={mat} position={[0, -0.9, 0]}>
            <boxGeometry args={[1.6, 0.08, 1.6]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function ServiceFigure3D({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef as unknown as RefObject<Element>, {
    threshold: 0.35,
  });

  const reduced = useReducedMotion();
  const mat = usePremiumSculptureMaterial(resolvedTheme);
  const frameloop: "always" | "demand" | "never" = inView ? "always" : "demand";

  const [dprMax, setDprMax] = useState(2);
  useEffect(() => {
    setDprMax(
      Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1.5)
    );
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={[
        "relative isolate overflow-hidden rounded-xl",
        className ?? "h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px]",
      ].join(" ")}
      aria-hidden
    >
      {/* CSS-Ambient – warmes Licht hinter dem Canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(ellipse 70% 55% at 50% 42%, hsl(28 82% 46% / 0.14), transparent 72%)",
            "radial-gradient(ellipse 50% 40% at 72% 68%, hsl(28 95% 55% / 0.08), transparent 70%)",
          ].join(", "),
        }}
      />

      <Canvas
        dpr={[1, dprMax]}
        frameloop={frameloop}
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0);
          state.gl.toneMapping = THREE.ACESFilmicToneMapping;
          state.gl.toneMappingExposure = 1.12;
        }}
      >
        <ambientLight intensity={0.18} color="#fff0e0" />

        <directionalLight
          position={[2.5, 2.5, 3]}
          intensity={1.15}
          color={BRAND_GLOW}
        />
        <directionalLight
          position={[-2, 0.5, 2]}
          intensity={0.55}
          color={BRAND_AMBER}
        />
        <pointLight
          position={[0, -1.5, 2]}
          intensity={0.35}
          color={BRAND_AMBER}
          distance={8}
        />

        <WarmBackdrop />

        <Environment background={false} resolution={256}>
          <Lightformer
            form="rect"
            intensity={1.1}
            color={BRAND_GLOW}
            scale={[5, 1.4, 1]}
            position={[0, 2.2, 3]}
            rotation={[-0.15, 0, 0]}
          />
          <Lightformer
            form="ring"
            intensity={0.45}
            color={BRAND_AMBER}
            scale={2.2}
            position={[1.8, -0.5, 1.5]}
            rotation={[0.4, 0.2, 0]}
          />
        </Environment>

        <EffectComposer>
          <SMAA />
          <Bloom
            intensity={0.14}
            luminanceThreshold={0.42}
            luminanceSmoothing={0.85}
          />
        </EffectComposer>

        <Sculpture
          variant={variant}
          mat={mat}
          active={inView}
          reduced={reduced}
        />
      </Canvas>
    </div>
  );
}
