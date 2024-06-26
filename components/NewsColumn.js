import React from 'react';
import NewsSection from '../components/NewsSection';

const NewsColumn = () => {
  return (
    <div className="flex-1 w-1/2 max-m:w-full max-w-3xl md:min-h-[350px]">
      <NewsSection />
    </div>
  );
};

export default NewsColumn;
