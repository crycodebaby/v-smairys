import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const SITE_NAME = "Smairys Netz-Manufaktur"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://smairys.de"

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Accessiblity: Allow zoom up to 5x
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Webentwicklung, SEO & Ads`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Die Premium-Vertriebswebsite für qualitätsbewusste KMU. Spezialisiert auf hochperformante Next.js Seiten, SEO und profitables Google Ads Management.",
  keywords: ["Webentwicklung", "Next.js", "SEO", "Google Ads", "KMU", "Smairys Netz-Manufaktur"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: "Die Premium-Vertriebswebsite für qualitätsbewusste KMU.",
    images: [
      {
        url: "/og-image.jpg", // Placeholder
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Og Image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Die Premium-Vertriebswebsite für qualitätsbewusste KMU.",
    creator: "@smairys",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

import { Footer } from "@/components/layout/Footer"
import { ConditionalFooter } from "@/components/layout/ConditionalFooter"
import { PlausibleAnalytics } from "@/components/analytics/PlausibleAnalytics"
import { AttributionCapture } from "@/components/analytics/AttributionCapture"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Plausible Analytics ist cookielos und privatsphärefreundlich und wird
  // daher global ohne Consent-Banner geladen. GTM (falls später aktiviert)
  // muss weiterhin hinter Consent laufen.

  return (
    <html lang="de" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen antialiased flex flex-col`}>
        <main className="flex-1">{children}</main>
        <ConditionalFooter>
          <Footer />
        </ConditionalFooter>
        <AttributionCapture />
        <PlausibleAnalytics />
      </body>
    </html>
  )
}
