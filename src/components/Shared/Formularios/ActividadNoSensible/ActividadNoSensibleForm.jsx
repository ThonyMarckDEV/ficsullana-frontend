import React from 'react';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm';

const ActividadNoSensibleForm = ({ data, handleChange }) => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex items-center gap-2 mb-4 border-b border-fic-red pb-2">
      <span className="font-bold text-fic-red text-lg">1. Datos de la Actividad</span>
    </div>

    <div>
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">SECTOR</label>
      <input
        name="sector"
        value={data.sector}
        onChange={handleChange}
        className={baseInputClass}
        placeholder="Ej. Comercio"
        required
      />
    </div>

    <div>
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">ACTIVIDAD</label>
      <input
        name="actividad"
        value={data.actividad}
        onChange={handleChange}
        className={baseInputClass}
        placeholder="Ej. Venta de abarrotes"
        required
      />
    </div>

    <div>
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Margen máximo</label>
      <input
        name="margen_maximo"
        type="number"
        min="0"
        max="100"
        step="0.01"
        value={data.margen_maximo}
        onChange={handleChange}
        className={baseInputClass}
        placeholder="Ej. 30"
        required
      />
      <p className="text-[10px] text-slate-400 mt-1">Máximo 3 dígitos. Ejemplo: 30 significa 30%.</p>
    </div>
  </div>
);

export default ActividadNoSensibleForm;
