import Image from 'next/image';
import Link from 'next/link';

interface NewsArticle {
  title: string;
  content: string;
  image: string | null;
  url: string;
  source: string;
  date?: string;
}

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  // Створюємо slug з URL статті
  const articleSlug = encodeURIComponent(article.url);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {article.image && (
        <Link href={`/article/${articleSlug}`} className="relative block h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            unoptimized
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {article.source}
          </span>
          {article.date && (
            <time className="text-xs text-zinc-500 dark:text-zinc-400">
              {new Date(article.date).toLocaleDateString('uk-UA')}
            </time>
          )}
        </div>
        <Link href={`/article/${articleSlug}`}>
          <h2 className="mb-3 text-xl font-semibold leading-tight text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-400">
            {article.title}
          </h2>
        </Link>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-4">
          {article.content.substring(0, 300)}
          {article.content.length > 300 && '...'}
        </p>
        <Link
          href={`/article/${articleSlug}`}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Читати повністю
        </Link>
      </div>
    </article>
  );
}

