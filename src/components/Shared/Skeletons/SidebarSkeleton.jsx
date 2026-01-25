import React from 'react';

const SidebarSkeleton = () => {
    return (
        <div className="fixed left-0 top-0 h-screen bg-fic-red shadow-2xl z-40 w-20 hidden md:flex flex-col border-r border-white/10 animate-pulse">
            
            {/* 1. Logo (Versión Icono Pequeño) */}
            <div className="h-24 flex items-center justify-center p-2 flex-shrink-0 border-b border-white/10 bg-white">
                {/* Simulamos solo el isotipo cuadrado */}
                <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
            </div>

            {/* 2. Lista de Menús (Solo Iconos Centrados) */}
            <div className="flex-1 py-6 flex flex-col items-center gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <div key={item} className="h-10 w-10 rounded-xl bg-white/20"></div>
                ))}
            </div>

            {/* 3. Footer (Botón Cerrar Sesión - Solo Icono) */}
            <div className="p-3 border-t border-white/20 flex-shrink-0 flex justify-center bg-fic-red">
                <div className="h-10 w-10 rounded-xl bg-white/20"></div>
            </div>
        </div>
    );
};

export default SidebarSkeleton;