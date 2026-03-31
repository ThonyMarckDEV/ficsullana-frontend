import { useCallback, useState } from 'react';
import {
  applyEvaluacionConsumoDerivedFields,
} from 'utilities/pages/evaluacion/consumo/formState';
import {
  isEvaluacionConsumoLocked,
  normalizeEvaluacionConsumoState,
} from 'utilities/pages/evaluacion/consumo/status';
import { initialEvaluacionConsumoForm } from './evaluacionConsumoInitialState';
import useEvaluacionConsumoBootstrap from './useEvaluacionConsumoBootstrap';
import useEvaluacionConsumoSelectors from './useEvaluacionConsumoSelectors';
import useEvaluacionConsumoActions from './useEvaluacionConsumoActions';

const useEvaluacionConsumoForm = ({ id, navigate, checkPermission }) => {
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState(initialEvaluacionConsumoForm);
  const [showAdmisionPicker, setShowAdmisionPicker] = useState(false);

  const isEditMode = Boolean(id);
  const normalizedState = normalizeEvaluacionConsumoState(form.estado);
  const isLocked = isEvaluacionConsumoLocked(normalizedState);
  const canEdit = isEditMode
    ? checkPermission('evaluaciones_consumo.editar') && !isLocked
    : checkPermission('evaluaciones_consumo.crear');
  const canApprove = isEditMode && !isLocked && checkPermission('evaluaciones_consumo.aprobar');
  const canReject = isEditMode && !isLocked && checkPermission('evaluaciones_consumo.rechazar');
  const canObserve = isEditMode && !isLocked && (canApprove || canReject);
  const canMakeDecision = canObserve || canApprove || canReject;
  const isReadonly = !canEdit;

  const {
    loading,
    catalogos,
    admisiones,
    contexto,
    setContexto,
    contextLoading,
    loadAdmisionContext,
  } = useEvaluacionConsumoBootstrap({
    id,
    isEditMode,
    setAlert,
    setForm,
  });

  const deriveForm = useCallback(
    (nextForm, overrideCatalogos = catalogos) => applyEvaluacionConsumoDerivedFields(nextForm, overrideCatalogos),
    [catalogos]
  );

  const {
    selectedAdmision,
    selectedProducto,
    selectedProductoRange,
    selectedNivelDiscrecionalidad,
    dependienteFormalTipoIngresoIds,
    showBoletasSection,
    totals,
    otrosIngresosLimit,
  } = useEvaluacionConsumoSelectors({
    form,
    catalogos,
    admisiones,
  });

  const {
    setField,
    handleActividadNoSensibleSelect,
    handleSelectAdmision: selectAdmisionInternal,
    handleGarantiaChange,
    addGarantiaRow,
    removeGarantiaRow,
    toggleGarantiaDireccionSolicitante,
    handleIngresoChange,
    addIngresoRow,
    removeIngresoRow,
    handleSubmit,
    handleDecision,
  } = useEvaluacionConsumoActions({
    id,
    isEditMode,
    navigate,
    form,
    setForm,
    setAlert,
    setSaving,
    catalogos,
    admisiones,
    selectedProductoRange,
    deriveForm,
    loadAdmisionContext,
    setContexto,
    canEdit,
    canMakeDecision,
  });

  const handleSelectAdmision = useCallback(async (admisionId) => {
    const selected = await selectAdmisionInternal(admisionId);
    if (selected) {
      setShowAdmisionPicker(false);
    }
  }, [selectAdmisionInternal]);

  return {
    loading,
    saving,
    alert,
    setAlert,
    form,
    setField,
    handleActividadNoSensibleSelect,
    handleGarantiaChange,
    addGarantiaRow,
    removeGarantiaRow,
    toggleGarantiaDireccionSolicitante,
    catalogos,
    admisiones,
    selectedAdmision,
    selectedProducto,
    selectedProductoRange,
    selectedNivelDiscrecionalidad,
    contexto,
    contextLoading,
    showAdmisionPicker,
    setShowAdmisionPicker,
    isEditMode,
    isReadonly,
    canEdit,
    canObserve,
    canApprove,
    canReject,
    canMakeDecision,
    handleSelectAdmision,
    handleIngresoChange,
    addIngresoRow,
    removeIngresoRow,
    showBoletasSection,
    dependienteFormalTipoIngresoIds,
    handleSubmit,
    handleDecision,
    totals,
    otrosIngresosLimit,
  };
};

export default useEvaluacionConsumoForm;