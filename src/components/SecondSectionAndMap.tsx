'use client'

// import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import AddToCalendar from './AddToCalendar'
import CityPicker from './CityPicker'
import { useMapRefresh } from '@/lib/MapRefreshContext'

// Current map (countries heatmap) — commented out; considering timezone-highlight map libs (e.g. react-timezone-map-select)
// const WorldMap = dynamic(() => import('./WorldMap'), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full min-h-[300px] bg-gray-50 rounded-xl flex items-center justify-center">
//       <span className="text-muted">Loading map...</span>
//     </div>
//   ),
// })

/** Second viewport: calendar + find local clap time + map in the same block. */
export default function SecondSectionAndMap() {
  const t = useTranslations('home')
  const { refreshTrigger, incrementRefresh } = useMapRefresh()

  return (
    <section
      className="min-h-[90dvh] flex flex-col px-4 py-12 lg:py-16 bg-white"
      style={{ minHeight: '90dvh' }}
    >
      <div className="max-w-2xl mx-auto w-full space-y-10">
        <AddToCalendar />
        <div className="flex justify-center pt-4">
          <div className="w-10 h-16 rounded-full border-2 border-gray-300 flex items-start justify-center p-2">
            <div className="w-1.5 h-4 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center">
            {t('findLocalClapTitle')}
          </h2>
          <p className="text-muted text-center">
            {t('findLocalClapSubtitle')}
          </p>
          <CityPicker onLocationSaved={incrementRefresh} />
        </div>
      </div>

      {/* Map in the same block — temporarily commented out */}
      {/* <div className="max-w-5xl mx-auto w-full mt-12 pb-8 min-h-[min(50vh,400px)]">
        <WorldMap refreshTrigger={refreshTrigger} />
      </div> */}
    </section>
  )
}
