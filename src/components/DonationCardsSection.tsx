'use client'

import { useTranslations } from 'next-intl'
import DonationCard from '@/components/DonationCard'
import type { DonationCurrency } from '@/lib/utils'
import type { SupportTier } from '@/lib/supportTiers'
import { useState } from 'react'

const CURRENCIES: { value: DonationCurrency; label: string }[] = [
  { value: 'eur', label: 'EUR (€)' },
  { value: 'usd', label: 'USD ($)' },
  { value: 'gbp', label: 'GBP (£)' },
]

type Props = {
  tiers: readonly SupportTier[]
}

export default function DonationCardsSection({ tiers }: Props) {
  const tCard = useTranslations('donationCard')
  const [currency, setCurrency] = useState<DonationCurrency>('eur')

  return (
    <section className="py-8 px-4 sm:py-12 border-b border-border bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">{tCard('currency')}:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as DonationCurrency)}
              className="px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <DonationCard
              key={tier.id}
              id={tier.id}
              name={tCard(tier.nameKey)}
              price={tier.isFlex ? undefined : (tier.price ?? 0)}
              isFlex={tier.isFlex}
              recommendedMin={tier.isFlex ? (tier.recommendedMin ?? 5) : undefined}
              currency={currency}
              compact
              benefit={tCard(tier.benefitKey)}
              benefitHighlight={tier.benefitHighlight}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
