import React from 'react';
import WeatherApp3 from './WeatherApp3';
import CurrencyDisplayMobile from './CurrencyInfoMobile';
import { useTranslation } from 'next-i18next';
import CurrencyInfo from './CurrencyInfo';

const WeatherColumn = () => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col md:max-w-[400px] max-m:flex-row max-m:justify-center max-m:gap-1 items-center max-m:w-full w-1/4 max-w-s">
      <WeatherApp3 />
      <div className="hidden md:block xl:hidden bg-white max-w-[300px] w-full">
        <h3 className="text-black font-semibold mb-1 text-center">{t('currency_rates')}</h3>
        <CurrencyInfo />
      </div>
      <div className="block">
        <CurrencyDisplayMobile />
      </div>
    </div>
  );
};

export default WeatherColumn;
