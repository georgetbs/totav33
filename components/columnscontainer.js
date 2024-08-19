import React from 'react';
import WeatherColumn from './WeatherColumn';
import NewsColumn from './NewsColumn';
import EmptyColumn from './EmptyColumn';

const ColumnsContainer = () => {
  return (
    <div className="flex flex-wrap max-m:flex-col max-m:w-full justify-center px-4 md:pb-2">
      <WeatherColumn />
      <NewsColumn />
      <div className="hidden xl:flex w-1/4">
        <EmptyColumn />
      </div>
    </div>
  );
};

export default ColumnsContainer;
