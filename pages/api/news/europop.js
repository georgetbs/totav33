// pages/api/news/europop.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://europop.ge";

export default async function handler(req, res) {
  const category = req.query.category || 'sports'; // По умолчанию спорт
  const cacheKey = `newsEuropopSports`;
  const cachedData = newsCache.get(cacheKey);

  if (cachedData) {
    console.log(`Returning cached data for Europop ${category}`);
    return res.status(200).json(cachedData);
  }

  const url = `${BASE_URL}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Network response was not ok");
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const sliceCount = 10;
    const newsItems = $('article.e-article-teaser')
      .map((index, element) => {
        const link = $(element).data("url");
        const title = $(element).find(".eat-info .article-link span").text().trim();
        return {
          title,
          link,
          cacheKey
        };
      })
      .get()
      .slice(0, sliceCount);

    newsCache.set(cacheKey, newsItems);
    res.status(200).json(newsItems);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching news' });
  }
  newsCache.set(cacheKey, newsItems);
  return newsItems;
}
