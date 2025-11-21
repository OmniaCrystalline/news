# Налаштування Supabase

Цей проєкт використовує Supabase (PostgreSQL) для локальної розробки та production.

## Крок 1: Створення проєкту на Supabase

1. Перейдіть на [Supabase](https://supabase.com/)
2. Створіть новий проєкт або увійдіть у існуючий
3. Оберіть регіон (рекомендовано: найближчий до вашого сервера)
4. Створіть проєкт

## Крок 2: Отримання Connection String (DATABASE_URL)

**Важливо:** Для Prisma потрібен `DATABASE_URL` (connection string), а не API key!

1. У вашому Supabase проєкті перейдіть до **Settings** → **Database**
2. Знайдіть секцію **Connection string** (НЕ Connection pooling)
3. Оберіть **URI** та скопіюйте connection string
4. Формат буде таким:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   або
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

**Примітка:** 
- API key (`SUPABASE_ANON_KEY` або `SUPABASE_SERVICE_ROLE_KEY`) використовується для Supabase REST API або клієнтської бібліотеки, але НЕ для Prisma
- Для Prisma використовується саме `DATABASE_URL` (PostgreSQL connection string)

## Крок 3: Налаштування змінних середовища

### Для локальної розробки та Production

Додайте `DATABASE_URL` в `.env.local` для локальної розробки:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Важливо:** Замініть `[YOUR-PASSWORD]` та `[PROJECT-REF]` на ваші реальні значення.

## Крок 4: Застосування міграцій до Supabase

### Варіант 1: Через Supabase Dashboard (рекомендовано, якщо Prisma команди зависають)

1. Відкрийте ваш Supabase проєкт
2. Перейдіть до **SQL Editor**
3. Відкрийте файл `prisma/supabase_init.sql` з проєкту
4. Скопіюйте весь SQL код
5. Вставте в SQL Editor та натисніть **Run**

Це створить всі необхідні таблиці вручну.

### Варіант 2: Через Prisma CLI

1. Встановіть залежності:
   ```bash
   npm install
   ```

2. Застосуйте міграції до Supabase:
   ```bash
   npx prisma migrate deploy
   ```

   Або якщо це перший раз:
   ```bash
   npx prisma db push
   ```

3. Перевірте підключення:
   ```bash
   npx prisma studio
   ```

**Примітка:** Якщо Prisma команди зависають або не підключаються, використайте Варіант 1 (через SQL Editor).

## Крок 5: Налаштування на Vercel

Детальні інструкції дивіться в [README_VERCEL.md](./README_VERCEL.md).

**Коротко:**
1. Перейдіть до вашого проєкту на Vercel
2. Перейдіть до **Settings** → **Environment Variables**
3. Додайте всі необхідні змінні середовища (дивіться README_VERCEL.md)
4. **Важливо:** Використовуйте Connection Pooling string для `DATABASE_URL` (порт 6543)
5. Перезапустіть deployment

## Переваги Supabase

- ✅ PostgreSQL база даних (потужна та надійна)
- ✅ Автоматичні резервні копії
- ✅ Масштабованість
- ✅ Безпека на рівні бази даних
- ✅ Реальний час (якщо потрібно в майбутньому)
- ✅ Безкоштовний tier для початку

## Міграція з SQLite на Supabase

Якщо у вас вже є дані в SQLite:

1. Експортуйте дані з SQLite
2. Імпортуйте до Supabase через Prisma Studio або SQL
3. Або використайте `prisma migrate` для автоматичної міграції

## Troubleshooting

### Помилка підключення

Перевірте:
- Правильність connection string
- Доступність бази даних (перевірте firewall налаштування в Supabase)
- Правильність пароля

### Помилка міграцій

Якщо міграції не застосовуються:
```bash
npx prisma migrate reset  # УВАГА: видалить всі дані!
npx prisma migrate deploy
```

### Connection Pooling

Для production рекомендується використовувати connection pooling. Supabase надає окремий connection string для pooling:
- Перейдіть до **Settings** → **Database** → **Connection Pooling**
- Використовуйте connection string з `:6543` портом замість `:5432`

