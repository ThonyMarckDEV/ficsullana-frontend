import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, buttonText, buttonLink, icon: Icon }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-200 pb-4 gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-fic-red">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-fic-dark leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 font-semibold mt-1 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="bg-fic-red text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-all font-black uppercase tracking-wide active:scale-95 text-center w-full md:w-auto text-sm"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
