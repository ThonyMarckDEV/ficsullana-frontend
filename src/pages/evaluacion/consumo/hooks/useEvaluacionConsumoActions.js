import { useCallback } from 'react';
import {
  createEvaluacionConsumo,
  updateEstadoEvaluacionConsumo,
  updateEvaluacionConsumo,
} from 'services/evaluacionConsumoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { normalizeEvaluacionContext } from 'utilities/pages/evaluacion/consumo/context';
import {
  AVAL_GARANTIA_VALUE,
  createAvalState,
  createAvalGarantiaRow,
  createGarantiaRow,
  createIngresoRow,
  buildAvalDireccion,
  isAvalGuarantee,
  mapApiToForm,
  mapAvalLookupToState,
  mapFormToPayload,
  normalizeAvalSlot,
  normalizeGarantiaClass,
} from 'utilities/pages/evaluacion/consumo/transformers';
import {
  clearLinkedGarantiaSelections,
  ensureAvalSlot,
  getFirstAvailableAvalSlot,
  mapGarantiaLookupToRow,
  normalizeAvalCollections,
  resolveGarantiaDireccion,
  syncGarantiasWithAvalDireccion,
} from 'utilities/pages/evaluacion/consumo/avalWorkflow';
import { validateEvaluacionConsumoForm } from 'utilities/pages/evaluacion/consumo/validators';
import { updateEvaluacionConsumoForm } from 'utilities/pages/evaluacion/consumo/formState';
import { normalizeEvaluacionConsumoState } from 'utilities/pages/evaluacion/consumo/status';
import {
  buildDecisionPlanAdjustmentPayload,
  validateDecisionPlanAdjustments,
} from 'utilities/pages/evaluacion/consumo/decisionPayload';

const updateGarantiaRow = (currentRow, overrides = {}) => createGarantiaRow({
  ...currentRow,
  ...overrides,
});

const normalizeAvalDraftGarantia = (garantia, avalSlot, aval) => {
  const { formIndex, ...draftRow } = garantia || {};
  const nextRow = createAvalGarantiaRow({
    ...draftRow,
    aval_slot: String(avalSlot),
  });

  return nextRow.usar_direccion_solicitante
    ? { ...nextRow, direccion: buildAvalDireccion(aval) }
    : nextRow;
};

export const applyGarantiaDireccionToggle = (form, garantia, checked) => ({
  ...garantia,
  usar_direccion_solicitante: checked,
  direccion: checked
    ? resolveGarantiaDireccion(form, {
      ...garantia,
      usar_direccion_solicitante: true,
    })
    : '',
});

const useEvaluacionConsumoActions = ({
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
  onRequestAvalModalOpen,
}) => {
  const updateForm = useCallback((updater) => {
    setForm((previousForm) => updateEvaluacionConsumoForm(previousForm, updater, catalogos));
  }, [catalogos, setForm]);

  const buildFormWithAvalCollections = useCallback((previousForm, nextGarantias, nextAvales, extra = {}) => {
    const normalized = normalizeAvalCollections(nextGarantias, nextAvales);

    return {
      ...previousForm,
      ...extra,
      garantias: normalized.garantias,
      avales: normalized.avales,
      requiere_aval: normalized.requiresAval,
    };
  }, []);

  const updateAvalAtIndex = useCallback((previousForm, avalIndex, updater) => {
    const nextAvales = ensureAvalSlot(previousForm.avales, avalIndex);
    const currentAval = createAvalState(nextAvales[avalIndex]);
    const rawNextAval = typeof updater === 'function' ? updater(currentAval) : updater;
    const nextAvalPayload = {
      ...currentAval,
      ...(rawNextAval || {}),
    };

    if (!Object.prototype.hasOwnProperty.call(rawNextAval || {}, 'direccion')) {
      nextAvalPayload.direccion = '';
    }

    const nextAval = createAvalState(nextAvalPayload);
    nextAvales[avalIndex] = nextAval;

    const avalSlot = avalIndex + 1;
    const ownerChanged = String(currentAval?.aval_id || '') !== String(nextAval?.aval_id || '')
      || Boolean(currentAval?.manual_mode) !== Boolean(nextAval?.manual_mode)
      || Boolean(currentAval?.is_existing) !== Boolean(nextAval?.is_existing);
    let nextGarantias = syncGarantiasWithAvalDireccion(previousForm.garantias, avalSlot, nextAval);

    if (ownerChanged) {
      nextGarantias = clearLinkedGarantiaSelections(nextGarantias, avalSlot);
    }

    return buildFormWithAvalCollections(previousForm, nextGarantias, nextAvales);
  }, [buildFormWithAvalCollections]);

  const setField = useCallback((name, value) => {
    updateForm((previousForm) => ({ ...previousForm, [name]: value }));
  }, [updateForm]);

  const setAvalField = useCallback((avalIndex, name, value) => {
    updateForm((previousForm) => updateAvalAtIndex(previousForm, avalIndex, {
      [name]: value,
    }));
  }, [updateAvalAtIndex, updateForm]);

  const handleAvalSelect = useCallback((avalIndex, aval) => {
    updateForm((previousForm) => updateAvalAtIndex(previousForm, avalIndex, (currentAval) => {
      const mappedAval = aval
        ? mapAvalLookupToState(aval)
        : createAvalState({
          client_id: currentAval.client_id,
        });

      return {
        ...mappedAval,
        client_id: currentAval.client_id,
      };
    }));
  }, [updateAvalAtIndex, updateForm]);

  const startManualAvalRegistration = useCallback((avalIndex) => {
    updateForm((previousForm) => updateAvalAtIndex(previousForm, avalIndex, (currentAval) => createAvalState({
      client_id: currentAval.client_id,
      manual_mode: true,
      tipo_documento: currentAval.tipo_documento || 'DNI',
    })));
  }, [updateAvalAtIndex, updateForm]);

  const cancelManualAvalRegistration = useCallback((avalIndex) => {
    updateForm((previousForm) => updateAvalAtIndex(previousForm, avalIndex, (currentAval) => createAvalState({
      client_id: currentAval.client_id,
    })));
  }, [updateAvalAtIndex, updateForm]);

  const handleActividadNoSensibleSelect = useCallback((actividadNoSensible) => {
    updateForm((previousForm) => ({
      ...previousForm,
      actividad_no_sensible_id: actividadNoSensible?.id ? String(actividadNoSensible.id) : '',
      otros_ingresos_sector_snapshot: actividadNoSensible?.sector || '',
      otros_ingresos_actividad_snapshot: actividadNoSensible?.actividad || '',
      otros_ingresos_margen_maximo_snapshot: actividadNoSensible?.margen_maximo !== undefined && actividadNoSensible?.margen_maximo !== null
        ? String(actividadNoSensible.margen_maximo)
        : '',
    }));
  }, [updateForm]);

  const handleSelectAdmision = useCallback(async (admisionId) => {
    const admision = admisiones.find((item) => Number(item.id) === Number(admisionId));
    if (!admision) return false;

    const direccionSolicitante = admision.direccion || '';

    updateForm((previousForm) => ({
      ...previousForm,
      admision_id: admision.id,
      clase_prestamo_snapshot: admision.clase_prestamo || '',
      expuesto_rcc: Boolean(admision.expuesto_rcc),
      sumatoria_cuotas: admision.sumatoria_cuotas !== null && admision.sumatoria_cuotas !== undefined ? String(admision.sumatoria_cuotas) : '',
      sumatoria_cuotas_consumo: admision.sumatoria_cuotas_consumo !== null && admision.sumatoria_cuotas_consumo !== undefined
        ? String(admision.sumatoria_cuotas_consumo)
        : '',
      sumatoria_cuotas_pyme: admision.sumatoria_cuotas_pyme !== null && admision.sumatoria_cuotas_pyme !== undefined
        ? String(admision.sumatoria_cuotas_pyme)
        : '',
      deuda_total: admision.deuda_total !== null && admision.deuda_total !== undefined ? String(admision.deuda_total) : '',
      numero_ifis: admision.numero_ifis !== null && admision.numero_ifis !== undefined ? String(admision.numero_ifis) : '',
      solicitante_nombre_snapshot: admision.solicitante_nombre || '',
      solicitante_dni_snapshot: admision.solicitante_dni || '',
      direccion_snapshot: direccionSolicitante,
      distrito_snapshot: admision.distrito || '',
      provincia_snapshot: admision.provincia || '',
      departamento_snapshot: admision.departamento || '',
      garantias: (previousForm.garantias || [createGarantiaRow()]).map((row) => (
        row.usar_direccion_solicitante && !isAvalGuarantee(row)
          ? { ...row, direccion: direccionSolicitante }
          : row
      )),
    }));

    try {
      await loadAdmisionContext(admision.id);
      return true;
    } catch (error) {
      setContexto(normalizeEvaluacionContext(null));
      setAlert(handleApiError(error, 'No se pudo cargar el contexto de la admisión seleccionada.'));
      return false;
    }
  }, [admisiones, loadAdmisionContext, setAlert, setContexto, updateForm]);

  const handleIngresoChange = useCallback((index, field, value) => {
    updateForm((previousForm) => {
      const nextRows = [...previousForm.ingresos];
      nextRows[index] = {
        ...nextRows[index],
        [field]: value,
      };
      return {
        ...previousForm,
        ingresos: nextRows,
      };
    });
  }, [updateForm]);

  const handleGarantiaChange = useCallback((index, field, value) => {
    let autoOpenSlot = null;

    updateForm((previousForm) => {
      const nextGarantias = [...(previousForm.garantias || [createGarantiaRow()])];
      const currentRow = createGarantiaRow(nextGarantias[index]);
      const wasAvalGuarantee = isAvalGuarantee(currentRow);
      let nextAvales = [...(previousForm.avales || [])];
      let nextRow = updateGarantiaRow(currentRow, { [field]: value });

      if (field === 'clase_garantia') {
        const nextClass = normalizeGarantiaClass(value);
        const nextSlot = nextClass === AVAL_GARANTIA_VALUE
          ? getFirstAvailableAvalSlot(previousForm.garantias)
          : '';

        nextRow = updateGarantiaRow(currentRow, {
          clase_garantia: nextClass,
          aval_slot: nextSlot === '' ? '' : String(nextSlot),
        });

        if (!wasAvalGuarantee && nextClass === AVAL_GARANTIA_VALUE) {
          autoOpenSlot = nextSlot;
        }
      }

      if (field === 'aval_slot') {
        const nextSlot = getFirstAvailableAvalSlot(previousForm.garantias, value);

        nextRow = updateGarantiaRow(currentRow, {
          aval_slot: String(nextSlot),
        });
      }

      if (!isAvalGuarantee(nextRow)) {
        nextRow = updateGarantiaRow(nextRow, {
          aval_slot: '',
          garantia_id: '',
        });
      } else {
        const avalSlot = normalizeAvalSlot(nextRow.aval_slot) || getFirstAvailableAvalSlot(previousForm.garantias);
        nextRow = updateGarantiaRow(nextRow, { aval_slot: avalSlot });
        nextAvales = ensureAvalSlot(nextAvales, avalSlot - 1);

        const currentSlot = normalizeAvalSlot(currentRow.aval_slot);
        if (String(currentRow.garantia_id || '').trim() !== '' && currentSlot !== avalSlot) {
          nextRow = updateGarantiaRow(nextRow, { garantia_id: '' });
        }
      }

      if (nextRow.usar_direccion_solicitante) {
        nextRow = {
          ...nextRow,
          direccion: resolveGarantiaDireccion({
            ...previousForm,
            avales: nextAvales,
          }, nextRow),
        };
      }

      nextGarantias[index] = nextRow;

      return buildFormWithAvalCollections(previousForm, nextGarantias, nextAvales);
    });

    if (autoOpenSlot && canEdit) {
      onRequestAvalModalOpen?.(autoOpenSlot, 'auto');
    }
  }, [buildFormWithAvalCollections, canEdit, onRequestAvalModalOpen, updateForm]);

  const handleGarantiaLookupSelect = useCallback((index, garantia) => {
    updateForm((previousForm) => {
      const nextGarantias = [...(previousForm.garantias || [createGarantiaRow()])];
      const currentRow = createGarantiaRow(nextGarantias[index]);
      const nextRow = garantia
        ? mapGarantiaLookupToRow(garantia, currentRow)
        : createGarantiaRow({
          ...currentRow,
          garantia_id: '',
        });

      nextGarantias[index] = nextRow;

      return buildFormWithAvalCollections(previousForm, nextGarantias, previousForm.avales);
    });
  }, [buildFormWithAvalCollections, updateForm]);

  const addGarantiaRow = useCallback(() => {
    updateForm((previousForm) => ({
      ...previousForm,
      garantias: [
        ...(previousForm.garantias || [createGarantiaRow()]),
        createGarantiaRow(),
      ],
    }));
  }, [updateForm]);

  const addAvalGarantiaRow = useCallback((avalSlot) => {
    updateForm((previousForm) => {
      const normalizedSlot = normalizeAvalSlot(avalSlot) || getFirstAvailableAvalSlot(previousForm.garantias);
      const nextAvales = ensureAvalSlot(previousForm.avales || [], normalizedSlot - 1);
      const nextGarantias = [
        ...(previousForm.garantias || [createGarantiaRow()]),
        createAvalGarantiaRow({
          aval_slot: String(normalizedSlot),
        }),
      ];

      return buildFormWithAvalCollections(previousForm, nextGarantias, nextAvales);
    });
  }, [buildFormWithAvalCollections, updateForm]);

  const applyAvalModalDraft = useCallback((avalSlot, avalDraft, garantiaDrafts = []) => {
    const normalizedSlot = normalizeAvalSlot(avalSlot);
    if (normalizedSlot === null) {
      return;
    }

    updateForm((previousForm) => {
      const avalIndex = normalizedSlot - 1;
      const nextAvales = ensureAvalSlot(previousForm.avales || [], avalIndex);
      const currentAval = createAvalState(nextAvales[avalIndex]);
      const nextAval = createAvalState({
        ...currentAval,
        ...(avalDraft || {}),
        client_id: currentAval.client_id || avalDraft?.client_id,
      });
      nextAvales[avalIndex] = nextAval;

      const previousGarantias = previousForm.garantias || [];
      const insertIndex = previousGarantias.findIndex((row) => (
        isAvalGuarantee(row) && normalizeAvalSlot(row?.aval_slot) === normalizedSlot
      ));
      const nextAvalGarantias = (Array.isArray(garantiaDrafts) ? garantiaDrafts : [])
        .map((row) => normalizeAvalDraftGarantia(row, normalizedSlot, nextAval));
      const nextGarantias = previousGarantias.filter((row) => (
        !isAvalGuarantee(row) || normalizeAvalSlot(row?.aval_slot) !== normalizedSlot
      ));
      const targetIndex = insertIndex === -1 ? nextGarantias.length : Math.min(insertIndex, nextGarantias.length);

      nextGarantias.splice(targetIndex, 0, ...nextAvalGarantias);

      return buildFormWithAvalCollections(previousForm, nextGarantias, nextAvales);
    });
  }, [buildFormWithAvalCollections, updateForm]);

  const removeGarantiaRow = useCallback((index) => {
    updateForm((previousForm) => {
      const nextRows = (previousForm.garantias || [createGarantiaRow()])
        .filter((_, rowIndex) => rowIndex !== index);
      const nextGarantias = nextRows.length > 0 ? nextRows : [createGarantiaRow()];

      return buildFormWithAvalCollections(previousForm, nextGarantias, previousForm.avales);
    });
  }, [buildFormWithAvalCollections, updateForm]);

  const toggleGarantiaDireccion = useCallback((index, checked) => {
    updateForm((previousForm) => {
      const nextRows = [...(previousForm.garantias || [createGarantiaRow()])];
      const currentRow = createGarantiaRow(nextRows[index]);
      const nextRow = applyGarantiaDireccionToggle(previousForm, currentRow, checked);

      nextRows[index] = nextRow;

      return buildFormWithAvalCollections(previousForm, nextRows, previousForm.avales);
    });
  }, [buildFormWithAvalCollections, updateForm]);

  const addIngresoRow = useCallback(() => {
    updateForm((previousForm) => ({
      ...previousForm,
      ingresos: [...previousForm.ingresos, createIngresoRow()],
    }));
  }, [updateForm]);

  const removeIngresoRow = useCallback((index) => {
    updateForm((previousForm) => {
      const nextRows = previousForm.ingresos.filter((_, rowIndex) => rowIndex !== index);
      return {
        ...previousForm,
        ingresos: nextRows.length > 0 ? nextRows : [createIngresoRow()],
      };
    });
  }, [updateForm]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!canEdit) return;

    setAlert(null);

    const errors = validateEvaluacionConsumoForm(form, {
      maxVecesSueldo: catalogos.max_veces_sueldo_consumo,
    });
    const propuesta = Number(form.propuesta);

    if (
      selectedProductoRange.hasConfiguraciones
      && form.tipo_frecuencia
      && form.monto
      && form.numero_cuotas
      && !selectedProductoRange.exactMatch
    ) {
      errors.push(selectedProductoRange.helperText);
    }

    if (
      Number.isFinite(propuesta)
      && selectedProductoRange.min !== null
      && selectedProductoRange.max !== null
      && (propuesta < selectedProductoRange.min || propuesta > selectedProductoRange.max)
    ) {
      errors.push(
        `La tasa propuesta debe estar entre ${selectedProductoRange.min}% y ${selectedProductoRange.max}% según el producto seleccionado.`
      );
    }

    if (errors.length > 0) {
      setAlert({ type: 'error', message: 'Complete los campos obligatorios.', details: errors });
      return;
    }

    setSaving(true);
    try {
      const payload = mapFormToPayload(form);
      if (isEditMode) {
        const response = await updateEvaluacionConsumo(id, payload);
        const source = response.data || response;
        setForm(deriveForm(mapApiToForm(source)));
        setContexto(normalizeEvaluacionContext(source.contexto));
        setAlert({ type: 'success', message: response.message || 'Evaluación consumo actualizada correctamente.' });
      } else {
        const response = await createEvaluacionConsumo(payload);
        setAlert({ type: 'success', message: response.message || 'Evaluación consumo creada correctamente.' });
        setTimeout(() => navigate('/evaluacion/consumo/listar'), 800);
      }
    } catch (error) {
      setAlert(handleApiError(error, 'No se pudo guardar la evaluación consumo.'));
    } finally {
      setSaving(false);
    }
  }, [
    canEdit,
    catalogos.max_veces_sueldo_consumo,
    deriveForm,
    form,
    id,
    isEditMode,
    navigate,
    selectedProductoRange,
    setAlert,
    setContexto,
    setForm,
    setSaving,
  ]);

  const handleDecision = useCallback(async (estado) => {
    if (!isEditMode || !canMakeDecision) return;

    const normalizedState = normalizeEvaluacionConsumoState(estado);
    const decisionComentario = String(form.decision_comentario || '').trim();

    if (decisionComentario === '') {
      setAlert({
        type: 'error',
        message: 'Debe registrar un comentario para la decisión.',
      });
      return;
    }

    const decisionPlanErrors = validateDecisionPlanAdjustments(form, selectedProductoRange);
    if (decisionPlanErrors.length > 0) {
      setAlert({
        type: 'error',
        message: 'Revise los ajustes de decisión.',
        details: decisionPlanErrors,
      });
      return;
    }

    setSaving(true);
    setAlert(null);
    try {
      const response = await updateEstadoEvaluacionConsumo(id, {
        estado: normalizedState,
        decision_comentario: decisionComentario || null,
        ...buildDecisionPlanAdjustmentPayload(form),
      });
      const source = response.data || response;
      setForm(deriveForm({
        ...mapApiToForm(source),
      }));
      setContexto(normalizeEvaluacionContext(source.contexto));
      setAlert({
        type: 'success',
        message: response.message || `Estado actualizado a ${normalizedState} correctamente.`,
      });
    } catch (error) {
      setAlert(handleApiError(error, 'No se pudo registrar la decisión de la evaluación consumo.'));
    } finally {
      setSaving(false);
    }
  }, [canMakeDecision, deriveForm, form, id, isEditMode, selectedProductoRange, setAlert, setContexto, setForm, setSaving]);

  return {
    setField,
    setAvalField,
    handleAvalSelect,
    startManualAvalRegistration,
    cancelManualAvalRegistration,
    handleActividadNoSensibleSelect,
    handleSelectAdmision,
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
  };
};

export default useEvaluacionConsumoActions;
