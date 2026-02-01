import React from 'react';
import { isNumeric, isTextOnly } from 'utilities/Validations/validations';

const SedeForm = ({ data, handleChange }) => {
  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";

  const handleInputValidation = (e) => {
    const { name, value } = e.target;

    // Validación para NOMBRE (Solo letras y espacios)
    if (name === 'nombre') {
       if (!isTextOnly(value)) return;
    }

    //Validación para CÓDIGO SUNAT (Solo números)
    if (name === 'codigo_sunat') {
       if (!isNumeric(value)) return;
    }

    handleChange(e, 'sede');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 border-b border-fic-red pb-2">
        <span className="font-bold text-fic-red text-lg">1. Datos del Local</span>
      </div>
      
      {/* NOMBRE */}
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre de Sede</label>
        <input 
            name="nombre" 
            value={data.nombre} 
            onChange={handleInputValidation}
            className={baseInputClass} 
            placeholder="Ej. Sucursal Sullana" 
            required 
        />
        <p className="text-[10px] text-slate-400 mt-1">Nombre identificativo de la sede.</p>
      </div>

      {/* DIRECCIÓN */}
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Dirección</label>
        <input 
            name="direccion" 
            value={data.direccion} 
            onChange={(e) => handleChange(e, 'sede')}
            className={baseInputClass} 
            placeholder="Ej. Av. Panamericana 123" 
        />
      </div>

      {/* CÓDIGO SUNAT */}
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Código SUNAT</label>
        <input 
            name="codigo_sunat" 
            value={data.codigo_sunat} 
            onChange={handleInputValidation} 
            className={baseInputClass} 
            placeholder="0000" 
            maxLength={4}
        />
        <p className="text-[10px] text-slate-400 mt-1">Código de 4 dígitos (solo números).</p>
      </div>
    </div>
  );
};

export default SedeForm;