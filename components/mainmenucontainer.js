import React from 'react';
import MainMenu from './mainmenu';
import LanguageSelector from './LanguageSelector';

const MenuContainer = ({ areMenusVisible, toggleMenuVisibility, closeMenu }) => {
    return (
        <div className="relative md:justify-center justify-start flex">
            <div className=" flex items-center p-4">
                <MainMenu 
                    areMenusVisible={areMenusVisible} 
                    toggleMenuVisibility={toggleMenuVisibility} 
                    closeMenu={closeMenu}
                
                />
              
                <LanguageSelector />
              
            </div>
            
            {areMenusVisible && (
                <div 
                    className="fixed inset-0 bg-white bg-opacity-50 bg-transparent z-20"
                    onClick={closeMenu}
                ></div>
            )}
        </div>
    );
};

export default MenuContainer;
