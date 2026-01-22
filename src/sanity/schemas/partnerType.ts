export default {
  name: 'partnerType',
  title: 'Partner Type',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      description: 'The title of this partner type',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localizedText',
      description: 'A description of this partner type and what it entails',
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'localizedString',
      description: 'The text for the call-to-action button',
    },
    {
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'url',
      description: 'The URL the CTA button links to',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which to display this partner type (lower numbers first)',
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'order',
    },
    prepare({ title, subtitle }: { title: string; subtitle: number }) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle !== undefined ? `Order: ${subtitle}` : '',
      }
    },
  },
}
