// pages/api/news/imedi.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import newsCache from '../../../../lib/cache';

const BASE_URL = "https://info.imedi.ge";

export default async function handler(req, res) {
  const categoryPaths = {
    politicsEn: '/en/politics',
    economicsEn: '/en/economy',
  };

  const categoriesToProcess = req.query.category ? [req.query.category] : Object.keys(categoryPaths);
  const allNewsItems = [];

  for (const currentCategory of categoriesToProcess) {
    const categoryPath = categoryPaths[currentCategory];
    if (!categoryPath) {
      continue; // Пропускаем неизвестные категории
    }

    const cacheKey = `newsImedi${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`;
    const cachedData = newsCache.get(cacheKey);

    if (cachedData) {
      console.log(`Возврат кэшированных данных для Imedi ${currentCategory}`);
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
        politicsEn: 10,
        economicsEn: 3
      };
      const newsItems = $('a.single-item')
        .map((index, element) => {
          const title = $(element).find("h3.title").text().trim();
          const link = $(element).attr("href");
          return {
            title,
            link,
            cacheKey
          };
        })
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
