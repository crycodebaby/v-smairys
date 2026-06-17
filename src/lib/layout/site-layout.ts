/**
 * Site-wide layout tokens (CSS custom properties on `:root`).
 *
 * `--site-header-height` and `--scroll-padding-top` are updated at runtime by
 * `SiteHeaderMetrics` (ResizeObserver on the fixed header). Fallbacks here
 * match the default Header padding before hydration.
 */
export const SITE_LAYOUT_CSS_VARS = {
  headerHeight: "--site-header-height",
  scrollPaddingTop: "--scroll-padding-top",
} as const;

/** Fallback header offset when JS has not measured yet (px equivalent via rem). */
export const SITE_HEADER_OFFSET_FALLBACK = "5.5rem";

/** Extra gap below the header for anchor scroll targets. */
export const SCROLL_PADDING_GAP_PX = 8;
