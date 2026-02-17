import React from 'react';
import {
  getExceptionRuleName,
  getExceptionRules,
  stripSystemAlertPrefix,
} from 'utilities/pages/admision/exceptionRules';
import {
  ADMISION_COPY_COMMON,
  ADMISION_COPY_EXCEPTION_MODAL,
} from 'utilities/pages/admision/copy';

const buildFullName = (persona, type) => {
  if (!persona) return ADMISION_COPY_COMMON.FALLBACK.SIN_NOMBRE;

  if (type === 'CLIENTE') {
    return `${persona.nombre || ''} ${persona.apellidoPaterno || ''} ${persona.apellidoMaterno || ''}`.trim() || ADMISION_COPY_COMMON.FALLBACK.SIN_NOMBRE;
  }

  return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim() || ADMISION_COPY_COMMON.FALLBACK.SIN_NOMBRE;
};

const ExceptionReviewModal = ({
  isOpen,
  loading = false,
  action = null,
  data = null,
  comment = '',
  canApprove = false,
  canReject = false,
  onCommentChange,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen) return null;

  const isSubmittingApprove = loading && action === 'APROBAR';
  const isSubmittingReject = loading && action === 'RECHAZAR';
  const isSubmittingDecision = isSubmittingApprove || isSubmittingReject;

  const evaluacion = data?.resultado_evaluacion || {};
  const exceptionRules = getExceptionRules(evaluacion);
  const selectedNames = Array.isArray(evaluacion.selected_exception_names) && evaluacion.selected_exception_names.length > 0
    ? evaluacion.selected_exception_names
    : exceptionRules.map((rule) => getExceptionRuleName(rule));
  const advisorObservation = stripSystemAlertPrefix(data?.observaciones || '');
  const persona = data?.cliente ? data?.cliente?.datos : data?.prospecto;
  const personType = data?.cliente ? 'CLIENTE' : 'PROSPECTO';
  const fullName = buildFullName(persona, personType);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-800">{ADMISION_COPY_EXCEPTION_MODAL.REVIEW.TITLE}</h3>
            <p className="text-xs text-slate-600 mt-1">
              {ADMISION_COPY_EXCEPTION_MODAL.REVIEW.SUBTITLE}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-700">
            #{data?.id || '---'}
          </span>
        </div>

        {!data ? (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
            {ADMISION_COPY_EXCEPTION_MODAL.REVIEW.LOADING_DETAIL}
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="md:col-span-2">
                <p className="text-[10px] uppercase font-black text-slate-500">{ADMISION_COPY_COMMON.LABELS.SOLICITANTE}</p>
                <p className="text-sm font-bold text-slate-800">{fullName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-500">{ADMISION_COPY_COMMON.LABELS.TIPO_PRESTAMO}</p>
                <p className="text-sm font-bold text-slate-800">{data?.tipo_prestamo || ADMISION_COPY_COMMON.FALLBACK.NA}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-500">{ADMISION_COPY_COMMON.LABELS.ESTADO_EXCEPCION}</p>
                <p className="text-sm font-bold text-slate-800">
                  {Number(data?.excepcion_estado) === 1
                    ? ADMISION_COPY_EXCEPTION_MODAL.REVIEW.ESTADO_PENDIENTE
                    : ADMISION_COPY_EXCEPTION_MODAL.REVIEW.ESTADO_NO_PENDIENTE}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase font-black text-slate-600 mb-2">{ADMISION_COPY_EXCEPTION_MODAL.REVIEW.EXCEPCIONES_DETECTADAS}</p>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {exceptionRules.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">{ADMISION_COPY_EXCEPTION_MODAL.REVIEW.SIN_EXCEPCIONES}</p>
                  ) : (
                    exceptionRules.map((rule, index) => (
                      <div key={`${rule.code || 'RULE'}-${index}`} className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2">
                        <p className="text-[11px] font-black uppercase text-orange-800">{getExceptionRuleName(rule)}</p>
                        <p className="text-xs text-orange-700 mt-1">{rule?.message || ADMISION_COPY_COMMON.FALLBACK.SIN_DETALLE}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase font-black text-slate-600 mb-2">{ADMISION_COPY_EXCEPTION_MODAL.REVIEW.EXCEPCIONES_ASESOR}</p>
                {selectedNames.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">{ADMISION_COPY_EXCEPTION_MODAL.REVIEW.SIN_SELECCION}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedNames.map((name, idx) => (
                      <span
                        key={`${name}-${idx}`}
                        className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-2 py-1 text-[10px] font-black uppercase text-orange-800"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <p className="text-[10px] uppercase font-black text-slate-500">{ADMISION_COPY_COMMON.LABELS.MOTIVO_ASESOR}</p>
                  <p className="text-sm text-slate-700 mt-1">{data?.excepcion_motivo_asesor || ADMISION_COPY_COMMON.FALLBACK.SIN_MOTIVO}</p>
                </div>

                <div className="mt-3 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <p className="text-[10px] uppercase font-black text-slate-500">{ADMISION_COPY_COMMON.LABELS.OBSERVACION_ASESOR}</p>
                  <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{advisorObservation || ADMISION_COPY_COMMON.FALLBACK.SIN_OBSERVACIONES}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-[11px] uppercase font-black text-slate-600 mb-1">{ADMISION_COPY_EXCEPTION_MODAL.REVIEW.COMENTARIO_REVISOR}</label>
              <textarea
                value={comment}
                onChange={(e) => onCommentChange(e.target.value)}
                className="w-full h-24 text-sm border rounded-md p-2 outline-none focus:border-fic-red"
                placeholder={ADMISION_COPY_EXCEPTION_MODAL.REVIEW.PLACEHOLDER_COMENTARIO}
              />
            </div>
          </>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmittingDecision}
            className="px-3 py-2 text-xs font-bold uppercase bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50"
          >
            {ADMISION_COPY_COMMON.ACTIONS.CERRAR}
          </button>
          {canReject && (
            <button
              type="button"
              onClick={onReject}
              disabled={loading || !data}
              className="px-3 py-2 text-xs font-bold uppercase text-white rounded bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingReject ? ADMISION_COPY_EXCEPTION_MODAL.REVIEW.RECHAZANDO : ADMISION_COPY_EXCEPTION_MODAL.REVIEW.RECHAZAR}
            </button>
          )}
          {canApprove && (
            <button
              type="button"
              onClick={onApprove}
              disabled={loading || !data}
              className="px-3 py-2 text-xs font-bold uppercase text-white rounded bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingApprove ? ADMISION_COPY_EXCEPTION_MODAL.REVIEW.APROBANDO : ADMISION_COPY_EXCEPTION_MODAL.REVIEW.APROBAR}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExceptionReviewModal;