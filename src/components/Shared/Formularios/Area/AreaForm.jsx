import React from 'react';
import { isTextOnly } from 'utilities/Validations/validations';

const AreaForm = ({ data, handleChange }) => {
  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm";
  const baseTextAreaClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm min-h-[96px]";

  const handleInputValidation = (e) => {
    const { name, value } = e.target;

    if (name === 'nombre_area') {
       if (!isTextOnly(value)) return;
    }

    handleChange(e, 'area');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 border-b border-fic-red pb-2">
        <span className="font-bold text-fic-red text-lg">1. Datos del Área</span>
      </div>
      
      {/* NOMBRE DE ÁREA */}
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre del Área</label>
        <input
          name="nombre_area"
          value={data.nombre_area}
          onChange={handleInputValidation}
          className={baseInputClass}
          placeholder="Ej. Administración"
          required
        />
        <p className="text-[10px] text-slate-400 mt-1">Solo letras y espacios.</p>
      </div>

      {/* DESCRIPCIÓN */}
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Descripción</label>
        <textarea
          name="descripcion"
          value={data.descripcion || ''}
          onChange={handleInputValidation}
          className={baseTextAreaClass}
          placeholder="Breve descripción del área (opcional)"
        />
      </div>
    </div>
  );
};

export default AreaForm;