import React, { useEffect, useRef, useState } from 'react';
import { exportToPdf } from 'utilities/Export/exportUtils';
import { useAuth } from 'context/AuthContext';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import { isEvaluacionConsumoLocked } from 'utilities/pages/evaluacion/consumo/status';
import useModalFocusTrap from '../../hooks/useModalFocusTrap';
import { BlockSkeleton } from '../shared/InlineSkeleton';
import EvaluacionConsumoPrintContent from './EvaluacionConsumoPrintContent';
import EvaluacionConsumoDetailContent from './EvaluacionConsumoDetailContent';

const EvaluacionConsumoDetailModal = ({ isOpen, onClose, loading, data, onDecisionSuccess }) => {
  const { checkPermission } = useAuth();
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [shouldRenderPrintContent, setShouldRenderPrintContent] = useState(false);

  const canPrint = checkPermission('evaluaciones_consumo.imprimir');
  const canApproveDecision = checkPermission('evaluaciones_consumo.aprobar');
  const canRejectDecision = checkPermission('evaluaciones_consumo.rechazar');
  const decisionLocked = isEvaluacionConsumoLocked(data?.estado);
  const showDecisionTab = canApproveDecision || canRejectDecision;
  const exportId = 'evaluacion-consumo-print-content';
  const copy = EVAL_CONSUMO_COPY.MODALS.DETAIL;

  useModalFocusTrap({
    isOpen,
    dialogRef,
    initialFocusRef: closeBtnRef,
    onClose,
  });

  useEffect(() => {
    if (!isOpen) {
      setIsPrinting(false);
      setShouldRenderPrintContent(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isPrinting || !shouldRenderPrintContent || !data) return undefined;

    let cancelled = false;
    let frameId = null;

    frameId = window.requestAnimationFrame(async () => {
      try {
        await exportToPdf(exportId, `EvaluacionConsumo-${data?.id || 'detalle'}.pdf`);
      } finally {
        if (!cancelled) {
          setIsPrinting(false);
          setShouldRenderPrintContent(false);
        }
      }
    });

    return () => {
      cancelled = true;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [data, exportId, isPrinting, shouldRenderPrintContent]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (loading || !data || isPrinting) return;

    setShouldRenderPrintContent(true);
    setIsPrinting(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fic-dark/80 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="evaluacion-consumo-detail-title"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h3 id="evaluacion-consumo-detail-title" className="text-sm font-black uppercase text-slate-700">
              {copy.TITLE} {data?.id ? `#${data.id}` : ''}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {canPrint && (
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-2 text-xs font-bold uppercase bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading || !data || isPrinting}
                aria-busy={isPrinting}
              >
                {isPrinting ? copy.PRINTING : EVAL_CONSUMO_COPY.ACTIONS.IMPRIMIR}
              </button>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold uppercase bg-fic-dark text-white rounded hover:bg-slate-800"
            >
              {EVAL_CONSUMO_COPY.COMMON.CERRAR}
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto">
          {loading ? (
            <div role="status" aria-live="polite" className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-4 text-sm text-slate-500">{copy.LOADING}</p>
              <BlockSkeleton rows={6} />
            </div>
          ) : !data ? (
            <div className="py-8 text-center text-slate-500">{EVAL_CONSUMO_COPY.COMMON.SIN_DATOS}</div>
          ) : (
            <EvaluacionConsumoDetailContent
              data={data}
              showDecisionTab={showDecisionTab}
              canObserve={!decisionLocked && showDecisionTab}
              canApprove={!decisionLocked && canApproveDecision}
              canReject={!decisionLocked && canRejectDecision}
              onDecisionSuccess={onDecisionSuccess}
            />
          )}
        </div>

        {shouldRenderPrintContent && (
          <EvaluacionConsumoPrintContent data={data} containerId={exportId} />
        )}
      </div>
    </div>
  );
};

export default EvaluacionConsumoDetailModal;
