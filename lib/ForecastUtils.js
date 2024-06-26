import fetch from 'node-fetch';

const apiKey = "edda70953e505c33ed54481d6bd0cacf";

async function fetchForecastData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Модификация данных прогноза
    data.list.forEach(item => {
        const date = new Date(item.dt_txt);
        const hour = date.getHours();

        if (hour >= 6 && hour < 12) {
            item.sys.pod = 'm'; // Утро
        } else if (hour >= 18 && hour < 24) {
            item.sys.pod = 'e'; // Вечер
        } else if (hour === 0 || hour === 3) {
            item.sys.pod = 'fn'; // Ранняя ночь
        }
    });

    return data;
}

export default fetchForecastData
