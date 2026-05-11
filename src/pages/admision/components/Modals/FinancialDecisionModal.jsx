import React from 'react';
import {
  ADMISION_COPY_COMMON,
  ADMISION_COPY_EXCEPTION_MODAL,
} from 'utilities/pages/admision/copy';
import { ADMISION_STATES } from 'utilities/pages/admision/status';

const FinancialDecisionModal = ({
  isOpen,
  loading = false,
  decision = '',
  comment = '',
  error = '',
  onCommentChange,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const numericDecision = Number(decision);
  const isApprove = numericDecision === ADMISION_STATES.APROBADO;
  const isObserved = numericDecision === ADMISION_STATES.OBSERVADO;
  const isCommentEmpty = comment.trim() === '';
  const hasCommentError = Boolean(error);
  const decisionTone = isApprove
    ? 'green'
    : (isObserved ? 'blue' : 'red');
  const decisionText = isApprove
    ? ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.DECISION_APROBAR
    : (isObserved
      ? ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.DECISION_OBSERVAR
      : ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.DECISION_RECHAZAR);
  const confirmText = isApprove
    ? ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.CONFIRM_APROBAR
    : (isObserved
      ? ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.CONFIRM_OBSERVAR
      : ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.CONFIRM_RECHAZAR);

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 p-5">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800">
            {ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.TITLE}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.SUBTITLE}
          </p>
          <p className={`mt-2 text-xs font-black uppercase ${decisionTone === 'green' ? 'text-green-700' : decisionTone === 'blue' ? 'text-blue-700' : 'text-red-700'}`}>
            {decisionText}
          </p>
        </div>

        <div className={`mt-4 rounded-lg border p-3 ${decisionTone === 'green' ? 'border-green-200 bg-green-50/40' : decisionTone === 'blue' ? 'border-blue-200 bg-blue-50/40' : 'border-red-200 bg-red-50/40'}`}>
          <label htmlFor="financial-comment" className="block text-[11px] uppercase font-black text-slate-700">
            {ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.COMENTARIO_LABEL}
          </label>
          <textarea
            id="financial-comment"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            aria-invalid={hasCommentError}
            className={`mt-2 w-full h-28 rounded-md border bg-white p-2 text-sm text-slate-700 outline-none transition-all ${hasCommentError ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/40' : 'border-slate-300 focus:border-fic-red focus:ring-1 focus:ring-fic-red/40'}`}
            placeholder={ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.COMENTARIO_PLACEHOLDER}
          />
          <p className="mt-2 text-[11px] text-slate-500">
            Este comentario se registrará en la auditoria de la admisión.
          </p>
          {Boolean(error) && (
            <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-xs font-bold text-red-700">
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3 py-2 text-xs font-bold uppercase bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50"
          >
            {ADMISION_COPY_COMMON.ACTIONS.CANCELAR}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || isCommentEmpty}
            className={`px-3 py-2 text-xs font-bold uppercase text-white rounded disabled:opacity-50 disabled:cursor-not-allowed ${decisionTone === 'green' ? 'bg-green-700 hover:bg-green-800' : decisionTone === 'blue' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-red-700 hover:bg-red-800'}`}
          >
            {loading
              ? ADMISION_COPY_COMMON.ACTIONS.PROCESANDO
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialDecisionModal;
