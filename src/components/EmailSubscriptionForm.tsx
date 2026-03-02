'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useEmailForm } from '@/lib/EmailFormContext'

export default function EmailSubscriptionForm() {
  const t = useTranslations('email')
  const { setHasEmailValue } = useEmailForm() ?? {}
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isFormValid = email.trim() !== '' && isValidEmail && agreed && !isSubmitting

  useEffect(() => {
    setHasEmailValue?.(email.trim().length > 0)
  }, [email, setHasEmailValue])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setValidationError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!isFormValid) {
      if (!agreed) {
        setValidationError(t('validationCheckbox'))
      } else {
        setValidationError(t('validationEmail'))
      }
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/mailing-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setShowSuccess(true)
        setEmail('')
        setAgreed(false)
        setHasEmailValue?.(false)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder={t('placeholder')}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
        />

        {/* Checkbox */}
        <div
          className="flex items-start gap-3 cursor-pointer text-left"
          onClick={() => { setAgreed(!agreed); setValidationError(null) }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
          />
          <span className="text-sm text-muted leading-relaxed">
            {t('consent')}
          </span>
        </div>

        {/* Button — centered */}
        <div className="flex flex-col items-center gap-1">
          <button
            type="submit"
            className="px-8 py-3 rounded-full font-medium transition-all bg-primary text-white hover:bg-primary/90 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('subscribing') : t('subscribe')}
          </button>
          {/* Message directly under button — very small, fits in the gap */}
          {(validationError || showSuccess) && (
            <p
              className={`text-[10px] sm:text-[11px] leading-tight text-center max-w-[min(100%,20rem)] px-1 ${
                validationError ? 'text-amber-200/95' : 'text-primary font-medium animate-fade-in'
              }`}
            >
              {validationError ?? t('success')}
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
