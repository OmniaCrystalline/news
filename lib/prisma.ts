import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Перевірка підключення до бази даних при старті (тільки в development)
if (process.env.NODE_ENV === 'development') {
  prisma.$connect().catch((error) => {
    console.error('Помилка підключення до бази даних:', error);
    console.error('Переконайтеся, що:');
    console.error('1. DATABASE_URL правильно налаштований в .env.local');
    console.error('2. Таблиці створені в Supabase (виконайте prisma/supabase_init.sql)');
  });
}

