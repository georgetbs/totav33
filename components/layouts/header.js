import React from 'react';
import SearchBar from '../../components/searchbar';
import CurrencyInfo from '@/components/CurrencyInfo';
import WeatherApp3 from '@/components/WeatherApp3';

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row justify-center gap-4 px-5 py-3 items-start">
      <div className="flex flex-col items-center text-center w-full md:w-1/4">
        <h1 className="text-[55px] sm:text-[55px] md:text-[55px] xl:text-[65px] text-green-700 font-medium leading-none font-sf-compact">
          TOTA.GE
          <span className="block text-[13px] sm:text-[13px] md:text-[13px] xl:text-[13px] font-extrabold mt-[5px] sm:mt-[7px] md:mt-[8px] text-red-500 font-noto-sans-georgian-semicondensed">
            მთელი საქართველო ერთ სივრცეში
          </span>
        </h1>
      </div>
      <div className="flex flex-1 items-center w-full md:w-1/2 max-w-3xl mt-2">
        <div className="w-full">
          <SearchBar />
          <div className="flex md:flex-row flex-col gap-2 justify-center items-center mt-1">
            <WeatherApp3 />
            <div className="-mb-10"></div>
            <CurrencyInfo />
          </div>
        </div>
      </div>
      <div className="hidden md:flex flex-col w-1/4 items-center justify-center">
        {/* Дополнительные элементы */}
      </div>
    </header>
  );
};

export default Header;
