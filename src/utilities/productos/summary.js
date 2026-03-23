import { PRODUCTO_TIPO_OPTIONS } from './constants';
import { formatDecimal, formatMoney, resolvePeriodicidadMeta, toNumberOrNull } from './helpers';
import { normalizeProducto } from './normalizers';

export const getPeriodicidadOptionById = (periodicidadId) => resolvePeriodicidadMeta('', periodicidadId);

export const getTipoEvaluacionLabel = (value) => (
  PRODUCTO_TIPO_OPTIONS.find((item) => item.value === value)?.label?.toUpperCase()
  || 'CONSUMO Y PYME'
);

export const formatMontoRange = (configuracion = {}) => {
  const desde = toNumberOrNull(configuracion?.monto_desde);
  const hasta = toNumberOrNull(configuracion?.monto_hasta);

  if (desde === null && hasta === null) return 'Monto no definido';
  if (desde !== null && hasta === null) return `Desde ${formatMoney(desde)} a más`;
  if (desde === null && hasta !== null) return `Hasta ${formatMoney(hasta)}`;
  return `${formatMoney(desde)} - ${formatMoney(hasta)}`;
};

export const formatCuotasRange = (configuracion = {}) => {
  const min = toNumberOrNull(configuracion?.cuotas_min);
  const max = toNumberOrNull(configuracion?.cuotas_max);

  if (min === null && max === null) return 'Cuotas no definidas';
  if (min !== null && max === null) return `Desde ${formatDecimal(min)} cuotas`;
  if (min === null && max !== null) return `Hasta ${formatDecimal(max)} cuotas`;
  if (min === max) return `${formatDecimal(min)} cuotas`;
  return `${formatDecimal(min)} - ${formatDecimal(max)} cuotas`;
};

export const formatTasaRange = (configuracion = {}) => {
  const min = toNumberOrNull(configuracion?.tasa_min);
  const max = toNumberOrNull(configuracion?.tasa_max);

  if (min === null && max === null) return 'N/A';
  if (min !== null && max === null) return `Desde ${formatDecimal(min, '%')}`;
  if (min === null && max !== null) return `Hasta ${formatDecimal(max, '%')}`;
  return `${formatDecimal(min, '%')} - ${formatDecimal(max, '%')}`;
};

export const getProductoOverallRateRange = (productoRaw = {}) => {
  const producto = normalizeProducto(productoRaw);
  const activeConfigs = (producto.configuraciones || []).filter((item) => item.activo !== false && item.legacy !== true);
  const numericRanges = activeConfigs
    .map((item) => ({
      min: toNumberOrNull(item.tasa_min),
      max: toNumberOrNull(item.tasa_max),
    }))
    .filter((item) => item.min !== null && item.max !== null);

  if (numericRanges.length > 0) {
    const min = Math.min(...numericRanges.map((item) => item.min));
    const max = Math.max(...numericRanges.map((item) => item.max));
    return {
      min,
      max,
      label: `${formatDecimal(min, '%')} - ${formatDecimal(max, '%')}`,
      source: 'configuraciones',
    };
  }

  const matches = String(producto.rango_tasa || '').replace(',', '.').match(/\d+(?:\.\d+)?/g) || [];
  if (matches.length >= 2) {
    const min = Number(matches[0]);
    const max = Number(matches[1]);
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return {
        min,
        max,
        label: `${formatDecimal(min, '%')} - ${formatDecimal(max, '%')}`,
        source: 'legacy',
      };
    }
  }

  return {
    min: null,
    max: null,
    label: producto.rango_tasa || 'N/A',
    source: 'none',
  };
};

export const buildProductoConfiguracionSummary = (productoRaw = {}) => {
  const producto = normalizeProducto(productoRaw);
  const configuraciones = (producto.configuraciones || []).filter((item) => item.activo !== false && item.legacy !== true);
  const overallRange = getProductoOverallRateRange(producto);
  const periodicidades = [...new Set(configuraciones.map((item) => item.periodicidad_label))];

  return {
    totalConfiguraciones: configuraciones.length,
    periodicidades,
    totalPeriodicidades: periodicidades.length,
    overallRangeLabel: overallRange.label,
  };
};