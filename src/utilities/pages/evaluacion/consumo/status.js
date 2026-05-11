export const EVALUACION_CONSUMO_STATES = {
  PENDIENTE: 'PENDIENTE',
  EN_REVISION: 'EN_REVISION',
  OBSERVADO: 'OBSERVADO',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
};

export const EVALUACION_CONSUMO_STATE_LABELS = {
  [EVALUACION_CONSUMO_STATES.PENDIENTE]: 'PENDIENTE',
  [EVALUACION_CONSUMO_STATES.EN_REVISION]: 'EN REVISIÓN',
  [EVALUACION_CONSUMO_STATES.OBSERVADO]: 'OBSERVADO',
  [EVALUACION_CONSUMO_STATES.APROBADO]: 'APROBADO',
  [EVALUACION_CONSUMO_STATES.RECHAZADO]: 'RECHAZADO',
};

export const normalizeEvaluacionConsumoState = (value) => {
  const normalized = String(value || '').trim().toUpperCase().replace(/[\s-]+/g, '_');

  if (!normalized) {
    return EVALUACION_CONSUMO_STATES.PENDIENTE;
  }

  return normalized;
};

export const isEvaluacionConsumoLocked = (value) => {
  const normalized = normalizeEvaluacionConsumoState(value);
  return normalized === EVALUACION_CONSUMO_STATES.EN_REVISION
    || normalized === EVALUACION_CONSUMO_STATES.APROBADO
    || normalized === EVALUACION_CONSUMO_STATES.RECHAZADO;
};

export const isEvaluacionConsumoEditable = (value) => {
  const normalized = normalizeEvaluacionConsumoState(value);
  return normalized === EVALUACION_CONSUMO_STATES.PENDIENTE || normalized === EVALUACION_CONSUMO_STATES.OBSERVADO;
};

export const isEvaluacionConsumoInReview = (value) => (
  normalizeEvaluacionConsumoState(value) === EVALUACION_CONSUMO_STATES.EN_REVISION
);

export const isEvaluacionConsumoDecision = (value) => {
  const normalized = normalizeEvaluacionConsumoState(value);
  return normalized === EVALUACION_CONSUMO_STATES.OBSERVADO
    || normalized === EVALUACION_CONSUMO_STATES.APROBADO
    || normalized === EVALUACION_CONSUMO_STATES.RECHAZADO;
};

export const formatEvaluacionConsumoState = (value) => {
  const normalized = normalizeEvaluacionConsumoState(value);
  return EVALUACION_CONSUMO_STATE_LABELS[normalized] || normalized;
};

export const EVALUACION_CONSUMO_BADGE_STYLES = {
  [EVALUACION_CONSUMO_STATES.PENDIENTE]: 'bg-amber-100 text-amber-800 border-amber-200',
  [EVALUACION_CONSUMO_STATES.EN_REVISION]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [EVALUACION_CONSUMO_STATES.OBSERVADO]: 'bg-blue-100 text-blue-800 border-blue-200',
  [EVALUACION_CONSUMO_STATES.APROBADO]: 'bg-green-100 text-green-800 border-green-200',
  [EVALUACION_CONSUMO_STATES.RECHAZADO]: 'bg-red-100 text-red-800 border-red-200',
};

export const EVALUACION_CONSUMO_STATE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: EVALUACION_CONSUMO_STATES.PENDIENTE, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.PENDIENTE) },
  { value: EVALUACION_CONSUMO_STATES.EN_REVISION, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.EN_REVISION) },
  { value: EVALUACION_CONSUMO_STATES.OBSERVADO, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.OBSERVADO) },
  { value: EVALUACION_CONSUMO_STATES.APROBADO, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.APROBADO) },
  { value: EVALUACION_CONSUMO_STATES.RECHAZADO, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.RECHAZADO) },
];

export const EVALUACION_CONSUMO_ADVISOR_STATE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: EVALUACION_CONSUMO_STATES.PENDIENTE, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.PENDIENTE) },
  { value: EVALUACION_CONSUMO_STATES.OBSERVADO, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.OBSERVADO) },
  { value: EVALUACION_CONSUMO_STATES.APROBADO, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.APROBADO) },
  { value: EVALUACION_CONSUMO_STATES.RECHAZADO, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.RECHAZADO) },
];

export const EVALUACION_CONSUMO_REVIEW_STATE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: EVALUACION_CONSUMO_STATES.EN_REVISION, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.EN_REVISION) },
  { value: EVALUACION_CONSUMO_STATES.OBSERVADO, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.OBSERVADO) },
  { value: EVALUACION_CONSUMO_STATES.APROBADO, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.APROBADO) },
  { value: EVALUACION_CONSUMO_STATES.RECHAZADO, label: formatEvaluacionConsumoState(EVALUACION_CONSUMO_STATES.RECHAZADO) },
];

export const getEvaluacionConsumoInitialFilters = ({ canReviewQueue = false } = {}) => ({
  search: '',
  estado: '',
});

export const getEvaluacionConsumoStateFilterOptions = ({ canReviewQueue = false } = {}) => (
  canReviewQueue
    ? EVALUACION_CONSUMO_REVIEW_STATE_OPTIONS
    : EVALUACION_CONSUMO_ADVISOR_STATE_OPTIONS
);

export const normalizeEvaluacionConsumoListFilters = (filters = {}, { canReviewQueue = false } = {}) => {
  const normalizedState = filters.estado ? normalizeEvaluacionConsumoState(filters.estado) : '';
  const allowedOptions = canReviewQueue
    ? EVALUACION_CONSUMO_REVIEW_STATE_OPTIONS
    : EVALUACION_CONSUMO_ADVISOR_STATE_OPTIONS;
  const allowedStates = allowedOptions.map((option) => option.value);

  if (canReviewQueue) {
    return {
      ...filters,
      estado: allowedStates.includes(normalizedState) ? normalizedState : '',
    };
  }

  return {
    ...filters,
    estado: allowedStates.includes(normalizedState) ? normalizedState : '',
  };
};
