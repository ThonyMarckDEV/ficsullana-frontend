import React from 'react';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import { formatSectionTitle } from './sectionTitle';

const buttonClassName = 'px-4 py-2.5 text-xs font-bold uppercase rounded disabled:opacity-50';

const DecisionSection = ({
  sectionNumber,
  currentState,
  decisionComment,
  onDecisionCommentChange,
  canObserve,
  canApprove,
  canReject,
  loading,
  onDecision,
}) => {
  const canAct = canObserve || canApprove || canReject;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Decisión de evaluación')}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Estado actual</p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              {currentState}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Comentario de decisión</p>
            <textarea
              value={decisionComment}
              onChange={(event) => onDecisionCommentChange(event.target.value)}
              rows={3}
              disabled={!canAct || loading}
              placeholder="Registre el sustento de la observación o rechazo."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-fic-red/30 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Los estados <strong>OBSERVADO</strong> y <strong>RECHAZADO</strong> requieren comentario.
        </p>

        {canAct ? (
          <div className="flex flex-wrap justify-end gap-3">
            {canObserve ? (
              <button
                type="button"
                onClick={() => onDecision('OBSERVADO')}
                disabled={loading}
                className={`${buttonClassName} bg-blue-700 text-white hover:bg-blue-800`}
              >
                {EVAL_CONSUMO_COPY.ACTIONS.OBSERVAR}
              </button>
            ) : null}

            {canApprove ? (
              <button
                type="button"
                onClick={() => onDecision('APROBADO')}
                disabled={loading}
                className={`${buttonClassName} bg-green-700 text-white hover:bg-green-800`}
              >
                {EVAL_CONSUMO_COPY.ACTIONS.APROBAR}
              </button>
            ) : null}

            {canReject ? (
              <button
                type="button"
                onClick={() => onDecision('RECHAZADO')}
                disabled={loading}
                className={`${buttonClassName} bg-red-700 text-white hover:bg-red-800`}
              >
                {EVAL_CONSUMO_COPY.ACTIONS.RECHAZAR}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default DecisionSection;