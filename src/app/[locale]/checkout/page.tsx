'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { CreditCard, ArrowLeft, AlertCircle } from 'lucide-react'

function CheckoutContent() {
  const t = useTranslations('checkout')
  const searchParams = useSearchParams()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const supporterName = useCartStore((state) => state.supporterName)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const canceled = searchParams.get('canceled')

  useEffect(() => {
    setMounted(true)
  }, [])

  const currency = useCartStore((state) => state.currency) ?? 'eur'

  const handleStripeCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            printifyProductId: item.printifyProductId,
            printifyVariantId: item.printifyVariantId,
          })),
          supporterName: (supporterName ?? '').trim() || 'Anonymous',
          currency,
        }),
      })

      const { url, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      if (url) {
        window.location.href = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-gray-200 rounded mb-8" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t('emptyCart')}
          </h1>
          <p className="text-muted mb-8">
            {t('emptyCartText')}
          </p>
          <Link
            href="/get-involved#donate"
            className="inline-flex items-center gap-2 btn-primary"
          >
            <ArrowLeft size={18} />
            {t('backToCart')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          {t('backToCart')}
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">{t('title')}</h1>

        {canceled && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800">
              {t('canceledTitle')}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t('orderSummary')}
          </h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-foreground font-medium">
                  {formatPrice(item.price * item.quantity, currency)}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-border flex justify-between">
            <span className="text-lg font-semibold text-foreground">{t('total')}</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(getTotal(), currency)}
            </span>
          </div>
        </div>

        {/* Pay with Card */}
        <button
          onClick={handleStripeCheckout}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-[#635BFF] hover:bg-[#5046e5] text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard size={20} />
          {isLoading ? t('redirecting') : t('payWithCard')}
        </button>

        {/* Security Note */}
        <p className="text-center text-sm text-muted mt-6">
          🔒 {t('securePayment')}
        </p>
      </div>
    </div>
  )
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-10 w-48 bg-gray-200 rounded mb-8" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}
