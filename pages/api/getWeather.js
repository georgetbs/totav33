import fetchWeatherData from '../../lib/WeatherUtils';
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
    const weatherData = await fetchWeatherData(lat, lon);
    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Error fetching weather data");
  }
}
