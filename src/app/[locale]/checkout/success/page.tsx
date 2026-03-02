'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useCartStore } from '@/lib/store'
import confetti from 'canvas-confetti'
import CountrySelect, { type CountryOption } from '@/components/CountrySelect'
import WallClapperPreviewCard from '@/components/WallClapperPreviewCard'

function SuccessContent() {
  const t = useTranslations('success')
  const searchParams = useSearchParams()
  const clearCart = useCartStore((state) => state.clearCart)
  const sessionId = searchParams.get('session_id')

  const [mounted, setMounted] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState<CountryOption | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setMounted(true)
    clearCart()

    const duration = 3000
    const end = Date.now() + duration
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#c17fb5', '#7c3aed', '#f59e0b'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#c17fb5', '#7c3aed', '#f59e0b'],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [clearCart])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionId) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/supporters/wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          countryCode: country?.code,
          countryName: country?.name,
        }),
      })
      if (res.ok) setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-center uppercase tracking-tight">
          {t('title')}
        </h1>
        <p className="text-lg text-muted text-center mb-10">
          {t('subtitle')}
        </p>

        <p className="text-muted mb-6">
          {t('wallIntro')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
              {t('firstName')}
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-border px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
              {t('lastName')}
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-border px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-foreground mb-1">
              {t('country')}
            </label>
            <CountrySelect
              id="country"
              value={country}
              onChange={setCountry}
              placeholder={t('countryPlaceholder')}
            />
          </div>

          {sessionId && (
            <button
              type="submit"
              disabled={submitting || submitted}
              className="w-full py-3 px-4 rounded-full font-medium bg-primary text-white hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitted ? t('submitSuccess') : submitting ? '…' : t('submit')}
            </button>
          )}
        </form>

        <p className="text-sm font-medium text-foreground mb-2">
          {t('previewCardTitle')}
        </p>
        <WallClapperPreviewCard
          firstName={firstName}
          lastName={lastName}
          email={email}
          countryCode={country?.code ?? null}
        />

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full border-2 border-border text-foreground hover:border-primary hover:text-primary transition-colors font-medium text-center"
          >
            {t('returnHome')}
          </Link>
          <a
            href="https://twitter.com/intent/tweet?text=I%20just%20supported%20World%20Clap%20Day!%20Join%20the%20global%20movement%20at&url=https://worldclapday.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-medium bg-primary text-white hover:bg-primary-dark text-center"
          >
            {t('shareOnX')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}
