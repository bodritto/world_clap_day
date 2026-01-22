'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  targetValue: number
  duration?: number
  title?: string
  className?: string
}

export default function AnimatedCounter({
  targetValue,
  duration = 2000,
  title = 'Clappers who joined the mission',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateCount()
        }
      },
      { threshold: 0.3 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated, targetValue])

  const animateCount = () => {
    const startTime = performance.now()
    const startValue = 0

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart)
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }

  return (
    <div ref={counterRef} className={`elementor-counter text-center ${className}`}>
      <div className="elementor-counter-title text-lg md:text-xl text-muted mb-3 font-medium">
        {title}
      </div>
      <div className="elementor-counter-number-wrapper">
        <span className="elementor-counter-number text-5xl md:text-7xl font-bold text-primary tabular-nums">
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
