import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { PortableText } from '@portabletext/react'
import { getPolicyPage, getAllPolicySlugs } from '@/sanity/client'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPolicySlugs()
    return slugs.map((item: { slug: string }) => ({
      slug: item.slug,
    }))
  } catch {
    // Return empty array if Sanity is not configured
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const page = await getPolicyPage(slug, locale as Locale)
  
  if (!page) {
    return {
      title: 'Page Not Found - World Clap Day',
    }
  }

  return {
    title: `${page.title} - World Clap Day`,
  }
}

export default async function PolicyPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const page = await getPolicyPage(slug, locale as Locale)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <article className="bg-white rounded-2xl border border-border p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {page.title}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <PortableText value={page.content} />
          </div>
        </article>
      </div>
    </div>
  )
}
