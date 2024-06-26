import  cities  from '../data/cities';  // Импорт списка городов
import  fetchForecastData  from './ForecastUtils';

let cachedCitiesForecastData = [];
let lastUpdatedIndex = 0;
let lastFetchTime = 0;

async function updateForecastData() {
    const currentTime = new Date().getTime();
    if (currentTime - lastFetchTime >= 10 * 60 * 1000) {
        lastUpdatedIndex = 0;
        cachedCitiesForecastData = [];
    }

    const updateBatch = async () => {
        const startIndex = lastUpdatedIndex;
        const endIndex = Math.min(startIndex + 50, cities.length);
        const forecastData = await Promise.all(
            cities.slice(startIndex, endIndex).map(city => fetchForecastData(city.lat, city.lon))
        );

        forecastData.forEach((data, index) => {
            cachedCitiesForecastData[startIndex + index] = data;
        });

        lastUpdatedIndex = endIndex;
        if (lastUpdatedIndex >= cities.length) {
            lastFetchTime = currentTime;
        } else {
            setTimeout(updateBatch, 60 * 1000);
        }
    };

    if (lastUpdatedIndex === 0 || currentTime - lastFetchTime >= 10 * 60 * 1000) {
        await updateBatch();
    }
}

export { cachedCitiesForecastData, updateForecastData };
