# World Clap Day Website

A modern Next.js website for World Clap Day - a global moment of unity.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **CMS**: Sanity (headless CMS)
- **Payments**: Stripe + PayPal
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret

# Site URL (for webhooks)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (Stripe, PayPal webhooks)
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout and success pages
│   ├── partners/          # Partners page
│   ├── support-us/        # Donation tiers page
│   └── [slug]/            # Dynamic policy pages
├── components/            # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CountdownTimer.tsx
│   ├── DonationCard.tsx
│   └── ...
├── lib/                   # Utility functions and configurations
│   ├── store.ts          # Zustand cart store
│   ├── stripe.ts         # Stripe integration
│   ├── paypal.ts         # PayPal integration
│   └── utils.ts
└── sanity/               # Sanity CMS configuration
    ├── client.ts
    ├── config.ts
    └── schemas/          # Content type definitions
```

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Webhook Configuration

After deployment, configure webhooks:

**Stripe:**
- URL: `https://your-domain.com/api/webhook`
- Events: `checkout.session.completed`, `payment_intent.payment_failed`

**PayPal:**
- PayPal handles capture automatically via client-side SDK

## Sanity CMS Setup

1. Create a Sanity project at [sanity.io](https://sanity.io)
2. Get your project ID and add to environment variables
3. Create a dataset (production)
4. Generate an API token with write access
5. The schemas are already defined in `src/sanity/schemas/`

### Content Types

- **Site Settings**: Global settings (countdown date, supporter count)
- **Donation Tier**: Support tiers ($5, $50, $500, $5000)
- **Supporter**: Wall of Claps entries
- **Partner Type**: Partner categories
- **Policy Page**: Legal pages (Privacy, Terms, Support Policy)

## Features

- ✅ Responsive design
- ✅ Countdown timer to World Clap Day
- ✅ Donation system with multiple tiers
- ✅ Shopping cart with persistent state
- ✅ Stripe and PayPal payment integration
- ✅ Wall of Claps for supporters
- ✅ Dynamic policy pages
- ✅ SEO optimized
- ✅ Mobile-friendly navigation

## License

Copyright © 2026 World Clap Day LTD
# world_clap_day
