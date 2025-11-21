import Link from 'next/link';
import Header from '../components/Header';

export const metadata = {
  title: 'Умови використання та Політика конфіденційності',
  description: 'Умови використання та політика конфіденційності сайту Новини України',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Умови використання та Політика конфіденційності
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                1. Загальні положення
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Цей сайт надає доступ до новин України з різних джерел. Використовуючи цей сайт, 
                ви погоджуєтесь з цими умовами використання. Якщо ви не згодні з цими умовами, 
                будь ласка, не використовуйте наш сайт.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                2. Використання контенту
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Весь контент на цьому сайті, включаючи новини, статті та інші матеріали, 
                надається виключно в інформаційних цілях. Контент може бути захищений авторським правом 
                оригінальних джерел. Ми не претендуємо на авторські права на матеріали, 
                які ми агрегуємо з інших джерел.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                3. Політика використання Cookie
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Ми використовуємо файли cookie для:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Збереження ваших налаштувань та переваг</li>
                <li>Покращення функціональності сайту</li>
                <li>Аналізу використання сайту</li>
                <li>Збереження сесії авторизації (якщо ви увійшли в систему)</li>
              </ul>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Ви можете налаштувати свій браузер для відмови від cookie, але це може 
                вплинути на функціональність сайту.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                4. Збір та використання даних
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Ми збираємо та обробляємо наступні дані:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Дані про авторизацію через Google OAuth (ім'я, email, зображення профілю)</li>
                <li>Повідомлення в чаті (якщо ви зареєстровані)</li>
                <li>Технічні дані (IP-адреса, тип браузера, операційна система)</li>
              </ul>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Ми не передаємо ваші персональні дані третім особам, за винятком випадків, 
                коли це необхідно для функціонування сайту або вимагається законом.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                5. Авторизація через Google
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                При авторизації через Google ми отримуємо доступ до вашого імені, email та 
                зображення профілю. Ці дані використовуються виключно для ідентифікації 
                та відображення в чаті. Ми не маємо доступу до інших даних вашого Google акаунту.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                6. Чат та повідомлення
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Всі повідомлення в чаті зберігаються в базі даних та доступні для перегляду 
                всіма користувачами. Будь ласка, не публікуйте особисту або конфіденційну інформацію 
                в чаті. Ми залишаємо за собою право видаляти повідомлення, які порушують 
                правила спільноти.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                7. Відмова від відповідальності
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Ми надаємо доступ до новин з різних джерел, але не несемо відповідальності 
                за точність, повноту або актуальність інформації. Контент надається "як є" 
                без будь-яких гарантій.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                8. Зміни в умовах
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Ми залишаємо за собою право змінювати ці умови в будь-який час. 
                Зміни набувають чинності з моменту їх публікації на сайті. 
                Рекомендуємо періодично перевіряти цю сторінку.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                9. Контакти
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                Якщо у вас є питання щодо цих умов або політики конфіденційності, 
                будь ласка, зв'яжіться з нами через чат на сайті.
              </p>
            </section>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Повернутися на головну
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

