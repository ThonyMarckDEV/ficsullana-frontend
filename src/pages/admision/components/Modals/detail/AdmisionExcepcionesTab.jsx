import React from 'react';
import { getExceptionRuleName } from 'utilities/pages/admision/exceptionRules';
import {
  ADMISION_COPY_COMMON,
  ADMISION_COPY_DETAIL_MODAL,
  ADMISION_COPY_EXCEPTION_MODAL,
} from 'utilities/pages/admision/copy';
import { Badge } from './DetailShared';

const AdmisionExcepcionesTab = ({
  viewModel,
  hasExceptionPending,
  canReviewExceptions,
  canRejectException,
  canApproveException,
  isResolvingException,
  isExceptionCommentEmpty,
  exceptionComment,
  resolveExceptionError,
  resolvingAction,
  onExceptionCommentChange,
  onResolveException,
}) => (
  <section className="space-y-4">
    <div>
      <p className="text-xs font-black uppercase text-slate-600 mb-2">Excepciones detectadas</p>
      <div className="space-y-2">
        {viewModel.reglasExcepcion.length === 0 ? (
          <p className="text-xs text-slate-500 italic">{ADMISION_COPY_DETAIL_MODAL.EMPTY.SIN_EXCEPCIONES}</p>
        ) : (
          viewModel.reglasExcepcion.map((rule, index) => (
            <div key={`${rule.code || 'RULE'}-${index}`} className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2">
              <p className="text-[11px] font-black uppercase text-orange-800">{getExceptionRuleName(rule)}</p>
              <p className="text-xs text-orange-700 mt-1">{rule.message || ADMISION_COPY_COMMON.FALLBACK.SIN_DETALLE}</p>
            </div>
          ))
        )}
      </div>
    </div>
    <div>
      <p className="text-xs font-black uppercase text-slate-600 mb-2">Reglas bloqueantes</p>
      <div className="space-y-2">
        {viewModel.reglasBloqueantes.length === 0 ? (
          <p className="text-xs text-slate-500 italic">{ADMISION_COPY_DETAIL_MODAL.EMPTY.SIN_REGLAS_BLOQUEANTES}</p>
        ) : (
          viewModel.reglasBloqueantes.map((rule, index) => (
            <div key={`${rule.code || 'BLOCK'}-${index}`} className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-[11px] font-black uppercase text-red-800">{getExceptionRuleName(rule)}</p>
              <p className="text-xs text-red-700 mt-1">{rule.message || ADMISION_COPY_COMMON.FALLBACK.SIN_DETALLE}</p>
            </div>
          ))
        )}
      </div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase text-slate-600 mb-2">Excepciones seleccionadas por asesor</p>
      {viewModel.selectedExceptionNames.length === 0 ? (
        <p className="text-xs text-slate-500 italic">{ADMISION_COPY_DETAIL_MODAL.EMPTY.SIN_SELECCIONES}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {viewModel.selectedExceptionNames.map((name, idx) => (
            <Badge key={`${name}-${idx}`} label={name} tone="orange" />
          ))}
        </div>
      )}
    </div>
    {hasExceptionPending && canReviewExceptions && (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-xs font-black uppercase text-slate-700">{ADMISION_COPY_EXCEPTION_MODAL.REVIEW.TITLE}</h4>
        <p className="mt-1 text-xs text-slate-600">{ADMISION_COPY_EXCEPTION_MODAL.REVIEW.SUBTITLE}</p>
        <div className="mt-3">
          <label className="block text-[11px] uppercase font-black text-slate-600 mb-1">
            {ADMISION_COPY_EXCEPTION_MODAL.REVIEW.COMENTARIO_REVISOR}
          </label>
          <textarea
            value={exceptionComment}
            onChange={(e) => onExceptionCommentChange(e.target.value)}
            className="w-full h-24 text-sm border rounded-md p-2 outline-none focus:border-fic-red"
            placeholder={ADMISION_COPY_EXCEPTION_MODAL.REVIEW.PLACEHOLDER_COMENTARIO}
          />
          {isExceptionCommentEmpty && (
            <p className="mt-2 text-xs font-bold text-red-700">
              {ADMISION_COPY_EXCEPTION_MODAL.REVIEW.COMENTARIO_REQUERIDO}
            </p>
          )}
          {Boolean(resolveExceptionError) && (
            <p className="mt-2 text-xs font-bold text-red-700">
              {resolveExceptionError}
            </p>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {canRejectException && (
            <button
              type="button"
              onClick={() => onResolveException('RECHAZAR')}
              disabled={isResolvingException || isExceptionCommentEmpty}
              className="px-3 py-2 text-xs font-bold uppercase text-white rounded bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resolvingAction === 'RECHAZAR'
                ? ADMISION_COPY_EXCEPTION_MODAL.REVIEW.RECHAZANDO
                : ADMISION_COPY_EXCEPTION_MODAL.REVIEW.RECHAZAR}
            </button>
          )}
          {canApproveException && (
            <button
              type="button"
              onClick={() => onResolveException('APROBAR')}
              disabled={isResolvingException || isExceptionCommentEmpty}
              className="px-3 py-2 text-xs font-bold uppercase text-white rounded bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resolvingAction === 'APROBAR'
                ? ADMISION_COPY_EXCEPTION_MODAL.REVIEW.APROBANDO
                : ADMISION_COPY_EXCEPTION_MODAL.REVIEW.APROBAR}
            </button>
          )}
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-black uppercase text-slate-600">Motivo asesor</p>
        <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{viewModel.motivoAsesor}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-black uppercase text-slate-600">Comentario revisión</p>
        <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{viewModel.comentarioRevision}</p>
      </div>
    </div>
  </section>
);

export default AdmisionExcepcionesTab;