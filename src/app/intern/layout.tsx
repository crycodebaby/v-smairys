import { internFontClass } from "@/lib/fonts/intern-fonts";

/**
 * Layout für alle internen Routen (`/intern/*`).
 * Aktiviert die hochwertige Dashboard-Typografie (Geist / Geist Mono)
 * scoped über CSS-Variablen – ohne die öffentliche Website zu verändern.
 */
export default function InternLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={internFontClass}>{children}</div>;
}
