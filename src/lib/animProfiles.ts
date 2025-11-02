// src/lib/animProfiles.ts
// Vollständig typisierte Animations-Profile für Mobile / Tablet / Desktop.
// Diese Datei ist React-frei und kann überall importiert werden.

import * as THREE from "three";

/** Gerätekategorien – bewusst schlank gehalten. */
export type ViewportTier = "mobile" | "tablet" | "desktop";

/** Ein Profil beschreibt den kompletten Ablauf/Look für ein Tier. */
export type AnimProfile = {
  /** Intro-Ablauf (Zeitangaben in ms) */
  intro: {
    /** Gesamtdauer des Intros (Hint: Content-Reveal sollte knapp danach passieren) */
    duration: number;
    /** Kurzes Pop-in (Skalierung/Spannung) */
    pop: number;
    /** Entspannungsphase nach dem Pop */
    settle: number;
    /** Ziel-X (nach links) am Ende des Intros */
    arcLeft: number;
    /** Bogenhöhe für den Intro-Arc */
    arcHeight: number;
    /** Millisekunden, ab wann der Arc startet */
    start: number;
    /** Millisekunden, wann der Arc endet */
    end: number;
    /** Basis-Skalierung im Intro (vor dem Parken) */
    introScale: number;
    /** Grundneigung in X (damit das Logo frontal „richtig“ steht) */
    baseTiltX: number;
  };

  /** Parkzustand (steady state nach dem Intro) */
  park: {
    /** Zielskalierung im Park-Zustand */
    scale: number;
    /** Zielposition im Park-Zustand */
    pos: THREE.Vector3;
  };

  /**
   * Scroll-Bahn: t ∈ [0..1] → Position.
   * t ist dein normalisierter Scrollfortschritt über alle Acts/Sektionen.
   */
  path: (t: number) => THREE.Vector3;

  /**
   * Scroll-Rotation: t ∈ [0..1] → Euler (Zusatzrotation zum baseTilt).
   * Nutze dies für sanfte 3D-„Reveal“-Momente beim Scroll.
   */
  scrollRot: (t: number) => THREE.Euler;

  /** Idle-Amplituden (mikrobewegungen außerhalb des Intros) */
  idle: {
    /** Yaw-Amplitude (um Y; links/rechts) */
    yaw: number;
    /** Pitch-Amplitude (um X; hoch/runter) */
    pitch: number;
    /** Leichte vertikale „Atmung“ */
    breathY: number;
  };

  /** Licht-/Tonemapping-Delicates für das jeweilige Tier */
  lighting: {
    /** Ambient-Light-Intensität */
    ambient: number;
    /** Key-Light (Hauptlicht) */
    key: { pos: [number, number, number]; intensity: number; color: string };
    /** Rim-Light (Kanten-/Gegenlicht) */
    rim: { pos: [number, number, number]; intensity: number; color: string };
    /** Tone-Mapping-Exposure für den Renderer */
    exposure: number;
  };

  /** Optional: Showcase-Feinheiten (wird in ThreeLogo berücksichtigt) */
  showcase?: {
    duration?: number; // ms
    amplitudes?: {
      yaw?: number;
      pitch?: number;
      posX?: number;
      posY?: number;
      scale?: number;
      freq?: number;
      phaseShift?: number;
    };
  };
};

/* ---------------------------------------------------
   Helpers
--------------------------------------------------- */

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Elliptische Bahn – gut für „schwebende“ Wege ohne harte Richtungswechsel. */
function ellipsePath(
  center: THREE.Vector3,
  radiusX: number,
  radiusY: number,
  depth: number,
  t: number
): THREE.Vector3 {
  const a = 2 * Math.PI * t;
  return v3(
    center.x + radiusX * Math.cos(a),
    center.y + radiusY * Math.sin(a * 1.2),
    center.z + depth * Math.sin(Math.PI * t)
  );
}

/** Smooth-Scroll-Rotation: dezente 3D-Drehungen, die „Echtheit“ signalisieren. */
function gentleScrollRot(
  yawAmp: number,
  pitchAmp: number,
  rollAmp: number,
  t: number
): THREE.Euler {
  // Sinus-basierte Mischung, keine plötzlichen Sprünge
  const yaw = Math.sin(2 * Math.PI * t) * yawAmp; // Y (links/rechts)
  const pitch = Math.sin(2 * Math.PI * t + Math.PI / 2) * pitchAmp; // X
  const roll = Math.sin(4 * Math.PI * t) * rollAmp; // Z (doppelte Frequenz, kleiner)
  return new THREE.Euler(pitch, yaw, roll);
}

/* ---------------------------------------------------
   Profile
   – Optimiert für: 350px Phones, Tablets (768–1024), Desktop (≥1024)
   – Patches: Park & Intro weiter nach links (weg von der Textspalte)
--------------------------------------------------- */

/**
 * MOBILE
 * Zielgeräte: ~350–767 px (iPhone SE/8/12 mini/13 mini etc.)
 * Philosophie: Kompaktere Ellipse, etwas weniger Tiefe, behutsamere Idle.
 * PATCH: arcLeft -1.05, park.x -1.08
 */
const MOBILE: AnimProfile = {
  intro: {
    duration: 1200,
    pop: 300,
    settle: 500,
    arcLeft: -1.05, // PATCH (vorher -0.85)
    arcHeight: 0.1,
    start: 400,
    end: 1100,
    introScale: 2.2,
    baseTiltX: -1.42,
  },
  park: {
    scale: 1.02, // PATCH (vorher 1.05 → minimal kleiner, edler)
    pos: v3(-1.08, 0.02, 0.0), // PATCH (vorher -0.90)
  },
  // Pfad-Zentrum konsistent zur neuen Park-Position
  path: (t) => ellipsePath(v3(-1.08, 0.02, 0.0), 0.36, 0.08, -0.9, t),
  scrollRot: (t) => gentleScrollRot(0.3, 0.16, 0.1, t),
  idle: {
    yaw: 0.06,
    pitch: 0.04,
    breathY: 0.01,
  },
  lighting: {
    ambient: 0.3,
    key: { pos: [2.0, 1.8, 1.8], intensity: 1.2, color: "#ffd8b5" },
    rim: { pos: [-2.0, 1.2, -1.6], intensity: 0.8, color: "#8fb9ff" },
    exposure: 1.05,
  },
  showcase: {
    duration: 2000,
    amplitudes: {
      yaw: 0.22,
      pitch: 0.08,
      posX: 0.03,
      posY: 0.022,
      scale: 0.014,
      freq: 0.9,
      phaseShift: Math.PI / 2,
    },
  },
};

/**
 * TABLET
 * Zielgeräte: ~768–1023 px (iPad, kleinere Android-Tablets)
 * Philosophie: Größere Ellipse, leicht mehr Tiefe und Rotation.
 * PATCH: arcLeft -1.28, park.x -1.30
 */
const TABLET: AnimProfile = {
  intro: {
    duration: 1300,
    pop: 320,
    settle: 560,
    arcLeft: -1.28, // PATCH (vorher -1.05)
    arcHeight: 0.12,
    start: 420,
    end: 1200,
    introScale: 2.35,
    baseTiltX: -1.42,
  },
  park: {
    scale: 1.12,
    pos: v3(-1.3, 0.03, 0.0), // PATCH (vorher -1.10)
  },
  path: (t) => ellipsePath(v3(-1.3, 0.03, 0.0), 0.42, 0.09, -1.1, t),
  scrollRot: (t) => gentleScrollRot(0.34, 0.18, 0.11, t),
  idle: {
    yaw: 0.07,
    pitch: 0.05,
    breathY: 0.011,
  },
  lighting: {
    ambient: 0.32,
    key: { pos: [2.2, 2.0, 2.2], intensity: 1.35, color: "#ffd9b8" },
    rim: { pos: [-2.4, 1.4, -1.8], intensity: 0.85, color: "#8fb9ff" },
    exposure: 1.07,
  },
  showcase: {
    duration: 2000,
    amplitudes: {
      yaw: 0.24,
      pitch: 0.09,
      posX: 0.035,
      posY: 0.026,
      scale: 0.015,
      freq: 0.9,
      phaseShift: Math.PI / 2,
    },
  },
};

/**
 * DESKTOP
 * Zielgeräte: ≥1024 px
 * Philosophie: Weiteste Ellipse, klarere Tiefe, etwas mehr Rotation, aber edel.
 * PATCH: arcLeft -1.55, park.x -1.55
 */
const DESKTOP: AnimProfile = {
  intro: {
    duration: 1400,
    pop: 350,
    settle: 650,
    arcLeft: -1.55, // PATCH (vorher -1.28)
    arcHeight: 0.12,
    start: 450,
    end: 1350,
    introScale: 2.55,
    baseTiltX: -1.42,
  },
  park: {
    scale: 1.18, // PATCH (vorher 1.20 → minimal ruhiger)
    pos: v3(-1.55, 0.04, 0.0), // PATCH (vorher -1.28)
  },
  path: (t) => ellipsePath(v3(-1.55, 0.04, 0.0), 0.5, 0.1, -1.2, t),
  scrollRot: (t) => gentleScrollRot(0.35, 0.2, 0.12, t),
  idle: {
    yaw: 0.08,
    pitch: 0.06,
    breathY: 0.012,
  },
  lighting: {
    ambient: 0.33,
    key: { pos: [2.4, 2.0, 2.2], intensity: 1.45, color: "#ffd9b8" },
    rim: { pos: [-2.8, 1.6, -1.8], intensity: 0.95, color: "#8fb9ff" },
    exposure: 1.08,
  },
  showcase: {
    duration: 2000,
    amplitudes: {
      yaw: 0.24,
      pitch: 0.09,
      posX: 0.035,
      posY: 0.026,
      scale: 0.015,
      freq: 0.9,
      phaseShift: Math.PI / 2,
    },
  },
};

/** Öffentliche Sammlung aller Profile. */
export const ANIM_PROFILES: Record<ViewportTier, AnimProfile> = {
  mobile: MOBILE,
  tablet: TABLET,
  desktop: DESKTOP,
};
