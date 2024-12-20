import { readData } from '../libs/readfile';
import { Reservation } from '@/app/types';


interface IParams {
  listingId?: string
  userId?: string
  authorId?: string;
}

export default async function getReservations(
  params: IParams
) {

  try {

    const { existingData: listings } = await readData('listing')
    const { existingData } = await readData('reservation')

    if (!existingData) {
      throw new Error('Data not found')
    }

    const { listingId, userId, authorId } = params;
    console.log({params})
    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      
      query.userId = userId;
    }

    if (authorId) {
      query.authorId = authorId;
    }

    // Buat lookup table untuk listings
    const listingMap = new Map();
    listings.forEach((listing: any) => {
      listingMap.set(listing.id, listing);
    });

    // Filter reservations
    const filteredReservations = existingData.filter((reservation: Reservation) => {
      if (query.listingId && reservation.listingId !== query.listingId) return false;
      if (query.userId && reservation.userId !== query.userId) return false;

      if (query.authorId) {
        const listing = listingMap.get(reservation.listingId);
        if (!listing || listing.userId !== query.authorId) return false;
      }

      return true;
    });

    // Gabungkan reservation dan listing
    const reservationAndListing = filteredReservations.map((reservation: Reservation) => {
      const listing = listingMap.get(reservation.listingId);
      return { ...reservation, listing };
    });

    return reservationAndListing;
  } catch (error: any) {
    throw new Error(error)
  }
}