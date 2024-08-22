import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import nextI18NextConfig from './next-i18next.config.js';

// Функция для получения языка из кэша
function getCachedLanguage() {
  return localStorage.getItem('i18nextLng') || document.cookie.match(/i18next=([^;]+)/)?.[1];
}

// Функция для установки языка
function setLanguage(language) {
  i18n.changeLanguage(language);
  localStorage.setItem('i18nextLng', language);
  document.cookie = `i18next=${language}; path=/; max-age=31536000`; // 1 год
}

// Устанавливаем язык из кэша или используем язык по умолчанию
const cachedLanguage = getCachedLanguage();
const defaultLanguage = nextI18NextConfig.i18n.defaultLocale;

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    ...nextI18NextConfig.i18n,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['localStorage', 'cookie'], // Только вручную управляемые источники
      caches: ['localStorage', 'cookie'],
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: defaultLanguage,
    debug: process.env.NODE_ENV === 'development',
    load: 'languageOnly',
  }, () => {
    // После инициализации i18n
    const detectedLanguage = cachedLanguage || defaultLanguage;
    setLanguage(detectedLanguage);
  });

export default i18n;
