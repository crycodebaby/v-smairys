import { Geist, Geist_Mono } from "next/font/google";

/**
 * Hochwertige Dashboard-Typografie – ausschließlich für interne Routen
 * (`/intern/*`, `/kundenlogin`). Selbstgehostet über next/font (keine
 * Laufzeit-Requests zu Google). Die öffentliche Website bleibt auf Inter.
 *
 * - Geist: UI, Headlines, Labels, Buttons
 * - Geist Mono: Slugs, URLs, UTM-Werte, technische Werte
 *
 * Beide sind Variable Fonts und decken 400/500/600/700 ab.
 */
export const internSans = Geist({
  subsets: ["latin"],
  variable: "--font-intern-sans",
  display: "swap",
});

export const internMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-intern-mono",
  display: "swap",
});

/** Wrapper-Klassen für interne Layouts. */
export const internFontClass = `${internSans.variable} ${internMono.variable} intern-typography`;
