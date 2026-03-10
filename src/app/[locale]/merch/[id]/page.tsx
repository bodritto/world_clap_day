import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getProduct, centsToDisplay, getProductDefaultImage } from '@/lib/printify'
import { Link } from '@/i18n/routing'
import MerchProductDetail from '@/components/merch/MerchProductDetail'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await getProduct(id)
    const price = centsToDisplay(
      product.variants.find((v) => v.is_default)?.price ??
        product.variants[0]?.price ??
        0
    )
    return {
      title: `${product.title} - World Clap Day Merch`,
      description: `${product.title} — $${price.toFixed(2)}`,
      openGraph: {
        images: [{ url: getProductDefaultImage(product) }],
      },
    }
  } catch {
    return { title: 'Product - World Clap Day Merch' }
  }
}

export default async function MerchProductPage({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)

  let product
  try {
    product = await getProduct(id)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-sm text-gray-400 mb-10">
          <Link href="/merch" className="text-primary hover:underline">
            ← Back to Merch
          </Link>
        </p>
        <MerchProductDetail product={product} />
      </div>
    </div>
  )
}
