// pages/api/news/tvpirveli.js
import fetch from 'node-fetch';
import newsCache from '../../../lib/cache';

const BASE_URL = "https://tvpirveli.ge/_mvcapi/newsapi/GetLatestNews";

export default async function handler(req, res) {
  const cacheKey = "newsTVPirveliPolitics";
  const cachedData = newsCache.get(cacheKey);

  if (cachedData) {
    console.log(`Returning cached data for TV Pirveli Politics`);
    return res.status(200).json(cachedData);
  }

  const requestData = {
    languageId: "1"
  };

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      console.log("Network response was not ok");
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    const data = await response.json();

    // Отбираем новости с categoryId равным 9
    const filteredNews = data.data.list.filter(({news}) => news.categoryId === 9);

    if (filteredNews.length === 0) {
      console.error("No news with categoryId=9 found");
      return res.status(404).json({ error: "No news found" });
    }

    // Преобразуем отфильтрованные новости в требуемый формат
    const newsItems = filteredNews.map(({news, url}) => ({
      title: decodeURIComponent(news.title),
      link: `https://tvpirveli.ge${url.slice(1)}`, // Удаление символа '~' и формирование полной ссылки
      cacheKey
    }));

    newsCache.set(cacheKey, newsItems);
    res.status(200).json(newsItems);
  } catch (error) {
    console.error(`Error fetching news from TV Pirveli:`, error);
    res.status(500).json({ error: 'Error fetching news' });
  }
}
