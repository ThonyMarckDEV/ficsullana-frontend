import React from 'react';
import {
  ADMISION_COPY_COMMON,
  ADMISION_COPY_EXCEPTION_MODAL,
} from 'utilities/pages/admision/copy';

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

  const isApprove = Number(decision) === 1;
  const isCommentEmpty = comment.trim() === '';

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
          <p className={`mt-2 text-xs font-black uppercase ${isApprove ? 'text-green-700' : 'text-red-700'}`}>
            {isApprove
              ? ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.DECISION_APROBAR
              : ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.DECISION_RECHAZAR}
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-[11px] uppercase font-black text-slate-600 mb-1">
            {ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.COMENTARIO_LABEL}
          </label>
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="w-full h-28 text-sm border rounded-md p-2 outline-none focus:border-fic-red"
            placeholder={ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.COMENTARIO_PLACEHOLDER}
          />
          {isCommentEmpty && (
            <p className="mt-2 text-xs font-bold text-red-700">
              {ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.COMENTARIO_REQUERIDO}
            </p>
          )}
          {Boolean(error) && (
            <p className="mt-2 text-xs font-bold text-red-700">{error}</p>
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
            className={`px-3 py-2 text-xs font-bold uppercase text-white rounded disabled:opacity-50 disabled:cursor-not-allowed ${isApprove ? 'bg-green-700 hover:bg-green-800' : 'bg-red-700 hover:bg-red-800'}`}
          >
            {loading
              ? ADMISION_COPY_COMMON.ACTIONS.PROCESANDO
              : (isApprove
                ? ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.CONFIRM_APROBAR
                : ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.CONFIRM_RECHAZAR)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialDecisionModal;