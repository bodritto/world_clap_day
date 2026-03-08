'use client'

import { useEffect } from 'react'

/** On mount, if the URL hash matches the given id, scroll the element into view. */
export default function ScrollToHash({ id }: { id: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash !== `#${id}`) return
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [id])
  return null
}
