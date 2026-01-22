'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { CreditCard, ArrowLeft, AlertCircle } from 'lucide-react'

function CheckoutContent() {
  const t = useTranslations('checkout')
  const searchParams = useSearchParams()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)
  const [supporterName, setSupporterName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const canceled = searchParams.get('canceled')

  useEffect(() => {
    setMounted(true)
  }, [])

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
          })),
          supporterName: supporterName || 'Anonymous',
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

  const createPayPalOrder = async () => {
    const response = await fetch('/api/paypal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: getTotal(),
        supporterName: supporterName || 'Anonymous',
      }),
    })

    const data = await response.json()
    return data.orderId
  }

  const onPayPalApprove = async (data: { orderID: string }) => {
    const response = await fetch('/api/paypal/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: data.orderID,
        supporterName: supporterName || 'Anonymous',
      }),
    })

    const result = await response.json()

    if (result.success) {
      clearCart()
      window.location.href = '/checkout/success?method=paypal'
    } else {
      setError(t('paymentFailed'))
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
            href="/support-us"
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
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
        currency: 'USD',
      }}
    >
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
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border flex justify-between">
              <span className="text-lg font-semibold text-foreground">{t('total')}</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(getTotal())}
              </span>
            </div>
          </div>

          {/* Supporter Name */}
          <div className="bg-white rounded-2xl border border-border p-6 mb-8">
            <label
              htmlFor="supporterName"
              className="block text-lg font-semibold text-foreground mb-2"
            >
              {t('supporterNameLabel')}
            </label>
            <p className="text-sm text-muted mb-4">
              {t('supporterNameDescription')}
            </p>
            <input
              type="text"
              id="supporterName"
              value={supporterName}
              onChange={(e) => setSupporterName(e.target.value)}
              placeholder={t('supporterNamePlaceholder')}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              {t('paymentMethod')}
            </h2>

            <div className="space-y-4">
              {/* Stripe Button */}
              <button
                onClick={handleStripeCheckout}
                disabled={isLoading}
                className="w-full py-4 px-6 bg-[#635BFF] hover:bg-[#5046e5] text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard size={20} />
                {isLoading ? t('redirecting') : t('payWithCard')}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-muted">{t('or')}</span>
                </div>
              </div>

              {/* PayPal Button */}
              <div className="paypal-buttons-container">
                <PayPalButtons
                  style={{
                    layout: 'horizontal',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal',
                    height: 50,
                  }}
                  createOrder={createPayPalOrder}
                  onApprove={onPayPalApprove}
                  onError={(err) => {
                    console.error('PayPal error:', err)
                    setError(t('paymentFailed'))
                  }}
                />
              </div>
            </div>
          </div>

          {/* Security Note */}
          <p className="text-center text-sm text-muted mt-6">
            🔒 {t('securePayment')}
          </p>
        </div>
      </div>
    </PayPalScriptProvider>
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
