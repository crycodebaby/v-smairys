import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/layout/Footer"
import { ConditionalFooter } from "@/components/layout/ConditionalFooter"
import { PlausibleAnalytics } from "@/components/analytics/PlausibleAnalytics"
import { AttributionCapture } from "@/components/analytics/AttributionCapture"

const inter = Inter({ subsets: ["latin"] })

const SITE_NAME = "Smairys Netz-Manufaktur"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://smairys.de"

export const viewport: Viewport = {
  // Dark-First Brand → mobile Adressleiste in Schwarz, nicht Weiß.
  // (Light-Mode-Override per `media`-Variante möglich, sobald Theme-Toggle live ist.)
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  // Accessibility: Zoom bis 5× zulassen.
  maximumScale: 5,
}

/*
 * Hinweis (No-Risk-Fix aus SEO-Audit):
 *  - `openGraph.images`/`twitter.images` enthielten zuvor explizit
 *    `/og-image.jpg`, eine Datei, die nicht existiert. Next nutzt nun das
 *    automatisch erkannte `src/app/opengraph-image.png` als Default-OG-Image.
 *  - `alternates.canonical` wurde aus dem Root-Layout entfernt, damit die
 *    pro-Route gesetzten Canonicals (`metadata.alternates.canonical` pro Page)
 *    nicht von einem globalen Root-Canonical überschrieben werden.
 *  - `metadataBase` bleibt – ermöglicht relative URLs in pro-Page-Metadata.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Webentwicklung, SEO & Ads`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Die Premium-Vertriebswebsite für qualitätsbewusste KMU. Spezialisiert auf hochperformante Next.js Seiten, SEO und profitables Google Ads Management.",
  keywords: [
    "Webentwicklung",
    "Webdesign",
    "Next.js",
    "SEO",
    "Google Ads",
    "Saarland",
    "Eppelborn",
    "Mittelstand",
    "Smairys Netz-Manufaktur",
  ],
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
    // images bewusst nicht gesetzt → Next nimmt automatisch
    // `src/app/opengraph-image.png` (1200×630) als Default für alle Routen.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Die Premium-Vertriebswebsite für qualitätsbewusste KMU.",
    creator: "@smairys",
    // Twitter-Image leitet sich vom OpenGraph-Image ab.
  },
}

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
