import React from 'react';

const SedeForm = ({ data, handleChange }) => {
  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 border-b border-fic-red pb-2">
        <span className="font-bold text-fic-red text-lg">1. Datos del Local</span>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre de Sede</label>
        <input name="nombre" value={data.nombre} onChange={(e) => handleChange(e, 'sede')} className={baseInputClass} placeholder="Ej. Sucursal Sullana" required />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Dirección</label>
        <input name="direccion" value={data.direccion} onChange={(e) => handleChange(e, 'sede')} className={baseInputClass} placeholder="Ej. Av. Panamericana 123" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Código SUNAT</label>
        <input name="codigo_sunat" value={data.codigo_sunat} onChange={(e) => handleChange(e, 'sede')} className={baseInputClass} placeholder="0000" maxLength={4}/>
      </div>
    </div>
  );
};

export default SedeForm;