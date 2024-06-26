// lib/news-alia.js
import cheerio from "cheerio";
import fetch from "node-fetch";

const url = "https://www.alia.ge/category/akhali-ambebi/";
const cacheKey = "newsAliaMain"; // Используется для добавления в каждый элемент новости

export async function fetchNews() {
  try {
    const response = await fetch(url);
    if (!response.ok) console.log("Network response was not ok");

    const html = await response.text();
    const $ = cheerio.load(html);

    const newsItems = $(".jeg_postblock_content h3")
      .map((i, el) => ({
        title: $(el).text().trim(),
        link: $(el).find("a").attr("href"),
        cacheKey, // Теперь cacheKey доступен
      }))
      .get()
      .slice(0, 8);

    return newsItems;
  } catch (error) {
    console.error(`Ошибка при получении новостей из ${url}:`, error);
  }
}
