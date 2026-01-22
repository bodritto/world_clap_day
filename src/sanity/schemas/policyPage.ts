export default {
  name: 'policyPage',
  title: 'Policy Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      description: 'The title of the policy page',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'localizedBlockContent',
      description: 'The content of the policy page',
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'slug.current',
    },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle ? `/${subtitle}` : '',
      }
    },
  },
}
