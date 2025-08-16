// src/app/layout.tsx
import type { Metadata } from "next";
// 1. "Open_Sans" durch "Inter" ersetzen
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"; // Provider importieren

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});
// 2. "Inter" für den Fließtext konfigurieren
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Smairys Netz-Manufaktur | Premium Websites & SEO",
  description:
    "Wir schmieden Ihre digitale Präsenz. Handgefertigte Premium-Websites, die überzeugen und nachhaltiges Wachstum durch SEO generieren.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className="dark" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} bg-background text-foreground antialiased`}
      >
        {/* Hier den Provider um alles wickeln */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
