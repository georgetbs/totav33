import React, { useState, useEffect, useRef } from "react";
import NewsLinks from "./newsLinks";
import { useTranslation } from 'next-i18next';
import menuItems from '../data/newsItems.json';

const CACHE_KEY_PREFIX = 'newsCache_';
const CACHE_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes in milliseconds

const NewsSection = () => {
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [newsData, setNewsData] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { t, i18n } = useTranslation('common');
  const [language, setLanguage] = useState(i18n.language || 'ka');
  const menuRef = useRef(null);
  const menuItemRefs = useRef([]);
  const existingTitles = useRef(new Set());

  useEffect(() => {
    if (language !== i18n.language) {
      setLanguage(i18n.language);
      setActiveMenuIndex(0); // Reset to "all" section when language changes
    }
  }, [i18n.language]);

  useEffect(() => {
    setNewsData({});
    setIsInitialLoading(true);
    const menuData = menuItems[language];

    if (!menuData || menuData.length === 0) {
      setActiveMenuIndex(0);
    } else if (menuData[activeMenuIndex] === undefined) {
      const allSectionIndex = menuData.findIndex(item => item.id === 'all');
      setActiveMenuIndex(allSectionIndex !== -1 ? allSectionIndex : 0);
    }

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 10000); // 10 секунд

    menuData.forEach((item) => {
      const cacheKey = `${CACHE_KEY_PREFIX}${language}_${item.id}`;
      const cache = JSON.parse(localStorage.getItem(cacheKey));
      if (cache && (Date.now() - cache.timestamp < CACHE_TIME_LIMIT)) {
        setNewsData(prev => ({ ...prev, [item.id]: cache.data }));
      } else {
        fetchNewsData(item);
      }
    });

    return () => clearTimeout(timer);
  }, [language]);

  useEffect(() => {
    if (menuItemRefs.current[activeMenuIndex]) {
      menuItemRefs.current[activeMenuIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeMenuIndex]);

  const handleMenuClick = (index) => {
    setActiveMenuIndex(index);
  };

  const updateSwipeStart = (e) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const executeSwipeEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    if (startX !== null && startY !== null && Math.abs(startX - endX) > Math.abs(startY - endY)) {
      if (Math.abs(startX - endX) > 50) {
        const direction = startX > endX ? 1 : -1;
        setActiveMenuIndex((prevIndex) => {
          const newIndex = (prevIndex + direction + menuItems[language].length) % menuItems[language].length;
          if (menuItemRefs.current[newIndex]) {
            setTimeout(() => {
              menuItemRefs.current[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }, 100);
          }
          return newIndex;
        });
      }
    }

    setStartX(null);
    setStartY(null);
  };

  const fetchNewsData = async (item) => {
    try {
      const newsPromises = item.sources.map(source =>
        fetch(source).then(res => res.json()).then(data => data).catch(err => {
          console.error(`Error fetching from ${source}:`, err);
          return [];
        })
      );

      const newsResults = await Promise.all(newsPromises);
      let combinedNews = newsResults.flat().filter(news =>
        news.title && news.link && news.title.length <= item.maxTitleLength && item.cacheKeys.includes(news.cacheKey)
      );

      combinedNews = combinedNews.filter(news => 
        !item.filterSubstrings.some(substring => news.title.includes(substring))
      );

      combinedNews = combinedNews.filter(news => isTitleUnique(news.title));
      combinedNews = combinedNews.sort(() => Math.random() - 0.5).slice(0, item.maxNewsDisplay);

      setNewsData(prev => ({ ...prev, [item.id]: combinedNews }));
      const cacheKey = `${CACHE_KEY_PREFIX}${language}_${item.id}`;
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: combinedNews }));
    } catch (error) {
      console.error('Error fetching aggregated news:', error);
      setNewsData(prev => ({ ...prev, [item.id]: [] }));
    }
  };

  const isTitleUnique = (title) => {
    const words = title.split(/\s+/);
    for (let existingTitle of existingTitles.current) {
      let existingWords = existingTitle.split(/\s+/);
      let commonWords = words.filter(word => existingWords.includes(word));
      if (
        commonWords.length >= Math.min(5, words.length * 0.5) ||
        commonWords.length >= Math.min(5, existingWords.length * 0.5)
      ) {
        return false;
      }
    }
    existingTitles.current.add(title);
    return true;
  };

  return (
    <section className="news bg-white border-0 mt-0 text-left pb-10 mb-0">
      <nav className="news-menu border-0 pt-0 overflow-x-auto mb-4 whitespace-nowrap" ref={menuRef}>
        <ul className="flex p-0 m-0 whitespace-nowrap list-none">
          {menuItems[language]?.map((item, index) => (
            <li key={item.id} className="inline-block mr-2 overflow-hidden text-ellipsis shrink-0" ref={el => menuItemRefs.current[index] = el}>
              <h2
                className={`block px-2 py-1 rounded transition text-lg cursor-pointer ${index === activeMenuIndex ? 'bg-blue-100 text-blue-900 active' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleMenuClick(index)}
              >
                {t(item.name)}
              </h2>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className="news-content"
        onTouchStart={updateSwipeStart}
        onTouchEnd={executeSwipeEnd}
      >
        {menuItems[language]?.map((item, index) => (
          <div
            key={item.id}
            className={`news-category ${index === activeMenuIndex ? 'block' : 'hidden'}`}
          >
            {newsData[item.id] && newsData[item.id].length > 0 ? (
              <NewsLinks newsItems={newsData[item.id]} />
            ) : !isInitialLoading ? (
              <div className="text-center">{t('noNewsAvailable')}</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
