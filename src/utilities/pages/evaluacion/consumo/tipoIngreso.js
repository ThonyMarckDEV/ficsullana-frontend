export const TIPO_INGRESO_KEYS = {
  DEPENDIENTE_FORMAL: 'DEPENDIENTE_FORMAL',
  INDEPENDIENTE_FORMALES: 'INDEPENDIENTE_FORMALES',
  INDEPENDIENTE_INFORMAL: 'INDEPENDIENTE_INFORMAL',
};

const TIPO_INGRESO_LABELS = {
  [TIPO_INGRESO_KEYS.DEPENDIENTE_FORMAL]: 'DEPENDIENTE FORMAL',
  [TIPO_INGRESO_KEYS.INDEPENDIENTE_FORMALES]: 'INDEPENDIENTE FORMALES',
  [TIPO_INGRESO_KEYS.INDEPENDIENTE_INFORMAL]: 'INDEPENDIENTE INFORMAL',
};

const normalizeTipoIngresoValue = (value = '') => String(value)
  .trim()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^A-Za-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '')
  .toUpperCase();

export const resolveTipoIngresoKey = (tipoIngreso) => {
  const descripcionKey = normalizeTipoIngresoValue(tipoIngreso?.descripcion);
  if (Object.values(TIPO_INGRESO_KEYS).includes(descripcionKey)) {
    return descripcionKey;
  }

  const nombreKey = normalizeTipoIngresoValue(tipoIngreso?.nombre);
  const matchedEntry = Object.entries(TIPO_INGRESO_LABELS).find(([, label]) => (
    normalizeTipoIngresoValue(label) === nombreKey
  ));

  return matchedEntry?.[0] || null;
};

export const findTipoIngresoIdsByKey = (tiposIngreso = [], expectedKey) => (
  (tiposIngreso || [])
    .filter((tipoIngreso) => resolveTipoIngresoKey(tipoIngreso) === expectedKey)
    .map((tipoIngreso) => Number(tipoIngreso.id))
    .filter((id) => Number.isFinite(id) && id > 0)
);