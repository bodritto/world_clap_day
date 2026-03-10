'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import {
  centsToDisplay,
  getProductDefaultImage,
  type PrintifyProduct,
} from '@/lib/printify'

interface Props {
  product: PrintifyProduct
}

export default function PrintifyProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  const enabledVariants = product.variants.filter(
    (v) => v.is_enabled && v.is_available
  )

  const [selectedVariantId, setSelectedVariantId] = useState<number>(
    enabledVariants.find((v) => v.is_default)?.id ?? enabledVariants[0]?.id ?? 0
  )
  const [added, setAdded] = useState(false)

  const selectedVariant = enabledVariants.find((v) => v.id === selectedVariantId)

  const defaultImageSrc = getProductDefaultImage(product)

  const variantImageSrc =
    product.images.find((img) => img.variant_ids.includes(selectedVariantId))
      ?.src ?? defaultImageSrc

  const displayPrice = selectedVariant
    ? centsToDisplay(selectedVariant.price)
    : null

  const handleAddToCart = () => {
    if (!selectedVariant) return
    addItem({
      id: `printify:${product.id}:${selectedVariant.id}`,
      name: `${product.title} — ${selectedVariant.title}`,
      price: centsToDisplay(selectedVariant.price),
      image: variantImageSrc,
      printifyProductId: product.id,
      printifyVariantId: selectedVariant.id,
      variantLabel: selectedVariant.title,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (enabledVariants.length === 0) return null

  const hasOptions = product.options.length > 0

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden flex flex-col group card-hover">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {variantImageSrc ? (
          <Image
            src={variantImageSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            👕
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title */}
        <h3 className="font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {product.title}
        </h3>

        {/* Price */}
        {displayPrice !== null && (
          <p className="text-xl font-bold text-primary">
            ${displayPrice.toFixed(2)}
          </p>
        )}

        {/* Variant selector — one dropdown per option (e.g. Size, Color) */}
        {hasOptions && (
          <div className="space-y-2">
            {product.options.map((option, optIdx) => {
              const availableOptionValues = new Set(
                enabledVariants.flatMap((v) => [v.options[optIdx]])
              )
              return (
                <div key={option.name} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {option.name}
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    value={selectedVariant?.options[optIdx] ?? ''}
                    onChange={(e) => {
                      const newOptionValueId = Number(e.target.value)
                      const match = enabledVariants.find(
                        (v) => v.options[optIdx] === newOptionValueId
                      )
                      if (match) setSelectedVariantId(match.id)
                    }}
                  >
                    {option.values
                      .filter((val) => availableOptionValues.has(val.id))
                      .map((val) => (
                        <option key={val.id} value={val.id}>
                          {val.title}
                        </option>
                      ))}
                  </select>
                </div>
              )
            })}
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || added}
          className={`
            mt-auto w-full py-2.5 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all text-sm
            ${added
              ? 'bg-green-500 text-white'
              : 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed'
            }
          `}
        >
          {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
