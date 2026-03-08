/**
 * List of countries for dropdowns. Uses Intl API for a complete, locale-aware list.
 * Filter to common country-like codes (exclude numeric and legacy).
 */
const DISPLAY_NAMES = typeof Intl !== 'undefined' && Intl.DisplayNames
  ? new Intl.DisplayNames(['en'], { type: 'region' })
  : null

function getRegionName(code: string): string {
  if (!DISPLAY_NAMES) return code
  try {
    return DISPLAY_NAMES.of(code) ?? code
  } catch {
    return code
  }
}

/** Get all countries as { code, name } sorted by name. Uses Intl.supportedValuesOf when available. */
export function getCountriesList(): Array<{ code: string; name: string }> {
  let codes: string[] = []
  if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
    try {
      codes = (Intl as unknown as { supportedValuesOf(t: string): string[] }).supportedValuesOf('region')
    } catch {
      codes = FALLBACK_COUNTRY_CODES
    }
  } else {
    codes = FALLBACK_COUNTRY_CODES
  }
  const list = codes
    .filter((c) => /^[A-Z]{2}$/.test(c))
    .map((code) => ({ code, name: getRegionName(code) }))
    .filter(({ name, code }) => name && name !== code)
  list.sort((a, b) => a.name.localeCompare(b.name))
  return list
}

/** Fallback list when Intl.supportedValuesOf is not available (e.g. older Node) */
const FALLBACK_COUNTRY_CODES = [
  'AD', 'AE', 'AF', 'AG', 'AL', 'AM', 'AO', 'AR', 'AT', 'AU', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI',
  'BJ', 'BN', 'BO', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CL', 'CM', 'CN', 'CO',
  'CR', 'CU', 'CV', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ER', 'ES', 'ET', 'FI', 'FJ',
  'FM', 'FR', 'GA', 'GB', 'GD', 'GE', 'GH', 'GM', 'GN', 'GQ', 'GR', 'GT', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU',
  'ID', 'IE', 'IL', 'IN', 'IQ', 'IR', 'IS', 'IT', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW',
  'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MG', 'MH', 'MK',
  'ML', 'MM', 'MN', 'MR', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR',
  'NZ', 'OM', 'PA', 'PE', 'PG', 'PH', 'PK', 'PL', 'PS', 'PT', 'PW', 'PY', 'QA', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB',
  'SC', 'SD', 'SE', 'SG', 'SI', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SY', 'SZ', 'TD', 'TG', 'TH',
  'TJ', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VN',
  'VU', 'WS', 'YE', 'ZA', 'ZM', 'ZW',
]
