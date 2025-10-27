"use client";

import {
  Canvas,
  useFrame,
  useThree,
  invalidate,
  type ThreeElements,
} from "@react-three/fiber";
import {
  Environment,
  useGLTF,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import type { GLTF } from "three-stdlib";
import type { GLTFLoader } from "three-stdlib";
import { MeshoptDecoder } from "three-stdlib";
import type { SectionAct } from "@/lib/useSectionAct";
// NEW import
import { useTheme } from "next-themes";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export type LogoPhase = "intro" | "park";

type Props = {
  phase: LogoPhase;
  showcaseSeq?: number;
  scroll?: number; // 0..1
  act?: SectionAct;
};

const BASE_TILT_X = -1.42;
const INTRO_SCALE = 2.55;
const PARK_SCALE = 1.2;

type GLTFResult = GLTF & { scene: THREE.Group };
const attachMeshopt = (loader: GLTFLoader) => {
  (loader as GLTFLoader).setMeshoptDecoder?.(
    MeshoptDecoder as unknown as object
  );
};

// ---------- Farben & Tints ----------
const DARK_BASE = new THREE.Color("#f5f7ff"); // hell, edel (Dark Mode)
const LIGHT_BASE = new THREE.Color("#2b2f35"); // Graphit (Light Mode → Text bleibt lesbar)

// dezente Section-Tints (werden 8–15% beigemischt)
const TINTS: Record<string, THREE.Color> = {
  hero: new THREE.Color("#ffffff"),
  bento: new THREE.Color("#ffffff"),
  cta: new THREE.Color("#ffffff"),
  process: new THREE.Color("#8ecaff"), // kühler Touch
  testimonials: new THREE.Color("#ffffff"),
  faq: new THREE.Color("#ffd9a8"), // warm
  footer: new THREE.Color("#ffffff"),
  none: new THREE.Color("#ffffff"),
};

// ---------- kleine Utils ----------
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number, s = 1.70158) =>
  1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);

// elliptische Scrollbahn (glatt, geschlossene Schleife)
function ellipsePath(t: number, cx = -0.8, rx = 0.7, cy = 0.02, ry = 0.12) {
  const a = 2 * Math.PI * t; // 0..2π
  return new THREE.Vector2(cx + rx * Math.cos(a), cy + ry * Math.sin(a * 1.3));
}

function LogoModel({
  phase,
  showcaseSeq = 0,
  scroll = 0,
  act = "hero",
  ...rest
}: Props & ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF(
    "/models/logo.final.glb",
    undefined,
    true,
    attachMeshopt
  ) as GLTFResult;

  const [mountedAt] = useState<number>(() => performance.now());
  const { resolvedTheme } = useTheme(); // <-- NEW

  const prepared = useMemo(() => {
    const root = gltf.scene.clone(true);
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat =
        mesh.material instanceof THREE.MeshStandardMaterial
          ? mesh.material.clone()
          : new THREE.MeshStandardMaterial({ color: "#f5f5f5" });

      mat.metalness = 0.68;
      mat.roughness = 0.28;
      (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.0;
      // für Fade-Out am Ende / FAQ/Footer
      mat.transparent = true;
      mat.opacity = 1;
      mesh.material = mat;
    });
    return root;
  }, [gltf.scene]);

  // Theme-Farbe & dezente Section-Tints mischen (max 15%)
  useEffect(() => {
    const base = (resolvedTheme === "light" ? LIGHT_BASE : DARK_BASE).clone();
    const tint = (TINTS[act as string] ?? TINTS.hero).clone();
    const tintAmount = act === "process" || act === "faq" ? 0.15 : 0.08;

    prepared.traverse((o) => {
      const m = (o as THREE.Mesh).material as
        | THREE.MeshStandardMaterial
        | undefined;
      if (!m) return;
      const mixed = base.clone().lerp(tint, tintAmount);
      m.color = mixed;
      // im Light Mode etwas weniger Glanz, damit’s nicht blendet
      m.metalness = resolvedTheme === "light" ? 0.55 : 0.7;
      m.roughness = resolvedTheme === "light" ? 0.35 : 0.24;
      m.envMapIntensity = resolvedTheme === "light" ? 0.85 : 1.0;
      m.needsUpdate = true;
    });
  }, [prepared, resolvedTheme, act]);

  // --- INTRO CHOREO (sanfter Pop + Bogen nach links) ---
  const intro = {
    popDur: 0.35,
    settleDur: 0.65,
    arcStart: 0.8,
    arcEnd: 1.6,
    arcHeight: 0.12,
    arcLeft: -0.8,
  };

  // Showcase-Trigger
  const showcaseStart = useRef<number | null>(null);
  const lastSeq = useRef<number>(showcaseSeq);
  useEffect(() => {
    if (showcaseSeq !== lastSeq.current) {
      lastSeq.current = showcaseSeq;
      if (!REDUCED) showcaseStart.current = performance.now();
      invalidate();
    }
  }, [showcaseSeq]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const elapsed = (performance.now() - mountedAt) / 1000;
    const active =
      elapsed < 2 ||
      showcaseStart.current !== null ||
      phase === "intro" ||
      !REDUCED;
    if (active) invalidate();

    // ---------- Intro ----------
    const tPop = clamp01(elapsed / intro.popDur);
    const tSettle = clamp01((elapsed - intro.popDur) / intro.settleDur);
    const scaleIntro =
      INTRO_SCALE *
      (0.65 + 0.35 * easeOutBack(tPop)) *
      (1 + 0.08 * (1 - easeOutCubic(tSettle)));
    const rotXIntro = THREE.MathUtils.lerp(
      -0.35,
      BASE_TILT_X,
      easeOutCubic(tSettle)
    );
    const yawIntro = THREE.MathUtils.lerp(0.18, 0, easeOutCubic(tSettle));

    // ---------- Scroll-Fahrt (Ellipsenbahn + Parallax) ----------
    const p = clamp01(scroll);
    const path = ellipsePath(p, -0.8, 0.7, 0.02, 0.12); // X/Y
    const yawFromScroll = Math.sin(p * Math.PI * 2) * 0.22;
    const zParallax = -Math.sin(p * Math.PI) * 1.4;

    // Idle (sehr dezent)
    const idle = REDUCED ? 0 : 1;
    const idleYaw = Math.sin(state.clock.elapsedTime * 0.6) * 0.1 * idle;
    const idlePitch =
      Math.sin(state.clock.elapsedTime * 0.7 + Math.PI / 3) * 0.06 * idle;
    const breathY = Math.sin(state.clock.elapsedTime * 0.9) * 0.012 * idle;

    // ---------- Showcase (seamless flourish) ----------
    const SHOWCASE_DUR = 2000;
    const FLOURISH = {
      yaw: 0.32,
      pitch: 0.12,
      posX: 0.045,
      posY: 0.032,
      scale: 0.022,
      freq: 1.0,
      phaseShift: Math.PI / 2,
    };
    let flourX = 0,
      flourY = 0,
      flourYaw = 0,
      flourPitch = 0,
      flourScale = 1;
    if (showcaseStart.current && !REDUCED) {
      const pp = clamp01(
        (performance.now() - showcaseStart.current) / SHOWCASE_DUR
      );
      const w = 0.5 * (1 - Math.cos(2 * Math.PI * pp));
      const tf = pp * FLOURISH.freq * 2 * Math.PI;
      flourYaw = FLOURISH.yaw * Math.sin(tf) * w;
      flourPitch = FLOURISH.pitch * Math.sin(tf + FLOURISH.phaseShift) * w;
      flourX = FLOURISH.posX * Math.cos(tf) * w;
      flourY = FLOURISH.posY * Math.sin(tf) * w;
      flourScale = 1 + FLOURISH.scale * Math.sin(Math.PI * pp) * w;
      if (pp >= 1) showcaseStart.current = null;
    }

    // ---------- FAQ/Footer-Schutz ----------
    // 1) Am Ende des Onepagers (letzte 12%) sanft ausblenden
    const tailFade = 1 - clamp01((p - 0.88) / 0.12); // 1 → 0 zwischen 88% und 100%
    // 2) In echten FAQ/Footer-Sections: nach rechts, kleiner und tiefer
    const isBottomAct = act === "faq" || act === "footer";
    const avoidX = isBottomAct ? 0.9 : 0;
    const avoidY = isBottomAct ? -0.06 : 0;
    const avoidZ = isBottomAct ? -1.0 : 0;
    const avoidScale = isBottomAct ? 0.9 : 1.0;

    // ---------- Zielwerte ----------
    const k = 1 - Math.pow(0.0016, delta);

    const scaleGoal =
      (phase === "intro" ? scaleIntro : PARK_SCALE) *
      (1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.01 * idle) *
      flourScale *
      avoidScale;

    const rotXGoal = (phase === "intro" ? rotXIntro : BASE_TILT_X) + idlePitch;
    const rotYGoal =
      (phase === "intro" ? yawIntro : 0) + idleYaw + yawFromScroll + flourYaw;
    const rotZGoal = 0;

    const introT = clamp01(
      (elapsed - intro.arcStart) / (intro.arcEnd - intro.arcStart)
    );
    const posXBase =
      phase === "intro"
        ? THREE.MathUtils.lerp(0, intro.arcLeft, easeOutCubic(introT))
        : path.x + flourX + avoidX;
    const posYBase =
      phase === "intro"
        ? intro.arcHeight * Math.sin(Math.PI * introT)
        : path.y + breathY + flourY + avoidY;
    const posZBase = zParallax + avoidZ;

    // ---------- Apply / Fade ----------
    const s = THREE.MathUtils.lerp(group.current.scale.x, scaleGoal, k);
    group.current.scale.setScalar(s);

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      rotXGoal,
      0.12
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      rotYGoal,
      0.14
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      rotZGoal,
      0.12
    );

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      posXBase,
      k
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      posYBase,
      0.1
    );
    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      posZBase,
      k
    );

    // Material-Opacity (FAQ/Footer + End-of-page)
    prepared.traverse((o) => {
      const m = (o as THREE.Mesh).material as
        | THREE.MeshStandardMaterial
        | undefined;
      if (!m) return;
      const targetOpacity =
        (phase === "intro" ? 1 : tailFade) * (isBottomAct ? 0.85 : 1);
      m.opacity = THREE.MathUtils.lerp(m.opacity, targetOpacity, 0.2);
    });
  });

  return <primitive ref={group} object={prepared} {...rest} />;
}
useGLTF.preload("/models/logo.final.glb", undefined, true, attachMeshopt);

// ---------- Parallax Camera ----------
function ParallaxCamera() {
  const { camera } = useThree();
  const camTarget = useRef(new THREE.Vector3(0, 0, 3.2));
  useFrame((state, delta) => {
    if (REDUCED) return;
    const k = 1 - Math.pow(0.0025, delta);
    const maxOffset = 0.12;
    camTarget.current.set(
      THREE.MathUtils.clamp(state.pointer.x, -1, 1) * maxOffset,
      -THREE.MathUtils.clamp(state.pointer.y, -1, 1) * maxOffset,
      3.2
    );
    camera.position.lerp(camTarget.current, k);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ---------- Canvas Wrapper bleibt fixed ----------
export default function ThreeLogo({
  phase,
  showcaseSeq = 0,
  scroll = 0,
  act = "hero",
}: Props) {
  const enableBloom = !REDUCED;
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        frameloop="demand"
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={(s) => (s.gl.toneMappingExposure = 1.08)}
        aria-label="3D-Logo"
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 2, 2]} intensity={2.1} />
        <directionalLight position={[-2.4, 1.4, -1.2]} intensity={0.7} />
        <ParallaxCamera />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <LogoModel
            phase={phase}
            showcaseSeq={showcaseSeq}
            scroll={scroll}
            act={act}
          />
          {enableBloom && (
            <EffectComposer>
              <SMAA />
              <Bloom
                intensity={0.12}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.85}
              />
              <Vignette eskil={false} offset={0.1} darkness={0.75} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
