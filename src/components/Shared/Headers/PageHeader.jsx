import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, buttonText, buttonLink, icon: Icon }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-4 border-fic-red pb-4 gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-3 bg-slate-100 rounded-xl text-fic-dark hidden sm:block">
            <Icon className="w-8 h-8" />
          </div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-fic-dark tracking-tighter uppercase leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 font-bold mt-1 uppercase text-sm tracking-wide">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="bg-fic-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-black shadow-lg uppercase tracking-widest active:scale-95 text-center w-full md:w-auto"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;