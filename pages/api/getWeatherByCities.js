import { cachedCitiesWeatherData, updateWeatherData } from '../../lib/update-weather';

export default async function handler(req, res) {
    await updateWeatherData(); // Обновляем данные о погоде, если нужно
    res.status(200).json(cachedCitiesWeatherData);
  }