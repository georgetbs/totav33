const { i18n } = require('./next-i18next.config');

module.exports = {

    i18n: {
      locales: ['ka', 'en', 'ru'], // Массив поддерживаемых языков
      defaultLocale: 'ka', // Язык по умолчанию - грузинский
      localeDetection: false, // Отключаем автоматическое определение языка
    },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};
