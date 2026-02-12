'use client'

// import { useState } from 'react'
// import dynamic from 'next/dynamic'
import CityPicker from './CityPicker'

// WorldMap (countries heatmap) — commented out; considering timezone-highlight libs (e.g. react-timezone-map-select)
// const WorldMap = dynamic(() => import('./WorldMap'), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-[400px] bg-gray-50 rounded-xl flex items-center justify-center">
//       <span className="text-muted">Loading map...</span>
//     </div>
//   ),
// })

export default function LocationSection() {
  // const [refreshTrigger, setRefreshTrigger] = useState(0)
  // const handleLocationSaved = () => setRefreshTrigger(prev => prev + 1)

  return (
    <div className="space-y-12">
      <CityPicker onLocationSaved={() => {}} />
      {/* <WorldMap refreshTrigger={refreshTrigger} /> */}
      <div className="w-full h-[400px] bg-gray-50 rounded-xl flex items-center justify-center text-muted border border-gray-200">
        <span>Map (timezone picker) — coming soon</span>
      </div>
    </div>
  )
}
