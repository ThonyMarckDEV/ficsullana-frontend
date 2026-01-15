import React from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import jwtUtils from 'utilities/Token/jwtUtils';

const SedeFloatingBadge = () => {
    const refresh_token = jwtUtils.getRefreshTokenFromCookie();
    // Solo obtenemos el nombre de la sede
    const nombreSede = refresh_token ? jwtUtils.getNombreSede(refresh_token) : null;

    // Si no hay sede, no mostramos nada
    if (!nombreSede) return null;

    return (
        <div className="
            fixed bottom-4 right-4 z-50 
            flex items-center gap-3 
            px-4 py-2.5 
            rounded-full shadow-xl 
            backdrop-blur-md 
            border border-red-400
            bg-fic-red text-white
            transition-all duration-300 hover:scale-105
            animate-fade-in-up
        ">
            {/* Contenedor del Icono */}
            <div className="p-1.5 rounded-full bg-white/20">
                <BuildingStorefrontIcon className="w-4 h-4 text-white" />
            </div>

            {/* Información de Sede */}
            <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-wider leading-none mb-0.5 opacity-80">
                    Sede Actual
                </span>
                <span className="text-sm font-black truncate max-w-[150px] md:max-w-[200px] uppercase">
                    {nombreSede}
                </span>
            </div>
        </div>
    );
};

export default SedeFloatingBadge;