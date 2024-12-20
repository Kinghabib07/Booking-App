import { readData } from '../libs/readfile'
import { Listing, Reservation } from '@/app/types'

export interface IListingsParams {
  userId?: string,
  category?: string,
  guestCount?: number,
  roomCount?: number,
  bathroomCount?: number,
  startDate?: string,
  endDate?: string,
  locationValue?: string
}

export default async function getListings(params: IListingsParams) {
  try {
    const { existingData: listingData } = await readData('listing')

    if (!listingData) {
      throw new Error('Data not found')
    }

    const { userId, category, guestCount, roomCount, bathroomCount, locationValue, startDate, endDate } = params

    let query: any = {}

    // Membentuk query berdasarkan params
    if (userId) query.userId = userId
    if (category) query.category = category
    if (guestCount) query.guestCount = { gte: +guestCount }
    if (roomCount) query.roomCount = { gte: +roomCount }
    if (bathroomCount) query.bathroomCount = { gte: +bathroomCount }
    if (locationValue) query.locationValue = locationValue

    // Filter manual pada listingData
    const listings = await listingData.filter((item: (Listing & { reservations: Reservation[] })) => {
      // Kondisi User ID
      if (query.userId && item.userId !== query.userId) return false

      // Kondisi Category
      if (query.category && item.category !== query.category) return false

      // Kondisi Guest Count
      if (query.guestCount && item.guestCount < query.guestCount.gte) return false

      // Kondisi Room Count
      if (query.roomCount && item.roomCount < query.roomCount.gte) return false

      // Kondisi Bathroom Count
      if (query.bathroomCount && item.bathroomCount < query.bathroomCount.gte) return false

      // Kondisi Location Value
      if (query.locationValue && item.locationValue !== query.locationValue) return false

      // Kondisi tanggal jika ada startDate dan endDate
      if (startDate && endDate && item.reservations) {
        const isReserved = item.reservations.some((res: Reservation) => {
          return (
            (res.endDate >= startDate && res.startDate <= endDate) || // Overlap kondisi 1
            (res.startDate <= endDate && res.endDate >= startDate)   // Overlap kondisi 2
          )
        })
        if (isReserved) return false
      }

      return true
    })

    return listings;

  } catch (error: any) {
    throw new Error(error)
  }
}