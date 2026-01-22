export default {
  name: 'donationTier',
  title: 'Donation Tier',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'localizedString',
      description: 'The name of the donation tier',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: { positive: () => { required: () => unknown } }) => Rule.positive().required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localizedText',
      description: 'A short description of what this tier includes',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'name.en',
      subtitle: 'price',
      media: 'image',
    },
    prepare({ title, subtitle, media }: { title: string; subtitle: number; media: unknown }) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle ? `$${subtitle}` : '',
        media,
      }
    },
  },
}
