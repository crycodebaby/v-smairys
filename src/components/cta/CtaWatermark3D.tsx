"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  AdaptiveDpr,
  AdaptiveEvents,
  Environment,
  Lightformer,
} from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { MeshoptDecoder } from "three-stdlib";
import { useTheme } from "next-themes";
import { EffectComposer, Bloom, SMAA } from "@react-three/postprocessing";

type GLTFResult = { scene: THREE.Group };

const attachMeshopt = (loader: any) => {
  if (typeof loader.setMeshoptDecoder === "function") {
    loader.setMeshoptDecoder(MeshoptDecoder);
  }
};

function WatermarkModel() {
  const { resolvedTheme } = useTheme();
  const { scene } = useGLTF(
    "/models/logo.final.glb",
    undefined,
    true,
    attachMeshopt
  ) as GLTFResult;
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += (delta * Math.PI * 2) / 20;
  });

  const prepared = useMemo(() => {
    const root = scene.clone(true);
    const tint =
      resolvedTheme === "light"
        ? new THREE.Color("#24282d")
        : new THREE.Color("#e6ebf5");

    root.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh) return;
      const mesh = o as THREE.Mesh;
      mesh.material = new THREE.MeshPhysicalMaterial({
        color: tint,
        metalness: 0,
        roughness: 0.55,
        transmission: 0.65,
        thickness: 0.45,
        ior: 1.45,
        attenuationColor: tint,
        attenuationDistance: 1.2,
        clearcoat: 0.2,
        transparent: true,
        opacity: 0.6,
        envMapIntensity: resolvedTheme === "light" ? 0.9 : 1.1,
      });
    });
    return root;
  }, [scene, resolvedTheme]);

  return (
    <group ref={ref} position={[0, 0, 0]} rotation={[-1.3, 0, 0]} scale={1.5}>
      <primitive object={prepared} />
    </group>
  );
}
useGLTF.preload("/models/logo.final.glb", undefined, true, attachMeshopt);

export default function CtaWatermark3D() {
  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10"
      style={{
        WebkitMaskImage:
          "radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
        maskImage:
          "radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={(s) => {
          s.gl.setClearColor(0x000000, 0);
          s.gl.toneMappingExposure = 1.1;
        }}
      >
        <AdaptiveDpr />
        <AdaptiveEvents />

        <ambientLight intensity={0.25} />
        <directionalLight
          position={[2, 2, 3]}
          intensity={1.0}
          color="#fff1d6"
        />
        <directionalLight
          position={[-2, -1, -2]}
          intensity={0.8}
          color="#a8c8ff"
        />

        <Environment background={false}>
          <Lightformer
            form="rect"
            intensity={0.9}
            scale={[6, 1.2, 1]}
            position={[0, 2, 3]}
            rotation={[-0.2, 0, 0]}
          />
        </Environment>

        <EffectComposer>
          <SMAA />
          <Bloom
            intensity={0.1}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>

        <WatermarkModel />
      </Canvas>
    </div>
  );
}
