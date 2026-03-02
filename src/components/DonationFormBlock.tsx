'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { useCartStore } from '@/lib/store'
import { formatPrice, getCurrencySymbol, type DonationCurrency } from '@/lib/utils'
import { CreditCard } from 'lucide-react'
import { useState } from 'react'

const CURRENCIES: { value: DonationCurrency; label: string }[] = [
  { value: 'eur', label: 'EUR (€)' },
  { value: 'usd', label: 'USD ($)' },
  { value: 'gbp', label: 'GBP (£)' },
]

const PRESET_AMOUNTS = [10, 50] as const
const MIN_CUSTOM = 1

type Props = {
  /** Optional image URL for the left column; if not set, shows text only. */
  imageUrl?: string | null
}

export default function DonationFormBlock({ imageUrl }: Props) {
  const t = useTranslations('donationForm')
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [currency, setCurrency] = useState<DonationCurrency>('eur')
  const [selectedAmount, setSelectedAmount] = useState<number | 'other'>(10)
  const [customAmount, setCustomAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const amount =
    selectedAmount === 'other'
      ? parseFloat(customAmount.replace(',', '.'))
      : selectedAmount
  const isValid = Number.isFinite(amount) && amount >= MIN_CUSTOM

  const handlePayWithCard = () => {
    if (!isValid) return
    setIsSubmitting(true)
    const name = t('supportLabel', { amount: formatPrice(amount, currency) })
    addItem(
      {
        id: `donate-${Date.now()}`,
        name,
        price: amount,
      },
      currency
    )
    router.push('/checkout')
    setIsSubmitting(false)
  }

  const symbol = getCurrencySymbol(currency)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 w-full min-h-0 overflow-hidden">
      {/* Left column: image or text only (no photo) */}
      <div className="lg:col-span-2 min-h-0 overflow-auto">
        {imageUrl ? (
          <div className="aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-foreground text-base leading-relaxed">
              {t('leftText1')}
            </p>
            <p className="text-muted text-sm leading-relaxed">
              {t('leftText2')}
            </p>
          </div>
        )}
      </div>

      {/* Right column: donation form */}
      <div className="lg:col-span-3 space-y-5 min-h-0 flex flex-col overflow-hidden">
        {/* One line: Choose amount left, Currency right */}
        <div className="flex flex-wrap items-center justify-between gap-3 gap-y-2">
          <span className="text-sm text-muted">{t('chooseAmount')}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">{t('currency')}</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as DonationCurrency)}
              className="w-auto min-w-0 max-w-[6rem] py-1.5 px-2 rounded-md border border-border bg-white text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm"
              aria-label={t('currency')}
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount: two buttons, then Other amount + input */}
        <div className="grid grid-cols-2 gap-2">
            {PRESET_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedAmount(value)}
                className={`py-3 px-4 rounded-xl border-2 font-semibold transition-colors ${
                  selectedAmount === value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white text-foreground hover:border-primary/50'
                }`}
              >
                {formatPrice(value, currency)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedAmount('other')}
              className={`py-3 px-4 rounded-xl border-2 font-semibold transition-colors flex items-center justify-center ${
                selectedAmount === 'other'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-foreground hover:border-primary/50'
              }`}
            >
              {t('otherAmount')}
            </button>
            {selectedAmount === 'other' ? (
              <div className="flex justify-center w-full min-w-0">
                <div className="flex items-center gap-2 w-1/4 min-w-[5rem]">
                  <span className="text-foreground shrink-0 font-medium">{symbol}</span>
                  <input
                    type="number"
                    min={MIN_CUSTOM}
                    step={1}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0"
                    className="w-full min-w-0 px-2 py-2 rounded-xl border-2 border-primary/40 bg-white text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    aria-label={t('otherAmount')}
                  />
                </div>
              </div>
            ) : (
              <div className="py-3 px-4 rounded-xl border-2 border-transparent bg-transparent" aria-hidden />
            )}
        </div>

        <div className="flex flex-col items-center shrink-0">
          <button
            type="button"
            onClick={handlePayWithCard}
            disabled={!isValid || isSubmitting}
            className="w-full py-4 px-6 bg-[#635BFF] hover:bg-[#5046e5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-colors"
          >
            <CreditCard className="w-5 h-5" aria-hidden />
            {isSubmitting ? t('redirecting') : t('payWithCard')}
          </button>
          <p className="text-xs text-muted mt-2 text-center">{t('stripeDisclaimer')}</p>
        </div>
      </div>
    </div>
  )
}
