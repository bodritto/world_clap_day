'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import {
  centsToDisplay,
  getProductDefaultImage,
  type PrintifyProduct,
  type PrintifyVariant,
} from '@/lib/printify'

interface Props {
  product: PrintifyProduct
}

export default function MerchProductDetail({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  // Use all variants — fall back to is_available if none are is_enabled
  const usableVariants = useMemo(() => {
    const enabled = product.variants.filter((v) => v.is_enabled && v.is_available)
    return enabled.length > 0
      ? enabled
      : product.variants.filter((v) => v.is_available)
  }, [product.variants])

  const defaultVariant =
    usableVariants.find((v) => v.is_default) ?? usableVariants[0]

  // Selected option values, one per option axis
  const [selectedOptions, setSelectedOptions] = useState<number[]>(() =>
    product.options.map((_, idx) => defaultVariant?.options[idx] ?? 0)
  )

  // Derive selected variant from chosen option values
  const selectedVariant: PrintifyVariant | undefined = useMemo(() => {
    return usableVariants.find((v) =>
      product.options.every((_, idx) => v.options[idx] === selectedOptions[idx])
    )
  }, [usableVariants, selectedOptions, product.options])

  // Image: prefer one that includes this variant, else default
  const imageSrc = useMemo(() => {
    if (selectedVariant) {
      const match = product.images.find((img) =>
        img.variant_ids.includes(selectedVariant.id)
      )
      if (match) return match.src
    }
    return getProductDefaultImage(product)
  }, [product, selectedVariant])

  const displayPrice = selectedVariant
    ? centsToDisplay(selectedVariant.price)
    : null

  function setOption(optIdx: number, valueId: number) {
    const next = [...selectedOptions]
    next[optIdx] = valueId
    setSelectedOptions(next)
  }

  function handleAddToCart() {
    if (!selectedVariant) return
    addItem({
      id: `printify:${product.id}:${selectedVariant.id}`,
      name: `${product.title}${selectedVariant.title ? ` — ${selectedVariant.title}` : ''}`,
      price: centsToDisplay(selectedVariant.price),
      image: imageSrc,
      printifyProductId: product.id,
      printifyVariantId: selectedVariant.id,
      variantLabel: selectedVariant.title,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Image */}
      <div className="w-full aspect-square bg-gray-200 relative overflow-hidden">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {product.title}
        </h1>

        {displayPrice !== null && (
          <p className="text-2xl text-gray-700 font-medium">
            ${displayPrice.toFixed(2)}
          </p>
        )}

        {/* Option selectors */}
        {product.options.map((option, optIdx) => {
          const availableIds = new Set(
            usableVariants.map((v) => v.options[optIdx])
          )
          const values = option.values.filter((v) => availableIds.has(v.id))

          return (
            <div key={option.name} className="flex flex-col gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                {option.name}
              </span>

              {option.type === 'color' ? (
                <div className="flex flex-wrap gap-2">
                  {values.map((val) => (
                    <button
                      key={val.id}
                      onClick={() => setOption(optIdx, val.id)}
                      className={`px-3 py-1.5 text-sm border transition-all ${
                        selectedOptions[optIdx] === val.id
                          ? 'border-foreground bg-foreground text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {val.title}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {values.map((val) => (
                    <button
                      key={val.id}
                      onClick={() => setOption(optIdx, val.id)}
                      className={`px-3 py-1.5 text-sm border transition-all min-w-[2.5rem] ${
                        selectedOptions[optIdx] === val.id
                          ? 'border-foreground bg-foreground text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {val.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || added}
          className={`mt-2 px-6 py-4 text-white font-medium text-sm tracking-wide flex items-center justify-center gap-2 transition-opacity ${
            added
              ? 'bg-green-600 opacity-100'
              : 'bg-primary hover:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          {added ? 'Added to Cart' : 'Add to Cart'}
        </button>

        {/* Description */}
        {product.description && (
          <div
            className="text-sm text-gray-500 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
      </div>
    </div>
  )
}
