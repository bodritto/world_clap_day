'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import LanguagePicker from './LanguagePicker'

export default function Header() {
  const t = useTranslations('nav')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  const [mounted, setMounted] = useState(false)

  const navLinks = [
    { href: '/support-us' as const, label: t('supportUs') },
    { href: '/partners' as const, label: t('partners') },
    { href: '/cart' as const, label: t('cart') },
    { href: '/checkout' as const, label: t('checkout') },
  ]

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/wcd-logo.png"
              alt="World Clap Day Logo"
              className="w-12 h-auto"
            />
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              World Clap Day
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted hover:text-primary transition-colors font-medium relative group"
              >
                {link.label}
                {link.href === '/cart' && mounted && itemCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
            <LanguagePicker />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguagePicker />
            <button
              className="p-2 text-muted hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isMenuOpen ? 'max-h-64' : 'max-h-0'
        )}
      >
        <nav className="bg-white border-t border-border px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 py-2 px-4 text-muted hover:text-primary hover:bg-primary-light/20 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
              {link.href === '/cart' && mounted && itemCount > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
