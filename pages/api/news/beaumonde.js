// pages/api/news/beaumonde.js
import fetch from 'node-fetch';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://www.beaumonde.ge/api/blocks/";

export default async function handler(req, res) {
  const cacheKey = "newsBeaumondeFashion";
  const cachedData = newsCache.get(cacheKey);

  if (cachedData) {
    console.log(`Returning cached data for Beaumonde Fashion`);
    return res.status(200).json(cachedData);
  }

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      console.error("Network response was not ok");
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    const data = await response.json();

    // Находим блок с id = 5
    const newsBlock = data.blocks.find(block => block.id === 5);

    if (!newsBlock) {
      console.error("News block with id=5 not found");
      return res.status(404).json({ error: "News block not found" });
    }

    // Извлечение и преобразование данных новостей
    const newsItems = newsBlock.articles.map(article => ({
      title: decodeURIComponent(article.title),
      link: `https://beaumonde.ge/article/${article.id}-${article.alias}`,
      cacheKey
    }));

    newsCache.set(cacheKey, newsItems);
    res.status(200).json(newsItems);
  } catch (error) {
    console.error(`Error fetching news from Beaumonde:`, error);
    return res.status(500).json({ error: 'Error fetching news' });
  }
}
