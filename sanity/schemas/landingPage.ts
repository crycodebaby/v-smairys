export default {
  name: 'landingPage',
  title: 'Landing Page (Performance/CRO)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'pageType',
      title: 'Page Type (für Tracking)',
      type: 'string',
      description: 'Z.B. "service_page", "local_landing" - wird ans Event-Tracking übergeben',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'H1 Headline', type: 'string' },
        { name: 'subheading', title: 'Subheader', type: 'text' },
        { name: 'ctaLabel', title: 'Primary CTA Button Label', type: 'string' },
        { name: 'heroImage', title: 'Hero Background/Image', type: 'image' },
      ],
    },
  ],
}
