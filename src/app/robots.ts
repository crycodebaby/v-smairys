import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smairys.de'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/studio/',
        '/success',
        // Interne Marketing-Übersicht und QR-Asset-Routen – nicht indexieren.
        '/intern/',
        // Kurzlink-Resolver – nur für Print/QR gedacht, keine Indexierung der
        // Slug-Permutationen oder Soft-404s gewünscht.
        '/go/',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
