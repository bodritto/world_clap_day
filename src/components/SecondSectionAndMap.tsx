'use client'

import TimezoneMapInline from './TimezoneMapInline'
import { useClapperCount } from '@/lib/ClapperCountContext'

/** Second viewport: timezone map (with city search and country coloring from clapper counts). */
export default function SecondSectionAndMap() {
  const { mapCountryCounts } = useClapperCount()
  return (
    <section
      className="flex flex-col px-4 pt-12 pb-4 sm:min-h-[90dvh] sm:pt-16 sm:pb-6 lg:pb-8 bg-white"
    >
      <div className="max-w-5xl mx-auto w-full min-w-0 sm:min-h-[min(50vh,400px)]">
        <TimezoneMapInline countryCounts={mapCountryCounts} />
      </div>
    </section>
  )
}
