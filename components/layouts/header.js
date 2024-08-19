import React from 'react';
import SearchBar from '../../components/searchbar';
import Script from 'next/script';
import CurrencyInfo from '@/components/CurrencyInfo';
import WeatherApp3 from '@/components/WeatherApp3';

const Header = () => {
  return (
    <header className="flex max-m:flex-col max-m:w-full justify-center gap-4 px-5 py-3">
      <div className="flex flex-col md:max-w-[400px] max-m:flex-row max-m:justify-center max-m:gap-1 items-center max-m:w-full w-1/4 max-w-s">
        <img 
          src="/logo21.png" 
          alt="Logo" 
          className="w-[225px] h-[85px]" 
        />
      </div>
      <div className="flex flex-1 items-center w-1/2 max-m:w-full max-w-3xl">
        <div className="w-full mt-2">
          <SearchBar />
          <div className="flex md:flex-row max-m:flex-col gap-2 justify-center items-center mt-1 max-w-1/2">
            <WeatherApp3 />
           <div className='-mb-10'></div>
             <CurrencyInfo />
            </div>

        </div>
      </div>
      <div className="hidden m:flex flex-col w-1/4  items-center justify-center">
        {/* Additional elements can be added here */}
        <div className='mr-28 -mt-8' id="top-ge-counter-container" data-site-id="117540"></div>
        <Script src="//counter.top.ge/counter.js" async />
      </div>
    </header>
  );
};

export default Header;
