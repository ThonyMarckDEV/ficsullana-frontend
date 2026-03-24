import { useCallback, useState } from 'react';
import {
  createAdmision,
  evaluarAdmision,
} from 'services/admisionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { ADMISION_COPY_ALERTS } from 'utilities/pages/admision/copy';
import {
  ADMISION_EVALUATION_STATUS,
  resolveAdmisionEvaluationAction,
} from 'utilities/pages/admision/evaluation';
import {
  buildAdmisionPayload,
  validateStoreAdmisionHeader,
} from 'utilities/pages/admision/payload';
import useAdmisionExceptionFlow from './useAdmisionExceptionFlow';
import useCapitalPendienteFicsullana from './useCapitalPendienteFicsullana';

const buildInitialHeader = () => ({
  cliente_id: null,
  prospecto_id: null,
  tipo_solicitante: 'CLIENTE',
  tipo_prestamo: '',
  motivo_bloqueo: null, 
  observaciones: '',
});

const useStoreAdmisionForm = ({ navigate, checkPermission }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isModalProspectoOpen, setIsModalProspectoOpen] = useState(false);

  const [header, setHeader] = useState(buildInitialHeader);
  const [clienteSelected, setClienteSelected] = useState(null);
  const [prospectoSelected, setProspectoSelected] = useState(null);
  const [deudas, setDeudas] = useState([]);
  const [protestos, setProtestos] = useState([]);
<<<<<<< HEAD
  const [capitalPendienteFicsullana, setCapitalPendienteFicsullana] = useState(0);
  const [capitalLoading, setCapitalLoading] = useState(false);
  
  const [isManualTipo, setIsManualTipo] = useState(false);
=======

  const submitAdmision = useCallback(async (payload, solicitudExcepcion = null) => {
    const payloadFinal = solicitudExcepcion
      ? { ...payload, solicitud_excepcion: solicitudExcepcion }
      : payload;

    const response = await createAdmision(payloadFinal);
    setAlert({ type: 'success', message: response.message || ADMISION_COPY_ALERTS.STORE.RESULTADO_OK });
    setTimeout(() => navigate('/gestion/listar-admisiones'), 2000);
  }, [navigate]);

  const {
    showExceptionModal,
    setShowExceptionModal,
    exceptionReason,
    setExceptionReason,
    exceptionRules,
    exceptionSelectionMap,
    openExceptionFlow,
    resetExceptionFlow,
    handleConfirmException,
    handleToggleExceptionRule,
  } = useAdmisionExceptionFlow({
    setAlert,
    setLoading,
    submitAction: submitAdmision,
    submitErrorMessage: ADMISION_COPY_ALERTS.STORE.ERR_REGISTRO,
  });

  const {
    capitalPendienteFicsullana,
    capitalLoading,
    loadCapitalPendiente,
    resetCapitalPendiente,
  } = useCapitalPendienteFicsullana({
    setAlert,
    errorMessage: ADMISION_COPY_ALERTS.STORE.ERR_CARGA_CAPITAL,
  });
>>>>>>> ef09c7eb43d8e56c80e24be7840ed10eb9fcf004

  const isSolicitanteSelected = Boolean(header.cliente_id || header.prospecto_id);

  const handleTipoSolicitanteChange = useCallback((e) => {
    const nuevoTipo = e.target.value;

    setHeader((prev) => ({
      ...prev,
      tipo_solicitante: nuevoTipo,
      cliente_id: null,
      prospecto_id: null,
      tipo_prestamo: nuevoTipo === 'PROSPECTO' ? 'NUEVO' : '',
      motivo_bloqueo: null,
    }));

    setClienteSelected(null);
    setProspectoSelected(null);
<<<<<<< HEAD
    setCapitalPendienteFicsullana(0);
    setCapitalLoading(false);
    setIsManualTipo(false);
  };

  const onSelectCliente = async (cliente) => {
    setIsManualTipo(false);
    
=======
    resetCapitalPendiente();
  }, [resetCapitalPendiente]);

  const onSelectCliente = useCallback(async (cliente) => {
>>>>>>> ef09c7eb43d8e56c80e24be7840ed10eb9fcf004
    if (!cliente) {
      setHeader((prev) => ({ ...prev, cliente_id: null, tipo_prestamo: '', motivo_bloqueo: null }));
      setClienteSelected(null);
      resetCapitalPendiente();
      return;
    }

    const tipoSugerido = cliente.tipo_prestamo || 'NUEVO';
    const motivo = cliente.motivo_bloqueo || null;

    setHeader((prev) => ({
      ...prev,
      cliente_id: cliente.id,
      prospecto_id: null,
      tipo_prestamo: tipoSugerido,
      motivo_bloqueo: motivo,
    }));

    setClienteSelected(cliente);
    setProspectoSelected(null);
    resetCapitalPendiente();

    let mensajeTipo = '';
    if (tipoSugerido === 'RCS') mensajeTipo = 'Deuda vigente detectada (RCS).';
    else if (tipoSugerido === 'RSS') mensajeTipo = 'Sin deuda activa (RSS).';
    else if (tipoSugerido === 'NUEVO') mensajeTipo = 'Sin historial previo.';
    else if (tipoSugerido === 'NO APLICA') mensajeTipo = motivo || 'No cumple requisitos mínimos para nueva admisión.';

    setAlert({ 
      type: tipoSugerido === 'NO APLICA' ? 'error' : 'info', 
      message: tipoSugerido === 'NO APLICA' ? `Cliente Bloqueado. ${mensajeTipo}` : `Cliente seleccionado. ${mensajeTipo}` 
    });

    if (tipoSugerido === 'RCS') {
      await loadCapitalPendiente(cliente.id);
    }
  }, [loadCapitalPendiente, resetCapitalPendiente]);

<<<<<<< HEAD
  const onSelectProspecto = (prospecto) => {
    setIsManualTipo(false);
    
=======
  const onSelectProspecto = useCallback((prospecto) => {
>>>>>>> ef09c7eb43d8e56c80e24be7840ed10eb9fcf004
    if (!prospecto) {
      setHeader((prev) => ({ ...prev, prospecto_id: null, tipo_prestamo: '', motivo_bloqueo: null }));
      setProspectoSelected(null);
      resetCapitalPendiente();
      return;
    }

    setHeader((prev) => ({
      ...prev,
      prospecto_id: prospecto.id,
      cliente_id: null,
      tipo_prestamo: 'NUEVO',
      motivo_bloqueo: null,
    }));
    setProspectoSelected(prospecto);
    setClienteSelected(null);
    resetCapitalPendiente();
    setAlert({ type: 'info', message: ADMISION_COPY_ALERTS.STORE.PROSPECTO_SELECCIONADO });
  }, [resetCapitalPendiente]);

  const handleProspectoCreado = useCallback((prospectoData) => {
    const nombreCompleto = `${prospectoData.nombres} ${prospectoData.apellido_paterno} ${prospectoData.apellido_materno}`;
    const prospectoObj = {
      id: prospectoData.id,
      nombre: nombreCompleto,
      dni: prospectoData.dni,
    };
    onSelectProspecto(prospectoObj);
    setAlert({ type: 'success', message: ADMISION_COPY_ALERTS.STORE.PROSPECTO_CREADO });
  }, [onSelectProspecto]);

<<<<<<< HEAD
  const handleToggleManualTipo = () => {
    setIsManualTipo(!isManualTipo);
  };

  const handleTipoPrestamoChange = (nuevoTipo) => {
    setHeader((prev) => ({
      ...prev,
      tipo_prestamo: nuevoTipo
    }));
  };

  const submitAdmision = async (payload, solicitudExcepcion = null) => {
    const payloadFinal = solicitudExcepcion
      ? { ...payload, solicitud_excepcion: solicitudExcepcion }
      : payload;

    const response = await createAdmision(payloadFinal);
    setAlert({ type: 'success', message: response.message || ADMISION_COPY_ALERTS.STORE.RESULTADO_OK });
    setTimeout(() => navigate('/gestion/listar-admisiones'), 2000);
  };

  const handleConfirmException = async () => {
    if (!pendingPayload) return;

    const motivo = exceptionReason.trim();
    if (!motivo) {
      setAlert({ type: 'error', message: ADMISION_COPY_ALERTS.EXCEPCION.MOTIVO_REQUERIDO });
      return;
    }

    const missingRules = getMissingExceptionRules(exceptionRules, exceptionSelectionMap);
    if (missingRules.length > 0) {
      setAlert({
        type: 'error',
        message: ADMISION_COPY_ALERTS.EXCEPCION.REGLAS_INCOMPLETAS,
        details: missingRules.map((rule) => getExceptionRuleName(rule)),
      });
      return;
    }

    const selectedCodes = getSelectedExceptionCodes(exceptionRules, exceptionSelectionMap);

    setShowExceptionModal(false);
    setLoading(true);
    try {
      await submitAdmision(pendingPayload, {
        motivo,
        codigos: selectedCodes,
      });
      setPendingPayload(null);
    } catch (error) {
      setAlert(handleApiError(error, ADMISION_COPY_ALERTS.STORE.ERR_REGISTRO));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExceptionRule = (code) => {
    const normalizedCode = normalizeRuleCode(code);
    if (!normalizedCode) return;

    setExceptionSelectionMap((prev) => ({
      ...prev,
      [normalizedCode]: !prev[normalizedCode],
    }));
  };

  const handleSubmit = async (e) => {
=======
  const handleSubmit = useCallback(async (e) => {
>>>>>>> ef09c7eb43d8e56c80e24be7840ed10eb9fcf004
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const validationError = validateStoreAdmisionHeader(header);
    if (validationError) {
      setAlert({ type: 'error', message: validationError });
      setLoading(false);
      return;
    }

<<<<<<< HEAD
    if (header.tipo_solicitante === 'PROSPECTO' && !header.prospecto_id) {
      setAlert({ type: 'error', message: 'Debe buscar o crear un Prospecto.' });
      setLoading(false);
      return;
    }

    if (!header.tipo_prestamo) {
      setAlert({ type: 'error', message: 'Error: No se ha determinado el tipo de préstamo.' });
      setLoading(false);
      return;
    }

    const protestosLimpios = protestos.filter(
      (p) => p.entidad_acreedora && p.entidad_acreedora.trim() !== ''
    );
    
    const deudasLimpias = deudas.filter(
      (d) => d.nombre_entidad && d.nombre_entidad.trim() !== ''
    );

    const payload = {
      cliente_id: header.tipo_solicitante === 'CLIENTE' ? header.cliente_id : null,
      prospecto_id: header.tipo_solicitante === 'PROSPECTO' ? header.prospecto_id : null,
      tipo_prestamo: header.tipo_prestamo,
      observaciones: header.observaciones,
      deudas: deudasLimpias,
      protestos: protestosLimpios,
    };
=======
    const payload = buildAdmisionPayload({ header, deudas, protestos });
>>>>>>> ef09c7eb43d8e56c80e24be7840ed10eb9fcf004

    try {
      const evalResponse = await evaluarAdmision(payload);
      const evalData = evalResponse.data || evalResponse;
      const evaluationAction = resolveAdmisionEvaluationAction({ evalData, checkPermission });

      if (evaluationAction.status === ADMISION_EVALUATION_STATUS.BLOQUEANTE) {
        setAlert({
          type: 'error',
          message: ADMISION_COPY_ALERTS.STORE.ERR_REGLAS_BLOQUEANTES,
          details: evaluationAction.blockingMessages,
        });
        return;
      }

      if (evaluationAction.status === ADMISION_EVALUATION_STATUS.SIN_PERMISO_EXCEPCION) {
        setAlert({
          type: 'error',
          message: ADMISION_COPY_ALERTS.STORE.ERR_PERMISO_EXCEPCION,
        });
        return;
      }

      if (evaluationAction.status === ADMISION_EVALUATION_STATUS.REQUIERE_EXCEPCION) {
        openExceptionFlow({
          payload,
          rules: evaluationAction.rules,
          selectionMap: evaluationAction.selectionMap,
        });
        return;
      }

      resetExceptionFlow();
      await submitAdmision(payload);
    } catch (error) {
      setAlert(handleApiError(error, ADMISION_COPY_ALERTS.STORE.ERR_REGISTRO));
    } finally {
      setLoading(false);
    }
  }, [
    checkPermission,
    deudas,
    header,
    openExceptionFlow,
    protestos,
    resetExceptionFlow,
    submitAdmision,
  ]);

  const getTipoPrestamoLabel = useCallback(() => {
    if (!header.tipo_prestamo) return '';
    if (header.tipo_prestamo === 'NUEVO') return 'NUEVO (Primer Crédito)';
    if (header.tipo_prestamo === 'RCS') return 'RCS (Recurrente con Saldo)';
    if (header.tipo_prestamo === 'RSS') return 'RSS (Recurrente sin Saldo)';
    if (header.tipo_prestamo === 'NO APLICA') return 'NO APLICA';
    return header.tipo_prestamo;
  }, [header.tipo_prestamo]);

  return {
    loading,
    alert,
    setAlert,
    isModalProspectoOpen,
    setIsModalProspectoOpen,
    showExceptionModal,
    setShowExceptionModal,
    exceptionReason,
    setExceptionReason,
    exceptionRules,
    exceptionSelectionMap,
    header,
    setHeader,
    clienteSelected,
    prospectoSelected,
    deudas,
    setDeudas,
    protestos,
    setProtestos,
    capitalPendienteFicsullana,
    capitalLoading,
    isSolicitanteSelected,
    isManualTipo,
    handleToggleManualTipo,
    handleTipoPrestamoChange,
    handleTipoSolicitanteChange,
    onSelectCliente,
    onSelectProspecto,
    handleProspectoCreado,
    handleConfirmException,
    handleToggleExceptionRule,
    handleSubmit,
    getTipoPrestamoLabel,
  };
};

export default useStoreAdmisionForm;