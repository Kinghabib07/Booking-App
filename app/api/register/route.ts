import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid'; // Untuk generate ID unik
import { readData } from '@/app/libs/readfile';
import { User } from '@/app/types';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  try {

    const { filePath, existingData } = await readData('user');

    if (!existingData) {
      throw new Error('Data not found');
    }

    const emailExists = existingData.some((user: User) => user.email === email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'Pendaftaran gagal, email sudah terdaftar' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      id: uuidv4(),
      name,
      email,
      hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favoriteIds: [],
    };

    // Tambahkan user baru ke array
    existingData.push(newUser);

    // Tulis kembali data ke file JSON
    await writeFile(filePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.error();
  }
}
