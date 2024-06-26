// pages/api/news/1tvEn.js
import fetch from 'node-fetch';
import newsCache from '../../../../lib/cache';

const BASE_URL = "https://1tv.ge/lang/wp-json/listing/all/news?offset=0&lang=en&post_type=news&topic=&tpl_ver=42.0.1";
const CACHE_KEY = "news1tvMainEn";

export default async function handler(req, res) {
  // Проверка кэша данных
  const cachedData = newsCache.get(CACHE_KEY);
  if (cachedData) {
    console.log(`Returning cached data for 1tv Main En`);
    return res.status(200).json(cachedData);
  }

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      console.log("Network response was not ok");
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    
    const data = await response.json();
    // Предполагая, что API возвращает массив новостей. Подстройте под фактическую структуру ответа.
    const newsItems = data.map(item => ({
      title: decodeURIComponent(item.post_title),
      link: item.post_permalink,
      cacheKey: CACHE_KEY,
    })).slice(0, 10); // Ограничиваем количество новостей до 10 для консистентности

    // Кэшируем данные перед возвращением
    newsCache.set(CACHE_KEY, newsItems);
    res.status(200).json(newsItems);
  } catch (error) {
    console.error(`Error fetching news from ${BASE_URL}:`, error);
    res.status(500).json({ error: 'Error fetching news' });
  }
}
