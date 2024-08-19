import React from 'react';

import CurrencyDisplayMobile from './CurrencyInfoMobile';
import { useTranslation } from 'next-i18next';

const WeatherColumn = () => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col md:max-w-[400px] max-m:flex-row max-m:justify-center max-m:gap-1 items-center max-m:w-full w-1/4 max-w-s">
      <div className="hidden md:block xl:hidden bg-white max-w-[300px] w-full">
      </div>
      <div className="hidden">
        <CurrencyDisplayMobile />
      </div>
    </div>
  );
};

export default WeatherColumn;
