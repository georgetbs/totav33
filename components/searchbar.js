import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation('common');

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClearInput = () => {
    setSearchValue('');
  };

  const handleSubmit = (e) => {
    if (!searchValue.trim()) {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-3xl mx-auto relative">
      <form
        id="searchForm"
        action="https://www.google.com/search"
        method="GET"
        target="_blank"
        rel="noopener"
        onSubmit={handleSubmit}
        className="relative flex items-center"
      >
        <input
          name="q"
          type="text"
          id="searchInput"
          placeholder={t('enter_search_query')}
          value={searchValue}
          onChange={handleInputChange}
          className="w-full py-2 px-5 pr-10 text-lg border-2 border-green-700 rounded-full shadow-md focus:border-red-500 focus:outline-none focus:outline-1 focus:outline-red-500 focus:outline-offset-[-2px]"
          autoComplete="off"
          noValidate
        />
        {searchValue && (
          <button
            type="button"
            id="clearInput"
            onClick={handleClearInput}
            className="absolute right-10 w-6 h-6 flex items-center justify-center"
          >
            <img src="/cancel2.svg" alt="Clear" className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 w-6 h-6 flex items-center justify-center"
        >
          <img src="/loupe.svg" alt="Search" className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
