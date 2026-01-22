// Helper for creating localized string fields in Sanity
const supportedLanguages = [
  { id: 'en', title: 'English', isDefault: true },
  { id: 'es', title: 'Español' },
  { id: 'fr', title: 'Français' },
  { id: 'de', title: 'Deutsch' },
]

export const localizedString = {
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: { collapsible: true },
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'string',
    fieldset: lang.isDefault ? undefined : 'translations',
  })),
}

export const localizedText = {
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: { collapsible: true },
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'text',
    rows: 3,
    fieldset: lang.isDefault ? undefined : 'translations',
  })),
}

export const localizedBlockContent = {
  name: 'localizedBlockContent',
  title: 'Localized Block Content',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: { collapsible: true },
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'array',
    of: [{ type: 'block' }],
    fieldset: lang.isDefault ? undefined : 'translations',
  })),
}
