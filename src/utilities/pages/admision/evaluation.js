import {
  buildExceptionSelectionMap,
  getExceptionRules,
} from 'utilities/pages/admision/exceptionRules';

const ADMISION_EVALUATION_STATUS = {
  BLOQUEANTE: 'BLOQUEANTE',
  CONTINUAR: 'CONTINUAR',
  REQUIERE_EXCEPCION: 'REQUIERE_EXCEPCION',
  SIN_PERMISO_EXCEPCION: 'SIN_PERMISO_EXCEPCION',
};

const getBlockingRuleMessages = (rules) => (
  Array.isArray(rules)
    ? rules
      .filter((rule) => rule?.severity === ADMISION_EVALUATION_STATUS.BLOQUEANTE)
      .map((rule) => rule?.message)
      .filter(Boolean)
    : []
);

const resolveAdmisionEvaluationAction = ({
  evalData,
  checkPermission,
  permissionCode = 'admisiones.excepciones.solicitar',
}) => {
  const decision = evalData?.decision;

  if (decision === ADMISION_EVALUATION_STATUS.BLOQUEANTE) {
    return {
      status: ADMISION_EVALUATION_STATUS.BLOQUEANTE,
      blockingMessages: getBlockingRuleMessages(evalData?.rules),
    };
  }

  if (decision === ADMISION_EVALUATION_STATUS.REQUIERE_EXCEPCION) {
    if (!checkPermission(permissionCode)) {
      return { status: ADMISION_EVALUATION_STATUS.SIN_PERMISO_EXCEPCION };
    }

    const rules = getExceptionRules(evalData);
    return {
      status: ADMISION_EVALUATION_STATUS.REQUIERE_EXCEPCION,
      rules,
      selectionMap: buildExceptionSelectionMap(rules, { defaultSelected: true }),
    };
  }

  return { status: ADMISION_EVALUATION_STATUS.CONTINUAR };
};

export {
  ADMISION_EVALUATION_STATUS,
  getBlockingRuleMessages,
  resolveAdmisionEvaluationAction,
};