import { internFontClass } from "@/lib/fonts/intern-fonts";

/**
 * Layout für `/kundenlogin` – gleiche Dashboard-Typografie wie `/intern/*`.
 */
export default function KundenloginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={internFontClass}>{children}</div>;
}
