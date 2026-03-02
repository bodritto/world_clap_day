import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import SupportUsClient from './SupportUsClient'

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

  return <SupportUsClient />
}
