'use client'

import TimezoneMapInline from './TimezoneMapInline'

export default function LocationSection() {
  return (
    <div className="space-y-12">
      <div className="w-full min-h-[400px] rounded-xl border border-gray-200 bg-white p-4">
        <TimezoneMapInline />
      </div>
    </div>
  )
}
