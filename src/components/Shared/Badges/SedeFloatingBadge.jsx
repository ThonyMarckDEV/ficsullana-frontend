import React from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import jwtUtils from 'utilities/Token/jwtUtils';

const SedeFloatingBadge = () => {
    const refresh_token = jwtUtils.getRefreshTokenFromCookie();
    const nombreSede = refresh_token ? jwtUtils.getNombreSede(refresh_token) : null;
    const rol = refresh_token ? jwtUtils.getUserRole(refresh_token) : null;

    if (!nombreSede) return null;

    const colorClass = rol === 'admin' 
        ? 'bg-fic-red text-white border-red-400' 
        : 'bg-fic-yellow text-fic-dark border-yellow-500';

    const iconBgClass = rol === 'admin' 
        ? 'bg-white/20' 
        : 'bg-black/10';

    const labelOpacityClass = rol === 'admin'
        ? 'opacity-80'
        : 'opacity-60';

    return (
        <div className={`
            fixed bottom-4 right-4 z-50 
            flex items-center gap-3 
            px-4 py-2.5 
            rounded-full shadow-xl 
            backdrop-blur-md 
            border
            transition-all duration-300 hover:scale-105
            animate-fade-in-up
            ${colorClass}
        `}>
            {/* Contenedor del Icono */}
            <div className={`p-1.5 rounded-full ${iconBgClass}`}>
                <BuildingStorefrontIcon className={`w-4 h-4 ${rol === 'admin' ? 'text-white' : 'text-fic-dark'}`} />
            </div>

            {/* Información de Sede */}
            <div className="flex flex-col">
                <span className={`text-[9px] font-black uppercase tracking-wider leading-none mb-0.5 ${labelOpacityClass}`}>
                    Sede Actual
                </span>
                <span className="text-sm font-black truncate max-w-[150px] md:max-w-[200px] uppercase">
                    {nombreSede}
                </span>
            </div>

            {/* Indicador visual de rol (pequeño punto) */}
            <div className={`w-2 h-2 rounded-full absolute -top-1 -right-1 shadow-sm ${rol === 'admin' ? 'bg-fic-yellow' : 'bg-fic-red'}`}></div>
        </div>
    );
};

export default SedeFloatingBadge;