'use client'

import TimezoneMapInline from './TimezoneMapInline'

export default function MapStickyColumn() {
  return (
    <aside
      className="hidden lg:block lg:w-[min(420px,35vw)] lg:shrink-0 lg:sticky lg:top-20 lg:self-start bg-gray-50/50 px-4 py-6"
      style={{ height: 'min(80dvh, 700px)', minHeight: '400px' }}
    >
      <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 bg-white p-4 overflow-y-auto">
        <TimezoneMapInline />
      </div>
    </aside>
  )
}
