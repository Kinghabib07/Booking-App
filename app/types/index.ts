/**
 * Model User
 * 
 */
export type User = {
  id: string
  name: string | null
  email: string | null
  hashedPassword: string | null
  createdAt: Date
  updatedAt: Date
  favoriteIds: string[]
}
/**
 * Model Listing
 * 
 */
export type Listing = {
  id: string
  title: string
  description: string
  imageSrc: string
  createdAt: Date
  category: string
  roomCount: number
  bathroomCount: number
  guestCount: number
  locationValue: string
  userId: string
  price: number
}

/**
 * Model Reservation
 * 
 */
export type Reservation = {
  id: string
  userId: string
  listingId: string
  startDate: string
  endDate: string
  totalPrice: number
  createdAt: Date
}