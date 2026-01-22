import siteSettings from './siteSettings'
import donationTier from './donationTier'
import supporter from './supporter'
import partnerType from './partnerType'
import policyPage from './policyPage'
import { localizedString, localizedText, localizedBlockContent } from './localizedString'

export const schemaTypes = [
  // Localization helpers
  localizedString,
  localizedText,
  localizedBlockContent,
  // Document types
  siteSettings,
  donationTier,
  supporter,
  partnerType,
  policyPage,
]
