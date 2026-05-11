import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from 'context/AuthContext';
import { showImpresionEvaluacionConsumo } from 'services/evaluacionConsumoService';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import { exportEvaluacionConsumoPdf } from 'utilities/pages/evaluacion/consumo/pdfExport';
import {
  isEvaluacionConsumoInReview,
} from 'utilities/pages/evaluacion/consumo/status';
import { normalizeEvaluacionConsumoPrintPayload } from 'utilities/pages/evaluacion/consumo/viewModel';
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
  const [printData, setPrintData] = useState(null);
  const [printError, setPrintError] = useState('');

  const canPrint = checkPermission('evaluaciones_consumo.imprimir');
  const canApproveDecision = checkPermission('evaluaciones_consumo.aprobar');
  const canRejectDecision = checkPermission('evaluaciones_consumo.rechazar');
  const canResolveDecision = canApproveDecision || canRejectDecision;
  const decisionEnabled = isEvaluacionConsumoInReview(data?.estado);
  const showDecisionTab = canResolveDecision && decisionEnabled;
  const exportId = 'evaluacion-consumo-print-content';
  const copy = EVAL_CONSUMO_COPY.MODALS.DETAIL;
  const printableId = data?.id;

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
      setPrintData(null);
      setPrintError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = async () => {
    if (loading || !printableId || isPrinting) return;

    setIsPrinting(true);
    setPrintError('');

    try {
      const response = await showImpresionEvaluacionConsumo(printableId);
      setPrintData(normalizeEvaluacionConsumoPrintPayload(response));
      setShouldRenderPrintContent(true);
    } catch (error) {
      setPrintError(error?.message || 'No se pudo cargar la vista previa de impresión.');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleExportPrint = async () => {
    if (!printData || isPrinting) return;

    setIsPrinting(true);
    setPrintError('');

    try {
      await exportEvaluacionConsumoPdf(
        printData,
        `EvaluacionConsumo-${printData?.evaluacion?.id || printableId || 'detalle'}.pdf`
      );
    } catch (error) {
      setPrintError(error?.message || 'No se pudo generar el PDF.');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleClosePrintPreview = () => {
    if (isPrinting) return;

    setShouldRenderPrintContent(false);
    setPrintData(null);
    setPrintError('');
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
                disabled={loading || !printableId || isPrinting}
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
              canObserve={showDecisionTab}
              canApprove={showDecisionTab && canApproveDecision}
              canReject={showDecisionTab && canRejectDecision}
              onDecisionSuccess={onDecisionSuccess}
            />
          )}
        </div>

        {printError && !shouldRenderPrintContent && (
          <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-xs font-semibold text-red-700">
            {printError}
          </div>
        )}
      </div>

      {shouldRenderPrintContent && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-fic-dark/80 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
              <div>
                <p className="text-xs font-black uppercase text-fic-red">Vista previa de impresión</p>
                <p className="text-sm font-bold text-slate-700">
                  Evaluación consumo #{printData?.evaluacion?.id || data?.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportPrint}
                  className="rounded bg-fic-red px-3 py-2 text-xs font-bold uppercase text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPrinting || !printData}
                >
                  {isPrinting ? copy.PRINTING : 'Generar PDF'}
                </button>
                <button
                  type="button"
                  onClick={handleClosePrintPreview}
                  className="rounded bg-slate-100 px-3 py-2 text-xs font-bold uppercase text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPrinting}
                >
                  {EVAL_CONSUMO_COPY.COMMON.CERRAR}
                </button>
              </div>
            </div>
            {printError && (
              <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-xs font-semibold text-red-700">
                {printError}
              </div>
            )}
            <div className="overflow-auto bg-slate-100 p-4">
              <div className="mx-auto w-[1100px] bg-white shadow">
                <EvaluacionConsumoPrintContent data={printData} containerId={exportId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluacionConsumoDetailModal;
