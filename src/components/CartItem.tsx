'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore, type CartItem as CartItemType } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border">
      {/* Icon */}
      <div className="w-16 h-16 flex-shrink-0 rounded-full bg-primary-light/30 flex items-center justify-center">
        <span className="text-3xl">👏</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground">{item.name}</h3>
        <p className="text-primary font-medium">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-foreground">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="p-2 text-muted hover:text-red-500 transition-colors"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}
