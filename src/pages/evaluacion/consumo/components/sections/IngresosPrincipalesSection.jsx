import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-fic-red focus:ring-1 focus:ring-fic-red/20 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed';
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-700">
            {formatSectionTitle(sectionNumber, 'Ingresos Principales')}
          </h3>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={onAddIngreso}
            aria-label="Agregar fila de ingreso"
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold uppercase text-slate-700 hover:bg-slate-200"
          >
            <PlusIcon className="w-4 h-4" /> Agregar ingreso
          </button>
        )}
      </div>

      <p className="text-[11px] text-slate-500">
        Máximo permitido en veces sueldo:{' '}
        <strong>
          {Number(catalogos.max_veces_sueldo_consumo || 1).toLocaleString('es-PE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </strong>
      </p>

      {hasDependienteFormal ? (
        <div className="max-w-xl rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-[11px] text-amber-900">
          Si selecciona <strong>Dependiente formal</strong>, el ingreso se calcula automáticamente con boleta básica más el promedio de variables de los meses 1 al 3.
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">Tipo ingreso</th>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">Ingreso</th>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">Veces sueldo</th>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">Monto máximo a otorgar</th>
              {!disabled ? <th className="px-3 py-3 w-14 text-right text-[11px] font-bold uppercase tracking-wide text-slate-500">Acción</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(form.ingresos || []).map((row, index) => {
              const isDependienteFormal = dependienteFormalTipoIngresoIds?.has(Number(row.tipo_ingreso_id));

              return (
                <tr key={`ing-${index}`} className="align-top">
                  <td className="px-3 py-3">
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
                  <td className="px-3 py-3">
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
                  <td className="px-3 py-3">
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
                  <td className="px-3 py-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-black text-slate-700">
                      {Number(row.monto_maximo_otorgar || 0).toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                  {!disabled ? (
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveIngreso(index)}
                        aria-label={`Eliminar fila de ingreso ${index + 1}`}
                        className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white p-2 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={(form.ingresos || []).length === 1}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Ingreso total</p>
          <p className="mt-2 text-xl font-black text-slate-700">
            {Number(totals.ingresoTotal || 0).toLocaleString('es-PE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Monto máximo total</p>
          <p className="mt-2 text-xl font-black text-slate-700">
            {Number(totals.montoMaximoTotal || 0).toLocaleString('es-PE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IngresosPrincipalesSection;