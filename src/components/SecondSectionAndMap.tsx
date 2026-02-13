'use client'

import TimezoneMapInline from './TimezoneMapInline'

/** Second viewport: timezone map (with city search). */
export default function SecondSectionAndMap() {
  return (
    <section
      className="min-h-[90dvh] flex flex-col px-4 py-12 lg:py-16 bg-white"
      style={{ minHeight: '90dvh' }}
    >
      <div className="max-w-5xl mx-auto w-full pb-8 min-h-[min(50vh,400px)]">
        <TimezoneMapInline />
      </div>
    </section>
  )
}
