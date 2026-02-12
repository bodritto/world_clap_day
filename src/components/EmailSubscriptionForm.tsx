'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function EmailSubscriptionForm() {
  const t = useTranslations('email')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isButtonEnabled = email.trim() !== '' && isValidEmail && agreed && !isSubmitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isButtonEnabled) return

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
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
        />

        {/* Checkbox */}
        <div 
          className="flex items-start gap-3 cursor-pointer text-left"
          onClick={() => setAgreed(!agreed)}
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

        {/* Button Row */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!isButtonEnabled}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              isButtonEnabled
                ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? t('subscribing') : t('subscribe')}
          </button>
          
          {showSuccess && (
            <span className="text-primary font-medium animate-fade-in">
              {t('success')}
            </span>
          )}
        </div>
      </div>
    </form>
  )
}
