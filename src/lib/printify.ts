const PRINTIFY_API_URL = 'https://api.printify.com/v1'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PrintifyImage {
  src: string
  variant_ids: number[]
  position: string
  is_default: boolean
}

export interface PrintifyOptionValue {
  id: number
  title: string
  colors?: string[]
}

export interface PrintifyOption {
  name: string
  type: string
  values: PrintifyOptionValue[]
}

export interface PrintifyVariant {
  id: number
  title: string
  sku: string
  /** Price in cents */
  cost: number
  /** Retail price in cents */
  price: number
  is_enabled: boolean
  is_available: boolean
  /** Option value IDs (e.g. [size_id, color_id]) */
  options: number[]
  grams: number
  is_default: boolean
}

export interface PrintifyProduct {
  id: string
  title: string
  description: string
  tags: string[]
  options: PrintifyOption[]
  variants: PrintifyVariant[]
  images: PrintifyImage[]
  created_at: string
  updated_at: string
  visible: boolean
  is_locked: boolean
  blueprint_id: number
  user_id: number
  shop_id: number
  print_provider_id: number
}

export interface PrintifyProductsResponse {
  current_page: number
  data: PrintifyProduct[]
  last_page: number
  per_page: number
  total: number
}

export interface PrintifyOrderLineItem {
  product_id: string
  variant_id: number
  quantity: number
}

export interface PrintifyOrderAddress {
  first_name: string
  last_name: string
  email: string
  phone: string
  /** ISO 3166-1 alpha-2, e.g. "US" */
  country: string
  /** State / province code */
  region: string
  address1: string
  address2?: string
  city: string
  zip: string
}

export interface PrintifyCreateOrderPayload {
  label: string
  line_items: PrintifyOrderLineItem[]
  /** 1 = standard, 2 = express */
  shipping_method: number
  send_shipping_notification: boolean
  address_to: PrintifyOrderAddress
}

export interface PrintifyShop {
  id: number
  title: string
  sales_channel: string
}

// ─── Client helpers ───────────────────────────────────────────────────────────

function getPrintifyHeaders(): Record<string, string> {
  const apiKey = process.env.PRINTIFY_API_KEY
  if (!apiKey) {
    throw new Error('PRINTIFY_API_KEY is not configured (set it in .env)')
  }
  if (apiKey === 'your_printify_api_key_here') {
    throw new Error(
      'PRINTIFY_API_KEY is still the placeholder. Get your key at https://printify.com/app/account/api-access'
    )
  }
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'User-Agent': 'WorldClapDay/1.0',
  }
}

function getShopId(): string {
  const shopId = process.env.PRINTIFY_SHOP_ID
  if (!shopId) {
    throw new Error('PRINTIFY_SHOP_ID is not configured (set it in .env)')
  }
  return shopId
}

/** Returns true when PRINTIFY_TEST_MODE=true (default: true in dev) */
export function isTestMode(): boolean {
  if (process.env.PRINTIFY_TEST_MODE !== undefined) {
    return process.env.PRINTIFY_TEST_MODE === 'true'
  }
  return process.env.NODE_ENV !== 'production'
}

// ─── API functions ────────────────────────────────────────────────────────────

/** List all shops connected to the API key. Useful for discovering shop IDs. */
export async function getShops(): Promise<PrintifyShop[]> {
  const response = await fetch(`${PRINTIFY_API_URL}/shops.json`, {
    headers: getPrintifyHeaders(),
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Printify API error ${response.status}: ${error}`)
  }
  return response.json()
}

export async function getProducts(
  page = 1,
  limit = 10
): Promise<PrintifyProductsResponse> {
  const shopId = getShopId()
  const response = await fetch(
    `${PRINTIFY_API_URL}/shops/${shopId}/products.json?page=${page}&limit=${limit}`,
    { headers: getPrintifyHeaders() }
  )
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Printify API error ${response.status}: ${error}`)
  }
  return response.json()
}

export async function getProduct(productId: string): Promise<PrintifyProduct> {
  const shopId = getShopId()
  const response = await fetch(
    `${PRINTIFY_API_URL}/shops/${shopId}/products/${productId}.json`,
    { headers: getPrintifyHeaders() }
  )
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Printify API error ${response.status}: ${error}`)
  }
  return response.json()
}

/**
 * Create a Printify order.
 * In test mode the order is marked as `test: true` — it won't be sent to
 * production / fulfillment and you won't be charged.
 */
export async function createOrder(
  payload: PrintifyCreateOrderPayload,
  testOverride?: boolean
): Promise<unknown> {
  const shopId = getShopId()
  const useTest = testOverride !== undefined ? testOverride : isTestMode()
  const body = useTest ? { ...payload, test: true } : payload

  const response = await fetch(
    `${PRINTIFY_API_URL}/shops/${shopId}/orders.json`,
    {
      method: 'POST',
      headers: getPrintifyHeaders(),
      body: JSON.stringify(body),
    }
  )
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Printify order error ${response.status}: ${error}`)
  }
  return response.json()
}

// ─── Price helpers ────────────────────────────────────────────────────────────

/** Convert Printify price (cents) → display dollars/euros */
export function centsToDisplay(cents: number): number {
  return cents / 100
}

/** Get the min price of all enabled variants (for "from $X" display) */
export function getProductMinPrice(product: PrintifyProduct): number {
  const enabled = product.variants.filter((v) => v.is_enabled && v.is_available)
  if (enabled.length === 0) return 0
  return Math.min(...enabled.map((v) => v.price))
}

/** Get the default image for a product */
export function getProductDefaultImage(product: PrintifyProduct): string {
  const defaultImg = product.images.find((i) => i.is_default)
  return defaultImg?.src ?? product.images[0]?.src ?? ''
}
