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
import { normalizeEvaluacionConsumoState } from 'utilities/pages/evaluacion/consumo/status';
import DecisionSection from '../../sections/DecisionSection';

const buildDecisionForm = (data) => applyEvaluacionConsumoDerivedFields(mapApiToForm(data || {}));

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
  const loadedDataIdRef = useRef(data?.id);
  const decisionInFlightRef = useRef(false);

  useEffect(() => {
    if (loadedDataIdRef.current === data?.id) {
      return;
    }

    loadedDataIdRef.current = data?.id;
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
        message: 'Debe registrar un comentario para la decisión.',
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
      setAlert({
        type: 'success',
        message: response.message || `Estado actualizado a ${pendingDecision.estado} correctamente.`,
      });
      onDecisionSuccess?.(source);
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

  return (
    <div className="space-y-4">
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
        canObserve={canObserve}
        canApprove={canApprove}
        canReject={canReject}
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
