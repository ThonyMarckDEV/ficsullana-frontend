import React, { useState, useMemo } from 'react';
import { 
    ShieldCheckIcon, 
    InformationCircleIcon, 
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const RolForm = ({ data, handleChange, permisosDisponibles, handlePermisoChange }) => {
  const baseInputClass = "w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm bg-white";
  
  // Estado local para el filtro
  const [filtro, setFiltro] = useState('');

  // Filtramos los permisos en tiempo real
  const permisosFiltrados = useMemo(() => {
    if (!filtro) return permisosDisponibles;
    return permisosDisponibles.filter(p => 
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(filtro.toLowerCase()))
    );
  }, [filtro, permisosDisponibles]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* --- COLUMNA IZQUIERDA: DATOS --- */}
      <div className="w-full md:w-4/12 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-4">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 bg-red-50 rounded-lg text-fic-red">
                    <InformationCircleIcon className="w-6 h-6"/>
                </div>
                <div>
                    <h3 className="font-black text-slate-800 text-lg leading-tight">Datos del Rol</h3>
                    <p className="text-xs text-slate-400">Información básica del perfil</p>
                </div>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                        Nombre del Rol <span className="text-red-500">*</span>
                    </label>
                    <input 
                        name="nombre" 
                        value={data.nombre} 
                        onChange={(e) => handleChange(e)} 
                        className={baseInputClass} 
                        placeholder="Ej. Supervisor de Créditos" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">Descripción</label>
                    <textarea 
                        name="descripcion" 
                        value={data.descripcion} 
                        onChange={(e) => handleChange(e)} 
                        className={`${baseInputClass} resize-none h-40`} 
                        placeholder="Describe brevemente las funciones..." 
                    />
                </div>
                <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors
                    ${data.permisos.length > 0 ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-sm font-bold text-slate-600">Permisos activos:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black 
                        ${data.permisos.length > 0 ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-500'}`}>
                        {data.permisos.length}
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA: PERMISOS --- */}
      <div className="w-full md:w-8/12 flex flex-col h-full">
        
        {/* Cabecera con Buscador */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 px-1 gap-4">
            <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-fic-red"/>
                <h3 className="font-black text-slate-700 text-xl">Configuración de Accesos</h3>
            </div>
            
            {/* BUSCADOR INTEGRADO */}
            <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-1 focus:ring-fic-red focus:border-fic-red sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Buscar permiso (ej: sedes)"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>
        </div>

        {/* LISTA CON SCROLL */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-inner h-[600px] flex flex-col">
            <div className="overflow-y-auto h-full p-4 custom-scrollbar">
                {permisosFiltrados.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {permisosFiltrados.map((permiso) => {
                            const isSelected = data.permisos.includes(permiso.id);
                            return (
                                <label 
                                    key={permiso.id} 
                                    className={`group relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer select-none hover:shadow-md
                                        ${isSelected 
                                            ? 'bg-white border-fic-red shadow-sm z-10' 
                                            : 'bg-white border-transparent hover:border-slate-200'
                                        }`}
                                >
                                    <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors
                                        ${isSelected ? 'bg-fic-red border-fic-red' : 'bg-slate-100 border-slate-300'}`}>
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        value={permiso.id}
                                        checked={isSelected}
                                        onChange={() => handlePermisoChange(permiso.id)}
                                        className="hidden" 
                                    />
                                    <div className="flex-1 min-w-0">
                                        {/* Resaltamos la coincidencia si hay filtro (opcional, aquí solo mostramos texto) */}
                                        <span className={`block text-sm font-black truncate ${isSelected ? 'text-fic-red' : 'text-slate-700'}`}>
                                            {permiso.nombre}
                                        </span>
                                        {permiso.descripcion && (
                                            <span className="text-xs text-slate-500 line-clamp-2 mt-1 leading-snug">
                                                {permiso.descripcion}
                                            </span>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                        <MagnifyingGlassIcon className="w-12 h-12 mb-2 text-slate-300"/>
                        <p className="text-sm font-medium">No se encontraron permisos</p>
                        <p className="text-xs">Prueba con otro término de búsqueda</p>
                    </div>
                )}
            </div>
        </div>

        {/* {data.permisos.length === 0 && (
             <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700 text-sm animate-pulse">
                <InformationCircleIcon className="w-5 h-5"/>
                <span>Atención: El rol debe tener al menos un permiso asignado.</span>
            </div>
        )} */}
      </div>

    </div>
  );
};

export default RolForm;