import { writeFile, readFile } from 'fs/promises';

export async function readData(filename: string) {

  const filePath = `./data/${filename}.json`; // Pastikan path ini benar
  let existingData = [];

  try {
    const data = await readFile(filePath, 'utf8');
    existingData = JSON.parse(data);
    return {
      filePath,
      existingData: existingData
    }

  } catch (error: any) {
    // Abaikan error jika file tidak ada
    // if (error.code !== 'ENOENT') {
    return {
      filePath,
      existingData: null
    }
    // }
  }

}