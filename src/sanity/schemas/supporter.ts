export default {
  name: 'supporter',
  title: 'Supporter',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
    },
    {
      name: 'countryCode',
      title: 'Country code (ISO 3166-1 alpha-2, e.g. US, GB)',
      type: 'string',
      description: 'Two-letter code for flag display',
    },
    {
      name: 'tier',
      title: 'Donation Tier',
      type: 'reference',
      to: [{ type: 'donationTier' }],
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      hidden: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tier.name',
    },
  },
}
