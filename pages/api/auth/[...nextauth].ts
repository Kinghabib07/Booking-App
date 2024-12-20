import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt';
import { readData } from "@/app/libs/readfile";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Incorrect email or password');
        }

        try {

          const { existingData: users } = await readData('user');
          if (!users) {
            throw new Error('Data not found');
          }
          // Cari user berdasarkan email
          const user = users.find((u: any) => u.email === credentials.email);
          if (!user || !user.hashedPassword) {
            throw new Error('Incorrect email or password');
          }

          // Cek password
          const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
          if (!isCorrectPassword) {
            throw new Error('Incorrect email or password');
          }

          return user;
        } catch (error: any) {
          console.error('Error during authorization:', error);
          throw new Error(error.message);
        }
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}
export default NextAuth(authOptions)