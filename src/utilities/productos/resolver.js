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

const normalizePolicyNumber = (value) => {
  const rounded = Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  return Number.isInteger(rounded) ? rounded : Number(rounded.toFixed(2));
};

const buildDeviation = (campo, solicitado, min, max) => {
  if (solicitado === null) return null;

  if (min !== null && solicitado < min) {
    return {
      campo,
      tipo: 'por_debajo_minimo',
      limite: normalizePolicyNumber(min),
      solicitado: normalizePolicyNumber(solicitado),
      diferencia: normalizePolicyNumber(min - solicitado),
    };
  }

  if (max !== null && solicitado > max) {
    return {
      campo,
      tipo: 'por_encima_maximo',
      limite: normalizePolicyNumber(max),
      solicitado: normalizePolicyNumber(solicitado),
      diferencia: normalizePolicyNumber(solicitado - max),
    };
  }

  return null;
};

const distanceToRange = (value, min, max) => {
  if (min === null || value === null) return Number.POSITIVE_INFINITY;
  if (value < min) return min - value;
  if (max !== null && value > max) return value - max;
  return 0;
};

const containsAmount = (configuracion, monto) => {
  const min = toNumberOrNull(configuracion?.monto_desde);
  const max = toNumberOrNull(configuracion?.monto_hasta);

  return min !== null && monto !== null && monto >= min && (max === null || monto <= max);
};

const containsInstallments = (configuracion, cuotas) => {
  const min = toNumberOrNull(configuracion?.cuotas_min);
  const max = toNumberOrNull(configuracion?.cuotas_max);

  return min !== null && max !== null && cuotas !== null && cuotas >= min && cuotas <= max;
};

const resolvePolicyReferenceConfiguracion = (configuraciones, monto, cuotas) => {
  if (monto === null || cuotas === null) return null;

  const exact = configuraciones.find((configuracion) => (
    containsAmount(configuracion, monto) && containsInstallments(configuracion, cuotas)
  ));
  if (exact) return exact;

  const amountMatches = configuraciones.filter((configuracion) => containsAmount(configuracion, monto));
  if (amountMatches.length > 0) {
    return [...amountMatches].sort((left, right) => (
      distanceToRange(cuotas, toNumberOrNull(left.cuotas_min), toNumberOrNull(left.cuotas_max))
      - distanceToRange(cuotas, toNumberOrNull(right.cuotas_min), toNumberOrNull(right.cuotas_max))
    ))[0];
  }

  const installmentMatches = configuraciones.filter((configuracion) => containsInstallments(configuracion, cuotas));
  if (installmentMatches.length > 0) {
    return [...installmentMatches].sort((left, right) => (
      distanceToRange(monto, toNumberOrNull(left.monto_desde), toNumberOrNull(left.monto_hasta))
      - distanceToRange(monto, toNumberOrNull(right.monto_desde), toNumberOrNull(right.monto_hasta))
    ))[0];
  }

  return [...configuraciones].sort((left, right) => (
    distanceToRange(monto, toNumberOrNull(left.monto_desde), toNumberOrNull(left.monto_hasta))
    + distanceToRange(cuotas, toNumberOrNull(left.cuotas_min), toNumberOrNull(left.cuotas_max))
    - distanceToRange(monto, toNumberOrNull(right.monto_desde), toNumberOrNull(right.monto_hasta))
    - distanceToRange(cuotas, toNumberOrNull(right.cuotas_min), toNumberOrNull(right.cuotas_max))
  ))[0] || null;
};

const buildPolicyEvaluation = (desviaciones, configuracion = null) => ({
  dentroPolitica: desviaciones.length === 0,
  requiereDiscrecionalidad: desviaciones.length > 0,
  desviaciones,
  configuracion,
});

export const evaluarProductoPolitica = (productoRaw, {
  tipoFrecuencia,
  monto,
  numeroCuotas,
  tasa,
} = {}) => {
  const producto = normalizeProducto(productoRaw);
  const overallRange = getProductoOverallRateRange(producto);
  const configuraciones = (producto.configuraciones || []).filter((item) => item.activo !== false && item.legacy !== true);
  const frequencyKey = normalizeKey(tipoFrecuencia);
  const montoNumero = toNumberOrNull(monto);
  const cuotasNumero = toNumberOrNull(numeroCuotas);
  const tasaNumero = toNumberOrNull(tasa);

  if (configuraciones.length === 0) {
    const desviaciones = [
      buildDeviation('tasa', tasaNumero, overallRange.min, overallRange.max),
    ].filter(Boolean);

    return buildPolicyEvaluation(desviaciones);
  }

  const matchingFrequency = configuraciones.filter((item) => item.periodicidad_key === frequencyKey);
  if (!frequencyKey || matchingFrequency.length === 0) {
    return buildPolicyEvaluation([{
      campo: 'tipo_frecuencia',
      tipo: 'sin_configuracion',
      limite: null,
      solicitado: tipoFrecuencia ? normalizeKey(tipoFrecuencia) : null,
      diferencia: null,
    }]);
  }

  const configuracion = resolvePolicyReferenceConfiguracion(matchingFrequency, montoNumero, cuotasNumero);
  if (!configuracion) return buildPolicyEvaluation([]);

  const desviaciones = [
    buildDeviation('monto', montoNumero, toNumberOrNull(configuracion.monto_desde), toNumberOrNull(configuracion.monto_hasta)),
    buildDeviation('tasa', tasaNumero, toNumberOrNull(configuracion.tasa_min), toNumberOrNull(configuracion.tasa_max)),
    buildDeviation('cuotas', cuotasNumero, toNumberOrNull(configuracion.cuotas_min), toNumberOrNull(configuracion.cuotas_max)),
  ].filter(Boolean);

  return buildPolicyEvaluation(desviaciones, configuracion);
};
