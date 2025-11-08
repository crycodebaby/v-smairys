"use client";

import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, SMAA, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import useInView from "@/components/leistungen/useInView";

type Variant = "web" | "jpp" | "seo" | "hosting";

/** Smooth damping */
const damp = (v: number, t: number, k: number, dt: number) =>
  v + (t - v) * (1 - Math.exp(-k * dt));

/** Reduced-motion Hook: SSR-safe + reacts to OS change */
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

/** Reusable glassy material tuned for your theme tokens */
function useGlassMaterial(theme?: string): THREE.MeshPhysicalMaterial {
  const tint = useMemo(
    () => new THREE.Color(theme === "light" ? "#2b2f35" : "#eaf0ff"),
    [theme]
  );

  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: tint,
        metalness: 0,
        roughness: 0.46,
        transmission: 0.6,
        thickness: 0.5,
        ior: 1.45,
        attenuationColor: tint,
        attenuationDistance: 1.2,
        clearcoat: 0.1,
        transparent: true,
        opacity: 0.85,
        envMapIntensity: theme === "light" ? 0.9 : 1.1,
      }),
    [tint, theme]
  );

  useEffect(() => () => mat.dispose(), [mat]); // tidy up GPU memory on unmount
  return mat;
}

/** Element-Typ mit Pointer-Capture-APIs */
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

  // drag state
  const [dragging, setDragging] = useState(false);
  const target = useRef<{ rx: number; ry: number }>({ rx: -0.2, ry: 0.0 });
  const lerped = useRef<{ rx: number; ry: number }>({ rx: -0.2, ry: 0.0 });

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;

    // subtle autorotation only when visible & not dragging & not reduced
    if (active && !reduced && !dragging) target.current.ry += dt * 0.25;

    // smooth follow
    lerped.current.rx = damp(lerped.current.rx, target.current.rx, 6, dt);
    lerped.current.ry = damp(lerped.current.ry, target.current.ry, 6, dt);

    g.rotation.set(lerped.current.rx, lerped.current.ry, 0);
  });

  // Pointer handlers (typ-sicher, ohne any)
  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const el = e.target as unknown as Element | null; // ThreeEvent.target ist ein generisches EventTarget
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

  // HTMLDivElement-Ref für DOM, aber Hook erwartet Element → sauber beim Aufruf casten
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef as unknown as React.RefObject<Element>, {
    threshold: 0.35,
  });

  const reduced = useReducedMotion();
  const mat = useGlassMaterial(resolvedTheme);

  // render only when visible
  const frameloop: "always" | "demand" | "never" = inView ? "always" : "demand";

  // safe DPR without hardcoding window at render-time
  const [dprMax, setDprMax] = useState(2);
  useEffect(() => {
    setDprMax(
      Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1.5)
    );
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={
        className ?? "relative h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px]"
      }
      aria-hidden
    >
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
          state.gl.toneMappingExposure = 1.05;
        }}
      >
        {/* Light — warm key + cool fill */}
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[2, 2, 3]}
          intensity={1.0}
          color={"#ffdcb8"}
        />
        <directionalLight
          position={[-2, -1, -2]}
          intensity={0.8}
          color={"#a8c8ff"}
        />

        <Environment background={false} resolution={256}>
          <Lightformer
            form="rect"
            intensity={0.8}
            scale={[6, 1.2, 1]}
            position={[0, 2, 3]}
            rotation={[-0.18, 0, 0]}
          />
        </Environment>

        <EffectComposer>
          <SMAA />
          <Bloom
            intensity={0.08}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.9}
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
