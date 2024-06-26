// pages/api/news/1tv.js
import fetch from 'node-fetch';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://1tv.ge/wp-json/listing/all/news?offset=0&lang=ge&post_type=news&topic=&tpl_ver=39.9.95";
const CACHE_KEY = "news1tvMainGe";

export default async function handler(req, res) {
  // Check for cached data first
  const cachedData = newsCache.get(CACHE_KEY);
  if (cachedData) {
    console.log(`Returning cached data for 1tv Main`);
    return res.status(200).json(cachedData);
  }

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      console.log("Network response was not ok");
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    
    const data = await response.json();
    // Assuming the API returns an array of news. Adjust according to the actual response structure.
    const newsItems = data.map(item => ({
      title: decodeURIComponent(item.post_title),
      link: item.post_permalink,
      cacheKey: CACHE_KEY,
    })).slice(0, 10); // Limiting the number of news items to 10 for consistency

    // Set the data in the cache before returning it
    newsCache.set(CACHE_KEY, newsItems);
    res.status(200).json(newsItems);
  } catch (error) {
    console.error(`Error fetching news from ${BASE_URL}:`, error);
    res.status(500).json({ error: 'Error fetching news' });
  }
}
