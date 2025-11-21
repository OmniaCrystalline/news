'use client';

import { useState, useEffect } from 'react';
import NewsCard from './components/NewsCard';
import Chat from './components/Chat';
import Header from './components/Header';

interface NewsArticle {
  title: string;
  content: string;
  image: string | null;
  url: string;
  source: string;
  date?: string;
}

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState('unian');
  const [lastFetchTime, setLastFetchTime] = useState<{ [key: string]: number }>({});

  const fetchNews = async (selectedSource: string, forceRefresh = false) => {
    // Перевіряємо кеш в localStorage
    const cacheKey = `news-${selectedSource}`;
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}-time`);
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 хвилин

    // Якщо є кеш і не примусове оновлення
    if (!forceRefresh && cached && cacheTime) {
      const cachedTime = parseInt(cacheTime);
      if (now - cachedTime < CACHE_DURATION) {
        try {
          const cachedData = JSON.parse(cached);
          setArticles(cachedData.articles || []);
          return;
        } catch (e) {
          // Якщо кеш пошкоджений, продовжуємо завантаження
        }
      }
    }

    // Перевіряємо, чи не був нещодавно запит для цього джерела
    const lastFetch = lastFetchTime[selectedSource] || 0;
    if (!forceRefresh && now - lastFetch < 30000) { // 30 секунд мінімальний інтервал
      return;
    }

    setLoading(true);
    setError(null);
    setLastFetchTime({ ...lastFetchTime, [selectedSource]: now });

    try {
      const response = await fetch(`/api/scrape?source=${selectedSource}`, {
        cache: 'no-store' // Для примусового оновлення
      });
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles || []);
        // Зберігаємо в кеш
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(`${cacheKey}-time`, now.toString());
      } else {
        setError(data.error || 'Помилка при завантаженні новин');
      }
    } catch (err: any) {
      setError(err.message || 'Помилка при завантаженні новин');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Спочатку намагаємося завантажити з кешу
    const cacheKey = `news-${source}`;
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}-time`);

    if (cached && cacheTime) {
      const cachedTime = parseInt(cacheTime);
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 хвилин

      if (now - cachedTime < CACHE_DURATION) {
        try {
          const cachedData = JSON.parse(cached);
          setArticles(cachedData.articles || []);
          // Завантажуємо нові дані в фоні, якщо кеш старіший за 2 хвилини
          if (now - cachedTime > 2 * 60 * 1000) {
            fetchNews(source, false);
          }
          return;
        } catch (e) {
          // Якщо кеш пошкоджений, завантажуємо нові дані
        }
      }
    }

    // Якщо кешу немає або він застарів, завантажуємо нові дані
    fetchNews(source, false);
  }, []);

  const handleSourceChange = (newSource: string) => {
    if (source === newSource) return; // Якщо вже вибрано це джерело, не робимо запит
    setSource(newSource);
    fetchNews(newSource, false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 flex flex-wrap gap-2 sm:mb-6">
            <button
              onClick={() => handleSourceChange('unian')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${source === 'unian'
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
            >
              УНІАН
            </button>
            <button
              onClick={() => handleSourceChange('pravda')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${source === 'pravda'
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
            >
              <span className="hidden sm:inline">Українська правда</span>
              <span className="sm:hidden">Правда</span>
            </button>
            <button
              onClick={() => handleSourceChange('bbc')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${source === 'bbc'
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
            >
              BBC Україна
            </button>
            <button
              onClick={() => handleSourceChange('rbc')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${source === 'rbc'
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
            >
              РБК-Україна
            </button>
            <button
              onClick={() => fetchNews(source, true)}
              disabled={loading}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="hidden sm:inline">{loading ? 'Завантаження...' : 'Оновити'}</span>
              <span className="sm:hidden">{loading ? '...' : '↻'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-zinc-600 dark:text-zinc-400">
              Завантаження новин...
            </div>
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <div className="py-12 text-center text-zinc-600 dark:text-zinc-400">
            Новин не знайдено
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
          </div>
        )}

        <div className="mt-8 sm:mt-12">
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            Чат
          </h2>
          <Chat />
        </div>
      </main>
    </div>
  );
}
