import React from 'react';

const SidebarSkeleton = () => {
    return (
        <div className="fixed left-0 top-0 h-screen bg-fic-red shadow-2xl z-40 w-64 flex flex-col border-r border-white/10 animate-pulse hidden md:flex">
            
            {/* 1. Área del Logo (Fondo blanco simulado) */}
            <div className="h-32 bg-white flex items-center justify-center p-6 flex-shrink-0">
                <div className="h-16 w-3/4 bg-slate-200 rounded-lg"></div>
            </div>

            {/* 2. Lista de Menús */}
            <div className="flex-1 py-6 px-3 space-y-3 overflow-hidden">
                {/* Generamos 6 items falsos para simular el menú */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                        {/* Icono Skeleton */}
                        <div className="h-6 w-6 rounded bg-white/20 flex-shrink-0"></div>
                        {/* Texto Skeleton */}
                        <div className="h-4 w-3/4 rounded bg-white/20"></div>
                    </div>
                ))}
            </div>

            {/* 3. Footer (Botón Cerrar Sesión) */}
            <div className="p-3 border-t border-white/20 flex-shrink-0">
                <div className="h-12 w-full rounded-xl bg-white/20"></div>
            </div>
        </div>
    );
};

export default SidebarSkeleton;