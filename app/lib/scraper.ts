import * as cheerio from 'cheerio';

export interface NewsArticle {
  title: string;
  content: string;
  image: string | null;
  url: string;
  source: string;
  date?: string;
}

export class NewsScraper {
  private async fetchHTML(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        next: { revalidate: 0 } // Не кешуємо запити
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      
      if (text.length < 100) {
        throw new Error('Отримано занадто коротку відповідь від сервера');
      }
      
      return text;
    } catch (error: any) {
      console.error(`Помилка при завантаженні ${url}:`, error.message);
      throw error;
    }
  }

  private extractImage($: cheerio.CheerioAPI, articleUrl: string): string | null {
    // Спробуємо знайти зображення в різних місцях
    const selectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'img.article-image',
      'img[itemprop="image"]',
      '.article-content img',
      '.post-content img',
      'article img',
      'img[alt*=""]'
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        let imageUrl = element.attr('content') || element.attr('src') || element.attr('data-src');
        
        if (imageUrl) {
          // Перетворюємо відносні URL в абсолютні
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (imageUrl.startsWith('/')) {
            const urlObj = new URL(articleUrl);
            imageUrl = urlObj.origin + imageUrl;
          }
          return imageUrl;
        }
      }
    }

    return null;
  }

  private extractContent($: cheerio.CheerioAPI): string {
    // Видаляємо небажані елементи
    $('script, style, nav, header, footer, aside, .advertisement, .ads, .social-share, .comments, .related-news, .tags, .share-buttons, iframe').remove();

    // Спробуємо знайти основний контент статті
    const contentSelectors = [
      'article .article-content',
      'article .post-content',
      'article .entry-content',
      '.article-body',
      '.post-body',
      '.entry-content',
      '.article-text',
      '.post-text',
      '[itemprop="articleBody"]',
      '.story-body',
      '.news-text',
      'article',
      '.content',
      'main article',
      '.main-content'
    ];

    let content = '';
    let foundContent = false;
    
    for (const selector of contentSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        elements.each((_, el) => {
          const $el = $(el);
          
          // Беремо всі параграфи
          $el.find('p').each((_, p) => {
            const text = $(p).text().trim();
            // Зменшив мінімальну довжину для кращого витягування
            if (text.length > 20 && !text.match(/^(читайте також|джерело|теги|категорії|підписуйтесь|реклама)/i)) {
              content += text + '\n\n';
              foundContent = true;
            }
          });
          
          // Також беремо текст з div, якщо він містить багато тексту
          $el.find('div').each((_, div) => {
            const $div = $(div);
            const text = $div.text().trim();
            // Якщо div містить багато тексту і не має дочірніх елементів з посиланнями
            if (text.length > 100 && $div.find('a').length < 3 && !$div.hasClass('ad') && !$div.hasClass('advertisement')) {
              const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 30);
              if (paragraphs.length > 0) {
                content += paragraphs.join('\n\n') + '\n\n';
                foundContent = true;
              }
            }
          });
        });
        
        if (content.length > 500) {
          break;
        }
      }
    }

    // Якщо не знайшли структурований контент, беремо всі параграфи
    if (!foundContent || content.length < 200) {
      $('article p, .content p, .post p, main p, .text p').each((_, el) => {
        const text = $(el).text().trim();
        // Фільтруємо короткі тексти та навігацію
        if (text.length > 30 && 
            !text.match(/^(читайте також|джерело|теги|категорії|підписуйтесь|реклама|поділитися)/i) &&
            !$(el).closest('.ad, .advertisement, .sidebar, .related').length) {
          content += text + '\n\n';
        }
      });
    }

    // Очищаємо від зайвих пробілів та переносів
    content = content
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Якщо контент все ще занадто короткий, спробуємо взяти весь текст з article
    if (content.length < 200) {
      const articleText = $('article').text().trim();
      if (articleText.length > content.length) {
        // Розбиваємо на параграфи за подвійними переносами
        const paragraphs = articleText.split(/\n{2,}/).filter(p => p.trim().length > 50);
        content = paragraphs.join('\n\n');
      }
    }

    return content;
  }

  async scrapeArticle(articleUrl: string, source: string): Promise<NewsArticle> {
    const html = await this.fetchHTML(articleUrl);
    const $ = cheerio.load(html);

    // Витягуємо заголовок
    const title = $('meta[property="og:title"]').attr('content') ||
                  $('h1').first().text().trim() ||
                  $('title').text().trim();

    // Витягуємо контент
    const content = this.extractContent($);

    // Витягуємо зображення
    const image = this.extractImage($, articleUrl);

    // Витягуємо дату
    const date = $('meta[property="article:published_time"]').attr('content') ||
                 $('time').attr('datetime') ||
                 $('.date, .published').text().trim();

    return {
      title: title || 'Без заголовку',
      content: content || 'Контент не знайдено',
      image,
      url: articleUrl,
      source,
      date: date || undefined
    };
  }

  async scrapeNewsList(sourceUrl: string, sourceName: string): Promise<NewsArticle[]> {
    try {
      const html = await this.fetchHTML(sourceUrl);
      const $ = cheerio.load(html);
      const articles: NewsArticle[] = [];

      const links = new Set<string>();
      const baseUrl = new URL(sourceUrl);
      const baseHostname = baseUrl.hostname.replace('www.', '');

      // Видаляємо небажані елементи перед пошуком посилань
      $('script, style, nav, header, footer, aside, .menu, .navigation, .sidebar').remove();

      // Більш широкі селектори для пошуку посилань
      const allLinks = $('a[href]');
      
      allLinks.each((_, el) => {
        let href = $(el).attr('href');
        if (!href || href === '#' || href.startsWith('javascript:')) return;

        // Перетворюємо відносні URL в абсолютні
        try {
          if (href.startsWith('//')) {
            href = 'https:' + href;
          } else if (href.startsWith('/')) {
            href = baseUrl.origin + href;
          } else if (!href.startsWith('http')) {
            href = baseUrl.origin + '/' + href;
          }

          // Нормалізуємо URL
          const url = new URL(href);
          const urlHostname = url.hostname.replace('www.', '');
          
          // Перевіряємо, чи посилання належить до того ж домену
          if (urlHostname === baseHostname || baseHostname.includes(urlHostname) || urlHostname.includes(baseHostname)) {
            const path = url.pathname.toLowerCase();
            const pathParts = path.split('/').filter(p => p.length > 0);
            
            // Різні патерни для статей
            const isArticleLink = 
              path.includes('/news/') ||
              path.includes('/article/') ||
              path.includes('/post/') ||
              path.includes('/story/') ||
              path.includes('/ukrainian/') ||
              path.includes('/novyny/') ||
              path.match(/\/\d{4}\/\d{2}\/\d{2}\//) || // Дата в URL (YYYY/MM/DD)
              path.match(/\/\d{4}\//) && path.length > 10 || // Дата в URL
              (pathParts.length >= 2 && pathParts.length <= 5 && // Розумна довжина шляху
               !pathParts[0].match(/^(tag|category|author|search|page|archive|about|contact)$/i));

            // Виключаємо посилання на теги, категорії, автори тощо
            const isExcluded = 
              path.includes('/tag/') ||
              path.includes('/category/') ||
              path.includes('/author/') ||
              path.includes('/page/') ||
              path.includes('/search/') ||
              path.includes('/archive/') ||
              path.includes('/about/') ||
              path.includes('/contact/') ||
              path === '/' ||
              path.length < 5 ||
              path.match(/\.(jpg|jpeg|png|gif|pdf|zip|doc)$/i);

            if (isArticleLink && !isExcluded) {
              // Додаткова перевірка: текст посилання не повинен бути порожнім або занадто коротким
              const linkText = $(el).text().trim();
              if (linkText.length > 5 || href.match(/\d{4}/)) { // Або є дата в URL
                links.add(href);
              }
            }
          }
        } catch (e) {
          // Ігноруємо невалідні URL
        }
      });

      // Обмежуємо кількість статей
      const articleUrls = Array.from(links).slice(0, 20);

      console.log(`Знайдено ${articleUrls.length} потенційних статей для ${sourceName}`);

      if (articleUrls.length === 0) {
        console.warn(`Не знайдено посилань на статті для ${sourceName}. Можливо, структура сайту змінилася.`);
        return [];
      }

      // Скрапимо кожну статтю
      for (const url of articleUrls) {
        try {
          const article = await this.scrapeArticle(url, sourceName);
          if (article.content.length > 50 && article.title !== 'Без заголовку') {
            articles.push(article);
            if (articles.length >= 10) break; // Обмежуємо до 10 статей
          }
        } catch (error) {
          console.error(`Помилка при скрапінгу ${url}:`, error);
        }
      }

      return articles;
    } catch (error) {
      console.error(`Помилка при скрапінгу списку новин з ${sourceUrl}:`, error);
      throw error;
    }
  }
}

// Конфігурація для популярних українських новинних сайтів
export const newsSources = [
  {
    name: 'УНІАН',
    url: 'https://www.unian.ua',
    articlePattern: /\/news\//
  },
  {
    name: 'Українська правда',
    url: 'https://www.pravda.com.ua',
    articlePattern: /\/news\//
  },
  {
    name: 'BBC Україна',
    url: 'https://www.bbc.com/ukrainian',
    articlePattern: /\/ukrainian\//
  },
  {
    name: 'РБК-Україна',
    url: 'https://www.rbc.ua',
    articlePattern: /\/news\//
  }
];

