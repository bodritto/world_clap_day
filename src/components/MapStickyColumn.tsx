'use client'

// import dynamic from 'next/dynamic'
// import { useMapRefresh } from '@/lib/MapRefreshContext'

// Current map (WorldMap) — commented out; considering timezone-highlight libs (e.g. react-timezone-map-select)
// const WorldMap = dynamic(() => import('./WorldMap'), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-full min-h-[300px] bg-gray-50 rounded-xl flex items-center justify-center">
//       <span className="text-muted">Loading map...</span>
//     </div>
//   ),
// })

export default function MapStickyColumn() {
  // const { refreshTrigger } = useMapRefresh()

  return (
    <aside
      className="hidden lg:block lg:w-[min(420px,35vw)] lg:shrink-0 lg:sticky lg:top-20 lg:self-start bg-gray-50/50 px-4 py-6"
      style={{ height: 'min(80dvh, 700px)', minHeight: '400px' }}
    >
      {/* Map placeholder — WorldMap commented out */}
      <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center text-muted">
        <span>Map (timezone picker) — coming soon</span>
      </div>
    </aside>
  )
}
