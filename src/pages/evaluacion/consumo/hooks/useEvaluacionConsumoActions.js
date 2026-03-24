import { useCallback } from 'react';
import {
  createEvaluacionConsumo,
  updateEstadoEvaluacionConsumo,
  updateEvaluacionConsumo,
} from 'services/evaluacionConsumoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { normalizeEvaluacionContext } from 'utilities/pages/evaluacion/consumo/context';
import { createIngresoRow, mapApiToForm, mapFormToPayload } from 'utilities/pages/evaluacion/consumo/transformers';
import { validateEvaluacionConsumoForm } from 'utilities/pages/evaluacion/consumo/validators';
import { updateEvaluacionConsumoForm } from 'utilities/pages/evaluacion/consumo/formState';
import { normalizeEvaluacionConsumoState } from 'utilities/pages/evaluacion/consumo/status';

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
}) => {
  const updateForm = useCallback((updater) => {
    setForm((previousForm) => updateEvaluacionConsumoForm(previousForm, updater, catalogos));
  }, [catalogos, setForm]);

  const setField = useCallback((name, value) => {
    updateForm((previousForm) => ({ ...previousForm, [name]: value }));
  }, [updateForm]);

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
      direccion_snapshot: admision.direccion || '',
      distrito_snapshot: admision.distrito || '',
      provincia_snapshot: admision.provincia || '',
      departamento_snapshot: admision.departamento || '',
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

  const addIngresoRow = useCallback(() => {
    updateForm((previousForm) => ({
      ...previousForm,
      ingresos: [...previousForm.ingresos, createIngresoRow()],
    }));
  }, [updateForm]);

  const removeIngresoRow = useCallback((index) => {
    updateForm((previousForm) => {
      const nextRows = previousForm.ingresos.filter((_, idx) => idx !== index);
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

    if ((normalizedState === 'OBSERVADO' || normalizedState === 'RECHAZADO') && decisionComentario === '') {
      setAlert({
        type: 'error',
        message: 'Debe registrar un comentario para observar o rechazar la evaluación.',
      });
      return;
    }

    setSaving(true);
    setAlert(null);
    try {
      const response = await updateEstadoEvaluacionConsumo(id, {
        estado: normalizedState,
        decision_comentario: decisionComentario || null,
      });
      const source = response.data || response;
      setForm(deriveForm(mapApiToForm(source)));
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
  }, [canMakeDecision, deriveForm, form.decision_comentario, id, isEditMode, setAlert, setContexto, setForm, setSaving]);

  return {
    setField,
    handleActividadNoSensibleSelect,
    handleSelectAdmision,
    handleIngresoChange,
    addIngresoRow,
    removeIngresoRow,
    handleSubmit,
    handleDecision,
  };
};

export default useEvaluacionConsumoActions;