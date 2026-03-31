// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// 🧠 Google-Fonts mit next/font/google
import { Outfit, Inter } from "next/font/google";

// 🌐 Optional: Analytics + Theme
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollCompanion from "@/components/ui/ScrollCompanion";

/* -------------------- FONT SETUP -------------------- */
const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-heading", // Für Überschriften
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans", // Für Fließtext
});

/* -------------------- METADATA -------------------- */
export const metadata: Metadata = {
  metadataBase: new URL("https://smairys-netz-manufaktur.de"),
  title: {
    default: "SMAIRYS Netz-Manufaktur – Websites für Handwerker & Betriebe",
    template: "%s | SMAIRYS Netz-Manufaktur",
  },
  description:
    "Handgefertigte Websites mit technischem SEO für Handwerker und regionale Betriebe im Saarland. Messbar mehr Anfragen – persönlich begleitet.",
  openGraph: {
    siteName: "SMAIRYS Netz-Manufaktur",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* -------------------- ROOT LAYOUT -------------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${outfit.variable} ${inter.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <ScrollCompanion />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="relative">{children}</main>
          <Footer />
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
