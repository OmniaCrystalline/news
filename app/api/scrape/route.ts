import { NextResponse } from 'next/server';
import { NewsScraper, newsSources } from '@/app/lib/scraper';

// Кеш для зберігання результатів скрапінгу
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 хвилин

// Очищення застарілого кешу кожні 5 хвилин
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'unian';
    const url = searchParams.get('url');

    const scraper = new NewsScraper();

    if (url) {
      // Скрапимо одну статтю за URL
      try {
        const urlObj = new URL(url);
        const sourceName = newsSources.find(s => {
          const sourceUrl = new URL(s.url);
          return urlObj.hostname.includes(sourceUrl.hostname.replace('www.', '')) || 
                 sourceUrl.hostname.includes(urlObj.hostname.replace('www.', ''));
        })?.name || 'Невідоме джерело';
        
        const article = await scraper.scrapeArticle(url, sourceName);
        return NextResponse.json({ success: true, article });
      } catch (error: any) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Помилка при скрапінгу статті: ${error.message}` 
          },
          { status: 500 }
        );
      }
    } else {
      // Скрапимо список новин з джерела
      let sourceConfig = newsSources.find(s => {
        const nameLower = s.name.toLowerCase();
        const sourceLower = source.toLowerCase();
        return nameLower.includes(sourceLower) || 
               sourceLower.includes(nameLower) ||
               (sourceLower === 'unian' && nameLower.includes('уніан')) ||
               (sourceLower === 'pravda' && nameLower.includes('правда')) ||
               (sourceLower === 'rbc' && nameLower.includes('рбк'));
      });
      
      if (!sourceConfig) {
        sourceConfig = newsSources[0]; // За замовчуванням УНІАН
      }

      // Перевіряємо кеш
      const cacheKey = `news-${source}`;
      const cached = cache.get(cacheKey);
      const now = Date.now();

      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log(`Використовуємо кеш для ${sourceConfig.name}`);
        return NextResponse.json(cached.data, {
          headers: {
            'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
          },
        });
      }

      console.log(`Скрапінг з джерела: ${sourceConfig.name} (${sourceConfig.url})`);

      const articles = await scraper.scrapeNewsList(sourceConfig.url, sourceConfig.name);
      
      const responseData = articles.length === 0 ? {
        success: false,
        error: `Не вдалося знайти новини на ${sourceConfig.name}. Можливо, структура сайту змінилася.`,
        articles: [],
        source: sourceConfig.name,
        count: 0
      } : {
        success: true, 
        articles,
        source: sourceConfig.name,
        count: articles.length
      };

      // Зберігаємо в кеш
      cache.set(cacheKey, {
        data: responseData,
        timestamp: now
      });

      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
        },
      });
    }
  } catch (error: any) {
    console.error('Помилка скрапінгу:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Помилка при скрапінгу новин',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

