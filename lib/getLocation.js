import fetch from 'node-fetch';
import http from 'http';

const httpAgent = new http.Agent({
  keepAlive: true
});

// Функция для получения данных о местоположении по IP-адресу
const getPublicIP = async (ip) => {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`, { agent: httpAgent });
    const data = await response.json();
    if (data.status === 'success') {
      return { lat: data.lat, lon: data.lon };
    } else {
      throw new Error('Failed to get location data');
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};

// Функция для получения координат местоположения
const getLocation = async (req) => {
  let lat, lon;
  let userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Если в заголовке 'x-forwarded-for' несколько IP-адресов, разделенных запятыми, берем первый
  if (typeof userIp === 'string' && userIp.includes(',')) {
    userIp = userIp.split(',')[0].trim();
  }

  // Парсим URL-запрос для получения параметров 'lat' и 'lon'
  const url = new URL(req.url, `http://${req.headers.host}`);
  lat = url.searchParams.get('lat');
  lon = url.searchParams.get('lon');

  // Если координаты не переданы в запросе
  if (!lat || !lon) {
    console.log('User IP:', userIp);
    const locationData = await getPublicIP(userIp);
    if (locationData) {
      lat = locationData.lat;
      lon = locationData.lon;
    } else {
      // Координаты по умолчанию, если не удалось получить местоположение
      lat = 1.7;
      lon = 44.1;
    }
  }

  return { lat, lon };
};

export default getLocation;
