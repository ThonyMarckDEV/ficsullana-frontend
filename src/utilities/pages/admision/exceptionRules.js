const normalizeRuleCode = (code = '') => String(code).trim().toUpperCase();

const getExceptionRules = (evaluacion) => {
  const fromExceptionRules = Array.isArray(evaluacion?.exception_rules) ? evaluacion.exception_rules : null;
  const baseRules = fromExceptionRules ?? (Array.isArray(evaluacion?.rules) ? evaluacion.rules : []);

  return baseRules.filter((rule) => normalizeRuleCode(rule?.code) !== '');
};

const buildExceptionSelectionMap = (rules, options = {}) => {
  const { previousMap = {}, defaultSelected = true } = options;
  const nextMap = {};

  rules.forEach((rule) => {
    const code = normalizeRuleCode(rule?.code);
    if (!code) return;
    nextMap[code] = code in previousMap ? Boolean(previousMap[code]) : defaultSelected;
  });

  return nextMap;
};

const getMissingExceptionRules = (rules, selectionMap) =>
  rules.filter((rule) => {
    const code = normalizeRuleCode(rule?.code);
    if (!code) return false;
    return !selectionMap[code];
  });

const getSelectedExceptionCodes = (rules, selectionMap) =>
  Array.from(
    new Set(
      rules
        .map((rule) => normalizeRuleCode(rule?.code))
        .filter((code) => code && selectionMap[code])
    )
  );

const getSelectionProgress = (rules, selectionMap) => {
  const ruleList = Array.isArray(rules) ? rules : [];
  const total = ruleList.length;
  const selected = ruleList.reduce((count, rule) => {
    const code = normalizeRuleCode(rule?.code);
    if (!code) return count;
    return selectionMap[code] ? count + 1 : count;
  }, 0);

  return {
    selected,
    total,
    complete: total > 0 ? selected === total : true,
  };
};

const getExceptionRuleName = (rule) => rule?.name || normalizeRuleCode(rule?.code) || 'EXCEPCIÓN';
const stripSystemAlertPrefix = (value = '') => String(value || '').replace(/^\[ALERTA:[\s\S]*?\]\s*/i, '').trim();

export {
  normalizeRuleCode,
  getExceptionRules,
  buildExceptionSelectionMap,
  getMissingExceptionRules,
  getSelectedExceptionCodes,
  getSelectionProgress,
  getExceptionRuleName,
  stripSystemAlertPrefix,
};
