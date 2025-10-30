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

/* ========= Mobile Detection ========= */
const isMobileNow = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

function useIsMobile() {
  const [mob, setMob] = useState<boolean>(() => isMobileNow());
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setMob(isMobileNow()));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return mob;
}

/* ========= Park-Offsets & Pfad ========= */
// Desktop links, Mobile noch weiter links
const PARK_X_DESKTOP = -1.28;
const PARK_X_MOBILE = -1.38;
const PARK_Y = 0.02;

// elliptische Scrollbahn
function ellipsePath(t: number, cx: number, rx = 0.5, cy = PARK_Y, ry = 0.1) {
  const a = 2 * Math.PI * t;
  return new THREE.Vector2(cx + rx * Math.cos(a), cy + ry * Math.sin(a * 1.25));
}

/* ========= Farben & Tints ========= */
const DARK_BASE = new THREE.Color("#f5f7ff");
const LIGHT_BASE = new THREE.Color("#2b2f35");

const TINTS: Record<string, THREE.Color> = {
  hero: new THREE.Color("#ffffff"),
  bento: new THREE.Color("#ffffff"),
  cta: new THREE.Color("#ffffff"),
  process: new THREE.Color("#8ecaff"),
  testimonials: new THREE.Color("#ffffff"),
  faq: new THREE.Color("#ffd9a8"),
  footer: new THREE.Color("#ffffff"),
  none: new THREE.Color("#ffffff"),
};

/* ========= Utils ========= */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number, s = 1.70158) =>
  1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};
const xexp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);

/* ========= Model ========= */
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
  const { resolvedTheme } = useTheme();
  const isMob = useIsMobile();

  // Mobile-Profile (enger, dezenter, sparsamer)
  const MOB_RX = 0.36;
  const MOB_RY = 0.075;
  const MOB_SCALE = 0.9;
  const MOB_OPACITY_CAP = 0.6;

  const prepared = useMemo(() => {
    const root = gltf.scene.clone(true);
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      const base =
        mesh.material instanceof THREE.MeshStandardMaterial
          ? mesh.material.clone()
          : new THREE.MeshStandardMaterial({ color: "#f5f5f5" });

      base.metalness = 0.68;
      base.roughness = 0.28;
      base.envMapIntensity = 1.0;
      base.transparent = true;
      base.opacity = 1;

      mesh.material = base;
    });
    return root;
  }, [gltf.scene]);

  // Theme-Farb/Tint
  useEffect(() => {
    const baseColor = (
      resolvedTheme === "light" ? LIGHT_BASE : DARK_BASE
    ).clone();
    const tint = (TINTS[act as string] ?? TINTS.hero).clone();
    const tintAmount = act === "process" || act === "faq" ? 0.12 : 0.06;

    prepared.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;

      const prevOpacity =
        (mesh.material as THREE.Material & { opacity?: number }).opacity ?? 1;
      const mixed = baseColor.clone().lerp(tint, tintAmount);

      if (resolvedTheme === "light") {
        const pm = new THREE.MeshPhysicalMaterial({
          color: mixed,
          metalness: 0.85,
          roughness: 0.35,
          envMapIntensity: 0.9,
          clearcoat: 0.6,
          clearcoatRoughness: 0.25,
          sheen: 0.3,
          sheenRoughness: 0.75,
          transmission: 0,
          transparent: true,
          opacity: prevOpacity,
        });
        mesh.material = pm;
      } else {
        const sm =
          mesh.material instanceof THREE.MeshStandardMaterial
            ? mesh.material
            : new THREE.MeshStandardMaterial({ color: mixed });

        sm.color = mixed;
        sm.metalness = 0.75;
        sm.roughness = 0.22;
        sm.envMapIntensity = 1.1;
        sm.transparent = true;
        sm.opacity = prevOpacity;
        mesh.material = sm;
      }

      (mesh.material as THREE.Material).needsUpdate = true;
    });
  }, [prepared, resolvedTheme, act]);

  // Intro
  const intro = {
    popDur: 0.35,
    settleDur: 0.65,
    arcStart: 0.8,
    arcEnd: 1.6,
    arcHeight: 0.12,
    arcLeft: PARK_X_DESKTOP,
  };

  // Showcase
  const showcaseStart = useRef<number | null>(null);
  const lastSeq = useRef<number>(showcaseSeq);
  useEffect(() => {
    if (showcaseSeq !== lastSeq.current) {
      lastSeq.current = showcaseSeq;
      if (!REDUCED) showcaseStart.current = performance.now();
      invalidate();
    }
  }, [showcaseSeq]);

  // Park/Radius-Refs (wechseln bei Resize)
  const parkXRef = useRef<number>(isMob ? PARK_X_MOBILE : PARK_X_DESKTOP);
  const rxRef = useRef<number>(isMob ? MOB_RX : 0.5);
  const ryRef = useRef<number>(isMob ? MOB_RY : 0.1);
  useEffect(() => {
    parkXRef.current = isMob ? PARK_X_MOBILE : PARK_X_DESKTOP;
    rxRef.current = isMob ? MOB_RX : 0.5;
    ryRef.current = isMob ? MOB_RY : 0.1;
    invalidate();
  }, [isMob]);

  // Quaternion cache
  const qTarget = useRef(new THREE.Quaternion());
  const eulerTmp = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const prevScroll = useRef(scroll);

  useFrame((state, delta) => {
    if (!group.current) return;

    const dt = Math.min(delta, 1 / 30);
    const elapsed = (performance.now() - mountedAt) / 1000;
    const active =
      elapsed < 2 ||
      showcaseStart.current !== null ||
      phase === "intro" ||
      !REDUCED;
    if (active) invalidate();

    // Intro
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
    const arcT = clamp01(
      (elapsed - intro.arcStart) / (intro.arcEnd - intro.arcStart)
    );

    // Showcase (leicht reduziert)
    const SHOWCASE_DUR = 2000;
    const FLOURISH = {
      yaw: 0.26,
      pitch: 0.1,
      posX: 0.04,
      posY: 0.03,
      scale: 0.016,
      freq: 0.9,
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

    // FAQ/Footer Fade
    const p = clamp01(scroll);
    const tailFade = 1 - smoothstep((p - 0.88) / 0.12);
    const isBottomAct = act === "faq" || act === "footer";

    // Geschwindigkeit → Rotationsdämpfung
    const dp = Math.abs(p - prevScroll.current);
    prevScroll.current = p;
    const speed = Math.min(dp / Math.max(dt, 1e-4), 4);
    const speedFactor = REDUCED ? 0 : THREE.MathUtils.smoothstep(speed, 0, 1);

    // Pfad (mit mobilen Radien)
    const path = ellipsePath(
      p,
      parkXRef.current,
      rxRef.current,
      PARK_Y,
      ryRef.current
    );

    // Parallax
    const zParallax = -Math.sin(p * Math.PI) * 1.2;

    // Scroll-Rotation (gedämpft, auf Mobil etwas geringer)
    const yawFromScroll =
      Math.sin(p * Math.PI * 2) *
      0.32 *
      (0.6 + 0.4 * speedFactor) *
      (isMob ? 0.85 : 1);
    const pitchFromScroll =
      Math.sin(p * Math.PI * 2 + Math.PI / 2) *
      0.16 *
      (0.6 + 0.4 * speedFactor) *
      (isMob ? 0.85 : 1);
    const rollFromScroll =
      Math.sin(p * Math.PI * 4) *
      0.1 *
      (0.6 + 0.4 * speedFactor) *
      (isMob ? 0.85 : 1);

    // Idle minimal
    const idle = REDUCED ? 0 : 1;
    const idleYaw =
      Math.sin(state.clock.elapsedTime * 0.55) *
      0.055 *
      idle *
      (isMob ? 0.8 : 1);
    const idlePitch =
      Math.sin(state.clock.elapsedTime * 0.7 + Math.PI / 3) *
      0.04 *
      idle *
      (isMob ? 0.8 : 1);
    const breathY =
      Math.sin(state.clock.elapsedTime * 0.9) *
      0.009 *
      idle *
      (isMob ? 0.8 : 1);

    // Smoothing
    const kPos = xexp(6.0, dt);
    const kRot = xexp(8.0, dt);
    const kScl = xexp(6.0, dt);

    // Scale (Mobile etwas kleiner)
    const scaleGoal =
      (phase === "intro" ? scaleIntro : PARK_SCALE) *
      (isMob ? MOB_SCALE : 1) *
      (1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.008 * idle) *
      flourScale *
      (isBottomAct ? 0.9 : 1.0);

    const rotXGoal =
      (phase === "intro" ? rotXIntro : BASE_TILT_X) +
      (phase === "intro" ? 0 : pitchFromScroll) +
      idlePitch +
      (flourPitch || 0);

    const rotYGoal =
      (phase === "intro" ? yawIntro : 0) +
      (phase === "intro" ? 0 : yawFromScroll) +
      idleYaw +
      (flourYaw || 0);

    const rotZGoal = phase === "intro" ? 0 : rollFromScroll;

    const posXBase =
      phase === "intro"
        ? THREE.MathUtils.lerp(0, intro.arcLeft, easeOutCubic(arcT))
        : path.x + (flourX || 0) + (isBottomAct ? 0.9 : 0);

    const posYBase =
      phase === "intro"
        ? intro.arcHeight * Math.sin(Math.PI * arcT)
        : path.y + breathY + (flourY || 0) + (isBottomAct ? -0.06 : 0);

    const posZBase =
      phase === "intro" ? 0 : zParallax + (isBottomAct ? -1.0 : 0);

    // Apply
    const s = THREE.MathUtils.lerp(group.current.scale.x, scaleGoal, kScl);
    group.current.scale.setScalar(s);

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      posXBase,
      kPos
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      posYBase,
      0.1
    );
    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      posZBase,
      kPos
    );

    // Quaternion slerp (kein Gimbal)
    eulerTmp.current.set(rotXGoal, rotYGoal, rotZGoal, "YXZ");
    qTarget.current.setFromEuler(eulerTmp.current);
    group.current.quaternion.slerp(qTarget.current, kRot);

    // Opacity (Mobile capped)
    prepared.traverse((o) => {
      const m = (o as THREE.Mesh).material as
        | THREE.MeshStandardMaterial
        | THREE.MeshPhysicalMaterial
        | undefined;
      if (!m) return;
      const baseTarget =
        (phase === "intro" ? 1 : tailFade) * (isBottomAct ? 0.85 : 1);
      const capped = isMob ? Math.min(baseTarget, MOB_OPACITY_CAP) : baseTarget;
      m.opacity = THREE.MathUtils.lerp(m.opacity, capped, xexp(10, dt));
    });
  });

  return <primitive ref={group} object={prepared} {...rest} />;
}
useGLTF.preload("/models/logo.final.glb", undefined, true, attachMeshopt);

/* ========= Parallax Camera ========= */
function ParallaxCamera() {
  const { camera } = useThree();
  const camTarget = useRef(new THREE.Vector3(0, 0, 3.2));
  useFrame((state, delta) => {
    if (REDUCED) return;
    const dt = Math.min(delta, 1 / 30);
    const k = xexp(7.0, dt);
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

/* ========= Canvas Wrapper ========= */
export default function ThreeLogo({
  phase,
  showcaseSeq = 0,
  scroll = 0,
  act = "hero",
}: Props) {
  const isMob = useIsMobile();

  // Mobile: PostFX & DPR & GL sparen
  const enableBloom = !REDUCED && !isMob;
  const dprTuple: [number, number] = isMob ? [1, 1.5] : [1, 2]; // <-- fix: Tupel, nicht number[]

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas
        dpr={dprTuple} // <-- typisiert als [number, number]
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        frameloop="demand"
        gl={{
          antialias: true,
          powerPreference: isMob ? "low-power" : "high-performance",
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={(s) => {
          s.gl.toneMappingExposure = 1.06;
          s.gl.setClearColor(0x000000, 0); // transparent
        }}
        aria-label="3D-Logo"
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Lighting: Mobile dezentere Intensitäten */}
        <ambientLight intensity={isMob ? 0.25 : 0.33} />
        <directionalLight
          position={[2.4, 2.0, 2.2]}
          intensity={isMob ? 1.0 : 1.45}
          color={new THREE.Color("#ffd9b8")}
        />
        <directionalLight
          position={[-2.8, 1.6, -1.8]}
          intensity={isMob ? 0.7 : 0.95}
          color={new THREE.Color("#8fb9ff")}
        />

        <ParallaxCamera />
        <Suspense fallback={null}>
          <Environment preset="studio" background={false} />
          <LogoModel
            phase={phase}
            showcaseSeq={showcaseSeq}
            scroll={scroll}
            act={act}
          />

          {/* PostFX: auf Mobile aus → spart GPU & Overdraw */}
          {enableBloom && (
            <EffectComposer>
              <SMAA />
              <Bloom
                intensity={0.09}
                luminanceThreshold={0.58}
                luminanceSmoothing={0.9}
              />
              <Vignette eskil={false} offset={0.12} darkness={0.74} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
