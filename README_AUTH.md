# Налаштування аутентифікації та чату

## Крок 1: Налаштування Google OAuth

1. Перейдіть на [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проєкт або виберіть існуючий
3. Увімкніть Google+ API
4. Перейдіть до "Credentials" → "Create Credentials" → "OAuth client ID"
5. Виберіть "Web application"
6. Додайте Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (для розробки)
   - `https://yourdomain.com/api/auth/callback/google` (для продакшену)
7. Скопіюйте Client ID та Client Secret

## Крок 2: Налаштування бази даних

Проєкт використовує Supabase (PostgreSQL). Детальні інструкції дивіться в [README_SUPABASE.md](./README_SUPABASE.md).

## Крок 3: Створення .env.local файлу

Створіть файл `.env.local` в корені проєкту з наступним вмістом:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"

# Google OAuth
GOOGLE_CLIENT_ID=ваш_google_client_id
GOOGLE_CLIENT_SECRET=ваш_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=будь-який_випадковий_рядок_для_шифрування_сесій

# OpenRouter API (для бота в чаті)
OPENROUTER_API_KEY=ваш_openrouter_api_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Для генерації NEXTAUTH_SECRET виконайте:
```bash
openssl rand -base64 32
```

## Крок 4: Запуск проєкту

```bash
npm run dev
```

## Функціонал

- ✅ Реєстрація/вхід через Google OAuth
- ✅ Чат для зареєстрованих користувачів
- ✅ Зберігання повідомлень у базі даних Supabase (PostgreSQL)
- ✅ Автоматичне оновлення повідомлень кожні 3 секунди
- ✅ Відображення імені та аватара користувача

## Структура бази даних

- `User` - користувачі
- `Account` - облікові записи OAuth
- `Session` - сесії користувачів
- `Message` - повідомлення чату

