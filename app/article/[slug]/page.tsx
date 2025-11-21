'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const slug = params.slug as string;
        const articleUrl = decodeURIComponent(slug);
        
        const response = await fetch(`/api/scrape?url=${encodeURIComponent(articleUrl)}`);
        const data = await response.json();
        
        if (data.success && data.article) {
          setArticle(data.article);
        } else {
          setError(data.error || 'Статтю не знайдено');
        }
      } catch (err: any) {
        setError(err.message || 'Помилка при завантаженні статті');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">
          Завантаження статті...
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Помилка
          </h1>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            {error || 'Статтю не знайдено'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Повернутися до новин
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Повернутися до новин
        </Link>

        <article className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {article.source}
            </span>
            {article.date && (
              <time className="text-sm text-zinc-500 dark:text-zinc-400">
                {new Date(article.date).toLocaleDateString('uk-UA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            )}
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-zinc-900 dark:text-zinc-50">
            {article.title}
          </h1>

          {article.image && (
            <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="prose prose-zinc max-w-none dark:prose-invert">
            <div className="whitespace-pre-line text-base leading-8 text-zinc-700 dark:text-zinc-300">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
              Оригінальна стаття:
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {article.url}
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}

