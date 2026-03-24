import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import RolAutorizadorSearchSelect from 'components/Shared/Comboboxes/RolAutorizadorSearchSelect';
import { TIPO_EVALUACION_OPTIONS } from 'utilities/nivelesDiscrecionalidad';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm';

const NivelDiscrecionalidadForm = ({ data, handleChange, onRolSelect }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center gap-2 mb-4 border-b border-fic-red pb-2">
      <ShieldCheckIcon className="w-5 h-5 text-fic-red" />
      <span className="font-bold text-fic-red text-lg">Configuración del Nivel</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo de evaluación</label>
        <select
          name="tipo_evaluacion"
          value={data.tipo_evaluacion}
          onChange={handleChange}
          className={baseInputClass}
          required
        >
          {TIPO_EVALUACION_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      <div>
        <RolAutorizadorSearchSelect
          selectedId={data.rol_autorizador_id}
          initialLabel={data.rol_autorizador_nombre}
          onSelect={onRolSelect}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Monto mínimo</label>
        <input
          name="monto_min"
          type="number"
          min="0"
          step="0.01"
          value={data.monto_min}
          onChange={handleChange}
          className={baseInputClass}
          placeholder="Ej. 1000"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Monto máximo</label>
        <input
          name="monto_max"
          type="number"
          min="0"
          step="0.01"
          value={data.monto_max}
          onChange={handleChange}
          className={baseInputClass}
          placeholder="Ej. 5000"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Estado</label>
        <select
          name="estado"
          value={data.estado}
          onChange={handleChange}
          className={baseInputClass}
        >
          <option value="1">ACTIVO</option>
          <option value="0">INACTIVO</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Cuotas mínimas</label>
        <input
          name="cuotas_min"
          type="number"
          min="1"
          step="1"
          value={data.cuotas_min}
          onChange={handleChange}
          className={baseInputClass}
          placeholder="Ej. 4"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Cuotas máximas</label>
        <input
          name="cuotas_max"
          type="number"
          min="1"
          step="1"
          value={data.cuotas_max}
          onChange={handleChange}
          className={baseInputClass}
          placeholder="Ej. 12"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tasa mínima</label>
        <input
          name="tasa_min"
          type="number"
          min="0"
          step="0.01"
          value={data.tasa_min}
          onChange={handleChange}
          className={baseInputClass}
          placeholder="Ej. 12"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tasa máxima</label>
        <input
          name="tasa_max"
          type="number"
          min="0"
          step="0.01"
          value={data.tasa_max}
          onChange={handleChange}
          className={baseInputClass}
          placeholder="Ej. 18"
          required
        />
      </div>
    </div>
  </div>
);

export default NivelDiscrecionalidadForm;
