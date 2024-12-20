import { readData } from '../libs/readfile';
import { Listing, User } from '@/app/types';

interface IParams {
  listingId?: string;
}

export default async function getListingById(
  params: IParams
) {
  try {
    const { existingData } = await readData('listing')
    if (!existingData) {
      throw new Error('Data not found')
    }
    const { existingData: dataUser } = await readData('user')

    const { listingId } = params

    const listing = await existingData.find((listing: Listing) => listing.id === listingId);
    const user = await dataUser.find((user: User) => user.id === listing.userId);

    if (!listing || !user) {
      return null
    }

    return {
      ...listing,
      user
    }

  } catch (error: any) {
    throw new Error(error)
  }
}