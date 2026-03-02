'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useEmailForm } from '@/lib/EmailFormContext'
import { useClapperCount } from '@/lib/ClapperCountContext'

interface AnimatedCounterProps {
  duration?: number
  title?: string
  className?: string
}

export default function AnimatedCounter({
  duration = 2000,
  title = 'Clappers who joined the mission',
  className = '',
}: AnimatedCounterProps) {
  const emailForm = useEmailForm()
  const localIncrement = emailForm?.hasEmailValue ? 1 : 0
  const { totalCount } = useClapperCount()
  const [displayCount, setDisplayCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  const animateTo = useCallback((startValue: number, endValue: number) => {
    const startTime = performance.now()
    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
      setDisplayCount(currentValue)
      if (progress < 1) requestAnimationFrame(updateCount)
      else setAnimationDone(true)
    }
    requestAnimationFrame(updateCount)
  }, [duration])

  // On first view: animate from 0 to initial total (from context)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateTo(0, totalCount)
        }
      },
      { threshold: 0.3 }
    )

    if (counterRef.current) observer.observe(counterRef.current)
    return () => observer.disconnect()
  }, [hasAnimated, totalCount, animateTo])

  // After animation done, keep display in sync with context (ticks every 5s)
  useEffect(() => {
    if (animationDone) setDisplayCount(totalCount)
  }, [animationDone, totalCount])

  return (
    <div ref={counterRef} className={`elementor-counter text-center ${className}`}>
      <div className="elementor-counter-title text-lg md:text-xl text-white mb-3 font-medium">
        {title}
      </div>
      <div className="elementor-counter-number-wrapper">
        <span className="elementor-counter-number text-5xl md:text-7xl font-bold text-primary tabular-nums">
          {(displayCount + localIncrement).toLocaleString()}
        </span>
      </div>
    </div>
  )
}
