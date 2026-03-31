import { normalizeKey, toNumberOrNull } from './helpers';
import { normalizeProducto } from './normalizers';
import {
  formatCuotasRange,
  formatMontoRange,
  formatTasaRange,
  getProductoOverallRateRange,
} from './summary';

export const resolveProductoConfiguracion = (productoRaw, {
  tipoFrecuencia,
  monto,
  numeroCuotas,
} = {}) => {
  const producto = normalizeProducto(productoRaw);
  const overallRange = getProductoOverallRateRange(producto);
  const configuraciones = (producto.configuraciones || []).filter((item) => item.activo !== false && item.legacy !== true);
  const frequencyKey = normalizeKey(tipoFrecuencia);
  const montoNumero = toNumberOrNull(monto);
  const cuotasNumero = toNumberOrNull(numeroCuotas);

  if (configuraciones.length === 0) {
    return {
      ...overallRange,
      configuracion: null,
      exactMatch: false,
      hasConfiguraciones: false,
      helperText: overallRange.source === 'legacy'
        ? 'Rango referencial heredado del producto.'
        : 'El producto no tiene configuraciones registradas.',
    };
  }

  if (!frequencyKey || montoNumero === null || cuotasNumero === null) {
    return {
      ...overallRange,
      configuracion: null,
      exactMatch: false,
      hasConfiguraciones: true,
      helperText: 'Complete periodicidad, monto y cuotas para resolver la tasa permitida. Luego ingrese una tasa propuesta dentro de ese rango.',
    };
  }

  const exactMatch = configuraciones.find((item) => {
    const montoDesde = toNumberOrNull(item.monto_desde);
    const montoHasta = toNumberOrNull(item.monto_hasta);
    const cuotasMin = toNumberOrNull(item.cuotas_min);
    const cuotasMax = toNumberOrNull(item.cuotas_max);

    if (
      item.periodicidad_key !== frequencyKey
      || montoDesde === null
      || cuotasMin === null
      || cuotasMax === null
    ) {
      return false;
    }

    const montoOk = montoNumero >= montoDesde && (montoHasta === null || montoNumero <= montoHasta);
    const cuotasOk = cuotasNumero >= cuotasMin && cuotasNumero <= cuotasMax;

    return montoOk && cuotasOk;
  }) || null;

  if (!exactMatch) {
    return {
      ...overallRange,
      configuracion: null,
      exactMatch: false,
      hasConfiguraciones: true,
      helperText: 'No existe una configuración activa que coincida con la periodicidad, monto y cuotas ingresados.',
    };
  }

  const min = toNumberOrNull(exactMatch.tasa_min);
  const max = toNumberOrNull(exactMatch.tasa_max);

  return {
    min,
    max,
    label: formatTasaRange(exactMatch),
    configuracion: exactMatch,
    exactMatch: true,
    hasConfiguraciones: true,
    helperText: `${exactMatch.periodicidad_label} | ${formatMontoRange(exactMatch)} | ${formatCuotasRange(exactMatch)}`,
  };
};