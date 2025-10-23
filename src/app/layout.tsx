// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

// 1. Analytics-Komponente importieren
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollCompanion from "@/components/ui/ScrollCompanion";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Smairys Netz-Manufaktur | Premium Websites & SEO",
  description:
    "Wir schmieden Ihre digitale Präsenz. Handgefertigte Premium-Websites, die überzeugen und nachhaltiges Wachstum durch SEO generieren.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} bg-background text-foreground antialiased`}
      >
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

        {/* 2. Analytics-Komponente hier einfügen */}
        <Analytics />
      </body>
    </html>
  );
}
