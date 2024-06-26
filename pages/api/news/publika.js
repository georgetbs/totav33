// pages/api/news/publika.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://publika.ge";

export default async function handler(req, res) {
  const categoryPaths = {
    main: '/post',
    politics: '/category/politika'
  };

  const categoriesToProcess = req.query.category ? [req.query.category] : Object.keys(categoryPaths);
  const allNewsItems = [];

  for (const currentCategory of categoriesToProcess) {
    const categoryPath = categoryPaths[currentCategory];
    if (!categoryPath) {
      continue; // Пропускаем неизвестные категории
    }

    const cacheKey = `newsPublika${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`;
    const cachedData = newsCache.get(cacheKey);

    if (cachedData) {
      console.log(`Возврат кэшированных данных для Publika ${currentCategory}`);
      allNewsItems.push(...cachedData);
      continue;
    }

    const url = `${BASE_URL}${categoryPath}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Не удалось получить данные из ${url}: ответ сети неудовлетворительный`);
        continue; // Пропускаем категорию при ошибке сети
      }
      const html = await response.text();
      const $ = cheerio.load(html);
      const sliceCounts = {
        main: 8,
        politics: 8,
        society: 6,
        economics: 5
      };
      const newsItems = $(".wi-news-list-box h3.wi-news-list-title a")
        .map((index, element) => ({
          title: $(element).text().trim(),
          link: $(element).attr("href"),
          cacheKey
        }))
        .get()
        .slice(0, sliceCounts[currentCategory]);

      newsCache.set(cacheKey, newsItems);
      allNewsItems.push(...newsItems);
    } catch (error) {
      console.error(`Ошибка при получении новостей из ${url}:`, error);
    }
  }

  res.status(200).json(allNewsItems);
}
