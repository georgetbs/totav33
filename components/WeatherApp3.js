import React, { useState, useEffect } from 'react';
import cityTranslations from '../data/cityTranslations.json';
import cityTranslationsEn from '../data/cityTranslationsEn.json';
import cityTranslationsRu from '../data/cityTranslationsRu.json';
import descriptionTranslations from '../data/descriptionTranslations.json';
import descriptionTranslationsRu from '../data/descriptionTranslationsRu.json';
import smallToBigCityMapping from '../data/smallToBigCityMapping.json';
import { useTranslation } from 'next-i18next';

const CityMenu = ({
    bigCities,
    otherCities,
    onSelectCity,
    searchValue,
    onSearchChange,
    showMore,
    setShowMore,
    filteredCities,
    closeMenu
}) => {
    const { t, i18n } = useTranslation('common');

    let cityTranslationsLocal;
    if (i18n.language === 'ru') {
        cityTranslationsLocal = cityTranslationsRu;
    } else if (i18n.language === 'en') {
        cityTranslationsLocal = cityTranslationsEn;
    } else {
        cityTranslationsLocal = cityTranslations;
    }

    return (
        <div className="city-menu bg-white border border-green-800 rounded-lg p-5 max-w-5xl mx-auto z-30 absolute left-1/2 transform -translate-x-1/2 max-m:p-4 max-m:overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold max-m:text-lg">{t('select_city')}</h2>
                <button className="close-button text-xl font-semibold max-m:text-lg" onClick={closeMenu}>✖</button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                {bigCities.map(city => (
                    <button key={city} className="city-button p-2 rounded hover:bg-gray-200 max-m:p-1" onClick={() => { onSelectCity(city); closeMenu(); }}>
                        {cityTranslationsLocal[city] || city}
                    </button>
                ))}
            </div>
            <input
                className="search-input w-full p-2 border border-gray-300 rounded mt-3 max-m:p-1"
                placeholder={t('search_city')}
                value={searchValue}
                onChange={onSearchChange}
            />
            <div className="suggestions-container max-h-40 overflow-y-auto mt-3 max-m:mt-2">
                {filteredCities.map(city => (
                    <div key={city} className="suggestion p-2 hover:bg-gray-200 cursor-pointer max-m:p-1" onClick={() => { onSelectCity(city); closeMenu(); }}>
                        {cityTranslationsLocal[city] || city}
                    </div>
                ))}
            </div>
            <button className="show-more-button w-full mt-3 p-2 bg-white border border-green-800 rounded text-green-800 max-m:mt-2 max-m:p-1" onClick={() => setShowMore(!showMore)}>
                {showMore ? t('hide') : t('more_cities')}
            </button>
            {showMore && (
                <div className="additional-cities-container max-h-40 overflow-y-auto mt-3 flex flex-wrap gap-2 max-m:mt-2">
                    {otherCities.sort((a, b) => cityTranslationsLocal[a].localeCompare(cityTranslationsLocal[b], i18n.language)).map(city => (
                        <button key={city} className="city-button p-2 rounded hover:bg-gray-200 max-m:p-1" onClick={() => { onSelectCity(city); closeMenu(); }}>
                            {cityTranslationsLocal[city]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const WeatherInfo = ({
    weatherData,
    lastSuccessfulCity,
    toggleMenuVisibility,
    toggleFullForecastVisibility,
    i18n,
    t
}) => {
    const getCityName = () => {
        let cityTranslationsLocal;
        if (i18n.language === 'ru') {
            cityTranslationsLocal = cityTranslationsRu;
        } else if (i18n.language === 'en') {
            cityTranslationsLocal = cityTranslationsEn;
        } else {
            cityTranslationsLocal = cityTranslations;
        }
        return cityTranslationsLocal[lastSuccessfulCity] || cityTranslationsLocal[weatherData?.name] || lastSuccessfulCity || weatherData?.name;
    };

    const { weather, main, wind } = weatherData;

    const cityName = getCityName();

    let description;
    if (i18n.language === 'ru') {
        description = descriptionTranslationsRu[weather[0].description] || weather[0].description;
    } else if (i18n.language === 'en') {
        description = weather[0].description;
    } else {
        description = descriptionTranslations[weather[0].description] || weather[0].description;
    }

    return (
        <div className="bg-white p-4 rounded-lg border shadow-md hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer max-m:p-2" onClick={toggleFullForecastVisibility}>
            <div className="weather-widget-header flex items-center justify-center">
                <button className="citynamebutton bg-transparent border-none cursor-pointer hover:text-green-800" onClick={(e) => { e.stopPropagation(); toggleMenuVisibility(); }}>
                    <p className="city text-xl font-semibold max-m:text-lg">{cityName}</p>
                </button>
            </div>
            <div className="weather-widget-body flex flex-col items-center justify-center gap-2 cursor-pointer">
                <p className="temperature text-2xl font-bold max-m:text-xl">{Math.round(main.temp)}°C</p>
                <img src={`https://openweathermap.org/img/wn/${weather[0].icon}.png`} alt={description} className="weather-icon w-10 h-10 max-m:w-8 max-m:h-8" />
                <p className="description text-sm text-gray-600 max-m:text-xs">{description}</p>
            </div>
            <div className="weather-widget-bottom flex justify-center gap-2 mt-2 max-m:mt-1">
                <p className="feels-like text-sm text-gray-600 max-m:text-xs">{t('feels_like')}: {Math.round(main.feels_like)}°C</p>
                <p className="wind text-sm text-gray-600 max-m:text-xs">{wind.speed} {t('ms')}</p>
            </div>
            <button className="expand-button text-green-800 text-xl mt-2 max-m:mt-1 max-m:text-lg flex items-center">
                🔍 <span className="ml-1">{t('more_details')}</span>
            </button>
        </div>
    );
};

const PartOfDayForecast = ({
    forecastData,
    weatherData,
    toggleFullForecastVisibility,
    i18n,
    t,
    groupForecastByDayAndTime,
    getTimeOfDay
}) => {
    if (!forecastData) return null;

    const groupedForecast = groupForecastByDayAndTime(forecastData.list, weatherData.timezone);
    const partsOfDayOrder = ['fn', 'm', 'd', 'e'];

    const currentDate = new Date(new Date().getTime() + weatherData.timezone * 1000 - 3600);
    const todayKey = currentDate.toISOString().split('T')[0];
    const currentHour = currentDate.getUTCHours();

    let partOfDayForecastItems = [];
    const addedPeriods = new Set();

    for (let day of Object.keys(groupedForecast)) {
        for (let pod of partsOfDayOrder) {
            let items = groupedForecast[day][pod];

            if (day === todayKey) {
                items = items.filter(item => {
                    const forecastHour = new Date((item.dt + weatherData.timezone - 3600) * 1000).getUTCHours();
                    return forecastHour > currentHour;
                });
            }

            if (items.length > 0 && !addedPeriods.has(pod)) {
                partOfDayForecastItems.push({...items[0], customPod: pod});
                addedPeriods.add(pod);
            }

            if (partOfDayForecastItems.length >= 3) break;
        }
        if (partOfDayForecastItems.length >= 3) break;
    }

    return (
        <div className="part-of-day-forecast-container mt-4 hidden xl:flex gap-2 cursor-pointer" onClick={toggleFullForecastVisibility}>
            {partOfDayForecastItems.slice(0, 3).map((item, index) => {
                const timeOfDay = getTimeOfDay(item.customPod);
                const temperature = Math.round(item.main.temp);
                const icon = item.weather[0].icon;

                return (
                    <div key={index} className="time-forecast rounded-lg p-2 flex-shrink-0 bg-white flex flex-col items-center gap-2 max-m:p-1">
                        <p className="time font-semibold break-all text-center max-m:text-xs">{timeOfDay}</p>
                        <div className="forecast-item flex flex-col items-center gap-2 p-2 bg-white rounded-lg mb-2 max-m:mb-1">
                            <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt="Weather Icon" className="weather-icon w-8 h-8 max-m:w-6 max-m:h-6" />
                            <p className="max-m:text-xs">{temperature}°C</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const HourlyForecast = ({
    forecastData,
    weatherData,
    selectedDay,
    setSelectedDay,
    i18n,
    t,
    groupForecastByDayAndTime,
    getTimeOfDay
}) => {
    const removeInvalidForecasts = (items) => {
        const currentTime = new Date();
        const adjustedCurrentTime = new Date(currentTime.getTime() + weatherData.timezone * 1000 - 3600);

        return items.filter(item => {
            const forecastTime = new Date((item.dt + weatherData.timezone - 3600) * 1000);
            return forecastTime > adjustedCurrentTime;
        });
    };

    const groupedForecast = groupForecastByDayAndTime(forecastData.list, weatherData.timezone);
    const filteredForecastItems = groupedForecast[selectedDay] ?
        groupedForecast[selectedDay].fn.concat(groupedForecast[selectedDay].m, groupedForecast[selectedDay].d, groupedForecast[selectedDay].e) : [];

    const validForecastItems = removeInvalidForecasts(filteredForecastItems);

    const sortedForecastItems = validForecastItems.sort((a, b) => new Date(a.dt * 1000).getTime() - new Date(b.dt * 1000).getTime());

    const getGeorgianWeekday = (dayIndex) => {
        const weekdays = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
        return weekdays[dayIndex];
    };

    const getGeorgianMonth = (monthIndex) => {
        const months = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
        return months[monthIndex];
    };

    return (
        <div className="hourly-forecast bg-white p-4 rounded-lg max-w-full mx-auto overflow-x-auto max-m:p-2">
            <div className="tabs flex flex-row space-x-2 mb-4 overflow-x-auto">
                {Object.keys(groupedForecast).map((day, index) => {
                    const date = new Date(day);
                    const weekday = i18n.language === 'ka' ? getGeorgianWeekday(date.getUTCDay()) : date.toLocaleString(i18n.language, { weekday: 'long' });
                    const dayMonth = `${date.getUTCDate()} ${i18n.language === 'ka' ? getGeorgianMonth(date.getUTCMonth()) : date.toLocaleString(i18n.language, { month: 'long' })}`;
                    return (
                        <button
                            key={index}
                            className={`tab ${selectedDay === day ? 'bg-green-800 text-white' : 'bg-gray-300 text-gray-700'} px-4 py-2 rounded max-m:px-2 max-m:py-1 max-m:text-xs`}
                            onClick={() => setSelectedDay(day)}
                        >
                            {weekday}, {dayMonth}
                        </button>
                    );
                })}
            </div>
            <div className="weather-container flex gap-4 overflow-x-auto">
                {sortedForecastItems
                    .map((item, idx) => {
                        const forecastTime = new Date((item.dt + weatherData.timezone - 3600) * 1000);
                        const hours = forecastTime.getUTCHours();
                        const time = `${hours.toString().padStart(2, '0')}:00`;
                        const temperature = Math.round(item.main.temp);
                        const icon = item.weather[0].icon;
                        let description;
                        if (i18n.language === 'ru') {
                            description = descriptionTranslationsRu[item.weather[0].description] || item.weather[0].description;
                        } else if (i18n.language === 'en') {
                            description = item.weather[0].description;
                        } else {
                            description = descriptionTranslations[item.weather[0].description] || item.weather[0].description;
                        }
                        return (
                            <div key={idx} className="hour-forecast-item border rounded-lg p-2 flex-shrink-0 bg-white flex flex-col items-center gap-2 max-m:p-1">
                                <p className="time font-semibold max-m:text-xs">{time}</p>
                                <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt={description} className="weather-icon w-8 h-8 max-m:w-6 max-m:h-6" />
                                <p className="max-m:text-xs">{temperature}°C</p>
                                <p className="max-m:text-xs">{description}</p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

const DailyForecast = ({
    forecastData,
    weatherData,
    i18n,
    t,
    groupForecastByDayAndTime
}) => {
    const calculateMaxTemperature = (items) => {
        const maxTemp = Math.max(...items.map(item => item.main.temp));
        return Math.round(maxTemp);
    };

    const getGeorgianWeekday = (dayIndex) => {
        const weekdays = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
        return weekdays[dayIndex];
    };

    const getGeorgianMonth = (monthIndex) => {
        const months = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
        return months[monthIndex];
    };

    const groupedForecast = groupForecastByDayAndTime(forecastData.list, weatherData.timezone);

    return (
        <div className="daily-forecast bg-white p-4 rounded-lg max-w-full mx-auto overflow-x-auto max-m:p-2">
            <div className="weather-container flex gap-4 mt-4 overflow-x-auto">
                {Object.keys(groupedForecast).map((day, index) => {
                    const date = new Date(day);
                    const weekday = i18n.language === 'ka' ? getGeorgianWeekday(date.getUTCDay()) : date.toLocaleString(i18n.language, { weekday: 'long' });
                    const dayMonth = `${date.getUTCDate()} ${i18n.language === 'ka' ? getGeorgianMonth(date.getUTCMonth()) : date.toLocaleString(i18n.language, { month: 'long' })}`;
                    const items = groupedForecast[day]['d'];
                    if (items.length === 0) return null;
                    const temperature = calculateMaxTemperature(items);
                    const icon = items[0].weather[0].icon;

                    return (
                        <div key={index} className="day-forecast border rounded-lg p-2 flex-shrink-0 bg-white max-m:p-1">
                            <p className="date font-semibold break-all text-center max-m:text-xs">{weekday},<br />{dayMonth}</p>
                            <div className="forecast-item flex flex-col items-center gap-2 p-2 bg-white rounded-lg mb-2 max-m:mb-1">
                                <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt="Weather Icon" className="weather-icon w-8 h-8 max-m:w-6 max-m:h-6" />
                                <p className="max-m:text-xs">{temperature}°C</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const FullForecast = ({
    forecastData,
    weatherData,
    activeTab,
    setActiveTab,
    selectedDay,
    setSelectedDay,
    closeFullForecast,
    i18n,
    t,
    toggleMenuVisibility,
    groupForecastByDayAndTime,
    getTimeOfDay
}) => {
    const getCityName = () => {
        let cityTranslationsLocal;
        if (i18n.language === 'ru') {
            cityTranslationsLocal = cityTranslationsRu;
        } else if (i18n.language === 'en') {
            cityTranslationsLocal = cityTranslationsEn;
        } else {
            cityTranslationsLocal = cityTranslations;
        }
        return cityTranslationsLocal[weatherData.name] || weatherData.name;
    };

    const getGeorgianWeekday = (dayIndex) => {
        const weekdays = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
        return weekdays[dayIndex];
    };

    const getGeorgianMonth = (monthIndex) => {
        const months = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
        return months[monthIndex];
    };

    if (!forecastData) return null;

    const groupedForecast = groupForecastByDayAndTime(forecastData.list, weatherData.timezone);
    const partsOfDayOrder = ['fn', 'm', 'd', 'e'];

    return (
        <div className="full-forecast bg-white p-4 rounded-lg max-w-full mx-auto overflow-x-auto max-m:p-2">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex-grow mb-2 max-m:text-lg">
                    {t('weather_forecast')}
                    <button className="citynamebutton bg-transparent border-none cursor-pointer hover:text-green-800" onClick={toggleMenuVisibility}>
                        <span className="city text-xl font-semibold px-1 max-m:text-lg">{getCityName()}</span>
                    </button>
                </h2>
                <button className="close-button text-lg font-semibold md:absolute md:top-4 md:right-4 max-m:text-base" onClick={closeFullForecast}>✖</button>
            </div>
            <div className="tabs flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4 max-m:space-y-1 max-m:space-x-2">
                <button
                    className={`tab ${activeTab === 'part_of_day' ? 'bg-green-800 text-white' : 'bg-gray-300 text-gray-700'} px-4 py-2 rounded max-m:px-2 max-m:py-1 max-m:text-xs`}
                    onClick={() => setActiveTab('part_of_day')}
                >
                    {t('weather_by_part_of_day')}
                </button>
                <button
                    className={`tab ${activeTab === 'hourly' ? 'bg-green-800 text-white' : 'bg-gray-300 text-gray-700'} px-4 py-2 rounded max-m:px-2 max-m:py-1 max-m:text-xs`}
                    onClick={() => setActiveTab('hourly')}
                >
                    {t('weather_by_hour')}
                </button>
                <button
                    className={`tab ${activeTab === 'daily' ? 'bg-green-800 text-white' : 'bg-gray-300 text-gray-700'} px-4 py-2 rounded max-m:px-2 max-m:py-1 max-m:text-xs`}
                    onClick={() => setActiveTab('daily')}
                >
                    {t('weather_by_day')}
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'part_of_day' && (
                    <div className="part-of-day-container flex gap-4 overflow-x-auto">
                        {Object.keys(groupedForecast).map((day, index) => (
                            <div key={index} className="day-forecast p-2 flex-shrink-0 bg-white rounded-lg shadow-md max-w-xs">
                                <h3 className="date text-lg font-semibold mb-2">
                                    {i18n.language === 'ka'
                                        ? `${getGeorgianWeekday(new Date(day).getUTCDay())}, ${new Date(day).getUTCDate()} ${getGeorgianMonth(new Date(day).getUTCMonth())}`
                                        : new Date(day).toLocaleDateString(i18n.language, { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {partsOfDayOrder.map(pod => {
                                        const items = groupedForecast[day][pod];
                                        if (items.length > 0) {
                                            const item = items[0];
                                            const timeOfDay = getTimeOfDay(pod);
                                            const temperature = Math.round(item.main.temp);
                                            const icon = item.weather[0].icon;

                                            return (
                                                <div key={pod} className="time-forecast rounded-lg p-2 flex-shrink-0 bg-white flex flex-col items-center gap-2 max-m:p-1">
                                                    <p className="time font-semibold break-all text-center max-m:text-xs">{timeOfDay}</p>
                                                    <div className="forecast-item flex flex-col items-center gap-2 p-2 bg-white rounded-lg mb-2 max-m:mb-1">
                                                        <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt="Weather Icon" className="weather-icon w-8 h-8 max-m:w-6 max-m:h-6" />
                                                        <p className="max-m:text-xs">{temperature}°C</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'hourly' && <HourlyForecast forecastData={forecastData} weatherData={weatherData} selectedDay={selectedDay} setSelectedDay={setSelectedDay} i18n={i18n} t={t} groupForecastByDayAndTime={groupForecastByDayAndTime} getTimeOfDay={getTimeOfDay} />}
                {activeTab === 'daily' && <DailyForecast forecastData={forecastData} weatherData={weatherData} i18n={i18n} t={t} groupForecastByDayAndTime={groupForecastByDayAndTime} />}
            </div>
        </div>
    );
};

const WeatherApp = () => {
    const [lastSuccessfulCity, setLastSuccessfulCity] = useState(null);
    const [error, setError] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [fullForecastVisible, setFullForecastVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [activeTab, setActiveTab] = useState('part_of_day');
    const [selectedDay, setSelectedDay] = useState('');
    const [serverTime, setServerTime] = useState('');

    const { t, i18n } = useTranslation('common');

    useEffect(() => {
        fetchInitialData();
        fetchServerTime();
    }, []);

    const fetchServerTime = async () => {
        try {
            const response = await fetch('/api/getCurrentTime');
            const data = await response.json();
            setServerTime(data.currentTime);
        } catch (error) {
            console.error('Failed to fetch server time', error);
        }
    };

    const fetchInitialData = async () => {
        try {
            const weatherRes = await fetch('/api/getWeather');
            const weatherJson = await weatherRes.json();
            setWeatherData(weatherJson);
            const forecastRes = await fetch('/api/getForecast');
            const forecastJson = await forecastRes.json();
            setForecastData(forecastJson);
            setSelectedDay(Object.keys(groupForecastByDayAndTime(forecastJson.list, forecastJson.city.timezone))[0]);
            setError('');
        } catch (error) {
            setError('Failed to load initial weather data');
        }
    };

    const handleSearchChange = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchValue(value);
        if (!value.trim()) {
            setFilteredCities([]);
            return;
        }
        const allTranslations = {
            ...cityTranslations,
            ...cityTranslationsEn,
            ...cityTranslationsRu
        };
        const cities = Object.keys(allTranslations).filter(
            city =>
                (cityTranslations[city] && cityTranslations[city].toLowerCase().startsWith(value)) ||
                (cityTranslationsEn[city] && cityTranslationsEn[city].toLowerCase().startsWith(value)) ||
                (cityTranslationsRu[city] && cityTranslationsRu[city].toLowerCase().startsWith(value))
        ).sort((a, b) => allTranslations[a].localeCompare(allTranslations[b], i18n.language));
        setFilteredCities(cities);
    };

    const fetchWeatherByCity = async (cityName) => {
        const targetCityName = smallToBigCityMapping[cityName] || cityName;
        try {
            const weatherRes = await fetch(`/api/getWeatherByCities`);
            const weatherJson = await weatherRes.json();
            const cityWeather = weatherJson.find(city => city.name === targetCityName);
            if (!cityWeather) throw new Error('City not found');
            setWeatherData(cityWeather);
            const forecastRes = await fetch(`/api/getForecastByCities`);
            const forecastJson = await forecastRes.json();
            const cityForecast = forecastJson.find(forecast => forecast.city.name === targetCityName);
            if (!cityForecast) throw new Error('City not found');
            setForecastData(cityForecast);
            setLastSuccessfulCity(cityName);
            toggleMenuVisibility();
            setError('');
        } catch (error) {
            setError('Failed to fetch weather or forecast data for selected city');
        }
    };

    const toggleMenuVisibility = () => {
        const visible = !menuVisible;
        setMenuVisible(visible);
        setIsOverlayVisible(visible);
    };

    const closeMenu = () => {
        setMenuVisible(false);
        setIsOverlayVisible(false);
    };

    const toggleFullForecastVisibility = () => {
        const visible = !fullForecastVisible;
        setFullForecastVisible(visible);
    };

    const closeFullForecast = () => {
        setFullForecastVisible(false);
    };

    const groupForecastByDayAndTime = (forecast, timezone) => {
        const groupedData = {};
        forecast.forEach(item => {
            const date = new Date((item.dt + timezone - 3600) * 1000);
            const dayKey = date.toISOString().split('T')[0];
            const hour = date.getUTCHours();
            let pod;
    
            if (hour >= 0 && hour < 5) {
                pod = 'fn';
            } else if (hour >= 5 && hour < 11) {
                pod = 'm';
            } else if (hour >= 11 && hour < 16) {
                pod = 'd';
            } else {
                pod = 'e';
            }
    
            if (!groupedData[dayKey]) {
                groupedData[dayKey] = { fn: [], m: [], d: [], e: [] };
            }
            groupedData[dayKey][pod].push(item);
        });
        return groupedData;
    };
    const getTimeOfDay = (pod) => {
        switch (pod) {
            case 'm': return t('morning');
            case 'd': return t('daytime');
            case 'e': return t('evening');
            case 'n':
            case 'fn': return t('night');
            default: return "";
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (menuVisible || fullForecastVisible) {
            const body = document.body;
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            const scrollY = window.scrollY;
            body.style.position = 'fixed';
            body.style.top = `-${scrollY}px`;
            body.style.width = '100%';
            body.style.overflowY = 'hidden';
            body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            const body = document.body;
            const scrollY = body.style.top;
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            body.style.overflowY = '';
            body.style.paddingRight = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [menuVisible, fullForecastVisible]);

    return (
        <>
            {error && <div id="error-container" className="text-red-500">{error}</div>}
            {weatherData && (
                <WeatherInfo 
                    weatherData={weatherData}
                    lastSuccessfulCity={lastSuccessfulCity}
                    toggleMenuVisibility={toggleMenuVisibility}
                    toggleFullForecastVisibility={toggleFullForecastVisibility}
                    i18n={i18n}
                    t={t}
                />
            )}
            <div className="part-of-day-forecast-container mt-4">
                {forecastData && <PartOfDayForecast forecastData={forecastData} weatherData={weatherData} toggleFullForecastVisibility={toggleFullForecastVisibility} i18n={i18n} t={t} groupForecastByDayAndTime={groupForecastByDayAndTime} getTimeOfDay={getTimeOfDay} />}
            </div>
            {fullForecastVisible && (
                <div className="full-forecast-overlay fixed inset-0 bg-white bg-opacity-50 z-30 flex justify-start md:justify-center items-center" onClick={closeFullForecast}>
                    <div className="relative max-w-full shadow-md border rounded-md" onClick={(e) => e.stopPropagation()}>
                        <FullForecast 
                            forecastData={forecastData} 
                            weatherData={weatherData} 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            selectedDay={selectedDay}
                            setSelectedDay={setSelectedDay}
                            closeFullForecast={closeFullForecast}
                            i18n={i18n}
                            t={t}
                            toggleMenuVisibility={toggleMenuVisibility}
                            groupForecastByDayAndTime={groupForecastByDayAndTime}
                            getTimeOfDay={getTimeOfDay}
                        />
                    </div>
                </div>
            )}
            {menuVisible && (
                <CityMenu
                    bigCities={["Tbilisi", "Saburtalo", "Meria", "K'alak'i T'bilisi", "Zahesi", "Batumi", "Rustavi", "Kutaisi", "Zugdidi", "Sukhumi", "Telavi", "Akhalts'ikhe", "Stepantsminda", "Mestia", "Oni"]}
                    otherCities={Object.keys(cityTranslations).filter(city => !["Tbilisi", "Saburtalo", "Meria", "K'alak'i T'bilisi", "Zahesi", "Batumi", "Rustavi", "Kutaisi", "Zugdidi", "Sukhumi", "Telavi", "Akhalts'ikhe", "Stepantsminda", "Mestia", "Oni"].includes(city)).sort((a, b) => cityTranslations[a].localeCompare(cityTranslations[b], i18n.language))}
                    onSelectCity={fetchWeatherByCity}
                    closeMenu={closeMenu}
                    searchValue={searchValue}
                    onSearchChange={handleSearchChange}
                    showMore={showMore}
                    setShowMore={setShowMore}
                    filteredCities={filteredCities}
                />
            )}
            {isOverlayVisible && <div className="fixed inset-0 bg-white bg-opacity-50 z-20" onClick={closeMenu}></div>}
        </>
    );
};

export default WeatherApp;
