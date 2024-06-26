// pages/api/news/georgiaToday.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import newsCache from '../../../../lib/cache';

const BASE_URL = "https://georgiatoday.ge";

export default async function handler(req, res) {
  const categoryPaths = {
    News: '/category/news',
    Politics: '/category/politics',
    Business: '/category/business',
    Culture: '/category/culture',
    Travel: '/category/travel',
  };

  const categoriesToProcess = req.query.category ? [req.query.category] : Object.keys(categoryPaths);
  const allNewsItems = [];

  for (const currentCategory of categoriesToProcess) {
    const categoryPath = categoryPaths[currentCategory];
    if (!categoryPath) {
      continue; // Пропускаем неизвестные категории
    }

    const cacheKey = `GeorgiaToday${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`;
    const cachedData = newsCache.get(cacheKey);

    if (cachedData) {
      console.log(`Возврат кэшированных данных для Georgia Today ${currentCategory}`);
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
        News: 8,
        Politics: 8,
        Business: 5,
        Culture: 5,
        Travel: 5
      };
      const newsItems = $('article.jeg_post.jeg_pl_md_1.format-standard')
        .map((index, element) => {
          const title = $(element).find("h3.jeg_post_title a").text().trim();
          const link = $(element).find("h3.jeg_post_title a").attr("href");
          return {
            title,
            link: `${link}`,
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
