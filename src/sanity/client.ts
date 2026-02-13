import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { sanityConfig } from './config'
import type { Locale } from '@/i18n/config'

let clientInstance: SanityClient | null = null

function getClient(): SanityClient {
  if (!clientInstance) {
    if (!sanityConfig.projectId) {
      throw new Error('Sanity projectId is not configured')
    }
    clientInstance = createClient({
      ...sanityConfig,
      token: process.env.SANITY_API_TOKEN,
    })
  }
  return clientInstance
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  const client = getClient()
  const builder = imageUrlBuilder(client)
  return builder.image(source)
}

// Helper to get localized value from a localized field
type LocalizedField = {
  en?: string
  es?: string
  fr?: string
  de?: string
}

export function getLocalizedValue(
  field: LocalizedField | string | undefined | null,
  locale: Locale = 'en'
): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  
  // Return the requested locale, falling back to English, then any available value
  return field[locale] || field.en || Object.values(field).find(v => v) || ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalizedBlockContent(field: any, locale: Locale = 'en') {
  if (!field) return []
  if (Array.isArray(field)) return field
  
  return field[locale] || field.en || []
}

// Queries - return null if Sanity is not configured
export async function getSiteSettings() {
  try {
    const client = getClient()
    return client.fetch(`*[_type == "siteSettings"][0]{
      logo,
      siteName,
      countdownDate,
      supporterCount,
      socialLinks
    }`)
  } catch {
    return null
  }
}

export async function getDonationTiers(locale: Locale = 'en') {
  try {
    const client = getClient()
    const tiers = await client.fetch(`*[_type == "donationTier"] | order(price asc){
      _id,
      name,
      price,
      description,
      image
    }`)
    
    // Transform localized fields
    return tiers.map((tier: {
      _id: string
      name: LocalizedField
      price: number
      description: LocalizedField
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      image: any
    }) => ({
      _id: tier._id,
      name: getLocalizedValue(tier.name, locale),
      price: tier.price,
      description: getLocalizedValue(tier.description, locale),
      image: tier.image,
    }))
  } catch {
    return []
  }
}

export async function getSupporters() {
  try {
    const client = getClient()
    return client.fetch(`*[_type == "supporter"] | order(_createdAt desc)[0...100]{
      _id,
      name,
      country,
      countryCode,
      tier->{name},
      _createdAt
    }`)
  } catch {
    return []
  }
}

export async function getPartnerTypes(locale: Locale = 'en') {
  try {
    const client = getClient()
    const partnerTypes = await client.fetch(`*[_type == "partnerType"] | order(order asc){
      _id,
      title,
      description,
      ctaText,
      ctaUrl
    }`)
    
    // Transform localized fields
    return partnerTypes.map((partner: {
      _id: string
      title: LocalizedField
      description: LocalizedField
      ctaText: LocalizedField
      ctaUrl: string
    }) => ({
      _id: partner._id,
      title: getLocalizedValue(partner.title, locale),
      description: getLocalizedValue(partner.description, locale),
      ctaText: getLocalizedValue(partner.ctaText, locale),
      ctaUrl: partner.ctaUrl,
    }))
  } catch {
    return []
  }
}

export async function getPolicyPage(slug: string, locale: Locale = 'en') {
  try {
    const client = getClient()
    const page = await client.fetch(`*[_type == "policyPage" && slug.current == $slug][0]{
      title,
      content
    }`, { slug })
    
    if (!page) return null
    
    return {
      title: getLocalizedValue(page.title, locale),
      content: getLocalizedBlockContent(page.content, locale),
    }
  } catch {
    return null
  }
}

export async function getAllPolicySlugs() {
  try {
    const client = getClient()
    return client.fetch(`*[_type == "policyPage"]{
      "slug": slug.current
    }`)
  } catch {
    return []
  }
}

// Mutations
export async function addSupporter(name: string, tierId: string) {
  const client = getClient()
  return client.create({
    _type: 'supporter',
    name,
    tier: { _type: 'reference', _ref: tierId },
  })
}

export async function incrementSupporterCount() {
  const client = getClient()
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ _id, supporterCount }`)
  if (settings) {
    return client.patch(settings._id)
      .set({ supporterCount: (settings.supporterCount || 0) + 1 })
      .commit()
  }
}
