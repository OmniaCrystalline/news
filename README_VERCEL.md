# Налаштування на Vercel

Цей гайд допоможе налаштувати проєкт на Vercel для production.

## Необхідні змінні середовища

Додайте наступні змінні середовища в Vercel:

### 1. База даних (Supabase)

```
DATABASE_URL=postgresql://postgres.wzajbsmlubkfwbaqkqrn:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Важливо:** 
- Використовуйте **Connection Pooling** string для production (порт 6543)
- Замініть `[YOUR-PASSWORD]` на ваш пароль бази даних
- Для production рекомендується використовувати pooling connection string

### 2. Google OAuth

```
GOOGLE_CLIENT_ID=ваш_google_client_id
GOOGLE_CLIENT_SECRET=ваш_google_client_secret
```

**Примітка:** У Google Cloud Console додайте Authorized redirect URI:
- `https://your-vercel-domain.vercel.app/api/auth/callback/google`

### 3. NextAuth

```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=ваш_випадковий_рядок_32_символи
```

**Для генерації NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. OpenRouter API (для бота)

```
OPENROUTER_API_KEY=ваш_openrouter_api_key
```

### 5. Site URL

```
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

## Як додати змінні на Vercel

1. Перейдіть до вашого проєкту на [Vercel](https://vercel.com)
2. Перейдіть до **Settings** → **Environment Variables**
3. Додайте кожну змінну:
   - **Name**: назва змінної (наприклад, `DATABASE_URL`)
   - **Value**: значення змінної
   - **Environment**: оберіть `Production`, `Preview`, та `Development` (або тільки `Production`)
4. Натисніть **Save**
5. Після додавання всіх змінних, перейдіть до **Deployments**
6. Натисніть на останній deployment → **Redeploy**

## Перевірка налаштувань

Після deployment перевірте:

1. **База даних**: Переконайтеся, що таблиці створені в Supabase (виконайте `prisma/supabase_init.sql` якщо ще не виконали)
2. **Аутентифікація**: Спробуйте увійти через Google
3. **Чат**: Спробуйте надіслати повідомлення
4. **Бот**: Спробуйте написати `@бот` в чаті

## Troubleshooting

### Помилка 500 на сервері

**Можливі причини:**
1. ❌ `DATABASE_URL` не налаштований або неправильний
2. ❌ Таблиці не створені в Supabase
3. ❌ `NEXTAUTH_SECRET` не налаштований
4. ❌ `NEXTAUTH_URL` не відповідає вашому домену

**Рішення:**
- Перевірте всі змінні середовища в Vercel
- Переконайтеся, що виконали SQL скрипт в Supabase
- Перевірте логи в Vercel Dashboard → **Deployments** → **Functions** → **View Function Logs**

### Помилка підключення до бази даних

**Можливі причини:**
1. ❌ Неправильний `DATABASE_URL`
2. ❌ Firewall блокує з'єднання з Vercel
3. ❌ Використовується прямий connection string замість pooling

**Рішення:**
- Використовуйте Connection Pooling string (порт 6543) для production
- Перевірте налаштування firewall в Supabase (Settings → Database → Connection Pooling)

### Помилка аутентифікації

**Можливі причини:**
1. ❌ `NEXTAUTH_URL` не відповідає домену
2. ❌ `GOOGLE_CLIENT_ID` або `GOOGLE_CLIENT_SECRET` неправильні
3. ❌ Redirect URI не додано в Google Cloud Console

**Рішення:**
- Перевірте, що `NEXTAUTH_URL` точно відповідає вашому Vercel домену
- Додайте правильний redirect URI в Google Cloud Console

## Checklist перед deployment

- [ ] Всі змінні середовища додано в Vercel
- [ ] SQL скрипт виконано в Supabase (таблиці створені)
- [ ] `DATABASE_URL` використовує Connection Pooling (порт 6543)
- [ ] `NEXTAUTH_URL` відповідає вашому Vercel домену
- [ ] Redirect URI додано в Google Cloud Console
- [ ] `NEXTAUTH_SECRET` згенеровано та додано
- [ ] `NEXT_PUBLIC_SITE_URL` відповідає вашому Vercel домену

## Після deployment

1. Перевірте, що сайт відкривається
2. Спробуйте увійти через Google
3. Спробуйте надіслати повідомлення в чаті
4. Спробуйте використати бота (`@бот`)

Якщо щось не працює, перевірте логи в Vercel Dashboard.

