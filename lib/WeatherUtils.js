// utils/weather-utils.js
import fetch from 'node-fetch';

const fetchWeatherData = async (lat, lon) => {
  const apiKey = "edda70953e505c33ed54481d6bd0cacf";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
};

export default fetchWeatherData;
