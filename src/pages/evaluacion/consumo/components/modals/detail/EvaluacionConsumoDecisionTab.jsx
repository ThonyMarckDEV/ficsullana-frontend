import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { updateEstadoEvaluacionConsumo } from 'services/evaluacionConsumoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { resolveProductoConfiguracion } from 'utilities/productos';
import { applyEvaluacionConsumoDerivedFields } from 'utilities/pages/evaluacion/consumo/formState';
import { mapApiToForm } from 'utilities/pages/evaluacion/consumo/transformers';
import {
  buildDecisionPlanAdjustmentPayload,
  validateDecisionPlanAdjustments,
} from 'utilities/pages/evaluacion/consumo/decisionPayload';
import {
  isEvaluacionConsumoInReview,
  normalizeEvaluacionConsumoState,
} from 'utilities/pages/evaluacion/consumo/status';
import DecisionSection from '../../sections/DecisionSection';
import {
  formatDateOrNA,
  textOrNA,
} from './detailFormatters';

const hasValue = (value) => value !== null && value !== undefined && value !== '';

const buildDecisionForm = (data) => {
  const derivedForm = applyEvaluacionConsumoDerivedFields(mapApiToForm(data || {}));

  return hasValue(data?.cuota)
    ? { ...derivedForm, cuota: String(data.cuota) }
    : derivedForm;
};

const buildDecisionDataKey = (data) => [
  data?.id || '',
  data?.estado || '',
  data?.decision_comentario || '',
  data?.resolucion_modificada_at || '',
  data?.monto || '',
  data?.tipo_frecuencia || '',
  data?.numero_cuotas || '',
  data?.propuesta || '',
  data?.tasa || '',
  data?.tasa_interes_solicitada || '',
  data?.cuota || '',
].join('|');

const DECISION_CONFIRM_COPY = {
  OBSERVADO: {
    title: 'Confirmar observación',
    message: '¿Desea observar dicha evaluación?',
  },
  APROBADO: {
    title: 'Confirmar aprobación',
    message: '¿Desea aprobar dicha evaluación?',
  },
  RECHAZADO: {
    title: 'Confirmar rechazo',
    message: '¿Desea rechazar dicha evaluación?',
  },
};

const EvaluacionConsumoDecisionTab = ({
  data,
  canObserve,
  canApprove,
  canReject,
  onDecisionSuccess,
}) => {
  const [form, setForm] = useState(() => buildDecisionForm(data));
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDecision, setPendingDecision] = useState(null);
  const loadedDataKeyRef = useRef(buildDecisionDataKey(data));
  const decisionInFlightRef = useRef(false);

  useEffect(() => {
    const nextDataKey = buildDecisionDataKey(data);
    if (loadedDataKeyRef.current === nextDataKey) {
      return;
    }

    loadedDataKeyRef.current = nextDataKey;
    decisionInFlightRef.current = false;
    setForm(buildDecisionForm(data));
    setAlert(null);
    setSaving(false);
    setPendingDecision(null);
  }, [data]);

  const selectedProductoRange = useMemo(() => resolveProductoConfiguracion(data?.producto, {
    tipoFrecuencia: form.tipo_frecuencia,
    monto: form.monto,
    numeroCuotas: form.numero_cuotas,
  }), [data?.producto, form.monto, form.numero_cuotas, form.tipo_frecuencia]);

  const setDecisionField = useCallback((name, value) => {
    setForm((previousForm) => applyEvaluacionConsumoDerivedFields({
      ...previousForm,
      [name]: value,
    }));
  }, []);

  const validateDecision = useCallback((estado) => {
    const normalizedState = normalizeEvaluacionConsumoState(estado);
    const decisionComentario = String(form.decision_comentario || '').trim();

    if (decisionComentario === '') {
      setAlert({
        type: 'error',
        message: 'Debe registrar un comentario para la resolución.',
      });
      return null;
    }

    const decisionPlanErrors = validateDecisionPlanAdjustments(form, selectedProductoRange);
    if (decisionPlanErrors.length > 0) {
      setAlert({
        type: 'error',
        message: 'Revise los ajustes de decisión.',
        details: decisionPlanErrors,
      });
      return null;
    }

    return {
      estado: normalizedState,
      decisionComentario,
    };
  }, [form, selectedProductoRange]);

  const handleDecisionRequest = useCallback((estado) => {
    if (!data?.id || saving) return;

    const nextDecision = validateDecision(estado);
    if (!nextDecision) return;

    setPendingDecision(nextDecision);
  }, [data?.id, saving, validateDecision]);

  const executeDecision = useCallback(async () => {
    if (!data?.id || !pendingDecision || saving || decisionInFlightRef.current) return;

    decisionInFlightRef.current = true;
    setSaving(true);
    setAlert(null);
    setPendingDecision(null);

    try {
      const response = await updateEstadoEvaluacionConsumo(data.id, {
        estado: pendingDecision.estado,
        decision_comentario: pendingDecision.decisionComentario,
        ...buildDecisionPlanAdjustmentPayload(form),
      });
      const source = response.data || response;

      setForm(buildDecisionForm(source));
      loadedDataKeyRef.current = buildDecisionDataKey(source);
      setAlert({
        type: 'success',
        message: response.message || `Resolución actualizada a ${pendingDecision.estado} correctamente.`,
      });
      await onDecisionSuccess?.(source);
    } catch (error) {
      setAlert(handleApiError(error, 'No se pudo registrar la decisión de la evaluación consumo.'));
    } finally {
      decisionInFlightRef.current = false;
      setSaving(false);
    }
  }, [data?.id, form, onDecisionSuccess, pendingDecision, saving]);

  const pendingDecisionCopy = pendingDecision
    ? DECISION_CONFIRM_COPY[pendingDecision.estado]
    : null;
  const isInReview = isEvaluacionConsumoInReview(data?.estado);
  const canEditResolution = isInReview;
  const modifiedBy = data?.resolucion_modificada_por?.username
    || data?.resolucion_modificada_por?.id
    || '';
  const modifiedAt = data?.resolucion_modificada_at;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-xs font-black uppercase text-slate-600">Resolución de crédito</p>
          {modifiedBy || modifiedAt ? (
            <p className="mt-1 text-xs text-slate-500">
              Última modificación: {textOrNA(modifiedBy)} · {formatDateOrNA(modifiedAt, true)}
            </p>
          ) : null}
        </div>

      </div>

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <DecisionSection
        framed={false}
        currentState={form.estado}
        form={form}
        selectedProductoRange={selectedProductoRange}
        decisionComment={form.decision_comentario || ''}
        onDecisionCommentChange={(value) => setDecisionField('decision_comentario', value)}
        onPlanFieldChange={setDecisionField}
        canObserve={canEditResolution && canObserve}
        canApprove={canEditResolution && canApprove}
        canReject={canEditResolution && canReject}
        loading={saving}
        onDecision={handleDecisionRequest}
      />

      {pendingDecisionCopy ? (
        <ConfirmModal
          title={pendingDecisionCopy.title}
          message={pendingDecisionCopy.message}
          confirmText="Sí"
          cancelText="Cancelar"
          onConfirm={executeDecision}
          onCancel={() => setPendingDecision(null)}
        />
      ) : null}
    </div>
  );
};

export default EvaluacionConsumoDecisionTab;
