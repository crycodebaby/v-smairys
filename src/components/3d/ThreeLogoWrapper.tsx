'use client';

import React, { useEffect, useState, Suspense } from 'react';

// Wir nutzen progressives Laden für ThreeJS/3D, um LCP nicht zu blockieren.

export function ThreeLogoWrapper() {
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  useEffect(() => {
    // 1. Accessibility Check: Prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 2. Performance Check: Network Connection (Progressive Enhancement)
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    const isSlowConnection = connection ? (
      connection.saveData || 
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g' || 
      connection.effectiveType === '3g'
    ) : false;

    // Nur laden wenn Performance und Accessibility es erlauben
    if (!prefersReducedMotion && !isSlowConnection) {
      // 3. LCP Schutz: 3D Render-Start künstlich um 800ms verzögern, damit Typografie sofort da ist
      const timer = setTimeout(() => {
        setShouldLoad3D(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Statischer High-Performance Fallback für LCP / Mobile / A11y
  if (!shouldLoad3D) {
    return (
      <div className="absolute inset-0 flex items-center justify-end md:justify-center overflow-hidden pointer-events-none opacity-20">
        <div className="w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] border-[1px] border-foreground/30 rounded-full" />
      </div>
    );
  }

  // Echter Canvas-Wrapper (Lazy Loaded)
  return (
    <div className="absolute inset-0 flex items-center justify-end md:justify-center overflow-hidden pointer-events-none opacity-50 mix-blend-screen mix-blend-plus-lighter">
      <Suspense fallback={<div className="w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] border-[1px] border-foreground/10 rounded-full" />}>
        {/* <Scene /> Hier kommt später die tatsächliche 3D Szene rein */}
        <div className="w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] border-[1px] border-foreground/30 rounded-full animate-spin [animation-duration:60s]" />
      </Suspense>
    </div>
  );
}
