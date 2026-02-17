import { useCallback, useEffect, useState } from 'react';
import {
  evaluarAdmision,
  getCapitalPendienteFicsullana,
  showAdmision,
  updateAdmision,
} from 'services/admisionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import {
  buildExceptionSelectionMap,
  getExceptionRuleName,
  getExceptionRules,
  getMissingExceptionRules,
  getSelectedExceptionCodes,
  normalizeRuleCode,
} from 'utilities/pages/admision/exceptionRules';
import { ADMISION_COPY_ALERTS } from 'utilities/pages/admision/copy';
import {
  ESTADOS,
  mapDeudasFromAdmision,
  mapHeaderFromAdmision,
  mapProtestosFromAdmision,
  normalizeEstado,
} from '../../../utilities/pages/admision/updateTransformers';

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
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('');
  const [exceptionRules, setExceptionRules] = useState([]);
  const [exceptionSelectionMap, setExceptionSelectionMap] = useState({});
  const [pendingPayload, setPendingPayload] = useState(null);

  const [header, setHeader] = useState(buildInitialHeader);
  const [deudas, setDeudas] = useState([]);
  const [protestos, setProtestos] = useState([]);
  const [capitalPendienteFicsullana, setCapitalPendienteFicsullana] = useState(0);
  const [capitalLoading, setCapitalLoading] = useState(false);

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
  }, [id]);

  useEffect(() => {
    const fetchCapitalPendiente = async () => {
      if (header.tipo_prestamo !== 'RCS' || !header.cliente_id) {
        setCapitalPendienteFicsullana(0);
        setCapitalLoading(false);
        return;
      }

      setCapitalLoading(true);
      try {
        const response = await getCapitalPendienteFicsullana(header.cliente_id);
        const capitalPendiente = Number(response?.data?.capital_pendiente_ficsullana ?? 0);
        setCapitalPendienteFicsullana(Number.isFinite(capitalPendiente) ? capitalPendiente : 0);

        if (capitalPendiente <= 0) {
          setAlert({
            type: 'info',
            message: ADMISION_COPY_ALERTS.CAPITAL_RCS_SIN_SALDO,
          });
        }
      } catch (error) {
        setCapitalPendienteFicsullana(0);
        setAlert(handleApiError(error, ADMISION_COPY_ALERTS.UPDATE.ERR_CARGA_CAPITAL));
      } finally {
        setCapitalLoading(false);
      }
    };

    fetchCapitalPendiente();
  }, [header.cliente_id, header.tipo_prestamo]);

  const handleHeaderChange = useCallback((e) => {
    const { name, value } = e.target;
    setHeader((prev) => ({ ...prev, [name]: name === 'estado' ? Number(value) : value }));
  }, []);

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

  const handleConfirmException = useCallback(async () => {
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
      await submitUpdate(pendingPayload, {
        motivo,
        codigos: selectedCodes,
      });
      setPendingPayload(null);
    } catch (error) {
      setAlert(handleApiError(error, ADMISION_COPY_ALERTS.UPDATE.ERR_ACTUALIZACION));
    } finally {
      setLoading(false);
    }
  }, [exceptionReason, exceptionRules, exceptionSelectionMap, pendingPayload, submitUpdate]);

  const handleToggleExceptionRule = useCallback((code) => {
    const normalizedCode = normalizeRuleCode(code);
    if (!normalizedCode) return;

    setExceptionSelectionMap((prev) => ({
      ...prev,
      [normalizedCode]: !prev[normalizedCode],
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const payload = {
      cliente_id: header.cliente_id,
      prospecto_id: header.prospecto_id,
      tipo_prestamo: header.tipo_prestamo,
      estado: Number(header.estado),
      observaciones: header.observaciones,
      deudas,
      protestos,
    };

    try {
      const evalResponse = await evaluarAdmision(payload);
      const evalData = evalResponse.data || evalResponse;

      if (evalData.decision === 'BLOQUEANTE') {
        setAlert({
          type: 'error',
          message: ADMISION_COPY_ALERTS.UPDATE.ERR_REGLAS_BLOQUEANTES,
          details: (evalData.rules || [])
            .filter((rule) => rule.severity === 'BLOQUEANTE')
            .map((rule) => rule.message),
        });
        return;
      }

      if (evalData.decision === 'REQUIERE_EXCEPCION') {
        if (!checkPermission('admisiones.excepciones.solicitar')) {
          setAlert({
            type: 'error',
            message: ADMISION_COPY_ALERTS.UPDATE.ERR_PERMISO_EXCEPCION,
          });
          return;
        }

        const detectedExceptionRules = getExceptionRules(evalData);
        setExceptionRules(detectedExceptionRules);
        setExceptionSelectionMap(buildExceptionSelectionMap(detectedExceptionRules, { defaultSelected: true }));
        setPendingPayload(payload);
        setShowExceptionModal(true);
        return;
      }

      setExceptionRules([]);
      setExceptionSelectionMap({});
      await submitUpdate(payload);
    } catch (error) {
      setAlert(handleApiError(error, ADMISION_COPY_ALERTS.UPDATE.ERR_ACTUALIZACION));
    } finally {
      setLoading(false);
    }
  }, [checkPermission, deudas, header, protestos, submitUpdate]);

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
