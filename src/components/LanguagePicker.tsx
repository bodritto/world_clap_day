'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config'
import { ChevronDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LanguagePicker() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
          'hover:bg-gray-100 text-muted hover:text-foreground',
          isOpen && 'bg-gray-100 text-foreground'
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={18} />
        <span className="text-lg">{localeFlags[locale]}</span>
        <span className="hidden sm:inline text-sm font-medium">
          {localeNames[locale]}
        </span>
        <ChevronDown
          size={16}
          className={cn('transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-border shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
          aria-label="Language selection"
        >
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                'hover:bg-gray-50',
                locale === loc
                  ? 'text-primary font-medium bg-primary-light/20'
                  : 'text-foreground'
              )}
              role="option"
              aria-selected={locale === loc}
            >
              <span className="text-xl">{localeFlags[loc]}</span>
              <span className="text-sm">{localeNames[loc]}</span>
              {locale === loc && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
