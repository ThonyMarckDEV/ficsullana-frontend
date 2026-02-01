import React from 'react';
import { isTextOnly } from 'utilities/Validations/validations';

const ProductoForm = ({ data, handleChange }) => {
  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";

  const handleInputValidation = (e) => {
    const { name, value } = e.target;

    // Validación para NOMBRE usando la utilidad importada
    if (name === 'nombre') {
       // Si isTextOnly devuelve false (contiene números o símbolos inválidos), detenemos el cambio
       if (!isTextOnly(value)) return;
    }

    // Validación para RANGO DE TASA
    if (name === 'rango_tasa') {
        if (!/^[0-9%\-\s]*$/.test(value)) return;
    }

    handleChange(e);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* NOMBRE */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre del Producto</label>
          <input 
            name="nombre" 
            value={data.nombre} 
            onChange={handleInputValidation}
            className={baseInputClass} 
            placeholder="Ej: Crédito Consumo"
            required 
          />
          <p className="text-[10px] text-slate-400 mt-1">Nombre comercial (solo letras).</p>
        </div>

        {/* RANGO DE TASA */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Rango de Tasa</label>
          <input 
            name="rango_tasa" 
            value={data.rango_tasa} 
            onChange={handleInputValidation}
            className={baseInputClass} 
            placeholder="Ej: 10% - 15%"
            required 
          />
          <p className="text-[10px] text-slate-400 mt-1">Formato sugerido: Min% - Max%</p>
        </div>
      </div>
      
      {/* NOTA INFORMATIVA */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
        <span className="text-xl">ℹ️</span>
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Nota Importante:</strong> El rango de tasa ingresado es meramente referencial para la etapa de evaluación. 
          La tasa final se definirá y confirmará al momento del desembolso según el perfil del cliente.
        </p>
      </div>
    </div>
  );
};

export default ProductoForm;