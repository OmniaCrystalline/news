import Link from 'next/link';

export const metadata = {
  title: '404 - Сторінку не знайдено',
  description: 'Сторінку, яку ви шукаєте, не знайдено.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-zinc-900 dark:text-zinc-50">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Сторінку не знайдено
        </h2>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Сторінку, яку ви шукаєте, не існує або була переміщена.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
}

