import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  PERIODICIDAD_OPTIONS,
  formatCuotasRange,
  formatMontoRange,
  formatTasaRange,
} from 'utilities/productos';

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700';

const ProductoConfiguracionesEditor = ({
  configuraciones = [],
  onConfigChange,
  onAddConfig,
  onRemoveConfig,
}) => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-black uppercase text-slate-700">Configuraciones del producto</h3>
        <p className="text-[11px] text-slate-500 mt-1">
          Defina los tramos por periodicidad, monto y cuotas. Deje monto hasta vacío cuando el rango sea &quot;a más&quot;.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddConfig}
        className="inline-flex items-center gap-2 rounded-lg bg-fic-dark px-4 py-2 text-xs font-black uppercase text-white hover:bg-slate-800"
      >
        <PlusIcon className="h-4 w-4" />
        Agregar tramo
      </button>
    </div>

    <div className="space-y-4">
      {configuraciones.map((configuracion, index) => (
        <div key={configuracion.id || `config-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-slate-700">Tramo {index + 1}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {configuracion.activo !== false
                  ? `${configuracion.periodicidad_label} | ${formatMontoRange(configuracion)} | ${formatTasaRange(configuracion)} | ${formatCuotasRange(configuracion)}`
                  : 'Configuración inactiva'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-[11px] font-bold uppercase text-slate-600">
                <input
                  type="checkbox"
                  checked={configuracion.activo !== false}
                  onChange={(event) => onConfigChange(index, 'activo', event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-fic-red focus:ring-fic-red"
                />
                Activo
              </label>

              {configuraciones.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onRemoveConfig(index)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] font-black uppercase text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                  Quitar
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Periodicidad</label>
              <select
                value={configuracion.periodicidad_id}
                onChange={(event) => onConfigChange(index, 'periodicidad_id', event.target.value)}
                className={inputClass}
              >
                {PERIODICIDAD_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} ({option.dias} días)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Monto desde</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={configuracion.monto_desde}
                onChange={(event) => onConfigChange(index, 'monto_desde', event.target.value)}
                className={inputClass}
                placeholder="600"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Monto hasta</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={configuracion.monto_hasta}
                onChange={(event) => onConfigChange(index, 'monto_hasta', event.target.value)}
                className={inputClass}
                placeholder="Vacío = a más"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Tasa mín. %</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={configuracion.tasa_min}
                onChange={(event) => onConfigChange(index, 'tasa_min', event.target.value)}
                className={inputClass}
                placeholder="16"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Tasa máx. %</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={configuracion.tasa_max}
                onChange={(event) => onConfigChange(index, 'tasa_max', event.target.value)}
                className={inputClass}
                placeholder="17"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Cuotas mín.</label>
              <input
                type="number"
                min="1"
                step="1"
                value={configuracion.cuotas_min}
                onChange={(event) => onConfigChange(index, 'cuotas_min', event.target.value)}
                className={inputClass}
                placeholder="4"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Cuotas máx.</label>
              <input
                type="number"
                min="1"
                step="1"
                value={configuracion.cuotas_max}
                onChange={(event) => onConfigChange(index, 'cuotas_max', event.target.value)}
                className={inputClass}
                placeholder="8"
              />
            </div>

            <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2">
              <p className="text-[10px] font-bold uppercase text-slate-500">Resumen del tramo</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">{formatMontoRange(configuracion)}</p>
              <p className="text-xs text-slate-500">{formatTasaRange(configuracion)}</p>
              <p className="text-xs text-slate-500">{formatCuotasRange(configuracion)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProductoConfiguracionesEditor;
