import React from 'react';

const ProductoForm = ({ data, handleChange }) => {
  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre del Producto</label>
          <input 
            name="nombre" 
            value={data.nombre} 
            onChange={handleChange} 
            className={baseInputClass} 
            placeholder="Ej: Crédito Consumo"
            required 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Rango de Tasa</label>
          <input 
            name="rango_tasa" 
            value={data.rango_tasa} 
            onChange={handleChange} 
            className={baseInputClass} 
            placeholder="Ej: 10% - 15%"
            required 
          />
        </div>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
        <p className="text-xs text-blue-700">
          <strong>Nota:</strong> El rango de tasa es referencial para la evaluación. La tasa final se define al momento del desembolso.
        </p>
      </div>
    </div>
  );
};

export default ProductoForm;