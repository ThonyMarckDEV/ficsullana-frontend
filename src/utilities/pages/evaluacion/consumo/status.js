export const EVALUACION_CONSUMO_STATES = {
  PENDIENTE: 'PENDIENTE',
  OBSERVADO: 'OBSERVADO',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
};

const LEGACY_STATE_MAP = {
  BORRADOR: EVALUACION_CONSUMO_STATES.PENDIENTE,
  FINALIZADA: EVALUACION_CONSUMO_STATES.APROBADO,
};

export const normalizeEvaluacionConsumoState = (value) => {
  const normalized = String(value || '').trim().toUpperCase();

  if (!normalized) {
    return EVALUACION_CONSUMO_STATES.PENDIENTE;
  }

  return LEGACY_STATE_MAP[normalized] || normalized;
};

export const isEvaluacionConsumoLocked = (value) => {
  const normalized = normalizeEvaluacionConsumoState(value);
  return normalized === EVALUACION_CONSUMO_STATES.APROBADO || normalized === EVALUACION_CONSUMO_STATES.RECHAZADO;
};

export const isEvaluacionConsumoEditable = (value) => {
  const normalized = normalizeEvaluacionConsumoState(value);
  return normalized === EVALUACION_CONSUMO_STATES.PENDIENTE || normalized === EVALUACION_CONSUMO_STATES.OBSERVADO;
};

export const EVALUACION_CONSUMO_BADGE_STYLES = {
  [EVALUACION_CONSUMO_STATES.PENDIENTE]: 'bg-amber-100 text-amber-800 border-amber-200',
  [EVALUACION_CONSUMO_STATES.OBSERVADO]: 'bg-blue-100 text-blue-800 border-blue-200',
  [EVALUACION_CONSUMO_STATES.APROBADO]: 'bg-green-100 text-green-800 border-green-200',
  [EVALUACION_CONSUMO_STATES.RECHAZADO]: 'bg-red-100 text-red-800 border-red-200',
};

export const EVALUACION_CONSUMO_STATE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: EVALUACION_CONSUMO_STATES.PENDIENTE, label: EVALUACION_CONSUMO_STATES.PENDIENTE },
  { value: EVALUACION_CONSUMO_STATES.OBSERVADO, label: EVALUACION_CONSUMO_STATES.OBSERVADO },
  { value: EVALUACION_CONSUMO_STATES.APROBADO, label: EVALUACION_CONSUMO_STATES.APROBADO },
  { value: EVALUACION_CONSUMO_STATES.RECHAZADO, label: EVALUACION_CONSUMO_STATES.RECHAZADO },
];