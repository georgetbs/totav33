import React, { useState, useEffect } from 'react';

const CurrencyDisplayMobile = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    fetchCurrencies();
    setupInterval();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (currencies.length > 0) {
      setupInterval();
    }
  }, [currencies]);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('api/getCurrency');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const selectedCurrencies = ["USD", "EUR", "RUB", "AMD", "AZN", "TRY"];
      const filteredData = data[0].currencies.filter(currency =>
        selectedCurrencies.includes(currency.code)
      ).sort((a, b) =>
        selectedCurrencies.indexOf(a.code) - selectedCurrencies.indexOf(b.code)
      );
      const formattedData = filteredData.map(formatCurrencyData);
      setCurrencies(formattedData);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  const formatCurrencyData = currency => {
    const { quantity, code, rateFormated } = currency;
    return {
      quantity,
      code,
      rate: parseFloat(rateFormated).toFixed(4),
    };
  };

  const setupInterval = () => {
    clearInterval(intervalId);
    const newIntervalId = setInterval(() => {
      toggleBlocks();
    }, 5000); // Switch blocks every 5 seconds
    setIntervalId(newIntervalId);
  };

  const toggleBlocks = () => {
    setCurrentBlockIndex(prevIndex => (prevIndex + 1) % Math.ceil(currencies.length / 3));
  };

  const handleTouchStart = (e) => {
    const startX = e.touches[0].pageX;

    const handleTouchMove = (e) => {
      const endX = e.changedTouches[0].pageX;
      if (Math.abs(startX - endX) > 50) {
        clearInterval(intervalId);
        toggleBlocks();
        setupInterval();
        window.removeEventListener('touchmove', handleTouchMove, { passive: false });
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
  };

  const displayBlocks = currencies.reduce((acc, item, index) => {
    const blockIndex = Math.floor(index / 3);
    if (!acc[blockIndex]) acc[blockIndex] = [];
    acc[blockIndex].push(item);
    return acc;
  }, []);

  return (
    <div className="widget-table bg-white rounded p-3 md:hidden w-full">
      <div className="currency-container-mobile flex flex-col text-[#15075d]" onTouchStart={handleTouchStart}>
        {displayBlocks.map((block, index) => (
          <div key={index} className={`${currentBlockIndex === index ? 'block' : 'hidden'}`}>
            {block.map((item, idx) => (
              <div key={idx} className="currency-item flex flex-col items-start mb-2 p-3 bg-white rounded shadow-md w-full">
                <div className="font-semibold text-left text-xs w-full whitespace-nowrap">{item.quantity} {item.code}</div>
                <div className="font-semibold text-right text-xs w-full whitespace-nowrap">{item.rate} GEL</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencyDisplayMobile;
