export const ADMISION_STATES = {
  PENDIENTE: 0,
  APROBADO: 1,
  OBSERVADO: 2,
  RECHAZADO: 3,
  EN_REVISION: 4,
};

export const ADMISION_STATE_LABELS = {
  [ADMISION_STATES.PENDIENTE]: 'PENDIENTE',
  [ADMISION_STATES.APROBADO]: 'APROBADO',
  [ADMISION_STATES.OBSERVADO]: 'OBSERVADO',
  [ADMISION_STATES.RECHAZADO]: 'RECHAZADO',
  [ADMISION_STATES.EN_REVISION]: 'EN REVISIÓN',
};

const ADMISION_LABEL_TO_VALUE = {
  PENDIENTE: ADMISION_STATES.PENDIENTE,
  APROBADO: ADMISION_STATES.APROBADO,
  OBSERVADO: ADMISION_STATES.OBSERVADO,
  RECHAZADO: ADMISION_STATES.RECHAZADO,
  EN_REVISION: ADMISION_STATES.EN_REVISION,
  EN_REVISIÓN: ADMISION_STATES.EN_REVISION,
};

export const normalizeAdmisionState = (value) => {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    return Number(value);
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toUpperCase().replace(/[\s-]+/g, '_');
    return ADMISION_LABEL_TO_VALUE[normalized] ?? ADMISION_STATES.PENDIENTE;
  }

  return ADMISION_STATES.PENDIENTE;
};

export const formatAdmisionState = (value) => (
  ADMISION_STATE_LABELS[normalizeAdmisionState(value)] || String(value || '')
);

export const isAdmisionEditable = (value) => {
  const normalized = normalizeAdmisionState(value);
  return normalized === ADMISION_STATES.PENDIENTE || normalized === ADMISION_STATES.OBSERVADO;
};

export const isAdmisionInReview = (value) => (
  normalizeAdmisionState(value) === ADMISION_STATES.EN_REVISION
);

export const isAdmisionLocked = (value) => {
  const normalized = normalizeAdmisionState(value);
  return normalized === ADMISION_STATES.EN_REVISION
    || normalized === ADMISION_STATES.APROBADO
    || normalized === ADMISION_STATES.RECHAZADO;
};

export const isAdmisionDecision = (value) => {
  const normalized = normalizeAdmisionState(value);
  return normalized === ADMISION_STATES.OBSERVADO
    || normalized === ADMISION_STATES.APROBADO
    || normalized === ADMISION_STATES.RECHAZADO;
};

export const ADMISION_BADGE_STYLES = {
  [ADMISION_STATES.PENDIENTE]: 'bg-amber-100 text-amber-800 border-amber-200',
  [ADMISION_STATES.EN_REVISION]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [ADMISION_STATES.OBSERVADO]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ADMISION_STATES.APROBADO]: 'bg-green-100 text-green-800 border-green-200',
  [ADMISION_STATES.RECHAZADO]: 'bg-red-100 text-red-800 border-red-200',
};

export const ADMISION_ADVISOR_STATE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: String(ADMISION_STATES.PENDIENTE), label: formatAdmisionState(ADMISION_STATES.PENDIENTE) },
  { value: String(ADMISION_STATES.OBSERVADO), label: formatAdmisionState(ADMISION_STATES.OBSERVADO) },
  { value: String(ADMISION_STATES.APROBADO), label: formatAdmisionState(ADMISION_STATES.APROBADO) },
  { value: String(ADMISION_STATES.RECHAZADO), label: formatAdmisionState(ADMISION_STATES.RECHAZADO) },
];

export const ADMISION_REVIEW_STATE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: String(ADMISION_STATES.EN_REVISION), label: formatAdmisionState(ADMISION_STATES.EN_REVISION) },
  { value: String(ADMISION_STATES.OBSERVADO), label: formatAdmisionState(ADMISION_STATES.OBSERVADO) },
  { value: String(ADMISION_STATES.APROBADO), label: formatAdmisionState(ADMISION_STATES.APROBADO) },
  { value: String(ADMISION_STATES.RECHAZADO), label: formatAdmisionState(ADMISION_STATES.RECHAZADO) },
];

export const getAdmisionStateFilterOptions = ({ canReviewQueue = false } = {}) => (
  canReviewQueue ? ADMISION_REVIEW_STATE_OPTIONS : ADMISION_ADVISOR_STATE_OPTIONS
);

export const normalizeAdmisionListFilters = (filters = {}, { canReviewQueue = false } = {}) => {
  const allowedOptions = getAdmisionStateFilterOptions({ canReviewQueue });
  const allowedStates = allowedOptions.map((option) => option.value);
  const normalizedState = filters.estado !== undefined && filters.estado !== null && filters.estado !== ''
    ? String(normalizeAdmisionState(filters.estado))
    : '';

  return {
    ...filters,
    estado: allowedStates.includes(normalizedState) ? normalizedState : '',
  };
};
