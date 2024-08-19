const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'ka',
    locales: ['ka', 'en', 'ru'],
    localeDetection: true,  // Отключаем автоматическое определение языка
  },
  localePath: path.resolve('./public/locales'),
};
