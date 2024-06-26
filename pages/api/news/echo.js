// pages/api/news/echo.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://radiotavisupleba.ge";
const cacheKey = "newsEchoPolitics";

export default async function handler(req, res) {
  const cachedData = newsCache.get(cacheKey);

  if (cachedData) {
    console.log(`Returning cached data for Echo politics`);
    return res.status(200).json(cachedData);
  }

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      console.log("Network response was not ok");
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const newsItems = $('li.col-xs-12.col-sm-6.col-md-12.col-lg-12.mb-grid')
      .map((index, element) => {
        const link = $(element).find('a').attr('href');
        const title = $(element).find('.media-block__title').attr('title').trim();
        return title && link ? { title, link: "https://radiotavisupleba.ge" + link, cacheKey } : null;
      })
      .get()
      .filter(n => n)
      .slice(0, 8);

    newsCache.set(cacheKey, newsItems);
    res.status(200).json(newsItems);
  } catch (error) {
    console.error(`Error fetching news from Echo:`, error);
    res.status(500).json({ error: 'Error fetching news' });
  }
  newsCache.set(cacheKey, newsItems);
  return newsItems;
}
