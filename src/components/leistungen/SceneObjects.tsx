// src/components/leistungen/SceneObjects.tsx
"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

type Tier = "M" | "T" | "D";
type Props = { theme: string | undefined; tier: Tier };

function makeGlass(color: THREE.Color, theme: string | undefined) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: 0.5,
    transmission: 0.6,
    thickness: 0.45,
    ior: 1.45,
    attenuationColor: color,
    attenuationDistance: 1.4,
    clearcoat: 0.15,
    transparent: true,
    opacity: 0.9, // Basis, tatsächliche Sichtbarkeit regeln wir über group alpha
    envMapIntensity: theme === "light" ? 0.9 : 1.1,
  });
}

// Hilfsfunktion: weiche Dämpfung
function damp(value: number, target: number, smoothing: number, delta: number) {
  return value + (target - value) * (1 - Math.exp(-smoothing * delta));
}

export default function SceneObjects({ theme, tier }: Props) {
  // Akt 1/2/3 – default zu 1
  const [active, setActive] = useState<"act-1" | "act-2" | "act-3">("act-1");

  // Listener auf globale Section-Events
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail as "act-1" | "act-2" | "act-3";
      if (id) setActive(id);
    };
    window.addEventListener("smairys-act", handler as EventListener);
    return () =>
      window.removeEventListener("smairys-act", handler as EventListener);
  }, []);

  // Theme-Tint
  const tint = useMemo(
    () => new THREE.Color(theme === "light" ? "#2b2f35" : "#eaf0ff"),
    [theme]
  );

  // Eigene Materialien je Gruppe (verhindert Side-Effects)
  const glass1 = useMemo(() => makeGlass(tint, theme), [tint, theme]);
  const glass2 = useMemo(() => makeGlass(tint, theme), [tint, theme]);
  const glass3 = useMemo(() => makeGlass(tint, theme), [tint, theme]);

  // Gruppen-Refs
  const g1 = useRef<THREE.Group>(null);
  const g2 = useRef<THREE.Group>(null);
  const g3 = useRef<THREE.Group>(null);

  // Sichtbarkeits-Lerps (0 → 1)
  const a1 = useRef(1);
  const a2 = useRef(0);
  const a3 = useRef(0);

  // reduzierte Bewegung
  const REDUCED =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useFrame((_, delta) => {
    // Zielwerte setzen
    const t1 = active === "act-1" ? 1 : 0;
    const t2 = active === "act-2" ? 1 : 0;
    const t3 = active === "act-3" ? 1 : 0;

    // Dämpfen
    a1.current = damp(a1.current, t1, 6, delta);
    a2.current = damp(a2.current, t2, 6, delta);
    a3.current = damp(a3.current, t3, 6, delta);

    // Idle-Rotation je nach Tier (Mobile langsamer)
    const rotSpeed = REDUCED ? 0 : tier === "M" ? 0.12 : 0.25;

    if (g1.current) {
      g1.current.rotation.y += rotSpeed * delta;
      const s = 0.9 + 0.1 * a1.current;
      g1.current.scale.setScalar(s);
      g1.current.position.y = (a1.current - 0.5) * 0.2;
      g1.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        if (m?.opacity !== undefined) m.opacity = 0.2 + 0.8 * a1.current;
      });
    }
    if (g2.current) {
      g2.current.rotation.y += rotSpeed * 1.1 * delta;
      const s = 0.9 + 0.1 * a2.current;
      g2.current.scale.setScalar(s);
      g2.current.position.y = (a2.current - 0.5) * 0.2;
      g2.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        if (m?.opacity !== undefined) m.opacity = 0.2 + 0.8 * a2.current;
      });
    }
    if (g3.current) {
      g3.current.rotation.y += rotSpeed * 0.9 * delta;
      const s = 0.9 + 0.1 * a3.current;
      g3.current.scale.setScalar(s);
      g3.current.position.y = (a3.current - 0.5) * 0.2;
      g3.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        if (m?.opacity !== undefined) m.opacity = 0.2 + 0.8 * a3.current;
      });
    }
  });

  /* ---------------- Skulpturen ----------------
     1) STRATEGIE / FORM – Torusknoten + Ring
     2) ENTWICKLUNG / BAUGRUPPE – gestapelte Layer
     3) WACHSTUM / SIGNAL – Zylindersäule + feine „Antennen“
  ------------------------------------------------ */

  // Komplexität je Tier (Mobile weniger Segmente)
  const seg = tier === "M" ? 80 : 120;

  return (
    <group position={[0, 0, 0]}>
      {/* ACT I – Strategie / Form */}
      <group ref={g1} position={[-1.7, 0.05, 0]}>
        <mesh material={glass1}>
          <torusKnotGeometry args={[0.52, 0.14, seg, 18]} />
        </mesh>
        <mesh position={[0, 0, -0.6]} material={glass1}>
          <torusGeometry args={[0.5, 0.06, 24, 120]} />
        </mesh>
      </group>

      {/* ACT II – Entwicklung / Baugruppe */}
      <group ref={g2} position={[0.15, -0.05, 0]}>
        <mesh position={[0, 0.26, 0]} material={glass2}>
          <boxGeometry args={[0.95, 0.12, 0.55]} />
        </mesh>
        <mesh position={[0, 0.05, 0]} material={glass2}>
          <boxGeometry args={[1.15, 0.12, 0.8]} />
        </mesh>
        <mesh position={[0, -0.16, 0]} material={glass2}>
          <boxGeometry args={[1.35, 0.12, 1.05]} />
        </mesh>
      </group>

      {/* ACT III – Wachstum / Signal */}
      <group ref={g3} position={[1.9, 0, 0]}>
        <mesh material={glass3}>
          <cylinderGeometry args={[0.09, 0.09, 1.5, 24]} />
        </mesh>
        {/* kleine Antennen-Ringe */}
        <mesh position={[0, 0.45, 0]} material={glass3}>
          <torusGeometry args={[0.18, 0.03, 16, 64]} />
        </mesh>
        <mesh position={[0, -0.45, 0]} material={glass3}>
          <torusGeometry args={[0.22, 0.03, 16, 64]} />
        </mesh>
      </group>
    </group>
  );
}
