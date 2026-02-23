import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getAllPolicySlugs, getPolicyPage } from '@/lib/policies'
import { locales } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllPolicySlugs()
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    for (const { slug } of slugs) {
      params.push({ locale, slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const page = getPolicyPage(slug, locale)
  if (!page) {
    return { title: 'Page Not Found - World Clap Day' }
  }
  return {
    title: `${page.title} - World Clap Day`,
  }
}

export default async function PolicyPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const page = getPolicyPage(slug, locale)
  if (!page) notFound()

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <article className="bg-white rounded-2xl border border-border p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {page.title}
          </h1>
          <div className="prose prose-lg max-w-none text-foreground">
            {page.paragraphs.map((text, i) => (
              <p key={i} className="mb-4 last:mb-0">
                {text}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
