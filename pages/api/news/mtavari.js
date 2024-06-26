// pages/api/news/mtavari.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://mtavari.tv";

export default async function handler(req, res) {
  const categoryPaths = {
    politics: '/category/politics',
    society: '/category/society',
    business: '/category/business',
    // Добавьте другие категории по необходимости
  };

  const categoriesToProcess = req.query.category ? [req.query.category] : Object.keys(categoryPaths);
  const allNewsItems = [];

  for (const currentCategory of categoriesToProcess) {
    const categoryPath = categoryPaths[currentCategory];
    if (!categoryPath) {
      continue; // Пропускаем неизвестные категории
    }

    const cacheKey = `newsMtavari${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`;
    const cachedData = newsCache.get(cacheKey);

    if (cachedData) {
      console.log(`Возврат кэшированных данных для Mtavari ${currentCategory}`);
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
        politics: 10,
        society: 1,
        business: 1
      };
      const newsItems = $("a")
        .map((index, element) => {
          const title = $(element).find("div.NewsItem__Text-sc-4tbadf-5").text().trim();
          const link = $(element).attr("href");
          if (title && link && !title.includes("ვალუტის კურსი")) {
            return { title, link: link.startsWith('http') ? link : `${BASE_URL}${link}`, cacheKey };
          }
          return null;
        })
        .get()
        .filter(n => n) // Фильтрация пустых значений
        .slice(0, sliceCounts[currentCategory]); // Установка максимального количества новостей для каждой категории

      newsCache.set(cacheKey, newsItems);
      allNewsItems.push(...newsItems);
    } catch (error) {
      console.error(`Ошибка при получении новостей из ${url}:`, error);
    }
  }

  res.status(200).json(allNewsItems);
}
