'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { useCartStore } from '@/lib/store'
import confetti from 'canvas-confetti'
import CountrySelect, { type CountryOption } from '@/components/CountrySelect'
import WallClapperPreviewCard from '@/components/WallClapperPreviewCard'
import { CheckCircle, Package, MapPin, Loader2 } from 'lucide-react'

// ─── Merch order types ────────────────────────────────────────────────────────

interface PrintifyOrder {
  id: string
  status: string
}

interface MerchOrderResult {
  order: PrintifyOrder
  items: Array<{ p: string; v: number; q: number; n: string }>
  shippingAddress: {
    name: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  email: string
}

// ─── Merch success component ──────────────────────────────────────────────────

function MerchOrderSuccess({ result }: { result: MerchOrderResult }) {
  const { order, items, shippingAddress, email } = result

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Order placed!</h1>
          <p className="text-gray-500">
            Thanks for your order. We&apos;ll send a confirmation to{' '}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Order ID
          </p>
          <p className="font-mono text-sm text-foreground break-all">{order.id}</p>
          <p className="text-xs text-gray-400 mt-2 capitalize">
            Status: <span className="text-foreground">{order.status ?? 'pending'}</span>
          </p>
        </div>

        {/* Items */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
            <Package size={16} className="text-gray-400" />
            <span className="text-sm font-semibold text-foreground">
              Items ordered
            </span>
          </div>
          <ul className="divide-y divide-gray-100">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-foreground">{item.n}</span>
                <span className="text-sm text-gray-500 ml-4 shrink-0">
                  × {item.q}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Shipping address */}
        {shippingAddress.line1 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-10">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
              <MapPin size={16} className="text-gray-400" />
              <span className="text-sm font-semibold text-foreground">
                Shipping to
              </span>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-foreground">{shippingAddress.name}</p>
              <p>{shippingAddress.line1}</p>
              {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
              <p>
                {[shippingAddress.city, shippingAddress.state, shippingAddress.postal_code]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-400 text-center mb-8">
          Production typically starts within 2–5 business days. You&apos;ll receive a
          shipping notification by email once your order is on its way.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/merch"
            className="px-6 py-3 bg-primary text-white text-center font-medium hover:opacity-80 transition-opacity"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 text-foreground text-center font-medium hover:border-primary hover:text-primary transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Donation success component (existing flow) ───────────────────────────────

function DonationSuccess({ sessionId }: { sessionId: string | null }) {
  const t = useTranslations('success')
  const pathname = usePathname()
  const clearCart = useCartStore((state) => state.clearCart)

  const [mounted, setMounted] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
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
          countryCode: country?.code,
          countryName: country?.name,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        const base = (pathname ?? '').replace(/\/checkout\/success.*$/, '') || '/'
        window.location.assign(window.location.origin + base + '#wall-of-clappers')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-center tracking-tight">
          {t('title')}
        </h1>
        <p className="text-lg text-muted text-center mb-2">{t('line1')}</p>
        <p className="text-lg text-muted text-center mb-2">{t('line2')}</p>
        <p className="text-lg text-muted text-center mb-10">{t('tagline')}</p>

        <p className="text-muted mb-6">{t('wallIntro')}</p>

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

        <div className="flex flex-col items-center mb-8">
          <p className="text-sm font-medium text-foreground mb-3">
            {t('previewCardTitle')}
          </p>
          <div className="w-full max-w-[200px]">
            <WallClapperPreviewCard
              firstName={firstName}
              lastName={lastName}
              email=""
              countryCode={country?.code ?? null}
            />
          </div>
        </div>

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

// ─── Main success page ────────────────────────────────────────────────────────

type PageState =
  | { phase: 'loading' }
  | { phase: 'merch'; result: MerchOrderResult }
  | { phase: 'merch-error'; message: string }
  | { phase: 'donation' }

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore((state) => state.clearCart)

  const [state, setState] = useState<PageState>({ phase: 'loading' })

  useEffect(() => {
    if (!sessionId) {
      setState({ phase: 'donation' })
      return
    }

    // Check if we already processed this session (prevents duplicate orders on refresh)
    const storageKey = `printify_order_${sessionId}`
    const cached = sessionStorage.getItem(storageKey)
    if (cached) {
      try {
        const result: MerchOrderResult = JSON.parse(cached)
        clearCart()
        setState({ phase: 'merch', result })
        return
      } catch {
        sessionStorage.removeItem(storageKey)
      }
    }

    // Detect order type by asking our API (which reads Stripe metadata)
    fetch('/api/printify/create-order-from-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          // "Not a merch order" → fall through to donation success
          if (data.error === 'Not a merch order') {
            setState({ phase: 'donation' })
          } else {
            setState({ phase: 'merch-error', message: data.error ?? 'Unknown error' })
          }
          return
        }
        // Cache so refreshes don't re-create the order
        sessionStorage.setItem(storageKey, JSON.stringify(data))
        clearCart()
        setState({ phase: 'merch', result: data as MerchOrderResult })
      })
      .catch((err) => {
        console.error('Merch order creation failed:', err)
        // Fall back to donation success if something goes wrong
        setState({ phase: 'donation' })
      })
  }, [sessionId, clearCart])

  if (state.phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-sm">Processing your order…</p>
        </div>
      </div>
    )
  }

  if (state.phase === 'merch') {
    return <MerchOrderSuccess result={state.result} />
  }

  if (state.phase === 'merch-error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md text-center">
          <p className="text-red-600 font-medium mb-2">Order error</p>
          <p className="text-gray-500 text-sm mb-6">{state.message}</p>
          <Link href="/merch" className="text-primary underline text-sm">
            ← Back to Merch
          </Link>
        </div>
      </div>
    )
  }

  // phase === 'donation'
  return <DonationSuccess sessionId={sessionId} />
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}
