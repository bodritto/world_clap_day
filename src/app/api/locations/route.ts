import { NextResponse } from 'next/server'
import { addUserLocation, getLocationCountsByCountry, getTotalLocationCount } from '@/lib/db'

// GET - Returns aggregated counts by country code
export async function GET() {
  try {
    const [countryCounts, totalCount] = await Promise.all([
      getLocationCountsByCountry(),
      getTotalLocationCount(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        countryCounts,
        totalCount,
      },
    })
  } catch (error) {
    console.error('Error fetching location counts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch location counts' },
      { status: 500 }
    )
  }
}

// POST - Save a new user location
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { city, country, countryCode } = body

    // Validate required fields
    if (!city || !country || !countryCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: city, country, countryCode' },
        { status: 400 }
      )
    }

    // Validate country code format (ISO 3166-1 alpha-2)
    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid country code format' },
        { status: 400 }
      )
    }

    const location = await addUserLocation({ city, country, countryCode })

    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: location.id,
        city: location.city,
        country: location.country,
        countryCode: location.countryCode,
      },
    })
  } catch (error) {
    console.error('Error saving user location:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save location' },
      { status: 500 }
    )
  }
}
