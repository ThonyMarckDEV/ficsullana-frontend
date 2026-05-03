import React from 'react';
import { formatDateOnly, formatMoney } from 'utilities/pages/admision/viewModel';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import { TableSkeletonRows } from '../shared/InlineSkeleton';
import { formatSectionTitle } from './sectionTitle';

const tableHeadClass = 'px-3 py-2 text-left';
const tableCellClass = 'px-3 py-2 whitespace-nowrap text-slate-700';

const HistorialInternoSection = ({ contexto, loading = false, sectionNumber }) => {
  if (!contexto?.historial_interno?.visible) return null;

  const rows = contexto.historial_interno.rows || [];

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-black uppercase text-slate-700">
          {formatSectionTitle(sectionNumber, EVAL_CONSUMO_COPY.HISTORY.INTERNAL_TITLE)}
        </h3>
        <span className="text-[11px] font-bold uppercase text-slate-500">
          {rows.length} {rows.length === 1 ? 'crédito' : 'créditos'}
        </span>
      </div>

      {loading ? (
        <div role="status" aria-live="polite" className="overflow-x-auto">
          <p className="mb-3 text-sm text-slate-500">{EVAL_CONSUMO_COPY.HISTORY.LOADING_INTERNAL}</p>
          <table className="min-w-full text-xs">
            <tbody>
              <TableSkeletonRows rows={3} columns={11} />
            </tbody>
          </table>
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-500 italic">Sin créditos internos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase">
              <tr>
                <th className={tableHeadClass}>ID</th>
                <th className={tableHeadClass}>Producto</th>
                <th className={tableHeadClass}>Modalidad</th>
                <th className={tableHeadClass}>Monto</th>
                <th className={tableHeadClass}>Interés</th>
                <th className={tableHeadClass}>Total</th>
                <th className={tableHeadClass}>Cuotas</th>
                <th className={tableHeadClass}>Valor cuota</th>
                <th className={tableHeadClass}>Frecuencia</th>
                <th className={tableHeadClass}>Fecha inicio</th>
                <th className={tableHeadClass}>Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className={tableCellClass}>#{row.id}</td>
                  <td className={tableCellClass}>{row.producto_nombre || 'N/A'}</td>
                  <td className={tableCellClass}>{row.modalidad || 'N/A'}</td>
                  <td className={tableCellClass}>S/ {formatMoney(row.monto)}</td>
                  <td className={tableCellClass}>{row.interes || 'N/A'}</td>
                  <td className={tableCellClass}>S/ {formatMoney(row.total)}</td>
                  <td className={tableCellClass}>{row.cuotas ?? 'N/A'}</td>
                  <td className={tableCellClass}>S/ {formatMoney(row.valor_cuota)}</td>
                  <td className={tableCellClass}>{row.frecuencia || 'N/A'}</td>
                  <td className={tableCellClass}>{formatDateOnly(row.fecha_inicio)}</td>
                  <td className={tableCellClass}>{row.estado_label || row.estado || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default HistorialInternoSection;
