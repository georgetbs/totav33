import NodeCache from "node-cache";

// Создаем экземпляры кэша для каждого типа данных
const weatherCache = new NodeCache({ stdTTL: 900 }); // 15 минут для погоды
const forecastCache = new NodeCache({ stdTTL: 3600 }); // 1 час для прогноза
const citiesWeatherCache = new NodeCache({ stdTTL: 600 }); // 10 минут для погоды по городам
const citiesForecastCache = new NodeCache({ stdTTL: 1800 }); // 30 минут для прогноза по городам

// Функция обновления кэша погоды
const updateWeatherCache = (key, data) => {
  weatherCache.set(key, data);
};

// Функция обновления кэша прогноза
const updateForecastCache = (key, data) => {
  forecastCache.set(key, data);
};

// Функция обновления кэша погоды по городам
const updateCitiesWeatherCache = (data) => {
  citiesWeatherCache.set("citiesWeather", data);
};

// Функция обновления кэша прогноза по городам
const updateCitiesForecastCache = (data) => {
  citiesForecastCache.set("citiesForecast", data);
};

// Функции получения данных из кэша
const getWeatherFromCache = (key) => {
  return weatherCache.get(key);
};

const getForecastFromCache = (key) => {
  return forecastCache.get(key);
};

const getCitiesWeatherFromCache = () => {
  return citiesWeatherCache.get("citiesWeather");
};

const getCitiesForecastFromCache = () => {
  return citiesForecastCache.get("citiesForecast");
};

export {
  updateWeatherCache,
  updateForecastCache,
  updateCitiesWeatherCache,
  updateCitiesForecastCache,
  getWeatherFromCache,
  getForecastFromCache,
  getCitiesWeatherFromCache,
  getCitiesForecastFromCache
};
