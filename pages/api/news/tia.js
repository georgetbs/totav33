// pages/api/news/tia.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://tia.ge";

export default async function handler(req, res) {
  const category = req.query.category;
  const categoryPaths = {
    society: '/news/sazogadoeba',
    politics: '/news/politic',
    facesociety: '/news/face'
  };

  const categoriesToProcess = category ? [category] : Object.keys(categoryPaths);
  const allNewsItems = [];

  for (const currentCategory of categoriesToProcess) {
    const categoryPath = categoryPaths[currentCategory];
    if (!categoryPath) {
      continue; // Пропускаем неизвестные категории
    }

    const cacheKey = `newsTia${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`;
    const cachedData = newsCache.get(cacheKey);

    if (cachedData) {
      console.log(`Возврат кэшированных данных для TIA ${currentCategory}`);
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
      const sliceCount = 10; // Фиксированное количество новостей для каждой категории
      const newsItems = $('.col-md-3.popular')
        .map((index, element) => {
          const title = $(element).find('a').text().trim().replace(/\s+/g, ' ');
          const link = $(element).find('a').attr('href');
          return {
            title,
            link,
            cacheKey
          };
        })
        .get()
        .slice(0, sliceCount);

      newsCache.set(cacheKey, newsItems);
      allNewsItems.push(...newsItems);
    } catch (error) {
      console.error(`Ошибка при получении новостей из ${url}:`, error);
    }
  }

  res.status(200).json(allNewsItems);
}
