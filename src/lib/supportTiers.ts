export const SUPPORT_TIERS = [
  { id: 'donate-15', nameKey: 'smallDonation' as const, benefitKey: 'smallBenefit' as const, price: 15, isFlex: false },
  { id: 'donate-50', nameKey: 'bigDonation' as const, benefitKey: 'bigBenefit' as const, benefitHighlight: true, price: 50, isFlex: false },
  { id: 'donate-flex', nameKey: 'whateverDonation' as const, benefitKey: 'whateverBenefit' as const, recommendedMin: 5, isFlex: true },
] as const

export type SupportTier = (typeof SUPPORT_TIERS)[number]
