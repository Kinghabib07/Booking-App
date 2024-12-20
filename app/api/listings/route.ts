import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { readData } from '@/app/libs/readfile';
import { writeFile } from 'fs/promises';
import { PathLike } from 'fs';
import { v4 as uuidv4 } from 'uuid'; // Untuk generate ID unik


export async function POST(
  request: Request
) {
  const { filePath, existingData } = await readData('listing')

  if (!existingData) {
    throw new Error('Data not found');
  }

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const body = await request.json()

  const { title, description, imageSrc, category, guestCount, roomCount, bathroomCount, location, price } = body

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error()
    }
  })
  const newListing = {
    id: uuidv4(),
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    locationValue: location.value,
    price: parseInt(price, 10),
    userId: currentUser.id,
    createdAt: new Date().toISOString(),
  }

  existingData.push(newListing)

  await writeFile(filePath, JSON.stringify(existingData, null, 2));

  return NextResponse.json(newListing)
}