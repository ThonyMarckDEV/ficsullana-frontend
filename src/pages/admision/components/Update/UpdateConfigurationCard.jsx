import React from 'react';

const UpdateConfigurationCard = ({ header, onHeaderChange }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
    <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">1. Configuración</h2>

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
