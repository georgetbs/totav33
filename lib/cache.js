// lib/cache.js
const NodeCache = require('node-cache');
const newsCache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Кэш живет 10 минут

module.exports = newsCache;
