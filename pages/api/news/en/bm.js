// pages/api/news/bm.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import newsCache from '../../../../lib/cache';

const BASE_URL = "https://bm.ge/en";

export default async function handler(req, res) {
  const categoryPaths = {
    economicsEn: '/category/economy',
    businessEn: '/category/business',
  };

  const categoriesToProcess = req.query.category ? [req.query.category] : Object.keys(categoryPaths);
  const allNewsItems = [];

  for (const currentCategory of categoriesToProcess) {
    const categoryPath = categoryPaths[currentCategory];
    if (!categoryPath) {
      continue; // Пропускаем неизвестные категории
    }

    const cacheKey = `newsBM${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`;
    const cachedData = newsCache.get(cacheKey);

    if (cachedData) {
      console.log(`Returning cached data for BM ${currentCategory}`);
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
      const newsItems = $("div.flex.flex-col.col-span-4.lg\\:col-span-1.gap-y-2")
        .map((index, element) => {
          const title = $(element)
            .find("a.bpg-web-caps.font-medium.leading-4.break-words")
            .text()
            .trim()
            .replace(/\n/g, " ");
          const link = $(element)
            .find("a.bpg-web-caps.font-medium.leading-4.break-words")
            .attr("href");
          return title && link ? { title, link, cacheKey } : null;
        })
        .get()
        .filter((n) => n) // Фильтрация пустых значений
        .slice(0, 8); // Установка максимального количества новостей для каждой категории

      newsCache.set(cacheKey, newsItems);
      allNewsItems.push(...newsItems);
    } catch (error) {
      console.error(`Error fetching news from ${url}:`, error);
    }
  }

  res.status(200).json(allNewsItems);
}
