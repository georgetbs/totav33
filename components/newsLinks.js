import React from 'react';
import { useTranslation } from 'next-i18next';

const NewsLinks = ({ newsItems }) => {
  const { t } = useTranslation('common');

  if (newsItems.length === 0) {
    return <div>{t('loading')}</div>;
  }

  const getFaviconUrl = (link) => {
    try {
      const url = new URL(link);
      return `https://www.google.com/s2/favicons?domain=${url.hostname}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-2"> {/* Уменьшение отступов */}
      {newsItems.map((news, index) => (
        <div key={index} className="news-item p-2 border-b">
          <a href={news.link} target="_blank" rel="noopener noreferrer" className="flex items-start">
            <img src={getFaviconUrl(news.link)} className="mr-2 w-6 h-6" alt="Favicon" />
            <span className="text-blue-800 hover:underline text-base">{news.title}</span>
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsLinks;
