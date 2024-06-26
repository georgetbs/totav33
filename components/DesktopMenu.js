import React, { useState } from 'react';

const DesktopMenu = ({ overlayRef }) => {
    const [areMenusVisible, setAreMenusVisible] = useState(false);

    const toggleMenuVisibility = () => {
        const newVisibility = !areMenusVisible;
        setAreMenusVisible(newVisibility);
        if (overlayRef.current) {
            overlayRef.current.style.display = newVisibility ? 'block' : 'none';
        }
    };

    return (
        <button 
            id="toggle-menu" 
            className="menu-button-desktop" 
            aria-expanded={areMenusVisible.toString()}
            onClick={toggleMenuVisibility}
        >
            ყველა სერვისი &nbsp;&nbsp;{areMenusVisible ? <span className="rotate-up">❱</span> : <span className="rotate-down">❱</span>}
        </button>
    );
};

export default DesktopMenu;
