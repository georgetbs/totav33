import React, { useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import menuData from '../data/menuData.json';

const desktopMenuCategories = ['tota_services', 'tickets', 'real_estate', 'stores', 'pharmacies', 'jobs', 'auto', 'handymen', 'school', 'tv_channels'];

const MainMenu = ({ areMenusVisible, toggleMenuVisibility }) => {
  const { t } = useTranslation('common');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const scrollableRef = useRef(null);

  const handleMouseEnter = (category) => {
    setActiveDropdown(category);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileCategoryClick = (category) => {
    setActiveMobileCategory(category);
  };

  const handleBackClick = () => {
    setActiveMobileCategory(null);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMobileCategory(null);
  };

  const DropdownContent = ({ t, items, isTotaServices }) => {
    return (
      <ul className="p-2 space-y-2">
        {items.map((item) => (
          <li key={item.href} className="p-2">
            <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 hover:bg-gray-100 text-lg">
              {isTotaServices && item.href.startsWith('/')
                ? <img src={item.icon} alt={item.label} className="mr-2" width="16" height="16" />
                : <img src={`https://www.google.com/s2/favicons?domain=${new URL(item.href).hostname}`} alt="favicon" width="16" height="16" className="mr-2" />
              }
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div ref={scrollableRef}>
      <nav className="main-menu w-full max-w-8xl mx-auto bg-white text-black font-sans relative">
        <ul className="flex flex-wrap justify-start p-0 m-0 list-none space-x-2">
          <li className="block md:hidden relative">
            <button
              id="toggle-menu-mobile"
              className="menu-button-mobile flex flex-col justify-center items-center p-4 -mt-4 text-green-800 text-6xl"
              aria-expanded={isMobileMenuOpen.toString()}
              onClick={handleMobileMenuToggle}
            >
              ☰
            </button>
          </li>
          {desktopMenuCategories.map((category) => (
            <li
              key={category}
              className="relative group hidden md:block"
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
            >
              <a href="#" className={`block px-4 py-2 text-lg md:text-base ${category === 'tota_services' ? 'text-green-800' : ''}`}>
                {t(menuData[category].translationKey)}
              </a>
              {activeDropdown === category && (
                <div className="absolute top-full left-0 w-max bg-white shadow-lg z-50">
                  <DropdownContent t={t} items={menuData[category].items} isTotaServices={category === 'tota_services'} />
                </div>
              )}
            </li>
          ))}
          <li className="hidden md:block relative">
            <button
              id="toggle-menu"
              className="menu-button-desktop text-green-800 block px-4 py-2 text-lg md:text-base"
              aria-expanded={areMenusVisible.toString()}
              onClick={toggleMenuVisibility}
            >
              {t('all_services')} &nbsp;&nbsp;
              {areMenusVisible
                ? <span className='rotate-up'>❱</span>
                : <span className='rotate-down'>❱</span>}
            </button>
          </li>
        </ul>
      </nav>
      {areMenusVisible && (
        <div className="fixed top-28 left-1/3 transform -translate-x-1/4 z-30 flex justify-center bg-white shadow-lg border-2 border-secondary rounded-2xl">
          <div className="p-5 max-w-8xl">
            <ul className="flex flex-wrap justify-center p-0 m-0 list-none space-x-4">
              {Object.keys(menuData).map((category) => (
                !desktopMenuCategories.includes(category) && (
                  <li
                    key={category}
                    className="relative group hidden md:block"
                    onMouseEnter={() => handleMouseEnter(category)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a href="#" className="block px-4 py-2 text-lg md:text-base">{t(menuData[category].translationKey)}</a>
                    {activeDropdown === category && (
                      <div className="absolute top-full left-0 w-max bg-white shadow-lg z-50">
                        <DropdownContent t={t} items={menuData[category].items} />
                      </div>
                    )}
                  </li>
                )
              ))}
            </ul>
          </div>
        </div>
      )}
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white shadow-lg z-50 md:hidden p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            {activeMobileCategory && (
              <button
                className="text-green-800 text-3xl"
                onClick={handleBackClick}
              >← {t('back')}</button>
            )}
            <button
              className="text-green-800 text-4xl"
              onClick={handleCloseMenu}
            >×</button>
          </div>
          {activeMobileCategory ? (
            <ul className="list-none">
              {menuData[activeMobileCategory].items.map((item) => (
                <li key={item.href} className="py-4">
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-4 hover:bg-gray-100 text-2xl">
                    {activeMobileCategory === 'tota_services' && item.href.startsWith('/')
                      ? <img src={item.icon} alt={item.label} className="mr-2" width="24" height="24" />
                      : <img src={`https://www.google.com/s2/favicons?domain=${new URL(item.href).hostname}`} alt="favicon" width="24" height="24" className="mr-2" />
                    }
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="list-none">
              <li>
                <button
                  className="block w-full text-left px-4 py-4 hover:bg-gray-100 text-2xl text-green-800"
                  onClick={() => handleMobileCategoryClick('tota_services')}
                >
                  {t('tota_services')}
                </button>
              </li>
              {Object.keys(menuData).map((category) => (
                category !== 'tota_services' && (
                  <li key={category}>
                    <button
                      className="block w-full text-left px-4 py-4 hover:bg-gray-100 text-2xl"
                      onClick={() => handleMobileCategoryClick(category)}
                    >
                      {t(menuData[category].translationKey)}
                    </button>
                  </li>
                )
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MainMenu;
