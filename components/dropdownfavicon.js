import React from 'react';

const DropdownFavicon = ({ href, width, height, className }) => {
    const getFaviconUrl = (url) => {
        const domain = (new URL(url)).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}`;
    };

    return (
        <img src={getFaviconUrl(href)} width={width} height={height} className={className} alt="Favicon" />
    );
};

export default DropdownFavicon;
