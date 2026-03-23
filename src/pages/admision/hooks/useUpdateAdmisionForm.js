import { useCallback, useEffect, useState } from 'react';
import {
  evaluarAdmision,
  showAdmision,
  updateAdmision,
} from 'services/admisionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { ADMISION_COPY_ALERTS } from 'utilities/pages/admision/copy';
import {
  ADMISION_EVALUATION_STATUS,
  resolveAdmisionEvaluationAction,
} from 'utilities/pages/admision/evaluation';
import { buildAdmisionPayload } from 'utilities/pages/admision/payload';
import {
  ESTADOS,
  mapDeudasFromAdmision,
  mapHeaderFromAdmision,
  mapProtestosFromAdmision,
  normalizeEstado,
} from '../../../utilities/pages/admision/updateTransformers';
import useAdmisionExceptionFlow from './useAdmisionExceptionFlow';
import useCapitalPendienteFicsullana from './useCapitalPendienteFicsullana';

const buildInitialHeader = () => ({
  cliente_id: null,
  prospecto_id: null,
  tipo_prestamo: 'NUEVO',
  estado: 0,
  observaciones: '',
  solicitanteName: '',
  solicitanteDni: '',
  tipoPersona: '',
  asesorFullName: '',
  sedeName: '',
});

const useUpdateAdmisionForm = ({ id, navigate, checkPermission }) => {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [header, setHeader] = useState(buildInitialHeader);
  const [deudas, setDeudas] = useState([]);
  const [protestos, setProtestos] = useState([]);

  const submitUpdate = useCallback(async (payload, solicitudExcepcion = null) => {
    const payloadFinal = solicitudExcepcion
      ? { ...payload, solicitud_excepcion: solicitudExcepcion }
      : payload;

    const response = await updateAdmision(id, payloadFinal);
    setAlert({ type: 'success', message: response.message || ADMISION_COPY_ALERTS.UPDATE.RESULTADO_OK });

    if (response.data) {
      setHeader((prev) => ({ ...prev, estado: normalizeEstado(response.data.estado) }));
    }

    setTimeout(() => navigate('/gestion/listar-admisiones'), 1500);
  }, [id, navigate]);

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
    submitAction: submitUpdate,
    submitErrorMessage: ADMISION_COPY_ALERTS.UPDATE.ERR_ACTUALIZACION,
  });

  const {
    capitalPendienteFicsullana,
    capitalLoading,
    loadCapitalPendiente,
    resetCapitalPendiente,
  } = useCapitalPendienteFicsullana({
    setAlert,
    errorMessage: ADMISION_COPY_ALERTS.UPDATE.ERR_CARGA_CAPITAL,
  });

  useEffect(() => {
    const fetchAdmision = async () => {
      try {
        const response = await showAdmision(id);
        const data = response.data;

        setHeader(mapHeaderFromAdmision(data));
        setExceptionReason(data.excepcion_motivo_asesor || '');
        setDeudas(mapDeudasFromAdmision(data.deudas));
        setProtestos(mapProtestosFromAdmision(data.protestos));
      } catch (err) {
        setAlert(handleApiError(err, ADMISION_COPY_ALERTS.UPDATE.ERR_CARGA_ADMISION));
      } finally {
        setLoading(false);
      }
    };

    fetchAdmision();
  }, [id, setExceptionReason]);

  useEffect(() => {
    const fetchCapitalPendiente = async () => {
      if (header.tipo_prestamo !== 'RCS' || !header.cliente_id) {
        resetCapitalPendiente();
        return;
      }

      await loadCapitalPendiente(header.cliente_id);
    };

    fetchCapitalPendiente();
  }, [header.cliente_id, header.tipo_prestamo, loadCapitalPendiente, resetCapitalPendiente]);

  const handleHeaderChange = useCallback((e) => {
    const { name, value } = e.target;
    setHeader((prev) => ({ ...prev, [name]: name === 'estado' ? Number(value) : value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const payload = buildAdmisionPayload({
      header,
      deudas,
      protestos,
      includeEstado: true,
    });

    try {
      const evalResponse = await evaluarAdmision(payload);
      const evalData = evalResponse.data || evalResponse;
      const evaluationAction = resolveAdmisionEvaluationAction({ evalData, checkPermission });

      if (evaluationAction.status === ADMISION_EVALUATION_STATUS.BLOQUEANTE) {
        setAlert({
          type: 'error',
          message: ADMISION_COPY_ALERTS.UPDATE.ERR_REGLAS_BLOQUEANTES,
          details: evaluationAction.blockingMessages,
        });
        return;
      }

      if (evaluationAction.status === ADMISION_EVALUATION_STATUS.SIN_PERMISO_EXCEPCION) {
        setAlert({
          type: 'error',
          message: ADMISION_COPY_ALERTS.UPDATE.ERR_PERMISO_EXCEPCION,
        });
        return;
      }

      if (evaluationAction.status === ADMISION_EVALUATION_STATUS.REQUIERE_EXCEPCION) {
        openExceptionFlow({
          payload,
          rules: evaluationAction.rules,
          selectionMap: evaluationAction.selectionMap,
          reason: exceptionReason,
        });
        return;
      }

      resetExceptionFlow({ keepReason: true });
      await submitUpdate(payload);
    } catch (error) {
      setAlert(handleApiError(error, ADMISION_COPY_ALERTS.UPDATE.ERR_ACTUALIZACION));
    } finally {
      setLoading(false);
    }
  }, [
    checkPermission,
    deudas,
    exceptionReason,
    header,
    openExceptionFlow,
    protestos,
    resetExceptionFlow,
    submitUpdate,
  ]);

  return {
    loading,
    alert,
    setAlert,
    showExceptionModal,
    setShowExceptionModal,
    exceptionReason,
    setExceptionReason,
    exceptionRules,
    exceptionSelectionMap,
    header,
    deudas,
    setDeudas,
    protestos,
    setProtestos,
    capitalPendienteFicsullana,
    capitalLoading,
    handleHeaderChange,
    handleSubmit,
    handleConfirmException,
    handleToggleExceptionRule,
    estados: ESTADOS,
  };
};

export default useUpdateAdmisionForm;