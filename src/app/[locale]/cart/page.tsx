'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import CartItem from '@/components/CartItem'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const t = useTranslations('cart')
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-light/30 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t('empty')}
          </h1>
          <p className="text-muted mb-8">
            {t('emptyText')}
          </p>
          <Link
            href="/support-us"
            className="inline-flex items-center gap-2 btn-primary"
          >
            <ArrowLeft size={18} />
            {t('browseTiers')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <button
            onClick={clearCart}
            className="text-sm text-muted hover:text-red-500 transition-colors"
          >
            {t('clearCart')}
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg text-muted">{t('total')}</span>
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(getTotal())}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/support-us"
              className="flex-1 py-3 px-6 rounded-full border-2 border-border text-muted hover:border-primary hover:text-primary transition-colors font-medium text-center"
            >
              {t('continueBrowsing')}
            </Link>
            <Link
              href="/checkout"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {t('proceedToCheckout')}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
