// pages/api/news/primetime.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://primetime.ge";

export default async function handler(req, res) {
  const categoryPaths = {
    society: '/news/sazogadoeb',
    politics: '/news/politika',
    // Добавьте другие категории по необходимости
  };

  const categoriesToProcess = req.query.category ? [req.query.category] : Object.keys(categoryPaths);
  const allNewsItems = [];

  for (const currentCategory of categoriesToProcess) {
    const categoryPath = categoryPaths[currentCategory];
    if (!categoryPath) {
      continue; // Пропускаем неизвестные категории
    }

    const cacheKey = `newsPrimetime${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`;
    const cachedData = newsCache.get(cacheKey);

    if (cachedData) {
      console.log(`Returning cached data for Primetime ${currentCategory}`);
      allNewsItems.push(...cachedData);
      continue;
    }

    const url = `${BASE_URL}${categoryPath}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch data from ${url}: Network response was not ok`);
        continue; // Пропускаем категорию при ошибке сети
      }
      const html = await response.text();
      const $ = cheerio.load(html);
      const newsItems = $(".row.news")
        .map((index, element) => ({
          title: $(element).find(".title").text().trim(),
          link: $(element).find("a").attr("href"),
          cacheKey
        }))
        .get()
        .slice(0, 9); // Ограничиваем количество элементов

      newsCache.set(cacheKey, newsItems);
      allNewsItems.push(...newsItems);
    } catch (error) {
      console.error(`Error fetching news from ${url}:`, error);
    }
  }

  res.status(200).json(allNewsItems);
}
