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
