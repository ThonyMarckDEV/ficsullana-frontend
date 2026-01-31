import React from 'react';

const AreaForm = ({ data, handleChange }) => {
  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm";
  const baseTextAreaClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm min-h-[96px]";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 border-b border-fic-red pb-2">
        <span className="font-bold text-fic-red text-lg">1. Datos del Área</span>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre del Área</label>
        <input
          name="nombre_area"
          value={data.nombre_area}
          onChange={(e) => handleChange(e, 'area')}
          className={baseInputClass}
          placeholder="Ej. Administración"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Descripción</label>
        <textarea
          name="descripcion"
          value={data.descripcion || ''}
          onChange={(e) => handleChange(e, 'area')}
          className={baseTextAreaClass}
          placeholder="Breve descripción del área (opcional)"
        />
      </div>
    </div>
  );
};

export default AreaForm;