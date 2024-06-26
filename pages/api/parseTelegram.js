import fetch from 'node-fetch';
import cheerio from 'cheerio';
import channelsConfig from '../../data/channelsconfig.json';

const parseTelegramChannel = async (url, channelName, feedId) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch channel: ${url}, Status: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const newsItems = [];
    const now = new Date();

    $('.tgme_widget_message_wrap').each((index, element) => {
      const titleHtml = $(element).find('.tgme_widget_message_text').html();
      const postId = $(element).find('.tgme_widget_message').attr('data-post');
      const logo = $(element).find('.tgme_widget_message_user_photo img').attr('src') || '';
      const dateTime = $(element).find('.tgme_widget_message_date time').attr('datetime');
      const postDate = new Date(dateTime);

      const hoursDiff = Math.abs(now - postDate) / 36e5;

      // Проверяем, содержит ли пост пересылку другого поста и игнорируем такие посты
      if ($(element).find('.tgme_widget_message_text.js-message_reply_text').length > 0) {
        return;
      }

      if (titleHtml && titleHtml.length >= 95 && hoursDiff <= 48 && postId) {
        const [channel, id] = postId.split('/');

        // Get image and video URLs
        const images = [];
        $(element).find('.tgme_widget_message_photo_wrap').each((i, imgWrap) => {
          const style = $(imgWrap).attr('style');
          const backgroundImage = style.match(/url\('(.+?)'\)/);
          if (backgroundImage) {
            images.push(backgroundImage[1]);
          }
        });

        const videos = [];
        $(element).find('.tgme_widget_message_video_player').each((i, video) => {
          const videoSrc = $(video).find('video').attr('src');
          if (videoSrc) videos.push(videoSrc);
        });

        newsItems.push({
          titleHtml,
          link: `https://t.me/${channel}/${id}`,
          logo,
          images,
          videos,
          cacheKey: postId,
          channelName,
          channelUrl: `https://t.me/${channel}`,
          dateTime,
          feedId
        });
      }
    });

    console.log(`Parsed ${newsItems.length} items from channel: ${channelName}`);
    return newsItems;
  } catch (error) {
    console.error(`Error parsing channel: ${channelName}, URL: ${url}`, error);
    return [];
  }
};

const getTelegramChannels = (language) => {
  return channelsConfig.telegram[language] || [];
};

const cache = new Map();
const CACHE_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes in milliseconds

const getCachedData = (language) => {
  const cacheKey = `telegram_${language}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TIME_LIMIT)) {
    console.log(`Serving from cache for language: ${language}`);
    return cached.data;
  }
  return null;
};

const setCachedData = (language, data) => {
  const cacheKey = `telegram_${language}`;
  cache.set(cacheKey, { timestamp: Date.now(), data });
  console.log(`Cached data for language: ${language}`);
};

export default async (req, res) => {
  const { language } = req.query;

  if (!language) {
    console.error('Missing language parameter');
    return res.status(400).json({ error: 'Missing language parameter' });
  }

  const cachedData = getCachedData(language);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  console.log(`Parsing Telegram channels for language: ${language}`);
  const channels = getTelegramChannels(language);
  if (!channels.length) {
    console.error(`No channels found for language: ${language}`);
    return res.status(400).json({ error: 'No channels found for the specified language' });
  }

  try {
    const allNewsItems = await Promise.all(channels.map(channel => parseTelegramChannel(channel.url, channel.name, channel.feed_id)));
    const newsItems = allNewsItems.flat().sort(() => Math.random() - 0.5); // Mix posts

    // Check for unique titles
    const uniqueNewsItems = [];
    const titlesSet = new Set();
    newsItems.forEach(item => {
      if (!titlesSet.has(item.titleHtml)) {
        uniqueNewsItems.push(item);
        titlesSet.add(item.titleHtml);
      }
    });

    setCachedData(language, uniqueNewsItems);
    console.log(`Fetched ${uniqueNewsItems.length} news items for language: ${language}`);
    res.status(200).json(uniqueNewsItems);
  } catch (error) {
    console.error('Error parsing Telegram channels:', error);
    res.status(500).json({ error: 'Error parsing Telegram channels' });
  }
};
