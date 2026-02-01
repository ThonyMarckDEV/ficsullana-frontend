import React, { useState, useMemo } from 'react';
import { 
    ShieldCheckIcon, 
    InformationCircleIcon, 
    MagnifyingGlassIcon,
    ListBulletIcon,
    TagIcon
} from '@heroicons/react/24/outline';
import { isTextOnly } from 'utilities/Validations/validations';

const RolForm = ({ data, handleChange, permisosDisponibles, handlePermisoChange }) => {
  const baseInputClass = "w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm bg-white";
  
  const [filtro, setFiltro] = useState('');
  const [activeTab, setActiveTab] = useState('ui'); 

  // Manejador de validaciones
  const handleInputValidation = (e) => {
    const { name, value } = e.target;

    // Validación para NOMBRE DEL ROL (Solo letras y espacios)
    if (name === 'nombre') {
       if (!isTextOnly(value)) return;
    }

    handleChange(e);
  };

  const { permisosUI, permisosCombo } = useMemo(() => {
    const listado = filtro 
        ? permisosDisponibles.filter(p => 
            p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(filtro.toLowerCase()))
          )
        : permisosDisponibles;

    return {
        permisosUI: listado.filter(p => !p.nombre.includes('combobox')),
        permisosCombo: listado.filter(p => p.nombre.includes('combobox'))
    };
  }, [filtro, permisosDisponibles]);

  const currentList = activeTab === 'ui' ? permisosUI : permisosCombo;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* COLUMNA IZQUIERDA: DATOS BÁSICOS */}
      <div className="w-full md:w-4/12">
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
                    <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">Nombre del Rol</label>
                    <input 
                        name="nombre" 
                        value={data.nombre} 
                        onChange={handleInputValidation}
                        className={baseInputClass} 
                        placeholder="Ej. Supervisor" 
                        required 
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Solo letras y espacios.</p>
                </div>
                <div>
                    <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">Descripción</label>
                    <textarea 
                        name="descripcion" 
                        value={data.descripcion} 
                        onChange={handleInputValidation} 
                        className={`${baseInputClass} resize-none h-32`} 
                        placeholder="Funciones del rol..." 
                    />
                </div>
                
                {/* Contador de Permisos */}
                <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors
                    ${data.permisos.length > 0 ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-sm font-bold text-slate-600">Seleccionados:</span>
                    <span className="px-3 py-1 bg-slate-800 text-white rounded-full text-xs font-black">
                        {data.permisos.length}
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: PERMISOS */}
      <div className="w-full md:w-8/12 flex flex-col">
        
        <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-6 h-6 text-fic-red"/>
                    <h3 className="font-black text-slate-700 text-xl">Configurar Accesos</h3>
                </div>
                
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-fic-red/20"
                        placeholder="Buscar permiso..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>
            </div>

            {/* TABS DE PERMISOS */}
            <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit">
                <button 
                    type="button" 
                    onClick={() => setActiveTab('ui')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black transition-all ${activeTab === 'ui' ? 'bg-white shadow-md text-fic-red' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                    <ListBulletIcon className="w-4 h-4"/>
                    INTERFAZ (UI)
                </button>
                <button 
                    type="button" 
                    onClick={() => setActiveTab('combobox')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black transition-all ${activeTab === 'combobox' ? 'bg-white shadow-md text-fic-red' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                    <TagIcon className="w-4 h-4"/>
                    SELECTORES (COMBOBOX)
                </button>
            </div>
        </div>

        {/* LISTADO DINÁMICO DE PERMISOS  */}
        <div className="bg-slate-100/50 border border-slate-200 rounded-2xl p-4 h-[550px] overflow-y-auto custom-scrollbar shadow-inner">
            {currentList.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {currentList.map((permiso) => {
                        const isSelected = data.permisos.includes(permiso.id);
                        return (
                            <label 
                                key={permiso.id} 
                                className={`group flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer bg-white
                                    ${isSelected ? 'border-fic-red ring-4 ring-fic-red/5' : 'border-transparent hover:border-slate-300'}`}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => handlePermisoChange(permiso.id)}
                                />
                                <div className={`mt-1 min-w-[20px] h-5 rounded flex items-center justify-center border transition-colors
                                    ${isSelected ? 'bg-fic-red border-fic-red' : 'bg-slate-100 border-slate-300'}`}>
                                    {isSelected && <CheckIconTiny />}
                                </div>
                                <div className="flex-1">
                                    <span className={`block text-xs font-black uppercase tracking-tight ${isSelected ? 'text-fic-red' : 'text-slate-700'}`}>
                                        {permiso.nombre.replace('.listar-combobox', '')}
                                    </span>
                                    <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2">
                                        {permiso.descripcion}
                                    </p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 italic text-sm">
                    No se encontraron permisos en esta categoría.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const CheckIconTiny = () => (
    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default RolForm;