import React from 'react';

const FloatingPlayer = ({ url }) => {
  return (
    <div className="fixed bottom-4 right-4 w-64 h-36 bg-black z-50 rounded-lg shadow-lg overflow-hidden">
      <video className="w-full h-full" src={url} controls autoPlay muted />
    </div>
  );
};

export default FloatingPlayer;
