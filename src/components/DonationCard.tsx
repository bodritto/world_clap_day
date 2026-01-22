'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'

interface DonationCardProps {
  id: string
  name: string
  price: number
  description?: string
  image?: string
}

export default function DonationCard({
  id,
  name,
  price,
  description,
  image,
}: DonationCardProps) {
  const t = useTranslations('donationCard')
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const [isAdded, setIsAdded] = useState(false)

  const isInCart = items.some((item) => item.id === id)

  const handleAddToCart = () => {
    addItem({ id, name, price, image })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 card-hover group">
      <div className="flex items-start gap-4">
        {/* Icon/Image */}
        <div className="w-16 h-16 flex-shrink-0 rounded-full bg-primary-light/30 flex items-center justify-center overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">👏</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-2xl font-bold text-primary mt-1">
            {formatPrice(price)}
          </p>
          {description && (
            <p className="text-muted text-sm mt-2 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdded}
        className={`
          mt-4 w-full py-3 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all
          ${
            isAdded
              ? 'bg-green-500 text-white'
              : 'bg-primary text-white hover:bg-primary-dark'
          }
        `}
      >
        {isAdded ? (
          <>
            <Check size={18} />
            {t('addedToCart')}
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            {t('addToCart')}
            {isInCart && <span className="text-xs opacity-75">(+1)</span>}
          </>
        )}
      </button>
    </div>
  )
}
