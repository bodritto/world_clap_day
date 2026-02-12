'use client'

/**
 * Current implementation: world map (react-simple-maps) with country counts heatmap.
 *
 * Alternative — timezone map with selection + highlight:
 * - react-timezone-map-select (npm): modal with world map + list; select TZ by list or by clicking map;
 *   highlights selected timezone; MUI 5, D3/TopoJSON; demos: https://kmiyashita.gitlab.io/react-timezone-map-select/
 * - timezone-picker (npm): jQuery SVG world map, region highlight, older (~6y).
 * - react-timezone-select: no map, list-only TZ selector (DST-aware).
 */

import { useState, useEffect, memo } from 'react'
import { useTranslations } from 'next-intl'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'

// TopoJSON world map from Natural Earth
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface CountryCounts {
  [countryCode: string]: number
}

interface WorldMapProps {
  refreshTrigger?: number
}

// Color scale based on count (light pink to dark primary)
function getCountryColor(count: number | undefined, maxCount: number): string {
  if (!count || count === 0) return '#f3f4f6' // Light gray for no data
  
  // Normalize to 0-1 range with logarithmic scale for better distribution
  const normalized = Math.log(count + 1) / Math.log(maxCount + 1)
  
  // Interpolate between light pink and primary color
  // Light: #fce7f3 (pink-100), Dark: #c17fb5 (primary)
  const lightR = 252, lightG = 231, lightB = 243
  const darkR = 193, darkG = 127, darkB = 181
  
  const r = Math.round(lightR + (darkR - lightR) * normalized)
  const g = Math.round(lightG + (darkG - lightG) * normalized)
  const b = Math.round(lightB + (darkB - lightB) * normalized)
  
  return `rgb(${r}, ${g}, ${b})`
}

// NOTE:
// world-atlas@2/countries-110m.json does NOT include ISO_A3 in properties by default.
// It uses numeric ids (ISO 3166-1 numeric / "ISO_N3") as geo.id.
// We therefore convert our alpha-2 counts into numeric-id keyed counts for matching.
//
// For now we map the key countries we seed/show prominently.
// If you want full global coverage later, we can extend this mapping or switch datasets.
const alpha2ToNumeric: Record<string, string> = {
  US: '840',
  GB: '826',
  AR: '32',
  CN: '156',
  IN: '356',
  CA: '124',
  TR: '792',
}

function convertToNumericId(counts: CountryCounts): CountryCounts {
  const result: CountryCounts = {}
  for (const [code, count] of Object.entries(counts)) {
    const numeric = alpha2ToNumeric[code]
    if (numeric) {
      result[numeric] = count
    }
  }
  return result
}

function WorldMapComponent({ refreshTrigger }: WorldMapProps) {
  const t = useTranslations('worldMap')
  const [countryCounts, setCountryCounts] = useState<CountryCounts>({})
  const [totalCount, setTotalCount] = useState(0)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [hoveredCount, setHoveredCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/locations')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setCountryCounts(convertToNumericId(data.data.countryCounts))
            setTotalCount(data.data.totalCount)
          }
        }
      } catch (error) {
        console.error('Error fetching location data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [refreshTrigger])

  const maxCount = Math.max(...Object.values(countryCounts), 1)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {t('title')}
        </h3>
        <p className="text-muted">
          {totalCount > 0 
            ? t('participantsCount', { count: totalCount })
            : t('beFirst')
          }
        </p>
      </div>

      {/* Map Container */}
      <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-muted">{t('loading')}</div>
          </div>
        )}

        {/* Tooltip */}
        {hoveredCountry && (
          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 z-20">
            <span className="font-medium text-foreground">{hoveredCountry}</span>
            {hoveredCount !== null && hoveredCount > 0 && (
              <span className="ml-2 text-primary font-semibold">
                {hoveredCount} {hoveredCount === 1 ? t('participant') : t('participants')}
              </span>
            )}
          </div>
        )}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 30],
          }}
          style={{ width: '100%', height: 'auto' }}
        >
          <ZoomableGroup zoom={1} minZoom={1} maxZoom={4}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryId = String(geo.id)
                  const count = countryCounts[countryId] || 0
                  const countryName = geo.properties.NAME || geo.properties.name || geo.properties.NAME_EN

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryColor(count, maxCount)}
                      stroke="#9ca3af"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { 
                          fill: count > 0 ? '#9b5d91' : '#e5e7eb',
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => {
                        setHoveredCountry(countryName)
                        setHoveredCount(count)
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null)
                        setHoveredCount(null)
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend */}
        {totalCount > 0 && (
          <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#f3f4f6' }} />
                <span className="text-muted">0</span>
              </div>
              <div className="w-16 h-4 rounded" style={{ 
                background: 'linear-gradient(to right, #fce7f3, #c17fb5)' 
              }} />
              <span className="text-muted">{maxCount}+</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
export default memo(WorldMapComponent)
