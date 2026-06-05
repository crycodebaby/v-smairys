"use client";

import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Edges, Environment } from "@react-three/drei";
import { EffectComposer, SMAA } from "@react-three/postprocessing";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import useInView from "@/components/leistungen/useInView";

type Variant = "web" | "jpp" | "seo" | "hosting";

/** Kupfer-Akzent nur auf Kantenlinien – nicht auf der Fläche. */
const EDGE_ACCENT = "#d47115";

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

type SculpturePalette = {
  body: string;
  edge: string;
  ground: string;
};

/**
 * Brutalist „Matte Stone“ – unglasiertes Off-White auf True-Black.
 * Kein Lack, kein Glas, keine Transmission. Akzent nur über Edges-Linien.
 */
function useSculpturePalette(theme?: string): SculpturePalette {
  return useMemo(() => {
    if (theme === "light") {
      return {
        body: "#2a2a2a",
        edge: EDGE_ACCENT,
        ground: "#e8e8e8",
      };
    }
    return {
      body: "#e8e6e1",
      edge: EDGE_ACCENT,
      ground: "#0c0c0c",
    };
  }, [theme]);
}

type SculptedMeshProps = {
  children: ReactNode;
  bodyColor: string;
  edgeColor: string;
  position?: [number, number, number];
};

/** Matte Volumen-Form + architektonische Kupfer-Kanten (drei Edges). */
function SculptedMesh({
  children,
  bodyColor,
  edgeColor,
  position,
}: SculptedMeshProps) {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(bodyColor),
        roughness: 1,
        metalness: 0,
        envMapIntensity: 0.12,
        flatShading: false,
      }),
    [bodyColor]
  );

  useEffect(() => () => mat.dispose(), [mat]);

  return (
    <mesh position={position} material={mat}>
      {children}
      <Edges
        color={edgeColor}
        threshold={14}
        linewidth={1}
        opacity={0.55}
        transparent
        renderOrder={1}
      />
    </mesh>
  );
}

/** Dezenter Boden-Schatten – neutral, kein Farbglow. */
function ContactGround({ color }: { color: string }) {
  return (
    <mesh position={[0, -1.35, -0.6]} rotation={[-Math.PI / 2.2, 0, 0]}>
      <circleGeometry args={[1.35, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
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
  palette: SculpturePalette;
  active: boolean;
  reduced: boolean;
};

function Sculpture({ variant, palette, active, reduced }: SculptureProps) {
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
    target.current.ry += (e.movementX ?? 0) * 0.01;
    target.current.rx += (e.movementY ?? 0) * 0.01;
    target.current.rx = Math.max(-1.2, Math.min(0.6, target.current.rx));
  };

  const seg = 80;
  const { body, edge } = palette;

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerMove={onPointerMove}
    >
      <ContactGround color={palette.ground} />

      {variant === "web" && (
        <>
          <SculptedMesh bodyColor={body} edgeColor={edge}>
            <torusKnotGeometry args={[0.6, 0.16, seg, 14]} />
          </SculptedMesh>
          <SculptedMesh
            bodyColor={body}
            edgeColor={edge}
            position={[0, -0.62, 0]}
          >
            <torusGeometry args={[0.55, 0.06, 18, 100]} />
          </SculptedMesh>
        </>
      )}

      {variant === "jpp" && (
        <group>
          <SculptedMesh
            bodyColor={body}
            edgeColor={edge}
            position={[0, 0.22, 0]}
          >
            <boxGeometry args={[1.0, 0.12, 0.62]} />
          </SculptedMesh>
          <SculptedMesh
            bodyColor={body}
            edgeColor={edge}
            position={[0, 0.02, 0]}
          >
            <boxGeometry args={[1.18, 0.12, 0.82]} />
          </SculptedMesh>
          <SculptedMesh
            bodyColor={body}
            edgeColor={edge}
            position={[0, -0.18, 0]}
          >
            <boxGeometry args={[1.36, 0.12, 1.02]} />
          </SculptedMesh>
        </group>
      )}

      {variant === "seo" && (
        <group>
          <SculptedMesh bodyColor={body} edgeColor={edge}>
            <cylinderGeometry args={[0.1, 0.1, 1.5, 24]} />
          </SculptedMesh>
          <SculptedMesh
            bodyColor={body}
            edgeColor={edge}
            position={[0, 0.45, 0]}
          >
            <torusGeometry args={[0.2, 0.03, 16, 64]} />
          </SculptedMesh>
          <SculptedMesh
            bodyColor={body}
            edgeColor={edge}
            position={[0, -0.45, 0]}
          >
            <torusGeometry args={[0.24, 0.03, 16, 64]} />
          </SculptedMesh>
        </group>
      )}

      {variant === "hosting" && (
        <group>
          <SculptedMesh bodyColor={body} edgeColor={edge}>
            <octahedronGeometry args={[0.7, 0]} />
          </SculptedMesh>
          <SculptedMesh
            bodyColor={body}
            edgeColor={edge}
            position={[0, -0.9, 0]}
          >
            <boxGeometry args={[1.6, 0.08, 1.6]} />
          </SculptedMesh>
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
  const palette = useSculpturePalette(resolvedTheme);
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
      {/* Neutraler Studio-Hintergrund – kein Amber-Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_50%_at_50%_45%,hsl(0_0%_100%/0.04),transparent_70%)]"
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
          state.gl.toneMappingExposure = 1.0;
        }}
      >
        {/* Weiches Studio-Licht – neutral, nicht farbig */}
        <ambientLight intensity={0.55} color="#fafafa" />
        <directionalLight
          position={[3, 4, 5]}
          intensity={0.85}
          color="#ffffff"
        />
        <directionalLight
          position={[-3, 1, 2]}
          intensity={0.35}
          color="#f0f0f0"
        />
        <hemisphereLight
          args={["#ffffff", "#1a1a1a", 0.4]}
        />

        {/* Neutrales Environment, sehr dezent */}
        <Environment preset="studio" environmentIntensity={0.25} />

        <EffectComposer>
          <SMAA />
        </EffectComposer>

        <Sculpture
          variant={variant}
          palette={palette}
          active={inView}
          reduced={reduced}
        />
      </Canvas>
    </div>
  );
}
