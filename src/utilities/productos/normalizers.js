import { DEFAULT_PERIODICIDAD } from './constants';
import { resolvePeriodicidadMeta, toBoolean, toNumberOrNull } from './helpers';

export const createEmptyProductoConfiguracion = (overrides = {}) => ({
  id: null,
  periodicidad_id: String(DEFAULT_PERIODICIDAD.id),
  periodicidad_nombre: DEFAULT_PERIODICIDAD.nombre,
  periodicidad_key: DEFAULT_PERIODICIDAD.key,
  periodicidad_label: DEFAULT_PERIODICIDAD.label,
  periodicidad_dias: DEFAULT_PERIODICIDAD.dias,
  monto_desde: '',
  monto_hasta: '',
  tasa_min: '',
  tasa_max: '',
  cuotas_min: '',
  cuotas_max: '',
  activo: true,
  legacy: false,
  ...overrides,
});

export const normalizeProductoConfiguracion = (item = {}) => {
  const periodicidadMeta = resolvePeriodicidadMeta(
    item?.periodicidad?.nombre
      || item?.periodicidad_nombre
      || item?.periodicidad_label
      || item?.periodicidad
      || item?.periodicidad_key,
    item?.periodicidad?.id ?? item?.periodicidad_id
  );

  const montoDesde = toNumberOrNull(item?.monto_desde);
  const montoHasta = toNumberOrNull(item?.monto_hasta);
  const tasaMin = toNumberOrNull(item?.tasa_min);
  const tasaMax = toNumberOrNull(item?.tasa_max);
  const cuotasMin = toNumberOrNull(item?.cuotas_min);
  const cuotasMax = toNumberOrNull(item?.cuotas_max);

  return createEmptyProductoConfiguracion({
    id: item?.id ?? null,
    periodicidad_id: String(item?.periodicidad_id ?? periodicidadMeta.id),
    periodicidad_nombre: item?.periodicidad?.nombre || item?.periodicidad_nombre || periodicidadMeta.nombre,
    periodicidad_key: periodicidadMeta.key,
    periodicidad_label: item?.periodicidad?.label || item?.periodicidad_label || periodicidadMeta.label,
    periodicidad_dias: Number(item?.periodicidad?.dias ?? item?.dias ?? periodicidadMeta.dias),
    monto_desde: montoDesde !== null ? String(montoDesde) : '',
    monto_hasta: montoHasta !== null ? String(montoHasta) : '',
    tasa_min: tasaMin !== null ? String(tasaMin) : '',
    tasa_max: tasaMax !== null ? String(tasaMax) : '',
    cuotas_min: cuotasMin !== null ? String(cuotasMin) : '',
    cuotas_max: cuotasMax !== null ? String(cuotasMax) : '',
    activo: toBoolean(item?.activo, true),
  });
};

const normalizeLegacyProductoConfiguracion = (producto = {}) => {
  const tasaMatches = String(producto?.rango_tasa || '')
    .replace(',', '.')
    .match(/\d+(?:\.\d+)?/g) || [];

  if (tasaMatches.length < 2) {
    return null;
  }

  return createEmptyProductoConfiguracion({
    tasa_min: tasaMatches[0],
    tasa_max: tasaMatches[1],
    legacy: true,
  });
};

export const normalizeProducto = (producto = {}) => {
  const configuracionesRaw = producto?.configuraciones || producto?.producto_configuraciones || [];
  const configuraciones = Array.isArray(configuracionesRaw)
    ? configuracionesRaw.map(normalizeProductoConfiguracion)
    : [];

  const fallbackLegacy = configuraciones.length === 0
    ? normalizeLegacyProductoConfiguracion(producto)
    : null;

  return {
    id: producto?.id ?? null,
    nombre: producto?.nombre || '',
    tipo_evaluacion: producto?.tipo_evaluacion || 'AMBOS',
    activo: toBoolean(producto?.activo, true),
    rango_tasa: producto?.rango_tasa || '',
    created_at: producto?.created_at || null,
    configuraciones: configuraciones.length > 0 ? configuraciones : (fallbackLegacy ? [fallbackLegacy] : []),
  };
};