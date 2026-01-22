export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'World Clap Day',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'countdownDate',
      title: 'Countdown Date',
      type: 'datetime',
      description: 'The date and time for World Clap Day',
    },
    {
      name: 'supporterCount',
      title: 'Supporter Count',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram', type: 'url' },
        { name: 'facebook', title: 'Facebook', type: 'url' },
        { name: 'twitter', title: 'X/Twitter', type: 'url' },
        { name: 'youtube', title: 'YouTube', type: 'url' },
        { name: 'reddit', title: 'Reddit', type: 'url' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'siteName',
    },
  },
}
