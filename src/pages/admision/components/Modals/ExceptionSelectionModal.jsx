import React from 'react';
import {
  getExceptionRuleName,
  getMissingExceptionRules,
  getSelectionProgress,
  normalizeRuleCode,
} from 'utilities/pages/admision/exceptionRules';
import {
  ADMISION_COPY_COMMON,
  ADMISION_COPY_EXCEPTION_MODAL,
} from 'utilities/pages/admision/copy';

const ExceptionSelectionModal = ({
  isOpen,
  reason,
  onReasonChange,
  rules,
  selectionMap,
  onToggleRule,
  onClose,
  onConfirm,
  title = ADMISION_COPY_EXCEPTION_MODAL.SELECTION.TITLE,
  subtitle = ADMISION_COPY_EXCEPTION_MODAL.SELECTION.SUBTITLE,
  confirmText = ADMISION_COPY_EXCEPTION_MODAL.SELECTION.CONFIRM_TEXT,
  loading = false,
}) => {
  if (!isOpen) return null;

  const { selected, total, complete } = getSelectionProgress(rules, selectionMap);
  const missingRules = getMissingExceptionRules(rules, selectionMap);
  const isReasonValid = String(reason || '').trim() !== '';
  const disableConfirm = loading || !isReasonValid || !complete;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-black uppercase text-slate-800">{title}</h3>
        <p className="text-xs text-slate-600 mt-2">{subtitle}</p>
        <div className="mt-3 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-bold uppercase text-slate-600">{ADMISION_COPY_EXCEPTION_MODAL.SELECTION.SELECTED_TITLE}</p>
          <p className={`text-[11px] font-black ${complete ? 'text-green-700' : 'text-orange-700'}`}>
            {selected}/{total}
          </p>
        </div>

        <div className="mt-4 max-h-72 overflow-y-auto border border-slate-200 rounded-md divide-y divide-slate-100">
          {rules.map((rule) => {
            const code = normalizeRuleCode(rule?.code);
            const checked = Boolean(selectionMap[code]);

            return (
              <label key={code} className="block p-3 cursor-pointer hover:bg-slate-50">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleRule(code)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-fic-red focus:ring-fic-red"
                  />
                  <div>
                    <p className="text-xs font-black uppercase text-slate-700">{getExceptionRuleName(rule)}</p>
                    <p className="text-xs text-slate-600 mt-1">{rule?.message}</p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {!complete && (
          <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 px-3 py-2">
            <p className="text-[11px] font-black uppercase text-orange-800">{ADMISION_COPY_EXCEPTION_MODAL.SELECTION.MISSING_TITLE}</p>
            <ul className="mt-1 list-disc pl-4 text-xs text-orange-700">
              {missingRules.map((rule) => (
                <li key={normalizeRuleCode(rule?.code)}>{getExceptionRuleName(rule)}</li>
              ))}
            </ul>
          </div>
        )}

        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          className="mt-3 w-full h-28 text-sm border rounded-md p-2 outline-none focus:border-fic-red"
          placeholder={ADMISION_COPY_EXCEPTION_MODAL.SELECTION.REASON_PLACEHOLDER}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-bold uppercase bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
          >
            {ADMISION_COPY_COMMON.ACTIONS.CANCELAR}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={disableConfirm}
            className="px-3 py-2 text-xs font-bold uppercase bg-fic-red text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? ADMISION_COPY_COMMON.ACTIONS.PROCESANDO : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExceptionSelectionModal;