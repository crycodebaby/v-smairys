export default {
  name: 'caseStudy',
  title: 'Case Study (Kundenprojekt)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
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
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
    },
    {
      name: 'serviceOptions',
      title: 'Services Provided',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Webentwicklung', value: 'web' },
          { title: 'SEO', value: 'seo' },
          { title: 'Google Ads', value: 'ads' },
        ],
      },
    },
    {
      name: 'results',
      title: 'Zahlen & Ergebnisse',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'metric', title: 'Metric (e.g., +150%)', type: 'string' },
            { name: 'label', title: 'Label (e.g., Leads generiert)', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Project Details / Story',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
}
