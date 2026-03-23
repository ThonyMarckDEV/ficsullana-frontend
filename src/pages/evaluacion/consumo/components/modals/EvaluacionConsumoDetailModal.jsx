import React, { useEffect, useRef } from 'react';
import { exportToPdf } from 'utilities/Export/exportUtils';
import { useAuth } from 'context/AuthContext';
import EvaluacionConsumoPrintContent from './EvaluacionConsumoPrintContent';
import HistorialInternoSection from '../sections/HistorialInternoSection';
import HistorialExternoSection from '../sections/HistorialExternoSection';
import ExcepcionesSection from '../sections/ExcepcionesSection';
import { resolveProductoConfiguracion } from 'utilities/productos';
import { normalizeEvaluacionConsumoState } from 'utilities/pages/evaluacion/consumo/status';

const money = (value) =>
  Number(value || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EvaluacionConsumoDetailModal = ({ isOpen, onClose, loading, data }) => {
  const { checkPermission } = useAuth();
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  const canPrint = checkPermission('evaluaciones_consumo.imprimir');

  useEffect(() => {
    if (!isOpen) return undefined;

    const focusableSelector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusables = Array.from(dialogRef.current.querySelectorAll(focusableSelector));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const exportId = 'evaluacion-consumo-print-content';
  const productoRange = resolveProductoConfiguracion(data?.producto, {
    tipoFrecuencia: data?.tipo_frecuencia,
    monto: data?.monto,
    numeroCuotas: data?.numero_cuotas,
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="evaluacion-consumo-detail-title"
        className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 id="evaluacion-consumo-detail-title" className="text-sm font-black uppercase text-slate-700">
            Detalle Evaluación Consumo {data?.id ? `#${data.id}` : ''}
          </h3>
          <div className="flex items-center gap-2">
            {canPrint && (
              <button
                type="button"
                onClick={() => exportToPdf(exportId, `EvaluacionConsumo-${data?.id || 'detalle'}.pdf`)}
                className="px-3 py-2 text-xs font-bold uppercase bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                disabled={loading || !data}
              >
                Imprimir
              </button>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold uppercase bg-fic-dark text-white rounded hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-slate-500">Cargando detalle...</div>
          ) : !data ? (
            <div className="py-8 text-center text-slate-500">Sin datos.</div>
          ) : (
            <div className="space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><span className="text-slate-500 text-xs uppercase font-bold">Estado:</span> <strong>{normalizeEvaluacionConsumoState(data.estado)}</strong></div>
                <div><span className="text-slate-500 text-xs uppercase font-bold">Solicitante:</span> <strong>{data.solicitante_nombre_snapshot}</strong></div>
                <div><span className="text-slate-500 text-xs uppercase font-bold">DNI:</span> <strong>{data.solicitante_dni_snapshot}</strong></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><span className="text-slate-500 text-xs uppercase font-bold">Monto:</span> <strong>{money(data.monto)}</strong></div>
                <div><span className="text-slate-500 text-xs uppercase font-bold">Rango Tasa %:</span> <strong>{productoRange?.label || 'N/A'}</strong></div>
                <div><span className="text-slate-500 text-xs uppercase font-bold">Producto:</span> <strong>{data?.producto?.nombre || 'N/A'}</strong></div>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1">Motivos</p>
                <p className="rounded-md border border-slate-200 p-3 bg-slate-50">{data.motivos}</p>
              </div>
              {data.decision_comentario ? (
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold mb-1">Comentario de decisión</p>
                  <p className="rounded-md border border-slate-200 p-3 bg-slate-50">{data.decision_comentario}</p>
                </div>
              ) : null}

              <HistorialInternoSection contexto={data.contexto} />
              <HistorialExternoSection contexto={data.contexto} />
              <ExcepcionesSection contexto={data.contexto} />
            </div>
          )}
        </div>

        <EvaluacionConsumoPrintContent data={data} containerId={exportId} />
      </div>
    </div>
  );
};

export default EvaluacionConsumoDetailModal;