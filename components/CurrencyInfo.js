import React, { useEffect, useState } from 'react';

const CurrencyInfo = () => {
  const [currencyData, setCurrencyData] = useState(null);

  const fetchDataAndDisplayCurrencies = async () => {
    try {
      const response = await fetch('/api/getCurrency');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const selectedCurrencies = ["USD", "EUR", "RUB", "AMD", "AZN", "TRY"];
      
      if (!data || !data.length || !data[0].currencies) {
        throw new Error("Malformed data received from the API");
      }

      const filteredData = data[0].currencies.filter(currency => 
        selectedCurrencies.includes(currency.code));

      const sortedData = filteredData.sort((a, b) =>
        selectedCurrencies.indexOf(a.code) - selectedCurrencies.indexOf(b.code));

      const formattedData = sortedData.map(currency => {
        const { quantity, code, rateFormated, diffFormated, diff } = currency;
        const sign = diff < 0 ? '-' : (diff > 0 ? '+' : '');
        const formattedDiff = `${sign}${Math.abs(diffFormated).toFixed(4)}`;
        const diffColor = diff > 0 ? 'text-green-800' : (diff < 0 ? 'text-red-500' : 'text-gray-500');
        return (
          <div key={code} className="flex items-center max-w-[300px] mb-2 p-2 bg-white rounded shadow-md">
            <div className="flex-1 text-left font-semibold text-[#15075d]">{quantity} {code}</div>
            <div className="flex-1 text-center font-semibold text-[#15075d]">{parseFloat(rateFormated).toFixed(4)} GEL</div>
            <div className={`flex-1 text-center font-semibold ${diffColor}`}>{formattedDiff}</div>
          </div>
        );
      });

      setCurrencyData(formattedData);
    } catch (error) {
      console.error('Error fetching currency data:', error);
    }
  };

  useEffect(() => {
    fetchDataAndDisplayCurrencies();
    const intervalId = setInterval(fetchDataAndDisplayCurrencies, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div id="currency-info" className="flex flex-col mt-4 text-xs text-[#15075d]">
      {currencyData}
    </div>
  );
};

export default CurrencyInfo;
