import { useCallback, useState } from 'react';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import {
  getExceptionRuleName,
  getMissingExceptionRules,
  getSelectedExceptionCodes,
  normalizeRuleCode,
} from 'utilities/pages/admision/exceptionRules';
import { ADMISION_COPY_ALERTS } from 'utilities/pages/admision/copy';

const useAdmisionExceptionFlow = ({
  setAlert,
  setLoading,
  submitAction,
  submitErrorMessage,
  initialReason = '',
}) => {
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionReason, setExceptionReason] = useState(initialReason);
  const [exceptionRules, setExceptionRules] = useState([]);
  const [exceptionSelectionMap, setExceptionSelectionMap] = useState({});
  const [pendingPayload, setPendingPayload] = useState(null);

  const resetExceptionFlow = useCallback((options = {}) => {
    const { keepReason = false } = options;
    setShowExceptionModal(false);
    setExceptionRules([]);
    setExceptionSelectionMap({});
    setPendingPayload(null);
    if (!keepReason) {
      setExceptionReason('');
    }
  }, []);

  const openExceptionFlow = useCallback(({ payload, rules, selectionMap, reason = '' }) => {
    setPendingPayload(payload);
    setExceptionRules(Array.isArray(rules) ? rules : []);
    setExceptionSelectionMap(selectionMap || {});
    setExceptionReason(reason);
    setShowExceptionModal(true);
  }, []);

  const handleToggleExceptionRule = useCallback((code) => {
    const normalizedCode = normalizeRuleCode(code);
    if (!normalizedCode) return;

    setExceptionSelectionMap((previousMap) => ({
      ...previousMap,
      [normalizedCode]: !previousMap[normalizedCode],
    }));
  }, []);

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
      await submitAction(pendingPayload, {
        motivo,
        codigos: selectedCodes,
      });
      resetExceptionFlow({ keepReason: false });
    } catch (error) {
      setAlert(handleApiError(error, submitErrorMessage));
    } finally {
      setLoading(false);
    }
  }, [
    exceptionReason,
    exceptionRules,
    exceptionSelectionMap,
    pendingPayload,
    resetExceptionFlow,
    setAlert,
    setLoading,
    submitAction,
    submitErrorMessage,
  ]);

  return {
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
  };
};

export default useAdmisionExceptionFlow;