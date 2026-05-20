export default {
  name: 'faq',
  title: 'FAQ Entry',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category (Service)',
      type: 'string',
      options: {
        list: [
          { title: 'Allgemein', value: 'general' },
          { title: 'Webentwicklung', value: 'web' },
          { title: 'SEO', value: 'seo' },
          { title: 'Google Ads', value: 'ads' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
  ],
}
