import { useCallback, useEffect, useState } from 'react';
import {
  applyEvaluacionConsumoDerivedFields,
} from 'utilities/pages/evaluacion/consumo/formState';
import { createAvalModalState } from 'utilities/pages/evaluacion/consumo/avalWorkflow';
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
  const [avalModalState, setAvalModalState] = useState(createAvalModalState());

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
    admisionesLoading,
    admisionesError,
    contexto,
    setContexto,
    contextLoading,
    loadAdmisionContext,
    loadAdmisionesElegibles,
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
    avalGroups,
  } = useEvaluacionConsumoSelectors({
    form,
    catalogos,
    admisiones,
    canEdit,
  });
  const avalGroupSlotsKey = avalGroups.map((group) => group.slot).join('|');

  const openAvalModal = useCallback((slot, reason = 'manual') => {
    setAvalModalState((previousState) => {
      if (
        previousState.isOpen
        && previousState.dirtyState
        && previousState.activeAvalSlot !== slot
      ) {
        return {
          ...previousState,
          exitConfirmOpen: true,
          pendingExit: {
            type: 'switch',
            slot,
            reason,
          },
        };
      }

      return createAvalModalState({
        isOpen: true,
        activeAvalSlot: slot,
        openReason: reason,
      });
    });
  }, []);

  const closeAvalModal = useCallback(() => {
    setAvalModalState((previousState) => {
      if (!previousState.isOpen) {
        return previousState;
      }

      if (previousState.dirtyState) {
        return {
          ...previousState,
          exitConfirmOpen: true,
          pendingExit: {
            type: 'close',
          },
        };
      }

      return createAvalModalState();
    });
  }, []);

  const cancelAvalModalExit = useCallback(() => {
    setAvalModalState((previousState) => ({
      ...previousState,
      exitConfirmOpen: false,
      pendingExit: null,
    }));
  }, []);

  const confirmAvalModalExit = useCallback(() => {
    setAvalModalState((previousState) => {
      const pendingExit = previousState.pendingExit;

      if (pendingExit?.type === 'switch') {
        return createAvalModalState({
          isOpen: true,
          activeAvalSlot: pendingExit.slot,
          openReason: pendingExit.reason,
        });
      }

      return createAvalModalState();
    });
  }, []);

  const markAvalModalDirty = useCallback((value = true) => {
    setAvalModalState((previousState) => {
      const nextDirtyState = Boolean(value);

      if (previousState.dirtyState === nextDirtyState) {
        return previousState;
      }

      return {
        ...previousState,
        dirtyState: nextDirtyState,
      };
    });
  }, []);

  useEffect(() => {
    if (!avalModalState.isOpen) {
      return;
    }

    const slotStillExists = avalGroupSlotsKey
      .split('|')
      .some((slot) => Number(slot) === avalModalState.activeAvalSlot);
    if (!slotStillExists) {
      setAvalModalState((previousState) => {
        if (!previousState.isOpen) {
          return previousState;
        }

        if (previousState.dirtyState) {
          if (previousState.exitConfirmOpen && previousState.pendingExit?.type === 'close') {
            return previousState;
          }

          return {
            ...previousState,
            exitConfirmOpen: true,
            pendingExit: {
              type: 'close',
            },
          };
        }

        return createAvalModalState();
      });
    }
  }, [
    avalGroupSlotsKey,
    avalModalState.activeAvalSlot,
    avalModalState.isOpen,
  ]);

  const {
    setField,
    setAvalField,
    handleAvalSelect,
    startManualAvalRegistration,
    cancelManualAvalRegistration,
    handleActividadNoSensibleSelect,
    handleSelectAdmision: selectAdmisionInternal,
    handleGarantiaChange,
    handleGarantiaLookupSelect,
    addGarantiaRow,
    addAvalGarantiaRow,
    applyAvalModalDraft,
    removeGarantiaRow,
    toggleGarantiaDireccion,
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
    onRequestAvalModalOpen: openAvalModal,
  });

  const handleSelectAdmision = useCallback(async (admisionId) => {
    const selected = await selectAdmisionInternal(admisionId);
    if (selected) {
      setShowAdmisionPicker(false);
    }
  }, [selectAdmisionInternal]);

  const handleOpenAdmisionPicker = useCallback(() => {
    setShowAdmisionPicker(true);
    loadAdmisionesElegibles().catch(() => {});
  }, [loadAdmisionesElegibles]);

  const handleReloadAdmisiones = useCallback(() => {
    loadAdmisionesElegibles({ force: true }).catch(() => {});
  }, [loadAdmisionesElegibles]);

  return {
    loading,
    saving,
    alert,
    setAlert,
    form,
    setField,
    setAvalField,
    handleAvalSelect,
    startManualAvalRegistration,
    cancelManualAvalRegistration,
    handleActividadNoSensibleSelect,
    handleGarantiaChange,
    addGarantiaRow,
    addAvalGarantiaRow,
    applyAvalModalDraft,
    removeGarantiaRow,
    toggleGarantiaDireccion,
    catalogos,
    admisiones,
    admisionesLoading,
    admisionesError,
    selectedAdmision,
    selectedProducto,
    selectedProductoRange,
    selectedNivelDiscrecionalidad,
    contexto,
    contextLoading,
    showAdmisionPicker,
    setShowAdmisionPicker,
    handleOpenAdmisionPicker,
    handleReloadAdmisiones,
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
    avalGroups,
    avalModalState,
    openAvalModal,
    closeAvalModal,
    cancelAvalModalExit,
    confirmAvalModalExit,
    markAvalModalDirty,
    handleGarantiaLookupSelect,
  };
};

export default useEvaluacionConsumoForm;
