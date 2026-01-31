import React, { useMemo } from 'react';

const EntidadFinancieraForm = ({ data, handleChange }) => {
  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm";

  const longitudesText = useMemo(() => {
    if (!Array.isArray(data.longitudes_cuenta)) return '';
    return data.longitudes_cuenta.join(', ');
  }, [data.longitudes_cuenta]);

  const handleLongitudesChange = (e) => {
    const value = e.target.value;
    const parsed = value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '')
      .map((v) => Number(v))
      .filter((v) => Number.isInteger(v) && v > 0);

    handleChange({ target: { name: 'longitudes_cuenta', value: parsed } }, 'entidad');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 border-b border-fic-red pb-2">
        <span className="font-bold text-fic-red text-lg">1. Datos de la Entidad</span>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre</label>
        <input
          name="nombre"
          value={data.nombre}
          onChange={(e) => handleChange(e, 'entidad')}
          className={baseInputClass}
          placeholder="Ej. BCP"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo</label>
        <select
          name="tipo"
          value={data.tipo}
          onChange={(e) => handleChange(e, 'entidad')}
          className={baseInputClass}
          required
        >
          <option value="">Seleccione...</option>
          <option value="banco">Banco</option>
          <option value="caja">Caja</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Longitudes de Cuenta</label>
        <input
          name="longitudes_cuenta_text"
          value={longitudesText}
          onChange={handleLongitudesChange}
          className={baseInputClass}
          placeholder="Ej. 13,14"
          required
        />
        <p className="text-[10px] text-slate-400 mt-1">Separar por comas (solo números).</p>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Estado</label>
        <select
          name="estado"
          value={data.estado ? '1' : '0'}
          onChange={(e) => handleChange({ target: { name: 'estado', value: e.target.value === '1' } }, 'entidad')}
          className={baseInputClass}
        >
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
    </div>
  );
};

export default EntidadFinancieraForm;