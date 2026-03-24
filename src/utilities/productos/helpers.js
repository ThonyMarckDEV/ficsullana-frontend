import { DEFAULT_PERIODICIDAD, PERIODICIDAD_OPTIONS } from './constants';

export const normalizeKey = (value = '') => String(value)
  .trim()
  .toUpperCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^A-Z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

export const toNumberOrNull = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const toBoolean = (value, fallback = true) => {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1') return true;
  if (value === 0 || value === '0') return false;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

export const formatDecimal = (value, suffix = '') => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 'N/A';
  const safe = Number.isInteger(parsed) ? String(parsed) : parsed.toFixed(2).replace(/\.?0+$/, '');
  return `${safe}${suffix}`;
};

export const formatMoney = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 'N/A';
  const safe = Number.isInteger(parsed) ? String(parsed) : parsed.toFixed(2).replace(/\.?0+$/, '');
  return `S/ ${safe}`;
};

export const resolvePeriodicidadMeta = (input, fallbackId = null) => {
  const normalizedInput = normalizeKey(input);
  const numericFallback = toNumberOrNull(fallbackId);

  return PERIODICIDAD_OPTIONS.find((item) => (
    item.id === numericFallback
    || item.key === normalizedInput
    || item.nombre === normalizedInput
    || normalizeKey(item.label) === normalizedInput
  )) || {
    id: numericFallback || DEFAULT_PERIODICIDAD.id,
    key: normalizedInput || DEFAULT_PERIODICIDAD.key,
    nombre: normalizedInput || DEFAULT_PERIODICIDAD.nombre,
    label: input || DEFAULT_PERIODICIDAD.label,
    dias: DEFAULT_PERIODICIDAD.dias,
  };
};

export const rangesOverlap = (aMin, aMax, bMin, bMax) => {
  const leftMin = Number(aMin);
  const rightMin = Number(bMin);
  const leftMax = aMax === null ? Number.POSITIVE_INFINITY : Number(aMax);
  const rightMax = bMax === null ? Number.POSITIVE_INFINITY : Number(bMax);

  return leftMin <= rightMax && rightMin <= leftMax;
};