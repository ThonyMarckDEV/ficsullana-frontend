import React, { useRef } from 'react';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import useModalFocusTrap from '../../hooks/useModalFocusTrap';
import { TableSkeletonRows } from '../shared/InlineSkeleton';

const SelectAdmisionModal = ({
  isOpen,
  onClose,
  admisiones = [],
  loading = false,
  error = null,
  onSelect,
}) => {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const copy = EVAL_CONSUMO_COPY.MODALS.SELECT_ADMISION;

  useModalFocusTrap({
    isOpen,
    dialogRef,
    initialFocusRef: closeBtnRef,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="select-admision-title"
        aria-describedby="select-admision-description"
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-slate-200"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h3 id="select-admision-title" className="text-sm font-black uppercase text-slate-700">
              {copy.TITLE}
            </h3>
            <p id="select-admision-description" className="mt-1 text-xs text-slate-500">
              {copy.DESCRIPTION}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label={copy.CLOSE_LABEL}
              className="text-sm font-bold text-slate-500 hover:text-slate-700"
            >
              {EVAL_CONSUMO_COPY.COMMON.CERRAR}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          <table className="min-w-full text-xs">
            <caption className="sr-only">{copy.TABLE_LABEL}</caption>
            <thead className="bg-slate-50 text-slate-500 uppercase">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Solicitante</th>
                <th className="p-3 text-left">DNI</th>
                <th className="p-3 text-left">Clase préstamo</th>
                <th className="p-3 text-left">Agencia</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && admisiones.length === 0 && (
                <>
                  <tr>
                    <td className="p-4 text-slate-500" colSpan={6}>
                      <span role="status" aria-live="polite">{copy.LOADING}</span>
                    </td>
                  </tr>
                  <TableSkeletonRows rows={4} columns={6} />
                </>
              )}
              {!loading && error && admisiones.length === 0 && (
                <tr>
                  <td className="p-4 text-amber-700" colSpan={6} role="alert">{error}</td>
                </tr>
              )}
              {!loading && !error && admisiones.length === 0 && (
                <tr>
                  <td className="p-4 text-slate-500 italic" colSpan={6}>{copy.EMPTY}</td>
                </tr>
              )}
              {admisiones.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 font-bold text-slate-700">#{item.id}</td>
                  <td className="p-3 text-slate-700">{item.solicitante_nombre}</td>
                  <td className="p-3 text-slate-700">{item.solicitante_dni || 'N/A'}</td>
                  <td className="p-3 text-slate-700">{item.clase_prestamo || 'N/A'}</td>
                  <td className="p-3 text-slate-700">{item.sede_nombre || 'N/A'}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      aria-label={copy.SELECT_LABEL(item.id)}
                      className="px-3 py-1.5 text-[11px] font-bold uppercase bg-fic-red text-white rounded-md hover:bg-red-700"
                    >
                      {EVAL_CONSUMO_COPY.COMMON.SELECCIONAR}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SelectAdmisionModal;
