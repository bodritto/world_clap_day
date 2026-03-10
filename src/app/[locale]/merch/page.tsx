import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import {
  getProducts,
  getProductDefaultImage,
  centsToDisplay,
  getProductMinPrice,
  type PrintifyProduct,
} from '@/lib/printify'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'merchPage' })
  return {
    title: `${t('title')} - World Clap Day`,
    description: t('intro'),
  }
}

async function fetchProducts(): Promise<PrintifyProduct[]> {
  try {
    const data = await getProducts(1, 20)
    return data.data.filter((p) => p.visible)
  } catch (err) {
    console.error('[merch] Printify fetch failed:', err)
    return []
  }
}

export default async function MerchPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const products = await fetchProducts()

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header block */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-foreground">
            World Clap Day Merch
          </h1>
          <div className="space-y-1 text-base leading-relaxed text-gray-600 mb-16">
            <p>The movement is visible now.</p>
            <p>Wear the moment.</p>
          </div>
          <div className="border-b border-gray-300" />
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-14 gap-y-16">
              {products.map((product) => (
                <MerchCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : (
          <p className="text-gray-500 text-base mb-20">
            Products are on their way — check back soon.
          </p>
        )}

        <p className="text-sm text-gray-400">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}

function MerchCard({ product }: { product: PrintifyProduct }) {
  const imageSrc = getProductDefaultImage(product)
  const minPriceCents = getProductMinPrice(product)
  const price = minPriceCents > 0 ? `$${centsToDisplay(minPriceCents).toFixed(2)}` : null
  const href = `/merch/${product.id}` as `/merch/${string}`

  return (
    <div className="flex flex-col h-full">
      {/* Product image */}
      <Link href={href}>
        <div className="w-full aspect-square bg-gray-200 mb-4 overflow-hidden relative hover:opacity-90 transition-opacity cursor-pointer">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : null}
        </div>
      </Link>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 text-foreground leading-tight">
        {product.title}
      </h3>

      {/* Price */}
      {price && (
        <p className="text-base text-gray-700 mb-4">{price}</p>
      )}

      {/* BUY button */}
      <Link
        href={href}
        className="mt-auto px-6 py-3 bg-primary text-white text-center font-medium hover:opacity-70 transition-opacity text-sm tracking-wide"
      >
        BUY
      </Link>
    </div>
  )
}
