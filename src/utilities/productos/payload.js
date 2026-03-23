import { resolvePeriodicidadMeta, toNumberOrNull } from './helpers';
import { normalizeProducto } from './normalizers';
import { getProductoOverallRateRange } from './summary';

const serializeConfiguracion = (configuracion) => {
  const periodicidadMeta = resolvePeriodicidadMeta(
    configuracion?.periodicidad_nombre || configuracion?.periodicidad_key,
    configuracion?.periodicidad_id
  );

  return {
    ...(configuracion?.id ? { id: Number(configuracion.id) } : {}),
    periodicidad_id: Number(configuracion?.periodicidad_id || periodicidadMeta.id),
    monto_desde: Number(configuracion.monto_desde),
    monto_hasta: toNumberOrNull(configuracion.monto_hasta),
    tasa_min: Number(configuracion.tasa_min),
    tasa_max: Number(configuracion.tasa_max),
    cuotas_min: Number(configuracion.cuotas_min),
    cuotas_max: Number(configuracion.cuotas_max),
    activo: configuracion.activo !== false,
  };
};

export const buildProductoPayload = (form) => {
  const producto = normalizeProducto(form);
  const configuraciones = producto.configuraciones || [];
  const overallRange = getProductoOverallRateRange(producto);

  return {
    nombre: String(producto.nombre || '').trim(),
    tipo_evaluacion: producto.tipo_evaluacion,
    activo: producto.activo !== false,
    rango_tasa: overallRange.label === 'N/A' ? '' : overallRange.label,
    configuraciones: configuraciones.map(serializeConfiguracion),
  };
};