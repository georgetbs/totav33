import React, { useState, useEffect } from 'react';
import FeedLinks from './feedLinks';
import { useTranslation } from 'next-i18next';

const CACHE_KEY_PREFIX = 'feedCache_';
const CACHE_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes in milliseconds

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation('common');
  const language = i18n.language || 'ka';

  useEffect(() => {
    setIsLoading(true);
    const feedCacheKey = `${CACHE_KEY_PREFIX}${language}`;
    const feedCache = JSON.parse(localStorage.getItem(feedCacheKey));

    if (feedCache && (Date.now() - feedCache.timestamp < CACHE_TIME_LIMIT)) {
      setFeedItems(feedCache.data);
      setIsLoading(false);
    } else {
      fetch(`/api/parseTelegram?language=${language}`)
        .then(response => response.json())
        .then(data => {
          setFeedItems(data);
          setIsLoading(false);
          localStorage.setItem(feedCacheKey, JSON.stringify({ timestamp: Date.now(), data }));
        })
        .catch(error => {
          console.error('Error fetching feed data:', error);
          setIsLoading(false);
        });
    }
  }, [language]);

  return (
    <section className="feed bg-white border-0 w-full min-h-[400px]">
     
      {isLoading ? (
        <div className="text-center">{t('loading')}</div>
      ) : (
        <FeedLinks newsItems={feedItems} />
      )}
    </section>
  );
};

export default Feed;
