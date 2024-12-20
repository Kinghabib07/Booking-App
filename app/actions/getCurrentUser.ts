import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { readData } from "../libs/readfile";
import { User } from "@/app/types";

export async function getSession() {
  return await getServerSession(authOptions)
}

export default async function getCurrentUser() {
  try {
    const { existingData } = await readData('user')

    if (!existingData) {
      throw new Error('Data not found');
    }

    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    // Cari user berdasarkan email dari sesi
    const currentUser = existingData.find((user: User) => user.email === session?.user?.email);

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt?.$date || null,
      updatedAt: currentUser.updatedAt?.$date || null,
    };
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    return null;
  }
}