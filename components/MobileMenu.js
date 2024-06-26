import React, { useState, useEffect, useRef } from 'react';

const MobileMenu = ({ overlayRef }) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const mainMenuRef = useRef(null);
    const originalMainMenuContent = useRef("");

    useEffect(() => {
        if (window.matchMedia("(max-width: 1023px)").matches) {
            originalMainMenuContent.current = mainMenuRef.current.innerHTML;
        }
    }, []);

    const toggleMenuVisibility = () => {
        setIsMenuVisible(!isMenuVisible);
        document.body.style.overflow = isMenuVisible ? '' : 'hidden';
        if (overlayRef.current) {
            overlayRef.current.style.display = isMenuVisible ? 'none' : 'block';
        }
    };

    const restoreMainMenu = () => {
        mainMenuRef.current.innerHTML = originalMainMenuContent.current;
    };

    return (
        <>
            <button 
                id="toggle-menu-mobile" 
                className="menu-button-mobile"
                aria-expanded={isMenuVisible.toString()}
                onClick={toggleMenuVisibility}
            >
                ☰
            </button>
            <div ref={mainMenuRef} className="main-menu-content">
                {/* Main Menu Content Here */}
            </div>
        </>
    );
};

export default MobileMenu;
