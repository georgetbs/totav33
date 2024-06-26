// pages/api/news/croco.js
import fetch from 'node-fetch';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://newadmin.croco.ge/api/posts/georgiansport?page=1";

export default async function handler(req, res) {
  const cacheKey = "newsCrocoSports";
  const cachedData = newsCache.get(cacheKey);

  if (cachedData) {
    console.log(`Returning cached data for Croco Sports`);
    return res.status(200).json(cachedData);
  }

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      console.error("Network response was not ok");
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    const data = await response.json();

    // Проверяем, есть ли данные в ответе
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("Invalid response format");
      return res.status(500).json({ error: 'Invalid response format' });
    }

    // Формируем массив объектов с заголовками и ссылками на новости
    const newsItems = data.data.map((item) => ({
      title: decodeURIComponent(item.title),
      link: `https://croco.ge/show/${item.categories[0].name_eng}/${item.id}`,
      cacheKey,
    })).slice(0, 10);

    newsCache.set(cacheKey, newsItems);
    res.status(200).json(newsItems);
  } catch (error) {
    console.error("Error fetching news from Croco Sports:", error);
    return res.status(500).json({ error: 'Error fetching news' });
  }
}
