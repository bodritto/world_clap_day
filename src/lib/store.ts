import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DonationCurrency } from './utils'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  /** Currency for the whole cart (set when first item is added). */
  currency: DonationCurrency | null
  /** Name for Wall of Claps (can be set on donation form or checkout). */
  supporterName: string
  addItem: (item: Omit<CartItem, 'quantity'>, currency?: DonationCurrency) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setSupporterName: (name: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

// Timezone store for managing user's selected timezone
interface TimezoneInfo {
  timezone: string
  city?: string
  country?: string
  source: 'ip' | 'city' | 'browser'
}

interface TimezoneStore {
  timezoneInfo: TimezoneInfo | null
  isLoading: boolean
  setTimezone: (info: TimezoneInfo) => void
  setLoading: (loading: boolean) => void
}

export const useTimezoneStore = create<TimezoneStore>()(
  persist(
    (set) => ({
      timezoneInfo: null,
      isLoading: true,
      setTimezone: (info) => set({ timezoneInfo: info, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'wcd-timezone',
    }
  )
)

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: null,
      supporterName: '',

      addItem: (item, currency) => {
        const state = get()
        const items = state.items
        const existingItem = items.find((i) => i.id === item.id)
        const newCurrency = state.currency ?? currency ?? 'eur'

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
            currency: state.currency ?? currency ?? 'eur',
          })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })
      },

      setSupporterName: (name) => set({ supporterName: name }),

      clearCart: () => set({ items: [], currency: null, supporterName: '' }),
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'wcd-cart',
    }
  )
)
