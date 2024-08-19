import React from 'react';

import { useTranslation } from 'next-i18next';

const EmptyColumn = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <div className="bg-white max-w-[300px] w-full">
    
       
      </div>
      <div className="bg-white w-full]">
        {/* Additional content can go here */}
      </div>
    </>
  );
};

export default EmptyColumn;
