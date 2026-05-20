// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint nicht im Build mitlaufen lassen: Wir behalten die Lint-Suite
  // (npm run lint) als separaten Qualitäts-Check, blockieren damit aber
  // keine Production-Builds wegen reinen Style-/Cosmetic-Warnungen
  // (z. B. nicht-escapte Anführungszeichen, ungenutzte Variablen).
  // TypeScript-Checks bleiben strict und blockieren den Build weiterhin.
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
        pathname: "/img/logos/**",
      },
    ],
  },

  async headers() {
    return [
      // Cache für deine 3D-Modelle (ein Jahr, immutable)
      {
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=31536000",
          },
        ],
      },
      // Falls du Draco-Decoder-Dateien unter /public/draco/ auslieferst
      {
        source: "/draco/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=31536000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
