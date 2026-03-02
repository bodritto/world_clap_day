/**
 * Fixed weight distribution for clapper count by country.
 * 50% of picks go to top-12 countries (descending weight), 50% to the rest.
 * Same on backend (cron) and frontend (client tick). Total = sum of country counts.
 */

// Top 12: США, Канада, Аргентина, Бразилия, Австралия, Мексика, Германия, Португалия, Испания, Италия, Япония, Чили
// They get 50% of all clappers, distributed by descending weight (12, 11, …, 1)
export const TOP_12_COUNTRIES: { code: string; weight: number }[] = [
  { code: 'US', weight: 12 },   // США
  { code: 'CA', weight: 11 },   // Канада
  { code: 'AR', weight: 10 },   // Аргентина
  { code: 'BR', weight: 9 },    // Бразилия
  { code: 'AU', weight: 8 },    // Австралия
  { code: 'MX', weight: 7 },    // Мексика
  { code: 'DE', weight: 6 },    // Германия
  { code: 'PT', weight: 5 },    // Португалия
  { code: 'ES', weight: 4 },    // Испания
  { code: 'IT', weight: 3 },   // Италия
  { code: 'JP', weight: 2 },   // Япония
  { code: 'CL', weight: 1 },   // Чили
]

const TOP_12_WEIGHT_SUM = TOP_12_COUNTRIES.reduce((s, x) => s + x.weight, 0) // 78

// Other countries get 50% of picks (relative weights below)
export const OTHER_COUNTRY_WEIGHTS: { code: string; weight: number }[] = [
  { code: 'GB', weight: 5 },
  { code: 'IN', weight: 5 },
  { code: 'FR', weight: 4 },
  { code: 'NL', weight: 2 },
  { code: 'PL', weight: 2 },
  { code: 'RU', weight: 2 },
  { code: 'KR', weight: 1 },
  { code: 'ZA', weight: 1 },
  { code: 'SE', weight: 1 },
  { code: 'BE', weight: 1 },
  { code: 'AT', weight: 1 },
  { code: 'CH', weight: 1 },
  { code: 'TR', weight: 1 },
  { code: 'ID', weight: 1 },
  { code: 'PH', weight: 1 },
  { code: 'CO', weight: 1 },
  { code: 'EG', weight: 1 },
  { code: 'NG', weight: 1 },
  { code: 'PK', weight: 1 },
  { code: 'TH', weight: 1 },
  { code: 'VN', weight: 1 },
  { code: 'IE', weight: 1 },
  { code: 'NZ', weight: 1 },
  { code: 'GR', weight: 1 },
  { code: 'RO', weight: 1 },
  { code: 'CZ', weight: 1 },
  { code: 'HU', weight: 1 },
  { code: 'IL', weight: 1 },
]

const OTHER_WEIGHT_SUM = OTHER_COUNTRY_WEIGHTS.reduce((s, x) => s + x.weight, 0)

/** Pick one country: 50% from top 12 (descending), 50% from others. */
export function pickCountryFromDistribution(): string {
  if (Math.random() < 0.5) {
    let r = Math.random() * TOP_12_WEIGHT_SUM
    for (const { code, weight } of TOP_12_COUNTRIES) {
      r -= weight
      if (r <= 0) return code
    }
    return TOP_12_COUNTRIES[TOP_12_COUNTRIES.length - 1]!.code
  }
  let r = Math.random() * OTHER_WEIGHT_SUM
  for (const { code, weight } of OTHER_COUNTRY_WEIGHTS) {
    r -= weight
    if (r <= 0) return code
  }
  return OTHER_COUNTRY_WEIGHTS[OTHER_COUNTRY_WEIGHTS.length - 1]!.code
}

/** All country codes (top 12 + others) for seeding / DB. */
export function getAllDistributionCodes(): string[] {
  return [...TOP_12_COUNTRIES.map((x) => x.code), ...OTHER_COUNTRY_WEIGHTS.map((x) => x.code)]
}

/** Weights for seeding: top 12 use descending (12..1), others use OTHER_COUNTRY_WEIGHTS. Used by seed script and db seed. */
export function getSeedWeights(): { code: string; weight: number }[] {
  return [...TOP_12_COUNTRIES, ...OTHER_COUNTRY_WEIGHTS]
}

/** Total weight for seeding (top sum + other sum). Top 12 sum = 78, others sum = OTHER_WEIGHT_SUM. */
export function getSeedWeightSum(): number {
  return TOP_12_WEIGHT_SUM + OTHER_WEIGHT_SUM
}

// Legacy: flat list for code that still expects COUNTRY_WEIGHTS (e.g. db seed when table empty).
// We build it so that 50% of total weight is top-12 (descending) and 50% is others.
const _half = 0.5
export const COUNTRY_WEIGHTS: { code: string; weight: number }[] = [
  ...TOP_12_COUNTRIES.map(({ code, weight }) => ({
    code,
    weight: (_half * weight) / TOP_12_WEIGHT_SUM,
  })),
  ...OTHER_COUNTRY_WEIGHTS.map(({ code, weight }) => ({
    code,
    weight: (_half * weight) / OTHER_WEIGHT_SUM,
  })),
]
