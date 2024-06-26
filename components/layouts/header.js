import React from 'react';
import SearchBar from '../../components/searchbar';

const Header = () => {
  return (
    <header className="flex max-m:flex-col max-m:w-full justify-center gap-4 p-5">
      <div className="flex flex-col md:max-w-[400px] max-m:flex-row max-m:justify-center max-m:gap-1 items-center max-m:w-full w-1/4 max-w-s">
        <img 
          src="/logo21.png" 
          alt="Logo" 
          className="w-[225px] h-[85px]" 
        />
      </div>
      <div className="flex mb-4 flex-1 items-center w-1/2 max-m:w-full max-w-3xl">
        <div className="w-full">
          <SearchBar />
        </div>
      </div>
      <div className="hidden m:flex flex-col w-1/4">
        {/* Additional elements can be added here */}
      </div>
    </header>
  );
};

export default Header;
