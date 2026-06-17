import { test, expect } from "@playwright/test";

const PUBLIC_ROUTES = [
  "/",
  "/leistungen",
  "/leistungen/webseiten",
  "/leistungen/seo",
  "/leistungen/google-ads",
  "/projekte",
  "/ueber-uns",
  "/kontakt",
  "/impressum",
  "/datenschutz",
  "/kundenlogin",
] as const;

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

for (const route of PUBLIC_ROUTES) {
  for (const viewport of VIEWPORTS) {
    test(`no horizontal overflow on ${route} at ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(route, { waitUntil: "networkidle" });

      const overflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
        );
      });

      expect(overflow, `horizontal overflow ${overflow}px`).toBeLessThanOrEqual(
        1,
      );
    });
  }
}

test("homepage hero fits viewport height on standard mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const heroOverflow = await page.evaluate(() => {
    const hero = document.querySelector("section.section-hero");
    if (!hero) return 0;
    return Math.max(0, hero.getBoundingClientRect().bottom - window.innerHeight);
  });

  expect(heroOverflow).toBeLessThanOrEqual(4);
});
