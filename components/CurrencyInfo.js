import React, { useEffect, useRef, useState } from 'react';

const CurrencyInfo = () => {
  const [currencyData, setCurrencyData] = useState([]);
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);
  const containerRef = useRef(null);

  const fetchDataAndDisplayCurrencies = async () => {
    try {
      const response = await fetch('/api/getCurrency');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const selectedCurrencies = ["USD", "EUR", "RUB", "AMD", "AZN", "TRY", "UAH"];

      if (!data || !data.length || !data[0].currencies) {
        throw new Error("Malformed data received from the API");
      }

      const filteredData = data[0].currencies.filter(currency =>
        selectedCurrencies.includes(currency.code)
      );

      const sortedData = filteredData.sort((a, b) =>
        selectedCurrencies.indexOf(a.code) - selectedCurrencies.indexOf(b.code)
      );

      setCurrencyData(sortedData);
    } catch (error) {
      console.error('Error fetching currency data:', error);
    }
  };

  useEffect(() => {
    fetchDataAndDisplayCurrencies();
    const intervalId = setInterval(fetchDataAndDisplayCurrencies, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatRate = (rate, code) => {
    if (code === 'RUB') {
      rate *= 10; // Умножаем значение для RUB на 10
    }
    const rounded = Math.round(rate * 100) / 100;
    return rounded.toFixed(2);
  };

  const getCurrencySymbol = (code) => {
    switch (code) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'RUB':
        return '₽';
      case 'AMD':
        return '֏';
      case 'AZN':
        return '₼';
      case 'TRY':
        return '₺';
      case 'UAH':
        return '₴';
      default:
        return code;
    }
  };

  const getQuantity = (code) => {
    switch (code) {
      case 'RUB':
      case 'AMD':
        return 1000;
      default:
        return ;
    }
  };

  const displayedCurrencies = currencyData.slice(0, 2); // Всегда показываем только 2 валюты

  const fullCurrencyList = currencyData.filter(
    (currency) => currency.code !== "USD" && currency.code !== "EUR"
  );

  const handleOverlayClick = () => {
    setShowAllCurrencies(false);
  };

  return (
    <div
      id="currency-info"
      className="relative flex flex-col items-center text-sm space-y-2  text-[#15075d] cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setShowAllCurrencies(!showAllCurrencies);
      }}
      ref={containerRef}
    >
      <div className="flex items-center justify-between space-x-4 p-2 bg-white rounded hover:shadow-lg transition-shadow">
        {displayedCurrencies.map((currency) => {
          const { code, rateFormated, diff } = currency;
          const formattedRate = formatRate(parseFloat(rateFormated), code);
          const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '';
          const arrowColor = diff > 0 ? 'text-green-800' : diff < 0 ? 'text-red-500' : 'text-gray-500';
          const currencySymbol = getCurrencySymbol(code);
          const quantity = getQuantity(code);

          if (["RUB", "AMD"].includes(code)) {
            return (
              <div key={code} className="flex-shrink-0  flex items-center space-x-1">
                <span className="font-semibold text-[#15075d]">{quantity}{currencySymbol}</span>
                <span className="font-semibold text-left text-[#15075d]">{formattedRate}</span>
                <span className={`font-semibold ${arrowColor}`}>{arrow}</span>
              </div>
            );
          }

          return (
            <div key={code} className="flex-shrink-0 flex items-center space-x-1">
              <span className="font-semibold text-[#15075d]">{currencySymbol} {formattedRate}</span>
              <span className={`font-semibold ${arrowColor}`}>{arrow}</span>
            </div>
          );
        })}
      </div>

      {showAllCurrencies && (
        <>
          {/* Overlay для предотвращения кликов вне окна */}
          <div
            className="fixed inset-0 bg-transparent z-20"
            onClick={handleOverlayClick}
          ></div>
          {/* Само окно с валютами */}
          <div className="absolute max-w-xs justify-center items-center top-full mt-2 w-full p-4 bg-white rounded shadow-lg z-30">
            {fullCurrencyList.map((currency) => {
              const { code, rateFormated, diff } = currency;
              const formattedRate = formatRate(parseFloat(rateFormated), code);
              const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '';
              const arrowColor = diff > 0 ? 'text-green-800' : diff < 0 ? 'text-red-500' : 'text-gray-500';
              const currencySymbol = getCurrencySymbol(code);
              const quantity = getQuantity(code);

              return (
                <div
                  key={code}
                  className="flex space-x-2 justify-between text-xs items-center mb-2 p-2 bg-gray-50 rounded"
                >
                  <span className="font-semibold text-right text-xs shrink-0 text-[#15075d]">{quantity}{currencySymbol}</span>
                  <span className="font-semibold text-left text-xs text-[#15075d]">{formattedRate}</span>
                  <span className={`font-semibold text-xs ${arrowColor} ml-2`}>{arrow}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencyInfo;
