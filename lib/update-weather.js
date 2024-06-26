import fetchWeatherData from './WeatherUtils';
import  cities  from '../data/cities'; // Путь к данным о городах

let cachedCitiesWeatherData = [];
let lastUpdatedIndex = 0;
let lastFetchTimeCities = 0;

const updateWeatherData = async () => {
  const currentTime = Date.now();
  if (currentTime - lastFetchTimeCities >= 10 * 60 * 1000) {
    lastUpdatedIndex = 0;
    cachedCitiesWeatherData = [];
  }

  const updateBatch = async () => {
    const startIndex = lastUpdatedIndex;
    const endIndex = Math.min(startIndex + 50, cities.length);
    const weatherDataPromises = cities.slice(startIndex, endIndex).map(city =>
      fetchWeatherData(city.lat, city.lon)
    );

    const weatherData = await Promise.all(weatherDataPromises);
    weatherData.forEach((data, index) => {
      cachedCitiesWeatherData[startIndex + index] = data;
    });

    lastUpdatedIndex = endIndex;
    if (lastUpdatedIndex >= cities.length) {
      lastFetchTimeCities = currentTime;
    } else {
      setTimeout(updateBatch, 60 * 1000); // Запуск следующего обновления
    }
  };

  if (lastUpdatedIndex === 0 || currentTime - lastFetchTimeCities >= 10 * 60 * 1000) {
    await updateBatch();
  }
};

export { cachedCitiesWeatherData, updateWeatherData };
