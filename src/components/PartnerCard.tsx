import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface PartnerCardProps {
  title: string
  description?: string
  ctaText?: string
  ctaUrl?: string
}

export default function PartnerCard({
  title,
  description,
  ctaText = 'Apply Now',
  ctaUrl = '#',
}: PartnerCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-8 card-hover">
      <h3 className="text-xl font-bold text-foreground mb-4">{title}</h3>
      {description && (
        <p className="text-muted leading-relaxed mb-6">{description}</p>
      )}
      <Link
        href={ctaUrl}
        className="inline-flex items-center gap-2 btn-primary group"
      >
        {ctaText}
        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  )
}
