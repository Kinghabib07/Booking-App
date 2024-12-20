import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { readData } from "@/app/libs/readfile";
import { writeFile } from "fs/promises";
import { Reservation } from "@/app/types";

interface IParams {
  reservationId?: string
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const { filePath, existingData } = await readData('reservation')

  if (!existingData) {
    throw new Error('Data not found');
  }

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const { reservationId } = params

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('Invalid ID')
  }

  const deletedReservation = await existingData.find((reservation: Reservation) => reservation.id === reservationId)
  if (!deletedReservation) {
    throw new Error('Reservation not found')
  }
  const currentReservation = await existingData.filter((reservation: Reservation) => reservation.id !== reservationId)

  await writeFile(filePath, JSON.stringify(currentReservation, null, 2));

  return NextResponse.json(deletedReservation)
}