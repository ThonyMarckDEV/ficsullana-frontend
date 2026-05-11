/**
 * Garantia state factories and helpers.
 *
 * Single source of truth for creating, normalizing, and inspecting
 * garantia row state within the evaluacion consumo form.
 */

export const SIMPLE_GARANTIA_VALUE = 'SIMPLE';
export const AVAL_GARANTIA_VALUE = 'AVAL';
export const MAX_AVALES = 3;

let garantiaClientIdSequence = 0;

const createGarantiaClientId = (prefix = 'garantia') => {
  garantiaClientIdSequence += 1;
  return `${prefix}-${garantiaClientIdSequence}`;
};

export const normalizeGarantiaClass = (value) => (
  String(value || '').trim().toUpperCase() === AVAL_GARANTIA_VALUE
    ? AVAL_GARANTIA_VALUE
    : SIMPLE_GARANTIA_VALUE
);

export const normalizeAvalSlot = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_AVALES) {
    return null;
  }

  return parsed;
};

export const isAvalGuarantee = (row = {}) => (
  normalizeGarantiaClass(row?.clase_garantia) === AVAL_GARANTIA_VALUE
);

export const hasGarantiaContent = (row = {}) => (
  Object.entries(row || {}).some(([key, value]) => {
    if (
      key === 'client_id'
      || key === 'clase_garantia'
      || key === 'usar_direccion_solicitante'
      || key === 'aval_slot'
    ) {
      return false;
    }

    if (key === 'garantia_id') {
      return Boolean(value);
    }

    return value !== null && value !== undefined && String(value).trim() !== '';
  })
);

const createGarantiaBase = (claseGarantia, overrides = {}) => {
  const normalizedClass = normalizeGarantiaClass(claseGarantia);
  const nextRow = {
    client_id: createGarantiaClientId(normalizedClass === AVAL_GARANTIA_VALUE ? 'aval-garantia' : 'garantia'),
    garantia_id: '',
    moneda_id: '',
    clase_garantia: normalizedClass,
    aval_slot: normalizedClass === AVAL_GARANTIA_VALUE ? '' : '',
    documento_garantia: '',
    tipo_garantia: '',
    descripcion: '',
    direccion: '',
    usar_direccion_solicitante: false,
    monto_garantias: '',
    valor_comercial: '',
    valor_realizacion: '',
    ficha_registral: '',
    fecha_ultima_evaluacion: '',
  };

  Object.entries(overrides || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      nextRow[key] = value;
    }
  });

  nextRow.clase_garantia = normalizedClass;
  nextRow.aval_slot = normalizedClass === AVAL_GARANTIA_VALUE
    ? String(normalizeAvalSlot(nextRow.aval_slot) ?? '')
    : '';

  return nextRow;
};

export const createGarantiaRow = (overrides = {}) => (
  createGarantiaBase(normalizeGarantiaClass(overrides?.clase_garantia), overrides)
);

export const createSolicitanteGarantiaRow = (overrides = {}) => (
  createGarantiaBase(SIMPLE_GARANTIA_VALUE, overrides)
);

export const createAvalGarantiaRow = (overrides = {}) => (
  createGarantiaBase(AVAL_GARANTIA_VALUE, overrides)
);

export const createIngresoRow = () => ({
  tipo_ingreso_id: '',
  ingreso: '',
  veces_sueldo: '',
  monto_maximo_otorgar: 0,
});

export const getActiveAvalSlots = (garantias = []) => {
  const slots = new Set();

  (Array.isArray(garantias) ? garantias : []).forEach((row) => {
    if (!isAvalGuarantee(row)) return;

    const slot = normalizeAvalSlot(row?.aval_slot);
    if (slot !== null) {
      slots.add(slot);
    }
  });

  return Array.from(slots).sort((left, right) => left - right);
};

export const parseRangoTasa = (rango = '') => {
  const clean = String(rango || '')
    .replace(',', '.')
    .replace(/\s+/g, ' ')
    .trim();

  const matches = clean.match(/\d+(\.\d+)?/g) || [];
  if (matches.length < 2) {
    return { min: null, max: null, label: clean || 'N/A' };
  }

  const min = Number(matches[0]);
  const max = Number(matches[1]);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: null, max: null, label: clean || 'N/A' };
  }

  return {
    min,
    max,
    label: `${min}% - ${max}%`,
  };
};
