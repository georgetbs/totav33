import React from 'react';
import CurrencyInfo from './CurrencyInfo';
import { useTranslation } from 'next-i18next';

const EmptyColumn = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <div className="bg-white max-w-[300px] w-full">
        <h3 className="text-black font-semibold mb-1 text-center">{t('currency_rates')}</h3>
        <CurrencyInfo />
      </div>
      <div className="bg-white w-full]">
        {/* Additional content can go here */}
      </div>
    </>
  );
};

export default EmptyColumn;
