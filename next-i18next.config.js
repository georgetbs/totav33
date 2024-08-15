const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'ka',
    locales: ['ka', 'en', 'ru'],
    localeDetection: false,  // Отключаем автоматическое определение языка
  },
  localePath: path.resolve('./public/locales'),
};
