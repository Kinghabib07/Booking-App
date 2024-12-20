import getCurrentUser from '@/app/actions/getCurrentUser';
import { readData } from '@/app/libs/readfile';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // Untuk generate ID unik


export async function POST(
  request: Request,
) {

  const { filePath, existingData } = await readData('reservation')

  if (!existingData) {
    throw new Error('Data not found');
  }

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const body = await request.json()

  const {
    listingId,
    startDate,
    endDate,
    totalPrice
  } = body

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error()
  }
  const newReservation = {
    id: uuidv4(),
    userId: currentUser.id,
    listingId,
    startDate,
    endDate,
    totalPrice,
    createdAt: new Date().toISOString()
  }
  console.log({newReservation})
  const appendData = [...existingData, newReservation]
  await writeFile(filePath, JSON.stringify(appendData, null, 2));

  return NextResponse.json(newReservation)
} 