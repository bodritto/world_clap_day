import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

interface SocialLinksProps {
  links?: {
    instagram?: string
    facebook?: string
    twitter?: string
    youtube?: string
    reddit?: string
  }
  className?: string
}

export default function SocialLinks({ links, className = '' }: SocialLinksProps) {
  const socialItems = [
    { href: links?.instagram || 'https://instagram.com/worldclapday', icon: Instagram, label: 'Instagram' },
    { href: links?.facebook || 'https://facebook.com/worldclapday', icon: Facebook, label: 'Facebook' },
    { href: links?.twitter || 'https://twitter.com/worldclapday', icon: Twitter, label: 'X/Twitter' },
    { href: links?.youtube || 'https://youtube.com/@worldclapday', icon: Youtube, label: 'YouTube' },
    { href: links?.reddit || 'https://reddit.com/r/worldclapday', icon: RedditIcon, label: 'Reddit' },
  ]

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
          aria-label={item.label}
        >
          <item.icon size={20} />
        </a>
      ))}
    </div>
  )
}

// Custom Reddit icon since lucide doesn't have one
function RedditIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16.5 9.5c.83 0 1.5.67 1.5 1.5 0 .52-.27 1-.67 1.28.1.35.17.72.17 1.1 0 2.76-3.13 5-7 5s-7-2.24-7-5c0-.38.06-.75.17-1.1A1.5 1.5 0 014.5 9.5c.83 0 1.5.67 1.5 1.5 0 .28-.08.54-.21.76 1.03-.66 2.37-1.09 3.86-1.23l.71-3.32a.5.5 0 01.6-.39l2.5.54a1 1 0 111.04.5z" />
      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
      <path d="M9.5 16.5c.88.44 2 .5 2.5.5s1.62-.06 2.5-.5" />
    </svg>
  )
}
