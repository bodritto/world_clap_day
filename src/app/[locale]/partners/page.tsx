import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import PartnerCard from '@/components/PartnerCard'
import { getPartnerTypes } from '@/sanity/client'
import { CheckCircle } from 'lucide-react'
import type { Locale } from '@/i18n/config'

// Default partner types
const defaultPartnerTypes = [
  {
    _id: '1',
    title: 'Cities, Regions & Countries',
    description: 'Help your city, region, or country become a leading voice of global unity. We work with public leaders and cultural institutions to activate participation and create official national moments.',
    ctaText: 'Apply as a Regional Partner',
    ctaUrl: 'https://forms.gle/regional-partner',
  },
  {
    _id: '2',
    title: 'Corporate Partners',
    description: 'Partner with World Clap Day to support global unity, inspire communities, and associate your brand with one of the most positive global movements of our time.',
    ctaText: 'Apply as a Corporate Partner',
    ctaUrl: 'https://forms.gle/corporate-partner',
  },
  {
    _id: '3',
    title: 'Service Partners',
    description: 'We collaborate with creators, media teams, platforms, venues, agencies, and technology providers who can help bring World Clap Day to life.',
    ctaText: 'Apply as a Service Partner',
    ctaUrl: 'https://forms.gle/service-partner',
  },
]

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partners' })
  
  return {
    title: `${t('title')} - World Clap Day`,
    description: t('description1'),
  }
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  let partnerTypes = defaultPartnerTypes
  
  try {
    const sanityPartnerTypes = await getPartnerTypes(locale as Locale)
    if (sanityPartnerTypes && sanityPartnerTypes.length > 0) {
      partnerTypes = sanityPartnerTypes
    }
  } catch (error) {
    console.log('Using default partner types')
  }

  return <PartnersContent partnerTypes={partnerTypes} />
}

function PartnersContent({ partnerTypes }: { partnerTypes: typeof defaultPartnerTypes }) {
  const t = useTranslations('partners')

  const partnershipIncludes = [
    t('partnershipItems.item1'),
    t('partnershipItems.item2'),
    t('partnershipItems.item3'),
    t('partnershipItems.item4'),
    t('partnershipItems.item5'),
    t('partnershipItems.item6'),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-muted mb-4">
            {t('subtitle')}
          </p>
          <p className="text-lg text-muted">
            {t('description1')}
          </p>
          <p className="text-lg text-muted mt-4">
            {t('description2')}
          </p>
        </div>
      </section>

      {/* Partner Types Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-10">
            {t('whoWePartner')}
          </h2>
          
          <div className="space-y-6">
            {partnerTypes.map((partner) => (
              <PartnerCard
                key={partner._id}
                title={partner.title}
                description={partner.description}
                ctaText={partner.ctaText}
                ctaUrl={partner.ctaUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What Partnership Includes */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-10">
            {t('whatPartnershipIncludes')}
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {partnershipIncludes.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-gray-50"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Inquiry CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t('differentIdea')}
          </h2>
          <p className="text-muted mb-8">
            {t('openToCollaborations')}
          </p>
          <Link
            href="/partner-inquiry"
            className="btn-primary inline-block"
          >
            {t('inquiryForm')}
          </Link>
        </div>
      </section>
    </div>
  )
}
