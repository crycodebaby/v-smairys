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
import { useTheme } from "next-themes";

/** Neue Architektur-Imports */
import { ANIM_PROFILES, type AnimProfile } from "@/lib/animProfiles";
import type { ViewportTier } from "@/hooks/useViewportTier";

/* ============================
   Prefs / Typen
   ============================ */
const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export type LogoPhase = "intro" | "park";

interface ThreeLogoProps {
  phase: LogoPhase;
  showcaseSeq?: number;
  scroll?: number; // 0..1
  act?: string;
  tier: ViewportTier;
}

/* ============================
   Hero-Guard & Bottom-Fade
   ============================ */
const HERO_GUARD_X: Record<ViewportTier, number> = {
  mobile: -0.58, // näher im Bild, aber links der Textspalte
  tablet: -1.2,
  desktop: -1.45,
};

const BOTTOM_FADE_START = 0.9; // ab 90% Scroll
const BOTTOM_FADE_END = 0.98; // bis ~Footer unsichtbar

const OCCLUDE_SECTIONS = new Set(["faq", "footer"]);

/* ============================
   GLTF / Meshopt
   ============================ */
type GLTFResult = GLTF & { scene: THREE.Group };
const attachMeshopt = (loader: GLTFLoader) => {
  (loader as GLTFLoader).setMeshoptDecoder?.(
    MeshoptDecoder as unknown as object
  );
};

/* ============================
   Farben & dezente Tints
   ============================ */
const DARK_BASE = new THREE.Color("#f5f7ff"); // hell, edel im Dark Mode
const LIGHT_BASE = new THREE.Color("#2b2f35"); // Graphit im Light Mode

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

/* ============================
   Easing / Utils
   ============================ */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number, s = 1.70158) =>
  1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/* ============================
   LogoModel – holt alles aus AnimProfile
   ============================ */
function LogoModel({
  phase,
  showcaseSeq = 0,
  scroll = 0,
  act = "hero",
  profile,
  tier,
  ...rest
}: {
  phase: LogoPhase;
  showcaseSeq?: number;
  scroll?: number;
  act?: string;
  profile: AnimProfile;
  tier: ViewportTier;
} & ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF(
    "/models/logo.final.glb",
    undefined,
    true,
    attachMeshopt
  ) as GLTFResult;

  const [mountedAt] = useState<number>(() => performance.now());
  const { resolvedTheme } = useTheme();

  // Three viewport tools (für Viewport-Clamp)
  const { camera, viewport } = useThree();

  // Scene-Klon
  const prepared = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  /**
   * Material-Cache (einmalig):
   * Einheitlich MeshPhysicalMaterial pro Mesh, danach nur Properties updaten.
   */
  const matsRef = useRef<
    Array<THREE.MeshPhysicalMaterial & { opacity?: number }>
  >([]);
  useEffect(() => {
    matsRef.current = [];
    prepared.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;

      const pm = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f5f5f5"),
        metalness: 0.75,
        roughness: 0.28,
        envMapIntensity: 1.0,
        clearcoat: 0.5,
        clearcoatRoughness: 0.25,
        sheen: 0.2,
        sheenRoughness: 0.7,
        transmission: 0,
        transparent: true,
        opacity: 1,
      });
      mesh.material = pm;
      matsRef.current.push(pm);
    });
  }, [prepared]);

  // Theme-Farbe & dezente Section-Tints (6–12 %) – nur Eigenschaften anpassen
  useEffect(() => {
    const baseColor =
      resolvedTheme === "light" ? LIGHT_BASE.clone() : DARK_BASE.clone();
    const tint = (TINTS[act] ?? TINTS.hero).clone();
    const tintAmount = act === "process" || act === "faq" ? 0.12 : 0.06;
    const mixed = baseColor.clone().lerp(tint, tintAmount);

    const isLight = resolvedTheme === "light";

    for (const mat of matsRef.current) {
      mat.color.copy(mixed);
      mat.metalness = isLight ? 0.85 : 0.75;
      mat.roughness = isLight ? 0.35 : 0.22;
      mat.envMapIntensity = isLight ? 0.9 : 1.1;
      mat.clearcoat = isLight ? 0.6 : 0.5;
      mat.clearcoatRoughness = isLight ? 0.25 : 0.22;
      mat.sheen = isLight ? 0.3 : 0.22;
      mat.sheenRoughness = isLight ? 0.75 : 0.7;
      mat.transparent = true;
      if (typeof mat.opacity !== "number") mat.opacity = 1;
      mat.needsUpdate = true;
    }
  }, [resolvedTheme, act]);

  // Showcase-Trigger (leichtes Flourish – *ohne* profile.showcase)
  const showcaseStart = useRef<number | null>(null);
  const lastSeq = useRef<number>(showcaseSeq);
  useEffect(() => {
    if (showcaseSeq !== lastSeq.current) {
      lastSeq.current = showcaseSeq;
      if (!REDUCED) showcaseStart.current = performance.now();
      invalidate();
    }
  }, [showcaseSeq]);

  // Viewport-Weltmaße auf Z=0 (für Clamp)
  const getWorldBounds = () => {
    const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, 0));
    return { worldW: vp.width as number, worldH: vp.height as number };
  };

  useFrame((state, delta) => {
    if (!group.current) return;

    const elapsed = (performance.now() - mountedAt) / 1000;
    const active =
      elapsed < 2 ||
      showcaseStart.current !== null ||
      phase === "intro" ||
      !REDUCED;
    if (active) invalidate();

    // ── Intro-Phasen (ms aus Profil) ──────────────────────────────────────────
    const tPop = clamp01((elapsed * 1000) / profile.intro.pop);
    const tSettle = clamp01(
      (elapsed * 1000 - profile.intro.pop) / profile.intro.settle
    );
    const arcT = clamp01(
      (elapsed * 1000 - profile.intro.start) /
        (profile.intro.end - profile.intro.start)
    );

    const rotXIntro = THREE.MathUtils.lerp(
      -0.32,
      profile.intro.baseTiltX,
      easeOutCubic(tSettle)
    );
    const yawIntro = THREE.MathUtils.lerp(0.16, 0, easeOutCubic(tSettle));

    const scaleIntro =
      profile.intro.introScale *
      (0.65 + 0.35 * easeOutBack(tPop)) *
      (1 + 0.06 * (1 - easeOutCubic(tSettle)));

    // ── Scrollpfad & Rotationen ───────────────────────────────────────────────
    const p = clamp01(scroll);
    const path = profile.path(p); // {x,y,z}
    const rotScroll = profile.scrollRot(p); // Euler (x,y,z)

    // ── Idle (profilabhängig) ────────────────────────────────────────────────
    const idleYaw = Math.sin(state.clock.elapsedTime * 0.6) * profile.idle.yaw;
    const idlePitch =
      Math.sin(state.clock.elapsedTime * 0.7 + Math.PI / 3) *
      profile.idle.pitch;
    const breathY =
      Math.sin(state.clock.elapsedTime * 0.9) * profile.idle.breathY;

    // ── Zielwerte (vor Guards) ───────────────────────────────────────────────
    const rotXGoal =
      (phase === "intro" ? rotXIntro : profile.intro.baseTiltX) +
      idlePitch +
      (phase === "intro" ? 0 : rotScroll.x);

    const rotYGoal =
      (phase === "intro" ? yawIntro : 0) +
      idleYaw +
      (phase === "intro" ? 0 : rotScroll.y);

    const rotZGoal = phase === "intro" ? 0 : rotScroll.z;

    let posXGoal =
      phase === "intro"
        ? THREE.MathUtils.lerp(0, profile.intro.arcLeft, easeOutCubic(arcT))
        : path.x;

    let posYGoal =
      phase === "intro"
        ? profile.intro.arcHeight * Math.sin(Math.PI * arcT)
        : path.y + breathY;

    const posZGoal = phase === "intro" ? 0 : path.z;

    const scaleGoal = phase === "intro" ? scaleIntro : profile.park.scale;

    // ── Viewport-Clamp (immer im Frame halten) ───────────────────────────────
    const { worldW, worldH } = getWorldBounds();
    const marginX = tier === "mobile" ? 0.08 : 0.1;
    const marginY = tier === "mobile" ? 0.06 : 0.08;

    const minX = -worldW / 2 + marginX;
    const maxX = worldW / 2 - marginX;
    const minY = -worldH / 2 + marginY;
    const maxY = worldH / 2 - marginY;

    // 1) nie in Textzone (Hero-Guard links halten)
    posXGoal = Math.min(posXGoal, HERO_GUARD_X[tier]);
    // 2) nie außerhalb des sichtbaren Frames
    posXGoal = THREE.MathUtils.clamp(posXGoal, minX, maxX);
    posYGoal = THREE.MathUtils.clamp(posYGoal, minY, maxY);

    // ── Bottom-Fade + (optional) Act-Fade ────────────────────────────────────
    const bottomFade = smoothstep(BOTTOM_FADE_START, BOTTOM_FADE_END, p);
    const actFade = OCCLUDE_SECTIONS.has(String(act ?? "").toLowerCase())
      ? 0
      : 1;
    const targetOpacity = (1 - bottomFade) * actFade;
    const lerpA = 1 - Math.pow(0.3, delta); // flott, aber weich

    for (const mat of matsRef.current) {
      mat.opacity = THREE.MathUtils.lerp(
        mat.opacity ?? 1,
        targetOpacity,
        lerpA
      );
    }

    // ── Apply (Interpolation) ─────────────────────────────────────────────────
    const k = 1 - Math.pow(0.0014, delta);

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      posXGoal,
      k
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      posYGoal,
      k
    );
    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      posZGoal,
      k
    );

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

    // Leichtes Showcase-Flourish (ohne profile.showcase)
    if (showcaseStart.current && !REDUCED) {
      const SHOWCASE_DUR = 2000;
      const pp = clamp01(
        (performance.now() - showcaseStart.current) / SHOWCASE_DUR
      );
      const w = 0.5 * (1 - Math.cos(2 * Math.PI * pp));
      const tf = pp * 0.9 * 2 * Math.PI;

      group.current.position.x += 0.03 * Math.cos(tf) * w;
      group.current.position.y += 0.022 * Math.sin(tf) * w;

      group.current.rotation.y += 0.22 * Math.sin(tf) * 0.1 * w;
      group.current.rotation.x += 0.08 * Math.sin(tf + Math.PI / 2) * 0.1 * w;

      const s2 = 1 + 0.014 * Math.sin(Math.PI * pp) * w * 0.5;
      group.current.scale.multiplyScalar(s2);

      if (pp >= 1) showcaseStart.current = null;
    }
  });

  return <primitive ref={group} object={prepared} {...rest} />;
}
useGLTF.preload("/models/logo.final.glb", undefined, true, attachMeshopt);

/* ============================
   Parallax Camera (tier-sensitiv, ohne profile.camera)
   ============================ */
function ParallaxCamera({ intensity = 0.12 }: { intensity?: number }) {
  const { camera } = useThree();
  const camTarget = useRef(new THREE.Vector3(0, 0, 3.2));
  useFrame((state, delta) => {
    if (REDUCED) return;
    const k = 1 - Math.pow(0.0025, delta);
    camTarget.current.set(
      THREE.MathUtils.clamp(state.pointer.x, -1, 1) * intensity,
      -THREE.MathUtils.clamp(state.pointer.y, -1, 1) * intensity,
      3.2
    );
    camera.position.lerp(camTarget.current, k);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ============================
   Canvas Wrapper – lädt Profil nach Tier
   ============================ */
export default function ThreeLogo({
  phase,
  showcaseSeq = 0,
  scroll = 0,
  act = "hero",
  tier,
}: ThreeLogoProps) {
  const profile: AnimProfile = ANIM_PROFILES[tier];

  // iOS/URL-Bar safe sizing + Kamera je Tier
  const camFov = tier === "mobile" ? 52 : 45;
  const camZ = tier === "mobile" ? 3.5 : 3.2;

  // Bloom-Intensität je Tier (dezent)
  const bloomIntensity =
    tier === "mobile" ? 0.08 : tier === "tablet" ? 0.1 : 0.12;

  // Parallax je Tier (etwas schwächer auf Mobile)
  const parallaxIntensity =
    tier === "mobile" ? 0.08 : tier === "tablet" ? 0.1 : 0.12;

  return (
    <div className="fixed inset-0 h-[100svh] w-full pointer-events-none -z-10">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, camZ], fov: camFov }}
        frameloop="demand"
        gl={{
          antialias: true,
          powerPreference:
            tier === "desktop" ? "high-performance" : "low-power",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={(state) => {
          state.gl.toneMappingExposure = profile.lighting.exposure;
          state.gl.setClearColor(0x000000, 0); // transparent
        }}
        aria-label="3D-Logo"
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Licht je Profil */}
        <ambientLight intensity={profile.lighting.ambient} />
        <directionalLight
          position={profile.lighting.key.pos as [number, number, number]}
          intensity={profile.lighting.key.intensity}
          color={new THREE.Color(profile.lighting.key.color)}
        />
        <directionalLight
          position={profile.lighting.rim.pos as [number, number, number]}
          intensity={profile.lighting.rim.intensity}
          color={new THREE.Color(profile.lighting.rim.color)}
        />

        <ParallaxCamera intensity={parallaxIntensity} />

        <Suspense fallback={null}>
          <Environment preset="studio" />

          <LogoModel
            phase={phase}
            showcaseSeq={showcaseSeq}
            scroll={scroll}
            act={act}
            profile={profile}
            tier={tier} // für Hero-Guard/Clamp
          />

          {!REDUCED && (
            <EffectComposer>
              <SMAA />
              <Bloom
                intensity={bloomIntensity}
                luminanceThreshold={0.4}
                luminanceSmoothing={0.9}
              />
              <Vignette eskil={false} offset={0.1} darkness={0.7} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
