'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { CheckCircle, PartyPopper } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import confetti from 'canvas-confetti'

function SuccessContent() {
  const t = useTranslations('success')
  const searchParams = useSearchParams()
  const clearCart = useCartStore((state) => state.clearCart)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    clearCart()

    // Trigger confetti celebration
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

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [clearCart])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
          <div className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-4">
          {t('title')} 👏
        </h1>

        <p className="text-xl text-muted mb-8">
          {t('subtitle')}
        </p>

        {/* Celebration Box */}
        <div className="bg-white rounded-2xl border border-border p-8 mb-8">
          <PartyPopper className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t('wallOfClapsTitle')}
          </h2>
          <p className="text-muted">
            {t('wallOfClapsText')}
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-primary-light/20 rounded-2xl p-8 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {t('whatsNext')}
          </h3>
          <ul className="text-left text-muted space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              {t('step1')}
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              {t('step2')}
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              {t('step3')}
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              {t('step4')}
            </li>
          </ul>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full border-2 border-border text-foreground hover:border-primary hover:text-primary transition-colors font-medium"
          >
            {t('returnHome')}
          </Link>
          <a
            href="https://twitter.com/intent/tweet?text=I%20just%20supported%20World%20Clap%20Day!%20Join%20the%20global%20movement%20at&url=https://worldclapday.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
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
