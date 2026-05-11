import React from 'react';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import { formatEvaluacionConsumoState } from 'utilities/pages/evaluacion/consumo/status';
import { formatSectionTitle } from './sectionTitle';

const buttonClassName = 'px-4 py-2.5 text-xs font-bold uppercase rounded disabled:opacity-50';
const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red disabled:bg-slate-100 disabled:text-slate-500';

const DecisionPlanAdjustments = ({
  form = {},
  disabled,
  selectedProductoRange,
  onFieldChange,
}) => {
  const tasaValue = form.propuesta || form.tasa || '';
  const tasaSolicitadaValue = form.tasa_interes_solicitada || tasaValue;

  return (
    <div className="border-t border-slate-200 pt-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-black uppercase text-slate-500">Ajustes de resolución</p>
        <span className="text-[11px] font-semibold text-slate-500">La cuota se recalcula al registrar la resolución.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="decision-monto" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Monto</label>
          <input
            id="decision-monto"
            type="number"
            className={baseInputClass}
            value={form.monto}
            onChange={(event) => onFieldChange('monto', event.target.value)}
            disabled={disabled}
            min="0.01"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="decision-tipo-frecuencia" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Frecuencia</label>
          <select
            id="decision-tipo-frecuencia"
            className={baseInputClass}
            value={form.tipo_frecuencia}
            onChange={(event) => onFieldChange('tipo_frecuencia', event.target.value)}
            disabled={disabled}
          >
            <option value="">SELECCIONE...</option>
            <option value="SEMANAL">SEMANAL</option>
            <option value="DECENAL">DECENAL</option>
            <option value="CATORCENAL">CATORCENAL</option>
            <option value="MENSUAL">MENSUAL</option>
          </select>
        </div>

        <div>
          <label htmlFor="decision-numero-cuotas" className="block text-xs font-bold text-slate-500 mb-1 uppercase">N° cuotas</label>
          <input
            id="decision-numero-cuotas"
            type="number"
            className={baseInputClass}
            value={form.numero_cuotas}
            onChange={(event) => onFieldChange('numero_cuotas', event.target.value)}
            disabled={disabled}
            min="1"
            step="1"
          />
        </div>

        <div>
          <label htmlFor="decision-tasa" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tasa final %</label>
          <input
            id="decision-tasa"
            type="number"
            className={baseInputClass}
            value={tasaValue}
            onChange={(event) => onFieldChange('propuesta', event.target.value)}
            disabled={disabled}
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="decision-tasa-solicitada" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tasa solicitada %</label>
          <input
            id="decision-tasa-solicitada"
            className={baseInputClass}
            value={tasaSolicitadaValue}
            disabled
            readOnly
          />
        </div>

        <div>
          <label htmlFor="decision-cuota" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Cuota</label>
          <input
            id="decision-cuota"
            className={baseInputClass}
            value={form.cuota}
            disabled
            readOnly
          />
        </div>
      </div>

      <p className={`mt-2 text-[10px] ${selectedProductoRange?.exactMatch ? 'text-green-700' : 'text-slate-500'}`}>
        {selectedProductoRange?.helperText || selectedProductoRange?.label || 'Seleccione producto'}
      </p>
    </div>
  );
};

const DecisionSection = ({
  sectionNumber,
  framed = true,
  currentState,
  form = {},
  selectedProductoRange,
  decisionComment,
  onDecisionCommentChange,
  onPlanFieldChange,
  canObserve,
  canApprove,
  canReject,
  loading,
  onDecision,
}) => {
  const canAct = canObserve || canApprove || canReject;
  const content = (
    <>
      <h3 className="text-sm font-black uppercase text-slate-700 mb-4">
        {sectionNumber ? formatSectionTitle(sectionNumber, 'Resolución de crédito') : 'Resolución de crédito'}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Estado actual</p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              {formatEvaluacionConsumoState(currentState)}
            </div>
          </div>
        </div>

        <DecisionPlanAdjustments
          form={form}
          disabled={!canAct || loading}
          selectedProductoRange={selectedProductoRange}
          onFieldChange={onPlanFieldChange}
        />

        <div>
          <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Comentario final de resolución</p>
          <textarea
            value={decisionComment}
            onChange={(event) => onDecisionCommentChange(event.target.value)}
            rows={3}
            disabled={!canAct || loading}
            placeholder="Registre el sustento final de la resolución."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-fic-red/30 disabled:bg-slate-100 disabled:text-slate-500"
          />
        </div>

        <p className="text-xs text-slate-500">
          El comentario es obligatorio para registrar la resolución.
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
    </>
  );

  if (!framed) {
    return content;
  }

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5">
      {content}
    </section>
  );
};

export default DecisionSection;
