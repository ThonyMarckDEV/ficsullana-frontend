import React from 'react';
import loaderGif from '../../assets/gif/loading.gif';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <img 
        src={loaderGif} 
        alt="Loading..." 
        className="w-20 h-20 object-contain" 
      />
    </div>
  );
};

export default LoadingScreen;
