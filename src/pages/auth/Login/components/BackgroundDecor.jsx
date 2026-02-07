import React, { memo } from 'react';

const BackgroundDecor = memo(function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-20 -top-16 h-56 w-56 rounded-full bg-red-200/60 blur-2xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-rose-200/50 blur-2xl" />
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 600 600" fill="none">
        <defs>
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#fca5a5" fillOpacity="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="600" fill="url(#dots)" />
      </svg>
    </div>
  );
});

export default BackgroundDecor;