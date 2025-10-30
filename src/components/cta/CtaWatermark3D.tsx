"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  AdaptiveDpr,
  AdaptiveEvents,
  Environment,
  Lightformer,
} from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import type { GLTFLoader } from "three-stdlib";
import { MeshoptDecoder } from "three-stdlib";
import { useTheme } from "next-themes";
import { EffectComposer, Bloom, SMAA } from "@react-three/postprocessing";

type GLTFResult = GLTF & { scene: THREE.Group };

const BASE_TILT_X = -1.42;
const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const attachMeshopt = (loader: unknown) => {
  if (typeof (loader as Partial<GLTFLoader>).setMeshoptDecoder === "function") {
    (loader as Partial<GLTFLoader>).setMeshoptDecoder!(MeshoptDecoder);
  }
};

function WatermarkModel() {
  const { resolvedTheme } = useTheme();
  const gltf = useGLTF(
    "/models/logo.final.glb",
    undefined,
    true,
    attachMeshopt
  ) as GLTFResult;
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current || REDUCED) return;
    // sanfte Dauerdrehung (1x in ~18s)
    ref.current.rotation.y += (delta * Math.PI * 2) / 18;
  });

  const prepared = useMemo(() => {
    const root = gltf.scene.clone(true);

    // Theme-aware milchiges „Glass“ mit MeshPhysicalMaterial (TS-safe, kein drei-Component)
    const tint =
      resolvedTheme === "light"
        ? new THREE.Color("#2b2f35") // graphite-ish tint (lesbar auf Light)
        : new THREE.Color("#eaf0ff"); // soft cool tint (lesbar auf Dark)

    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;

      const mat = new THREE.MeshPhysicalMaterial({
        color: tint,
        metalness: 0, // echtes Glas hat kein Metalness
        roughness: 0.8, // milchig
        transmission: 0.35, // 0.35 = milky; auf 0.6 klarer
        thickness: 0.35,
        ior: 1.35,
        // Attenuation wirkt wie „Volumenfarbe“ – sehr dezentes Tönen:
        attenuationColor: tint,
        attenuationDistance: 0.55,
        clearcoat: 0,
        sheen: 0,
        transparent: true,
        opacity: 0.22, // Watermark-Intensität
        envMapIntensity: resolvedTheme === "light" ? 0.8 : 1.0,
        // Kein emissive, damit es nicht „leuchtet“
      });
      mesh.material = mat;
    });

    return root;
  }, [gltf.scene, resolvedTheme]);

  return (
    <group
      ref={ref}
      position={[0, 0.06, 0]}
      rotation={[BASE_TILT_X, 0, 0]}
      scale={1.35}
    >
      <primitive object={prepared} />
    </group>
  );
}
useGLTF.preload("/models/logo.final.glb", undefined, true, attachMeshopt);

export default function CtaWatermark3D() {
  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10" // hinter allem
      style={{
        // weiche Maskierung ins Nichts
        WebkitMaskImage:
          "radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)",
        maskImage:
          "radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)",
      }}
      aria-hidden
    >
      <Canvas
        dpr={[1, 2]}
        frameloop="always" // echte kontinuierliche Rotation
        camera={{ position: [0, 0, 3.35], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true, // transparenter Hintergrund
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={(s) => {
          s.gl.setClearColor(0x000000, 0); // komplett transparent
          s.gl.toneMappingExposure = 1.05;
        }}
        aria-label="CTA 3D Wasserzeichen"
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* dezente, elegante Beleuchtung */}
        <ambientLight intensity={0.26} />
        <directionalLight
          position={[2.2, 1.8, 2.0]}
          intensity={1.0}
          color={"#ffd8b5"}
        />
        <directionalLight
          position={[-2.2, 1.4, -1.8]}
          intensity={0.8}
          color={"#8fb9ff"}
        />

        {/* Lightformers (achte auf gültige scale: number oder [x,y,z]) */}
        <Environment resolution={256} background={false}>
          <Lightformer
            form="rect"
            intensity={1.0}
            scale={[5.2, 1.1, 1]} // <- fix: [x,y,z]
            position={[0, 2.1, 3]}
            rotation={[-0.18, 0, 0]}
            color="#ffffff"
          />
          <Lightformer
            form="ring"
            intensity={0.7}
            scale={[3.0, 3.0, 1]} // <- fix: [x,y,z]
            position={[-2.2, -1.2, 2.2]}
            color="#cfe0ff"
          />
        </Environment>

        {/* Subtile Post-FX fürs „Gel“ */}
        <EffectComposer>
          <SMAA />
          <Bloom
            intensity={0.075}
            luminanceThreshold={0.52}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>

        <WatermarkModel />
      </Canvas>
    </div>
  );
}
