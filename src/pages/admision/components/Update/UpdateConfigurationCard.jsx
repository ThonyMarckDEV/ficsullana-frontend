import React from 'react';

const UpdateConfigurationCard = ({ header, estados, onHeaderChange }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
    <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">1. Configuración</h2>
    {header.estado === 2 && (
      <p className="mb-4 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-md px-3 py-2 font-semibold">
        Estado OBSERVADO: al guardar, el sistema puede mantener este estado por reglas de riesgo.
      </p>
    )}

    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Estado de Evaluación</label>
      <select
        name="estado"
        value={header.estado}
        onChange={onHeaderChange}
        className={`w-full px-3 py-2 border rounded-md outline-none text-sm font-bold shadow-sm focus:ring-2 focus:ring-fic-red ${
          estados[header.estado]?.color || 'text-slate-700'
        }`}
      >
        <option value={0}>PENDIENTE</option>
        <option value={1}>APROBADO</option>
        <option value={2}>OBSERVADO</option>
        <option value={3}>RECHAZADO</option>
      </select>
    </div>

    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo de Préstamo</label>
      <select
        name="tipo_prestamo"
        value={header.tipo_prestamo}
        onChange={onHeaderChange}
        disabled={header.tipoPersona.includes('PROSPECTO')}
        className="w-full px-3 py-2 border rounded-md outline-none text-sm shadow-sm focus:border-fic-red disabled:bg-slate-100 disabled:text-slate-500"
      >
        <option value="NUEVO">NUEVO (Cliente Nuevo)</option>
        <option value="RCS">RCS (Recurrente con Saldo)</option>
        <option value="RSS">RSS (Recurrente sin Saldo)</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Observaciones</label>
      <textarea
        name="observaciones"
        value={header.observaciones}
        onChange={onHeaderChange}
        className="w-full px-3 py-2 border rounded-md outline-none text-sm h-32 resize-none shadow-sm focus:border-fic-red"
        placeholder="Notas del asesor..."
      />
    </div>
  </div>
);

export default UpdateConfigurationCard;
