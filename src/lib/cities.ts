// Major world cities for the city picker
// Data includes city name, country, ISO 3166-1 alpha-2 country code, and IANA timezone

export interface City {
  city: string
  country: string
  countryCode: string
  timezone: string
}

export const cities: City[] = [
  // United States
  { city: "New York", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "Los Angeles", country: "United States", countryCode: "US", timezone: "America/Los_Angeles" },
  { city: "Chicago", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "Houston", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "Phoenix", country: "United States", countryCode: "US", timezone: "America/Phoenix" },
  { city: "Philadelphia", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "San Antonio", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "San Diego", country: "United States", countryCode: "US", timezone: "America/Los_Angeles" },
  { city: "Dallas", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "San Jose", country: "United States", countryCode: "US", timezone: "America/Los_Angeles" },
  { city: "Austin", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "Jacksonville", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "Fort Worth", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "Columbus", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "San Francisco", country: "United States", countryCode: "US", timezone: "America/Los_Angeles" },
  { city: "Charlotte", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "Indianapolis", country: "United States", countryCode: "US", timezone: "America/Indiana/Indianapolis" },
  { city: "Seattle", country: "United States", countryCode: "US", timezone: "America/Los_Angeles" },
  { city: "Denver", country: "United States", countryCode: "US", timezone: "America/Denver" },
  { city: "Washington D.C.", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "Boston", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "Nashville", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "Detroit", country: "United States", countryCode: "US", timezone: "America/Detroit" },
  { city: "Portland", country: "United States", countryCode: "US", timezone: "America/Los_Angeles" },
  { city: "Las Vegas", country: "United States", countryCode: "US", timezone: "America/Los_Angeles" },
  { city: "Miami", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "Atlanta", country: "United States", countryCode: "US", timezone: "America/New_York" },
  { city: "Minneapolis", country: "United States", countryCode: "US", timezone: "America/Chicago" },
  { city: "Honolulu", country: "United States", countryCode: "US", timezone: "Pacific/Honolulu" },
  { city: "Anchorage", country: "United States", countryCode: "US", timezone: "America/Anchorage" },

  // Canada
  { city: "Toronto", country: "Canada", countryCode: "CA", timezone: "America/Toronto" },
  { city: "Montreal", country: "Canada", countryCode: "CA", timezone: "America/Montreal" },
  { city: "Vancouver", country: "Canada", countryCode: "CA", timezone: "America/Vancouver" },
  { city: "Calgary", country: "Canada", countryCode: "CA", timezone: "America/Edmonton" },
  { city: "Edmonton", country: "Canada", countryCode: "CA", timezone: "America/Edmonton" },
  { city: "Ottawa", country: "Canada", countryCode: "CA", timezone: "America/Toronto" },
  { city: "Winnipeg", country: "Canada", countryCode: "CA", timezone: "America/Winnipeg" },
  { city: "Quebec City", country: "Canada", countryCode: "CA", timezone: "America/Toronto" },
  { city: "Hamilton", country: "Canada", countryCode: "CA", timezone: "America/Toronto" },
  { city: "Victoria", country: "Canada", countryCode: "CA", timezone: "America/Vancouver" },

  // Mexico
  { city: "Mexico City", country: "Mexico", countryCode: "MX", timezone: "America/Mexico_City" },
  { city: "Guadalajara", country: "Mexico", countryCode: "MX", timezone: "America/Mexico_City" },
  { city: "Monterrey", country: "Mexico", countryCode: "MX", timezone: "America/Monterrey" },
  { city: "Puebla", country: "Mexico", countryCode: "MX", timezone: "America/Mexico_City" },
  { city: "Tijuana", country: "Mexico", countryCode: "MX", timezone: "America/Tijuana" },
  { city: "Cancún", country: "Mexico", countryCode: "MX", timezone: "America/Cancun" },

  // United Kingdom
  { city: "London", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Birmingham", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Manchester", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Glasgow", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Liverpool", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Edinburgh", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Leeds", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Bristol", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Sheffield", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Cardiff", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Belfast", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Newcastle", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Nottingham", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Cambridge", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { city: "Oxford", country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },

  // Germany
  { city: "Berlin", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Hamburg", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Munich", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Cologne", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Frankfurt", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Stuttgart", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Düsseldorf", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Leipzig", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Dortmund", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Essen", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Bremen", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Dresden", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Hanover", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },
  { city: "Nuremberg", country: "Germany", countryCode: "DE", timezone: "Europe/Berlin" },

  // France
  { city: "Paris", country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { city: "Marseille", country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { city: "Lyon", country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { city: "Toulouse", country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { city: "Nice", country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { city: "Nantes", country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { city: "Strasbourg", country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { city: "Montpellier", country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { city: "Bordeaux", country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { city: "Lille", country: "France", countryCode: "FR", timezone: "Europe/Paris" },

  // Spain
  { city: "Madrid", country: "Spain", countryCode: "ES", timezone: "Europe/Madrid" },
  { city: "Barcelona", country: "Spain", countryCode: "ES", timezone: "Europe/Madrid" },
  { city: "Valencia", country: "Spain", countryCode: "ES", timezone: "Europe/Madrid" },
  { city: "Seville", country: "Spain", countryCode: "ES", timezone: "Europe/Madrid" },
  { city: "Zaragoza", country: "Spain", countryCode: "ES", timezone: "Europe/Madrid" },
  { city: "Málaga", country: "Spain", countryCode: "ES", timezone: "Europe/Madrid" },
  { city: "Bilbao", country: "Spain", countryCode: "ES", timezone: "Europe/Madrid" },
  { city: "Palma de Mallorca", country: "Spain", countryCode: "ES", timezone: "Europe/Madrid" },

  // Italy
  { city: "Rome", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },
  { city: "Milan", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },
  { city: "Naples", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },
  { city: "Turin", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },
  { city: "Palermo", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },
  { city: "Genoa", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },
  { city: "Bologna", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },
  { city: "Florence", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },
  { city: "Venice", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },
  { city: "Verona", country: "Italy", countryCode: "IT", timezone: "Europe/Rome" },

  // Netherlands
  { city: "Amsterdam", country: "Netherlands", countryCode: "NL", timezone: "Europe/Amsterdam" },
  { city: "Rotterdam", country: "Netherlands", countryCode: "NL", timezone: "Europe/Amsterdam" },
  { city: "The Hague", country: "Netherlands", countryCode: "NL", timezone: "Europe/Amsterdam" },
  { city: "Utrecht", country: "Netherlands", countryCode: "NL", timezone: "Europe/Amsterdam" },
  { city: "Eindhoven", country: "Netherlands", countryCode: "NL", timezone: "Europe/Amsterdam" },

  // Belgium
  { city: "Brussels", country: "Belgium", countryCode: "BE", timezone: "Europe/Brussels" },
  { city: "Antwerp", country: "Belgium", countryCode: "BE", timezone: "Europe/Brussels" },
  { city: "Ghent", country: "Belgium", countryCode: "BE", timezone: "Europe/Brussels" },
  { city: "Bruges", country: "Belgium", countryCode: "BE", timezone: "Europe/Brussels" },

  // Switzerland
  { city: "Zurich", country: "Switzerland", countryCode: "CH", timezone: "Europe/Zurich" },
  { city: "Geneva", country: "Switzerland", countryCode: "CH", timezone: "Europe/Zurich" },
  { city: "Basel", country: "Switzerland", countryCode: "CH", timezone: "Europe/Zurich" },
  { city: "Bern", country: "Switzerland", countryCode: "CH", timezone: "Europe/Zurich" },
  { city: "Lausanne", country: "Switzerland", countryCode: "CH", timezone: "Europe/Zurich" },

  // Austria
  { city: "Vienna", country: "Austria", countryCode: "AT", timezone: "Europe/Vienna" },
  { city: "Salzburg", country: "Austria", countryCode: "AT", timezone: "Europe/Vienna" },
  { city: "Innsbruck", country: "Austria", countryCode: "AT", timezone: "Europe/Vienna" },
  { city: "Graz", country: "Austria", countryCode: "AT", timezone: "Europe/Vienna" },

  // Portugal
  { city: "Lisbon", country: "Portugal", countryCode: "PT", timezone: "Europe/Lisbon" },
  { city: "Porto", country: "Portugal", countryCode: "PT", timezone: "Europe/Lisbon" },
  { city: "Braga", country: "Portugal", countryCode: "PT", timezone: "Europe/Lisbon" },

  // Ireland
  { city: "Dublin", country: "Ireland", countryCode: "IE", timezone: "Europe/Dublin" },
  { city: "Cork", country: "Ireland", countryCode: "IE", timezone: "Europe/Dublin" },
  { city: "Galway", country: "Ireland", countryCode: "IE", timezone: "Europe/Dublin" },

  // Poland
  { city: "Warsaw", country: "Poland", countryCode: "PL", timezone: "Europe/Warsaw" },
  { city: "Kraków", country: "Poland", countryCode: "PL", timezone: "Europe/Warsaw" },
  { city: "Łódź", country: "Poland", countryCode: "PL", timezone: "Europe/Warsaw" },
  { city: "Wrocław", country: "Poland", countryCode: "PL", timezone: "Europe/Warsaw" },
  { city: "Poznań", country: "Poland", countryCode: "PL", timezone: "Europe/Warsaw" },
  { city: "Gdańsk", country: "Poland", countryCode: "PL", timezone: "Europe/Warsaw" },

  // Czech Republic
  { city: "Prague", country: "Czech Republic", countryCode: "CZ", timezone: "Europe/Prague" },
  { city: "Brno", country: "Czech Republic", countryCode: "CZ", timezone: "Europe/Prague" },
  { city: "Ostrava", country: "Czech Republic", countryCode: "CZ", timezone: "Europe/Prague" },

  // Hungary
  { city: "Budapest", country: "Hungary", countryCode: "HU", timezone: "Europe/Budapest" },
  { city: "Debrecen", country: "Hungary", countryCode: "HU", timezone: "Europe/Budapest" },

  // Greece
  { city: "Athens", country: "Greece", countryCode: "GR", timezone: "Europe/Athens" },
  { city: "Thessaloniki", country: "Greece", countryCode: "GR", timezone: "Europe/Athens" },

  // Romania
  { city: "Bucharest", country: "Romania", countryCode: "RO", timezone: "Europe/Bucharest" },
  { city: "Cluj-Napoca", country: "Romania", countryCode: "RO", timezone: "Europe/Bucharest" },

  // Bulgaria
  { city: "Sofia", country: "Bulgaria", countryCode: "BG", timezone: "Europe/Sofia" },
  { city: "Plovdiv", country: "Bulgaria", countryCode: "BG", timezone: "Europe/Sofia" },

  // Croatia
  { city: "Zagreb", country: "Croatia", countryCode: "HR", timezone: "Europe/Zagreb" },
  { city: "Split", country: "Croatia", countryCode: "HR", timezone: "Europe/Zagreb" },
  { city: "Dubrovnik", country: "Croatia", countryCode: "HR", timezone: "Europe/Zagreb" },

  // Serbia
  { city: "Belgrade", country: "Serbia", countryCode: "RS", timezone: "Europe/Belgrade" },
  { city: "Novi Sad", country: "Serbia", countryCode: "RS", timezone: "Europe/Belgrade" },

  // Slovenia
  { city: "Ljubljana", country: "Slovenia", countryCode: "SI", timezone: "Europe/Ljubljana" },

  // Slovakia
  { city: "Bratislava", country: "Slovakia", countryCode: "SK", timezone: "Europe/Bratislava" },

  // Nordic Countries
  { city: "Stockholm", country: "Sweden", countryCode: "SE", timezone: "Europe/Stockholm" },
  { city: "Gothenburg", country: "Sweden", countryCode: "SE", timezone: "Europe/Stockholm" },
  { city: "Malmö", country: "Sweden", countryCode: "SE", timezone: "Europe/Stockholm" },
  { city: "Copenhagen", country: "Denmark", countryCode: "DK", timezone: "Europe/Copenhagen" },
  { city: "Aarhus", country: "Denmark", countryCode: "DK", timezone: "Europe/Copenhagen" },
  { city: "Oslo", country: "Norway", countryCode: "NO", timezone: "Europe/Oslo" },
  { city: "Bergen", country: "Norway", countryCode: "NO", timezone: "Europe/Oslo" },
  { city: "Trondheim", country: "Norway", countryCode: "NO", timezone: "Europe/Oslo" },
  { city: "Helsinki", country: "Finland", countryCode: "FI", timezone: "Europe/Helsinki" },
  { city: "Tampere", country: "Finland", countryCode: "FI", timezone: "Europe/Helsinki" },
  { city: "Reykjavik", country: "Iceland", countryCode: "IS", timezone: "Atlantic/Reykjavik" },

  // Baltic States
  { city: "Tallinn", country: "Estonia", countryCode: "EE", timezone: "Europe/Tallinn" },
  { city: "Riga", country: "Latvia", countryCode: "LV", timezone: "Europe/Riga" },
  { city: "Vilnius", country: "Lithuania", countryCode: "LT", timezone: "Europe/Vilnius" },

  // Russia
  { city: "Moscow", country: "Russia", countryCode: "RU", timezone: "Europe/Moscow" },
  { city: "Saint Petersburg", country: "Russia", countryCode: "RU", timezone: "Europe/Moscow" },
  { city: "Novosibirsk", country: "Russia", countryCode: "RU", timezone: "Asia/Novosibirsk" },
  { city: "Yekaterinburg", country: "Russia", countryCode: "RU", timezone: "Asia/Yekaterinburg" },
  { city: "Kazan", country: "Russia", countryCode: "RU", timezone: "Europe/Moscow" },
  { city: "Vladivostok", country: "Russia", countryCode: "RU", timezone: "Asia/Vladivostok" },

  // Ukraine
  { city: "Kyiv", country: "Ukraine", countryCode: "UA", timezone: "Europe/Kyiv" },
  { city: "Kharkiv", country: "Ukraine", countryCode: "UA", timezone: "Europe/Kyiv" },
  { city: "Odesa", country: "Ukraine", countryCode: "UA", timezone: "Europe/Kyiv" },
  { city: "Lviv", country: "Ukraine", countryCode: "UA", timezone: "Europe/Kyiv" },

  // Turkey
  { city: "Istanbul", country: "Turkey", countryCode: "TR", timezone: "Europe/Istanbul" },
  { city: "Ankara", country: "Turkey", countryCode: "TR", timezone: "Europe/Istanbul" },
  { city: "Izmir", country: "Turkey", countryCode: "TR", timezone: "Europe/Istanbul" },
  { city: "Antalya", country: "Turkey", countryCode: "TR", timezone: "Europe/Istanbul" },

  // Israel
  { city: "Tel Aviv", country: "Israel", countryCode: "IL", timezone: "Asia/Jerusalem" },
  { city: "Jerusalem", country: "Israel", countryCode: "IL", timezone: "Asia/Jerusalem" },
  { city: "Haifa", country: "Israel", countryCode: "IL", timezone: "Asia/Jerusalem" },

  // United Arab Emirates
  { city: "Dubai", country: "United Arab Emirates", countryCode: "AE", timezone: "Asia/Dubai" },
  { city: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE", timezone: "Asia/Dubai" },

  // Saudi Arabia
  { city: "Riyadh", country: "Saudi Arabia", countryCode: "SA", timezone: "Asia/Riyadh" },
  { city: "Jeddah", country: "Saudi Arabia", countryCode: "SA", timezone: "Asia/Riyadh" },
  { city: "Mecca", country: "Saudi Arabia", countryCode: "SA", timezone: "Asia/Riyadh" },

  // Qatar
  { city: "Doha", country: "Qatar", countryCode: "QA", timezone: "Asia/Qatar" },

  // Kuwait
  { city: "Kuwait City", country: "Kuwait", countryCode: "KW", timezone: "Asia/Kuwait" },

  // Bahrain
  { city: "Manama", country: "Bahrain", countryCode: "BH", timezone: "Asia/Bahrain" },

  // Oman
  { city: "Muscat", country: "Oman", countryCode: "OM", timezone: "Asia/Muscat" },

  // Iran
  { city: "Tehran", country: "Iran", countryCode: "IR", timezone: "Asia/Tehran" },
  { city: "Isfahan", country: "Iran", countryCode: "IR", timezone: "Asia/Tehran" },

  // India
  { city: "Mumbai", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { city: "Delhi", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { city: "Bangalore", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { city: "Hyderabad", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { city: "Chennai", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { city: "Kolkata", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { city: "Ahmedabad", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { city: "Pune", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { city: "Jaipur", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { city: "Lucknow", country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },

  // Pakistan
  { city: "Karachi", country: "Pakistan", countryCode: "PK", timezone: "Asia/Karachi" },
  { city: "Lahore", country: "Pakistan", countryCode: "PK", timezone: "Asia/Karachi" },
  { city: "Islamabad", country: "Pakistan", countryCode: "PK", timezone: "Asia/Karachi" },

  // Bangladesh
  { city: "Dhaka", country: "Bangladesh", countryCode: "BD", timezone: "Asia/Dhaka" },
  { city: "Chittagong", country: "Bangladesh", countryCode: "BD", timezone: "Asia/Dhaka" },

  // Sri Lanka
  { city: "Colombo", country: "Sri Lanka", countryCode: "LK", timezone: "Asia/Colombo" },

  // Nepal
  { city: "Kathmandu", country: "Nepal", countryCode: "NP", timezone: "Asia/Kathmandu" },

  // China
  { city: "Beijing", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Shanghai", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Guangzhou", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Shenzhen", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Chengdu", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Hangzhou", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Nanjing", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Xi'an", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Chongqing", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Wuhan", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Tianjin", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },
  { city: "Suzhou", country: "China", countryCode: "CN", timezone: "Asia/Shanghai" },

  // Hong Kong & Macau
  { city: "Hong Kong", country: "Hong Kong", countryCode: "HK", timezone: "Asia/Hong_Kong" },
  { city: "Macau", country: "Macau", countryCode: "MO", timezone: "Asia/Macau" },

  // Taiwan
  { city: "Taipei", country: "Taiwan", countryCode: "TW", timezone: "Asia/Taipei" },
  { city: "Kaohsiung", country: "Taiwan", countryCode: "TW", timezone: "Asia/Taipei" },
  { city: "Taichung", country: "Taiwan", countryCode: "TW", timezone: "Asia/Taipei" },

  // Japan
  { city: "Tokyo", country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },
  { city: "Osaka", country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },
  { city: "Yokohama", country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },
  { city: "Nagoya", country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },
  { city: "Sapporo", country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },
  { city: "Fukuoka", country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },
  { city: "Kobe", country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },
  { city: "Kyoto", country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },
  { city: "Hiroshima", country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },

  // South Korea
  { city: "Seoul", country: "South Korea", countryCode: "KR", timezone: "Asia/Seoul" },
  { city: "Busan", country: "South Korea", countryCode: "KR", timezone: "Asia/Seoul" },
  { city: "Incheon", country: "South Korea", countryCode: "KR", timezone: "Asia/Seoul" },
  { city: "Daegu", country: "South Korea", countryCode: "KR", timezone: "Asia/Seoul" },
  { city: "Daejeon", country: "South Korea", countryCode: "KR", timezone: "Asia/Seoul" },

  // Southeast Asia
  { city: "Singapore", country: "Singapore", countryCode: "SG", timezone: "Asia/Singapore" },
  { city: "Kuala Lumpur", country: "Malaysia", countryCode: "MY", timezone: "Asia/Kuala_Lumpur" },
  { city: "Penang", country: "Malaysia", countryCode: "MY", timezone: "Asia/Kuala_Lumpur" },
  { city: "Bangkok", country: "Thailand", countryCode: "TH", timezone: "Asia/Bangkok" },
  { city: "Chiang Mai", country: "Thailand", countryCode: "TH", timezone: "Asia/Bangkok" },
  { city: "Phuket", country: "Thailand", countryCode: "TH", timezone: "Asia/Bangkok" },
  { city: "Jakarta", country: "Indonesia", countryCode: "ID", timezone: "Asia/Jakarta" },
  { city: "Bali", country: "Indonesia", countryCode: "ID", timezone: "Asia/Makassar" },
  { city: "Surabaya", country: "Indonesia", countryCode: "ID", timezone: "Asia/Jakarta" },
  { city: "Bandung", country: "Indonesia", countryCode: "ID", timezone: "Asia/Jakarta" },
  { city: "Manila", country: "Philippines", countryCode: "PH", timezone: "Asia/Manila" },
  { city: "Cebu City", country: "Philippines", countryCode: "PH", timezone: "Asia/Manila" },
  { city: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN", timezone: "Asia/Ho_Chi_Minh" },
  { city: "Hanoi", country: "Vietnam", countryCode: "VN", timezone: "Asia/Ho_Chi_Minh" },
  { city: "Da Nang", country: "Vietnam", countryCode: "VN", timezone: "Asia/Ho_Chi_Minh" },
  { city: "Phnom Penh", country: "Cambodia", countryCode: "KH", timezone: "Asia/Phnom_Penh" },
  { city: "Yangon", country: "Myanmar", countryCode: "MM", timezone: "Asia/Yangon" },

  // Australia
  { city: "Sydney", country: "Australia", countryCode: "AU", timezone: "Australia/Sydney" },
  { city: "Melbourne", country: "Australia", countryCode: "AU", timezone: "Australia/Melbourne" },
  { city: "Brisbane", country: "Australia", countryCode: "AU", timezone: "Australia/Brisbane" },
  { city: "Perth", country: "Australia", countryCode: "AU", timezone: "Australia/Perth" },
  { city: "Adelaide", country: "Australia", countryCode: "AU", timezone: "Australia/Adelaide" },
  { city: "Gold Coast", country: "Australia", countryCode: "AU", timezone: "Australia/Brisbane" },
  { city: "Canberra", country: "Australia", countryCode: "AU", timezone: "Australia/Sydney" },
  { city: "Hobart", country: "Australia", countryCode: "AU", timezone: "Australia/Hobart" },

  // New Zealand
  { city: "Auckland", country: "New Zealand", countryCode: "NZ", timezone: "Pacific/Auckland" },
  { city: "Wellington", country: "New Zealand", countryCode: "NZ", timezone: "Pacific/Auckland" },
  { city: "Christchurch", country: "New Zealand", countryCode: "NZ", timezone: "Pacific/Auckland" },
  { city: "Queenstown", country: "New Zealand", countryCode: "NZ", timezone: "Pacific/Auckland" },

  // South America
  { city: "São Paulo", country: "Brazil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { city: "Rio de Janeiro", country: "Brazil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { city: "Brasília", country: "Brazil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { city: "Salvador", country: "Brazil", countryCode: "BR", timezone: "America/Bahia" },
  { city: "Fortaleza", country: "Brazil", countryCode: "BR", timezone: "America/Fortaleza" },
  { city: "Belo Horizonte", country: "Brazil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { city: "Curitiba", country: "Brazil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { city: "Porto Alegre", country: "Brazil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { city: "Buenos Aires", country: "Argentina", countryCode: "AR", timezone: "America/Argentina/Buenos_Aires" },
  { city: "Córdoba", country: "Argentina", countryCode: "AR", timezone: "America/Argentina/Cordoba" },
  { city: "Mendoza", country: "Argentina", countryCode: "AR", timezone: "America/Argentina/Mendoza" },
  { city: "Santiago", country: "Chile", countryCode: "CL", timezone: "America/Santiago" },
  { city: "Valparaíso", country: "Chile", countryCode: "CL", timezone: "America/Santiago" },
  { city: "Lima", country: "Peru", countryCode: "PE", timezone: "America/Lima" },
  { city: "Cusco", country: "Peru", countryCode: "PE", timezone: "America/Lima" },
  { city: "Bogotá", country: "Colombia", countryCode: "CO", timezone: "America/Bogota" },
  { city: "Medellín", country: "Colombia", countryCode: "CO", timezone: "America/Bogota" },
  { city: "Cartagena", country: "Colombia", countryCode: "CO", timezone: "America/Bogota" },
  { city: "Cali", country: "Colombia", countryCode: "CO", timezone: "America/Bogota" },
  { city: "Caracas", country: "Venezuela", countryCode: "VE", timezone: "America/Caracas" },
  { city: "Quito", country: "Ecuador", countryCode: "EC", timezone: "America/Guayaquil" },
  { city: "Guayaquil", country: "Ecuador", countryCode: "EC", timezone: "America/Guayaquil" },
  { city: "Montevideo", country: "Uruguay", countryCode: "UY", timezone: "America/Montevideo" },
  { city: "La Paz", country: "Bolivia", countryCode: "BO", timezone: "America/La_Paz" },
  { city: "Asunción", country: "Paraguay", countryCode: "PY", timezone: "America/Asuncion" },

  // Central America & Caribbean
  { city: "Panama City", country: "Panama", countryCode: "PA", timezone: "America/Panama" },
  { city: "San José", country: "Costa Rica", countryCode: "CR", timezone: "America/Costa_Rica" },
  { city: "Guatemala City", country: "Guatemala", countryCode: "GT", timezone: "America/Guatemala" },
  { city: "Havana", country: "Cuba", countryCode: "CU", timezone: "America/Havana" },
  { city: "Santo Domingo", country: "Dominican Republic", countryCode: "DO", timezone: "America/Santo_Domingo" },
  { city: "San Juan", country: "Puerto Rico", countryCode: "PR", timezone: "America/Puerto_Rico" },
  { city: "Kingston", country: "Jamaica", countryCode: "JM", timezone: "America/Jamaica" },
  { city: "Nassau", country: "Bahamas", countryCode: "BS", timezone: "America/Nassau" },
  { city: "Port of Spain", country: "Trinidad and Tobago", countryCode: "TT", timezone: "America/Port_of_Spain" },

  // Africa
  { city: "Cairo", country: "Egypt", countryCode: "EG", timezone: "Africa/Cairo" },
  { city: "Alexandria", country: "Egypt", countryCode: "EG", timezone: "Africa/Cairo" },
  { city: "Lagos", country: "Nigeria", countryCode: "NG", timezone: "Africa/Lagos" },
  { city: "Abuja", country: "Nigeria", countryCode: "NG", timezone: "Africa/Lagos" },
  { city: "Johannesburg", country: "South Africa", countryCode: "ZA", timezone: "Africa/Johannesburg" },
  { city: "Cape Town", country: "South Africa", countryCode: "ZA", timezone: "Africa/Johannesburg" },
  { city: "Durban", country: "South Africa", countryCode: "ZA", timezone: "Africa/Johannesburg" },
  { city: "Pretoria", country: "South Africa", countryCode: "ZA", timezone: "Africa/Johannesburg" },
  { city: "Nairobi", country: "Kenya", countryCode: "KE", timezone: "Africa/Nairobi" },
  { city: "Mombasa", country: "Kenya", countryCode: "KE", timezone: "Africa/Nairobi" },
  { city: "Casablanca", country: "Morocco", countryCode: "MA", timezone: "Africa/Casablanca" },
  { city: "Marrakech", country: "Morocco", countryCode: "MA", timezone: "Africa/Casablanca" },
  { city: "Rabat", country: "Morocco", countryCode: "MA", timezone: "Africa/Casablanca" },
  { city: "Tunis", country: "Tunisia", countryCode: "TN", timezone: "Africa/Tunis" },
  { city: "Algiers", country: "Algeria", countryCode: "DZ", timezone: "Africa/Algiers" },
  { city: "Accra", country: "Ghana", countryCode: "GH", timezone: "Africa/Accra" },
  { city: "Addis Ababa", country: "Ethiopia", countryCode: "ET", timezone: "Africa/Addis_Ababa" },
  { city: "Dar es Salaam", country: "Tanzania", countryCode: "TZ", timezone: "Africa/Dar_es_Salaam" },
  { city: "Kampala", country: "Uganda", countryCode: "UG", timezone: "Africa/Kampala" },
  { city: "Dakar", country: "Senegal", countryCode: "SN", timezone: "Africa/Dakar" },
  { city: "Lusaka", country: "Zambia", countryCode: "ZM", timezone: "Africa/Lusaka" },
  { city: "Harare", country: "Zimbabwe", countryCode: "ZW", timezone: "Africa/Harare" },
  { city: "Kigali", country: "Rwanda", countryCode: "RW", timezone: "Africa/Kigali" },
  { city: "Mauritius", country: "Mauritius", countryCode: "MU", timezone: "Indian/Mauritius" },

  // Central Asia
  { city: "Almaty", country: "Kazakhstan", countryCode: "KZ", timezone: "Asia/Almaty" },
  { city: "Astana", country: "Kazakhstan", countryCode: "KZ", timezone: "Asia/Almaty" },
  { city: "Tashkent", country: "Uzbekistan", countryCode: "UZ", timezone: "Asia/Tashkent" },
  { city: "Baku", country: "Azerbaijan", countryCode: "AZ", timezone: "Asia/Baku" },
  { city: "Tbilisi", country: "Georgia", countryCode: "GE", timezone: "Asia/Tbilisi" },
  { city: "Yerevan", country: "Armenia", countryCode: "AM", timezone: "Asia/Yerevan" },

  // Other
  { city: "Monaco", country: "Monaco", countryCode: "MC", timezone: "Europe/Monaco" },
  { city: "Luxembourg City", country: "Luxembourg", countryCode: "LU", timezone: "Europe/Luxembourg" },
  { city: "Valletta", country: "Malta", countryCode: "MT", timezone: "Europe/Malta" },
  { city: "Nicosia", country: "Cyprus", countryCode: "CY", timezone: "Asia/Nicosia" },
  { city: "Andorra la Vella", country: "Andorra", countryCode: "AD", timezone: "Europe/Andorra" },
]

// Search cities by query string (case-insensitive)
export function searchCities(query: string, limit = 10): City[] {
  if (!query || query.length < 2) return []
  
  const lowerQuery = query.toLowerCase()
  
  return cities
    .filter(city => 
      city.city.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit)
}

// Find a city by exact name (case-insensitive)
export function findCityByName(cityName: string): City | undefined {
  const lowerName = cityName.toLowerCase()
  return cities.find(city => city.city.toLowerCase() === lowerName)
}
