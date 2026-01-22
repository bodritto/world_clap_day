import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import DonationCard from '@/components/DonationCard'
import WallOfClaps from '@/components/WallOfClaps'
import { getDonationTiers, getSupporters } from '@/sanity/client'
import type { Locale } from '@/i18n/config'

// Default donation tiers
const defaultTiers = [
  {
    _id: 'single-clap',
    name: 'Single Clap',
    price: 5,
    description: 'A small gesture with big impact.',
  },
  {
    _id: 'round-of-applause',
    name: 'Round of Applause',
    price: 50,
    description: 'Show your enthusiastic support.',
  },
  {
    _id: 'standing-ovation',
    name: 'Standing Ovation',
    price: 500,
    description: 'Make a significant contribution to the movement.',
  },
  {
    _id: 'global-ovation',
    name: 'Global Ovation',
    price: 5000,
    description: 'Be a founding champion of World Clap Day.',
  },
]

// Default supporters for display
const defaultSupporters = [
  { _id: '1', name: 'Nathalie L.', country: 'France', _createdAt: '2024-01-15' },
  { _id: '2', name: 'Alina D.', country: 'Poland', _createdAt: '2024-01-14' },
  { _id: '3', name: 'Paolo R.', country: 'Italy', _createdAt: '2024-01-13' },
  { _id: '4', name: 'Albert F.', country: 'UK', _createdAt: '2024-01-12' },
  { _id: '5', name: 'Mauro B.', country: 'Italy', _createdAt: '2024-01-11' },
  { _id: '6', name: 'Artem O.', country: 'Florida', _createdAt: '2024-01-10' },
]

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'supportPage' })
  
  return {
    title: `${t('title')} - World Clap Day`,
    description: t('description'),
  }
}

export default async function SupportUsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  let tiers = defaultTiers
  let supporters = defaultSupporters
  
  try {
    const [sanityTiers, sanitySupporters] = await Promise.all([
      getDonationTiers(locale as Locale),
      getSupporters(),
    ])
    
    if (sanityTiers && sanityTiers.length > 0) {
      tiers = sanityTiers
    }
    if (sanitySupporters && sanitySupporters.length > 0) {
      supporters = sanitySupporters
    }
  } catch (error) {
    console.log('Using default data')
  }

  return <SupportUsContent tiers={tiers} supporters={supporters} />
}

function SupportUsContent({ 
  tiers, 
  supporters 
}: { 
  tiers: typeof defaultTiers
  supporters: typeof defaultSupporters 
}) {
  const t = useTranslations('supportPage')

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
            {t('description')}
          </p>
        </div>
      </section>

      {/* Donation Tiers Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            {t('sectionTitle')}
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {tiers.map((tier) => (
              <DonationCard
                key={tier._id}
                id={tier._id}
                name={tier.name}
                price={tier.price}
                description={tier.description}
              />
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-white rounded-xl border border-border">
            <p className="text-sm text-muted mb-2">
              {t('disclaimer1')}{' '}
              <strong>{t('companyName')}</strong>, {t('disclaimer2')}
            </p>
            <p className="text-sm text-muted mb-2">
              {t('disclaimer3')}{' '}
              <Link href="/support-policy" className="text-primary hover:underline">
                {t('supportPolicy')}
              </Link>
              .
            </p>
            <p className="text-sm text-muted">
              {t('disclaimer4')}{' '}
              <a href="mailto:hello@worldclapday.com" className="text-primary hover:underline">
                hello@worldclapday.com
              </a>
              . {t('disclaimer5')}
            </p>
          </div>
        </div>
      </section>

      {/* Wall of Claps Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            {t('wallOfClaps')}
          </h2>
          <p className="text-center text-muted mb-8">
            {t('wallOfClapsText')}
          </p>
          
          <WallOfClaps supporters={supporters} />
        </div>
      </section>
    </div>
  )
}
