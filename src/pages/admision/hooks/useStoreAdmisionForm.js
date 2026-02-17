import { useState } from 'react';
import {
  createAdmision,
  evaluarAdmision,
  getCapitalPendienteFicsullana,
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

const buildInitialHeader = () => ({
  cliente_id: null,
  prospecto_id: null,
  tipo_solicitante: 'CLIENTE',
  tipo_prestamo: '',
  observaciones: '',
});

const useStoreAdmisionForm = ({ navigate, checkPermission }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isModalProspectoOpen, setIsModalProspectoOpen] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('');
  const [exceptionRules, setExceptionRules] = useState([]);
  const [exceptionSelectionMap, setExceptionSelectionMap] = useState({});
  const [pendingPayload, setPendingPayload] = useState(null);

  const [header, setHeader] = useState(buildInitialHeader);
  const [clienteSelected, setClienteSelected] = useState(null);
  const [prospectoSelected, setProspectoSelected] = useState(null);
  const [deudas, setDeudas] = useState([]);
  const [protestos, setProtestos] = useState([]);
  const [capitalPendienteFicsullana, setCapitalPendienteFicsullana] = useState(0);
  const [capitalLoading, setCapitalLoading] = useState(false);

  const isSolicitanteSelected = Boolean(header.cliente_id || header.prospecto_id);

  const handleTipoSolicitanteChange = (e) => {
    const nuevoTipo = e.target.value;

    setHeader((prev) => ({
      ...prev,
      tipo_solicitante: nuevoTipo,
      cliente_id: null,
      prospecto_id: null,
      tipo_prestamo: nuevoTipo === 'PROSPECTO' ? 'NUEVO' : '',
    }));

    setClienteSelected(null);
    setProspectoSelected(null);
    setCapitalPendienteFicsullana(0);
    setCapitalLoading(false);
  };

  const onSelectCliente = async (cliente) => {
    if (!cliente) {
      setHeader((prev) => ({ ...prev, cliente_id: null, tipo_prestamo: '' }));
      setClienteSelected(null);
      setCapitalPendienteFicsullana(0);
      setCapitalLoading(false);
      return;
    }

    const tipoSugerido = cliente.tipo_financiero;
    setHeader((prev) => ({
      ...prev,
      cliente_id: cliente.id,
      prospecto_id: null,
      tipo_prestamo: tipoSugerido,
    }));

    setClienteSelected(cliente);
    setProspectoSelected(null);
    setCapitalPendienteFicsullana(0);

    let mensajeTipo = '';
    if (tipoSugerido === 'RCS') mensajeTipo = 'Deuda vigente detectada (RCS).';
    else if (tipoSugerido === 'RSS') mensajeTipo = 'Sin deuda activa (RSS).';
    else if (tipoSugerido === 'NUEVO') mensajeTipo = 'Sin historial previo.';
    setAlert({ type: 'info', message: `Cliente seleccionado. ${mensajeTipo}` });

    if (tipoSugerido === 'RCS') {
      setCapitalLoading(true);
      try {
        const response = await getCapitalPendienteFicsullana(cliente.id);
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
        setAlert(handleApiError(error, ADMISION_COPY_ALERTS.STORE.ERR_CARGA_CAPITAL));
      } finally {
        setCapitalLoading(false);
      }
    }
  };

  const onSelectProspecto = (prospecto) => {
    if (!prospecto) {
      setHeader((prev) => ({ ...prev, prospecto_id: null, tipo_prestamo: '' }));
      setProspectoSelected(null);
      setCapitalPendienteFicsullana(0);
      setCapitalLoading(false);
      return;
    }

    setHeader((prev) => ({
      ...prev,
      prospecto_id: prospecto.id,
      cliente_id: null,
      tipo_prestamo: 'NUEVO',
    }));
    setProspectoSelected(prospecto);
    setClienteSelected(null);
    setCapitalPendienteFicsullana(0);
    setCapitalLoading(false);
    setAlert({ type: 'info', message: ADMISION_COPY_ALERTS.STORE.PROSPECTO_SELECCIONADO });
  };

  const handleProspectoCreado = (prospectoData) => {
    const nombreCompleto = `${prospectoData.nombres} ${prospectoData.apellido_paterno} ${prospectoData.apellido_materno}`;
    const prospectoObj = {
      id: prospectoData.id,
      nombre: nombreCompleto,
      dni: prospectoData.dni,
    };
    onSelectProspecto(prospectoObj);
    setAlert({ type: 'success', message: ADMISION_COPY_ALERTS.STORE.PROSPECTO_CREADO });
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
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (header.tipo_solicitante === 'CLIENTE' && !header.cliente_id) {
      setAlert({ type: 'error', message: 'Debe buscar y seleccionar un Cliente.' });
      setLoading(false);
      return;
    }

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

    const payload = {
      cliente_id: header.tipo_solicitante === 'CLIENTE' ? header.cliente_id : null,
      prospecto_id: header.tipo_solicitante === 'PROSPECTO' ? header.prospecto_id : null,
      tipo_prestamo: header.tipo_prestamo,
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
          message: ADMISION_COPY_ALERTS.STORE.ERR_REGLAS_BLOQUEANTES,
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
            message: ADMISION_COPY_ALERTS.STORE.ERR_PERMISO_EXCEPCION,
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
      await submitAdmision(payload);
    } catch (error) {
      setAlert(handleApiError(error, ADMISION_COPY_ALERTS.STORE.ERR_REGISTRO));
    } finally {
      setLoading(false);
    }
  };

  const getTipoPrestamoLabel = () => {
    if (!header.tipo_prestamo) return '';
    if (header.tipo_prestamo === 'NUEVO') return 'NUEVO (Primer Crédito)';
    if (header.tipo_prestamo === 'RCS') return 'RCS (Recurrente con Saldo)';
    if (header.tipo_prestamo === 'RSS') return 'RSS (Recurrente sin Saldo)';
    return header.tipo_prestamo;
  };

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
