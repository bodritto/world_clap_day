'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/lib/store'
import { formatPrice, getCurrencySymbol, type DonationCurrency } from '@/lib/utils'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'

interface DonationCardProps {
  id: string
  name: string
  price?: number
  description?: string
  image?: string
  /** Fixed tier (15 or 50) or flex (custom amount). */
  isFlex?: boolean
  /** Recommended minimum for flex tier (e.g. 5); not enforced. */
  recommendedMin?: number
  currency: DonationCurrency
  /** Inline/compact layout for single-row display. */
  compact?: boolean
  /** Short text shown above the button (e.g. benefit or thanks). */
  benefit?: string
  /** If true, benefit is shown in large uppercase (e.g. REAL CLAP). */
  benefitHighlight?: boolean
}

export default function DonationCard({
  id,
  name,
  price = 0,
  description,
  image,
  isFlex = false,
  recommendedMin = 5,
  currency,
  compact = false,
  benefit,
  benefitHighlight = false,
}: DonationCardProps) {
  const t = useTranslations('donationCard')
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const [isAdded, setIsAdded] = useState(false)
  const [customAmount, setCustomAmount] = useState<string>('5')

  const isInCart = items.some((item) => item.id === id)

  const handleAddFixed = () => {
    addItem({ id, name, price, image }, currency)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleAddFlex = () => {
    const value = parseFloat(customAmount.replace(',', '.'))
    if (Number.isNaN(value) || value < 0.01) return
    addItem(
      { id, name: `${name} — ${formatPrice(value, currency)}`, price: value, image },
      currency
    )
    setCustomAmount('5')
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const flexValue = parseFloat(customAmount.replace(',', '.'))
  const flexValid = !Number.isNaN(flexValue) && flexValue >= 0.01

  const cardPadding = compact ? 'p-2.5 sm:p-4' : 'p-6'
  const showIcon = !compact

  /** Compact: same layout for all — row1 = title + value/input, row2 = benefit (optional), row3 = button. Input width ~3 digits; currency symbol to the right for flex. */
  const currencySymbol = getCurrencySymbol(currency)
  const compactRow1 = compact && (
    <div className="flex justify-between items-center gap-1.5 sm:gap-3 min-h-[2rem] sm:min-h-[2.5rem]">
      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs sm:text-base truncate min-w-0">
        {name}
      </h3>
      {isFlex ? (
        <div className="flex items-center gap-0.5 shrink-0">
          <input
            type="number"
            min="0"
            step="0.01"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder={t('customAmountPlaceholder')}
            className="w-[3.5ch] sm:w-[4ch] max-w-[4rem] rounded border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all px-1 py-1 sm:px-1.5 sm:py-1.5 text-xs sm:text-sm text-right tabular-nums"
            aria-label={t('customAmountPlaceholder')}
          />
          <span className="text-sm sm:text-base font-medium text-muted-foreground" aria-hidden>
            {currencySymbol}
          </span>
        </div>
      ) : (
        <p className="font-bold text-primary text-sm sm:text-xl shrink-0">
          {formatPrice(price, currency)}
        </p>
      )}
    </div>
  )

  const compactBenefit = compact && benefit && (
    <p
      className={
        benefitHighlight
          ? 'mt-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide text-primary leading-tight'
          : 'text-[10px] sm:text-xs text-muted mt-1.5 line-clamp-2 leading-tight'
      }
    >
      {benefit}
    </p>
  )

  const compactButton = compact && (
    <button
      onClick={isFlex ? handleAddFlex : handleAddFixed}
      disabled={isFlex ? !flexValid || isAdded : isAdded}
      className={`
        w-full mt-2 sm:mt-3 py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-full font-medium flex items-center justify-center gap-1 sm:gap-2 transition-all text-xs sm:text-sm
        ${
          isAdded
            ? 'bg-green-500 text-white'
            : isFlex && !flexValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
        }
      `}
    >
      {isAdded ? <Check size={14} /> : <ShoppingCart size={14} />}
      {isAdded ? t('addedToCart') : t('addToCart')}
      {isInCart && !isAdded && <span className="text-[10px] sm:text-xs opacity-75">(+1)</span>}
    </button>
  )

  if (compact) {
    return (
      <div className={`bg-white rounded-xl sm:rounded-2xl border border-border ${cardPadding} card-hover group flex flex-col min-w-0`}>
        {compactRow1}
        {compactBenefit}
        {compactButton}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl border border-border ${cardPadding} card-hover group flex flex-col min-w-0`}>
      <div className="flex items-start gap-4">
        {showIcon && (
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
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          {!isFlex && (
            <p className="text-2xl font-bold text-primary mt-0.5">
              {formatPrice(price, currency)}
            </p>
          )}
          {isFlex && (
            <p className="text-sm text-muted mt-1">
              {t('recommendMin', { amount: formatPrice(recommendedMin, currency) })}
            </p>
          )}
          {description && (
            <p className="text-muted text-sm mt-2 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {isFlex ? (
        <div className="mt-4 space-y-3">
          <input
            type="number"
            min="0"
            step="0.01"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder={t('customAmountPlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <button
            onClick={handleAddFlex}
            disabled={!flexValid || isAdded}
            className={`
              w-full py-3 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all
              ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : flexValid
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
            {isAdded ? t('addedToCart') : t('addToCart')}
            {isInCart && !isAdded && <span className="text-xs opacity-75">(+1)</span>}
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddFixed}
          disabled={isAdded}
          className={`
            mt-4 w-full py-3 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all
            ${isAdded ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-dark'}
          `}
        >
          {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
          {isAdded ? t('addedToCart') : t('addToCart')}
          {isInCart && !isAdded && <span className="text-xs opacity-75">(+1)</span>}
        </button>
      )}
    </div>
  )
}
