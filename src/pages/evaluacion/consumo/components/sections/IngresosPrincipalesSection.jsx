import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-fic-red disabled:bg-slate-100 disabled:text-slate-500';
const selectClass = `${baseInputClass} uppercase`;

const IngresosPrincipalesSection = ({
  form,
  disabled,
  totals,
  catalogos,
  onIngresoChange,
  onAddIngreso,
  onRemoveIngreso,
  dependienteFormalTipoIngresoIds,
  sectionNumber,
}) => {
  const hasDependienteFormal = (form.ingresos || []).some((row) =>
    dependienteFormalTipoIngresoIds?.has(Number(row?.tipo_ingreso_id))
  );

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase text-slate-700">{formatSectionTitle(sectionNumber, 'Ingresos Principales')}</h3>
        {!disabled && (
          <button
            type="button"
            onClick={onAddIngreso}
            aria-label="Agregar fila de ingreso"
            className="px-3 py-2 text-xs font-bold uppercase bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" /> Agregar
          </button>
        )}
      </div>

      <p className="text-[11px] text-slate-500 mb-4">
        Máximo permitido en veces sueldo: <strong>{Number(catalogos.max_veces_sueldo_consumo || 1).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong>
      </p>

      {hasDependienteFormal ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-[11px] text-amber-900">
          Si selecciona <strong>Dependiente formal</strong>, el ingreso se calcula automáticamente con boleta básica más el promedio de variables de los meses 1 al 3.
        </div>
      ) : null}

      <div className="overflow-x-auto border border-slate-200 rounded-md">
      <table className="min-w-full text-xs">
        <thead className="bg-slate-50 text-slate-500 uppercase">
          <tr>
            <th className="p-2 text-left">Tipo ingreso</th>
            <th className="p-2 text-left">Ingreso</th>
            <th className="p-2 text-left">Veces sueldo</th>
            <th className="p-2 text-left">Monto Máximo a Otorgar</th>
            {!disabled && <th className="p-2 w-10"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(form.ingresos || []).map((row, index) => {
            const isDependienteFormal = dependienteFormalTipoIngresoIds?.has(Number(row.tipo_ingreso_id));

            return (
              <tr key={`ing-${index}`}>
                <td className="p-2">
                  <select
                    id={`evaluacion-ingresos-tipo-${index}`}
                    className={selectClass}
                    value={row.tipo_ingreso_id}
                    onChange={(e) => onIngresoChange(index, 'tipo_ingreso_id', e.target.value)}
                    disabled={disabled}
                  >
                    <option value="">SELECCIONE...</option>
                    {(catalogos.tipos_ingreso || []).map((item) => (
                      <option key={item.id} value={item.id}>{String(item.nombre || '').toUpperCase()}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <input
                    id={`evaluacion-ingresos-monto-${index}`}
                    type="number"
                    className={`${baseInputClass} ${isDependienteFormal ? 'bg-slate-100 text-slate-500' : ''}`}
                    min="0.01"
                    step="0.01"
                    value={row.ingreso}
                    onChange={(e) => onIngresoChange(index, 'ingreso', e.target.value)}
                    disabled={disabled || isDependienteFormal}
                    readOnly={isDependienteFormal}
                  />
                </td>
                <td className="p-2">
                  <input
                    id={`evaluacion-ingresos-veces-${index}`}
                    type="number"
                    className={baseInputClass}
                    min="0.01"
                    step="0.01"
                    max={catalogos.max_veces_sueldo_consumo || 1}
                    value={row.veces_sueldo}
                    onChange={(e) => onIngresoChange(index, 'veces_sueldo', e.target.value)}
                    disabled={disabled}
                  />
                </td>
                <td className="p-2 font-bold text-slate-700">
                  {Number(row.monto_maximo_otorgar || 0).toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                {!disabled && (
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveIngreso(index)}
                      aria-label={`Eliminar fila de ingreso ${index + 1}`}
                      className="text-red-600 hover:text-red-800"
                      disabled={(form.ingresos || []).length === 1}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
        <p className="text-[11px] uppercase text-slate-500 font-bold">Ingreso total</p>
        <p className="text-lg font-black text-slate-700">
          {Number(totals.ingresoTotal || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
        <p className="text-[11px] uppercase text-slate-500 font-bold">Monto máximo total</p>
        <p className="text-lg font-black text-slate-700">
          {Number(totals.montoMaximoTotal || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
    </section>
  );
};

export default IngresosPrincipalesSection;