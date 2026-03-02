# World Clap Day Website

A modern Next.js website for World Clap Day - a global moment of unity.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
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

Copy `.env.example` to `.env.local` and fill in the values. For **production**, set Stripe to your live keys (`pk_live_...`, `sk_live_...`) in your host's env (e.g. Vercel).

```bash
cp .env.example .env.local
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
│   └── [slug]/            # Static policy pages (support-policy, privacy-policy, terms-of-use)
├── components/            # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CountdownTimer.tsx
│   ├── DonationCard.tsx
│   └── ...
└── lib/                   # Utility functions and configurations
    ├── store.ts          # Zustand cart store
    ├── stripe.ts         # Stripe integration
    ├── paypal.ts         # PayPal integration
    ├── policies.ts       # Static policy page content
    └── utils.ts
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
