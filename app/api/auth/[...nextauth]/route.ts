import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

// Валідація змінних середовища
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('⚠️ GOOGLE_CLIENT_ID не налаштовано');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.error('⚠️ GOOGLE_CLIENT_SECRET не налаштовано');
}

if (!process.env.NEXTAUTH_SECRET) {
  console.error('⚠️ NEXTAUTH_SECRET не налаштовано');
}

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
  console.error('⚠️ NEXTAUTH_URL не налаштовано для production');
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Дозволяє працювати з різними доменами
});

export const { GET, POST } = handlers;

