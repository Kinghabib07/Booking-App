import getCurrentUser from './getCurrentUser'
import { readData } from '../libs/readfile';
import { Listing } from '@/app/types';

export default async function getFavoriteListings() {
  try {
    const { existingData } = await readData('listing')

    if (!existingData) {
      throw new Error('Data not found');
    }

    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return []
    }

    const favoriteIds = currentUser.favoriteIds || [];
    const favorites = await existingData.filter((listing: Listing) => favoriteIds.includes(listing.id));


    // const safeFavorites = favorites.map((favorite:any) => ({
    //   ...favorite,
    //   createdAt: favorite.createdAt.toISOString()
    // }))

    return favorites;

  } catch (error: any) {
    throw new Error(error)
  }
}