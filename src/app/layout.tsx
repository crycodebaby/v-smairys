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
  title: "Smairys Netz-Manufaktur | Premium Websites & SEO",
  description:
    "Wir schmieden Ihre digitale Präsenz. Handgefertigte Premium-Websites, die überzeugen und nachhaltiges Wachstum durch SEO generieren.",
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
