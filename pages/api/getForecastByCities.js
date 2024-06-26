import { cachedCitiesForecastData, updateForecastData } from '../../lib/update-forecast';

export default async function handler(req, res) {
    await updateForecastData(); // Обновляем данные о погоде, если нужно
    res.status(200).json(cachedCitiesForecastData);
  }