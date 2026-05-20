export default {
  name: 'post',
  title: 'Blog Post (Fachartikel)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
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
      name: 'seoTitle',
      title: 'SEO Title (max 60 chars)',
      type: 'string',
      validation: (Rule: any) => Rule.max(60).warning('Optimal sind unter 60 Zeichen'),
    },
    {
      name: 'seoDescription',
      title: 'SEO Description (max 160 chars)',
      type: 'text',
      validation: (Rule: any) => Rule.max(160).warning('Optimal sind unter 160 Zeichen'),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' }, // requires an author schema
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }], // PortableText
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
  },
}
