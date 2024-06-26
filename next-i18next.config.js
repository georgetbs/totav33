const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'ka',
    locales: ['ka', 'en', 'ru'],
    localeDetection: true,
  },
  localePath: path.resolve('./public/locales'),
};
