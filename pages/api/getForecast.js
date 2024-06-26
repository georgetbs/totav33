import fetchforecastData from '../../lib/ForecastUtils';
import getLocation from '../../lib/getLocation'; // Убедитесь, что путь корректен

export default async function handler(req, res) {
  try {
    let { lat, lon } = req.query;

    // Если параметры широты и долготы не предоставлены, получаем их через getLocation
    if (!lat || !lon) {
      const location = await getLocation(req);
      lat = location.lat;
      lon = location.lon;
    }

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    // Получаем данные о погоде, используя полученные координаты
    const forecastData = await fetchforecastData(lat, lon);
    res.status(200).json(forecastData);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    res.status(500).send("Error fetching forecast data");
  }
}
