// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavItem {
  name: string
  icon: string
  path: string
  subItems?: { name: string; path: string }[]
}

// ============================================
// LOCATION TYPES
// ============================================

export interface City {
  id: number
  name: string
}

export interface Province {
  id: number
  name: string
  cities: City[]
}
