import getCurrentUser from "@/app/actions/getCurrentUser";
import { readData } from "@/app/libs/readfile";
import { Listing } from "@/app/types";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";


interface IParams {
  listingId?: string
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const {filePath,existingData} = await readData('listing')

  if (!existingData) {
    throw new Error('Data not found');
  }
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const { listingId } = params

  if (!listingId && typeof listingId !== 'string') {
    throw new Error('Invalid ID')
  }
  const deletedListing = await existingData.find((listing:Listing) => listing.id === listingId && listing.userId === currentUser.id)

  const newListingData = await existingData.filter((listing:Listing) => listing.id !== listingId && listing.userId !== currentUser.id)
  await writeFile(filePath, JSON.stringify(newListingData, null, 2));

  return NextResponse.json(deletedListing)
}