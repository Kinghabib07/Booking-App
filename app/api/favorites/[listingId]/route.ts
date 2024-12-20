import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { writeFile } from 'fs/promises';
import { readData } from "@/app/libs/readfile";
import { PathLike } from "fs";
import { User } from "@/app/types";

interface IParams {
  listingId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  const { filePath, existingData } = await readData('user');
  if (!existingData) {
    throw new Error('Data not found');
  }
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const { listingId } = params

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID')
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])]

  favoriteIds.push(listingId)

  const findUser = existingData.find((user: User) => user.id === currentUser.id);
  
  if (!findUser) {
    throw new Error('User not found');
  }
  const userNotIncludeCurrentUser = existingData.filter((user: User) => user.id !== currentUser.id);

  findUser.favoriteIds = favoriteIds
  const appendUser = [...userNotIncludeCurrentUser, findUser]
  await writeFile(filePath, JSON.stringify(appendUser, null, 2));

  return NextResponse.json(findUser)

}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const { filePath, existingData } = await readData('user');
  if (!existingData) {
    throw new Error('Data not found');
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error()
  }

  let { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID')
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])]

  favoriteIds = favoriteIds.filter((id) => id !== listingId)

  const findUser = existingData.find((user: User) => user.id === currentUser.id);

  if (!findUser) {
    throw new Error('User not found');
  }

  const userNotIncludeCurrentUser = existingData.filter((user: User) => user.id !== currentUser.id);

  const newUserWithFavorites = { ...findUser, favoriteIds };
  const appendUser = [...userNotIncludeCurrentUser, newUserWithFavorites]

  await writeFile(filePath, JSON.stringify(appendUser, null, 2));

  return NextResponse.json(newUserWithFavorites)

}