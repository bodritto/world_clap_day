'use client'

import TimezoneMapInline from './TimezoneMapInline'

interface SecondSectionAndMapProps {
  /** Pass supporters to color countries on the map by clapper count */
  supporters?: { countryCode?: string }[]
}

/** Second viewport: timezone map (with city search and country coloring). */
export default function SecondSectionAndMap({ supporters = [] }: SecondSectionAndMapProps) {
  return (
    <section
      className="min-h-[90dvh] flex flex-col px-4 py-12 lg:py-16 bg-white"
      style={{ minHeight: '90dvh' }}
    >
      <div className="max-w-5xl mx-auto w-full pb-8 min-h-[min(50vh,400px)]">
        <TimezoneMapInline supporters={supporters} />
      </div>
    </section>
  )
}
