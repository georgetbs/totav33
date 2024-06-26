// pages/api/news.js
import { fetchNews } from '../../../lib/news-alia';

export default async function handler(req, res) {
  try {
    const newsItems = await fetchNews();
    res.status(200).json(newsItems);
  } catch (error) {
    console.error(`Ошибка при обработке запроса:`, error);
    res.status(500).json({ message: `Ошибка при обработке запроса: ${error.message}` });
  }
}
