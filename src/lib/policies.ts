/**
 * Static policy pages (no CMS).
 * Used by [locale]/[slug] for support-policy, privacy-policy, terms-of-use.
 */

export const POLICY_SLUGS = ['support-policy', 'privacy-policy', 'terms-of-use'] as const
export type PolicySlug = (typeof POLICY_SLUGS)[number]

export interface PolicyPage {
  slug: string
  title: string
  paragraphs: string[]
}

type PolicyContent = Record<string, { title: string; paragraphs: string[] }>

const policies: Record<PolicySlug, PolicyContent> = {
  'support-policy': {
    en: {
      title: 'Support Policy',
      paragraphs: [
        'This Support Policy explains how donations to World Clap Day are used and what you can expect when you support us.',
        'Donations go toward spreading the message of global unity, organizing the event, and maintaining our platforms. We are committed to transparency and will use funds responsibly.',
        'If you have questions about your donation or this policy, please contact us at hello@worldclapday.com.',
      ],
    },
    de: {
      title: 'Unterstützungsrichtlinie',
      paragraphs: [
        'Diese Unterstützungsrichtlinie erläutert, wie Spenden an World Clap Day verwendet werden.',
        'Spenden fließen in die Verbreitung der Botschaft globaler Einheit, die Organisation der Veranstaltung und den Betrieb unserer Plattformen.',
        'Bei Fragen wenden Sie sich an hello@worldclapday.com.',
      ],
    },
    es: {
      title: 'Política de Apoyo',
      paragraphs: [
        'Esta política explica cómo se utilizan las donaciones a World Clap Day.',
        'Las donaciones se destinan a difundir el mensaje de unidad global y a organizar el evento.',
        'Para consultas: hello@worldclapday.com.',
      ],
    },
    fr: {
      title: 'Politique de soutien',
      paragraphs: [
        'Cette politique explique comment sont utilisés les dons à World Clap Day.',
        'Les dons servent à diffuser le message d\'unité mondiale et à organiser l\'événement.',
        'Pour toute question : hello@worldclapday.com.',
      ],
    },
  },
  'privacy-policy': {
    en: {
      title: 'Privacy Policy',
      paragraphs: [
        'World Clap Day respects your privacy. This policy describes what data we collect and how we use it.',
        'We may collect your email when you subscribe to updates, and payment information when you donate (processed by our payment providers). We do not sell your data.',
        'We use cookies and similar technologies to run the site. You can control cookies through your browser settings.',
        'For questions or to request deletion of your data, contact hello@worldclapday.com.',
      ],
    },
    de: {
      title: 'Datenschutzrichtlinie',
      paragraphs: [
        'World Clap Day respektiert Ihre Privatsphäre. Diese Richtlinie beschreibt, welche Daten wir erfassen und wie wir sie nutzen.',
        'Wir erfassen ggf. Ihre E-Mail bei Anmeldung zum Newsletter und Zahlungsdaten bei Spenden (verarbeitet durch unsere Zahlungsanbieter). Wir verkaufen keine Daten.',
        'Bei Fragen oder zur Löschung Ihrer Daten: hello@worldclapday.com.',
      ],
    },
    es: {
      title: 'Política de privacidad',
      paragraphs: [
        'World Clap Day respeta su privacidad. Esta política describe qué datos recopilamos y cómo los usamos.',
        'Podemos recopilar su correo al suscribirse y datos de pago al donar (procesados por nuestros proveedores). No vendemos sus datos.',
        'Para consultas o solicitud de eliminación: hello@worldclapday.com.',
      ],
    },
    fr: {
      title: 'Politique de confidentialité',
      paragraphs: [
        'World Clap Day respecte votre vie privée. Cette politique décrit les données que nous collectons et leur utilisation.',
        'Nous pouvons collecter votre e-mail lors de l\'inscription et les informations de paiement lors d\'un don (traitement par nos prestataires). Nous ne vendons pas vos données.',
        'Pour toute question ou suppression de vos données : hello@worldclapday.com.',
      ],
    },
  },
  'terms-of-use': {
    en: {
      title: 'Terms of Use',
      paragraphs: [
        'By using the World Clap Day website, you agree to these terms.',
        'The site and its content are provided "as is". We do not guarantee uninterrupted access or that the content is error-free.',
        'You may not use the site for illegal purposes or to harm others. We may update these terms; continued use constitutes acceptance.',
        'For questions: hello@worldclapday.com.',
      ],
    },
    de: {
      title: 'Nutzungsbedingungen',
      paragraphs: [
        'Mit der Nutzung der Website von World Clap Day akzeptieren Sie diese Bedingungen.',
        'Die Website und ihre Inhalte werden „wie besehen“ bereitgestellt. Wir geben keine Garantie für unterbrechungsfreien Zugang.',
        'Bei Fragen: hello@worldclapday.com.',
      ],
    },
    es: {
      title: 'Términos de uso',
      paragraphs: [
        'Al utilizar el sitio web de World Clap Day, acepta estos términos.',
        'El sitio y su contenido se proporcionan "tal cual". No garantizamos acceso ininterrumpido.',
        'Para consultas: hello@worldclapday.com.',
      ],
    },
    fr: {
      title: 'Conditions d\'utilisation',
      paragraphs: [
        'En utilisant le site World Clap Day, vous acceptez ces conditions.',
        'Le site et son contenu sont fournis « tels quels ». Nous ne garantissons pas un accès ininterrompu.',
        'Pour toute question : hello@worldclapday.com.',
      ],
    },
  },
}

export function getAllPolicySlugs(): { slug: string }[] {
  return POLICY_SLUGS.map((slug) => ({ slug }))
}

export function getPolicyPage(
  slug: string,
  locale: string
): PolicyPage | null {
  if (!POLICY_SLUGS.includes(slug as PolicySlug)) return null
  const content = policies[slug as PolicySlug]
  const localeContent = content[locale] ?? content.en
  if (!localeContent) return null
  return {
    slug,
    title: localeContent.title,
    paragraphs: localeContent.paragraphs,
  }
}
