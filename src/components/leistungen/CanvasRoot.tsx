"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, SMAA, Bloom } from "@react-three/postprocessing";
import { useTheme } from "next-themes";
import SceneObjects from "@/components/leistungen/SceneObjects";
import { useViewportTier } from "@/hooks/useViewportTier";

/** Normalisiert unterschiedliche Rückgabeformen deines vorhandenen Hooks. */
function normalizeTier(raw: unknown): "M" | "T" | "D" {
  // String-Varianten
  if (typeof raw === "string") {
    const s = raw.toLowerCase();
    if (s.startsWith("m")) return "M";
    if (s.startsWith("t")) return "T";
    if (s.startsWith("d")) return "D";
  }
  // Objekt-Variante mit .tier
  if (
    typeof raw === "object" &&
    raw !== null &&
    "tier" in (raw as Record<string, unknown>)
  ) {
    const t = String((raw as Record<string, unknown>).tier || "").toLowerCase();
    if (t.startsWith("m")) return "M";
    if (t.startsWith("t")) return "T";
    if (t.startsWith("d")) return "D";
  }
  // Fallback: Desktop
  return "D";
}

export default function CanvasRoot() {
  const { resolvedTheme } = useTheme();
  const vt = useViewportTier(); // dein bestehender Hook
  const tier = normalizeTier(vt);

  const config = useMemo(() => {
    switch (tier) {
      case "M":
        return {
          dpr: [1, 1.5] as [number, number],
          bloom: 0.06,
          exposure: 1.0,
          cameraZ: 4.2,
          frameloop: "demand" as const,
        };
      case "T":
        return {
          dpr: [1, 2] as [number, number],
          bloom: 0.08,
          exposure: 1.05,
          cameraZ: 3.8,
          frameloop: "always" as const,
        };
      default:
        return {
          dpr: [1, 2] as [number, number],
          bloom: 0.1,
          exposure: 1.08,
          cameraZ: 3.4,
          frameloop: "always" as const,
        };
    }
  }, [tier]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas
        dpr={config.dpr}
        frameloop={config.frameloop}
        camera={{ position: [0, 0, config.cameraZ], fov: 45 }}
        gl={{ antialias: true }}
        onCreated={(s) => {
          s.gl.setClearColor(0x000000, 0);
          s.gl.toneMappingExposure = config.exposure;
        }}
      >
        {/* Licht */}
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
            intensity={config.bloom}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>

        <Suspense fallback={null}>
          <SceneObjects theme={resolvedTheme} tier={tier} />
        </Suspense>
      </Canvas>
    </div>
  );
}
