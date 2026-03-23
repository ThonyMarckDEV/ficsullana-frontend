import { rangesOverlap, toNumberOrNull } from './helpers';
import { normalizeProducto } from './normalizers';

export const validateProductoForm = (form) => {
  const errors = [];
  const producto = normalizeProducto(form);

  if (!String(producto.nombre || '').trim()) {
    errors.push('Debe ingresar el nombre del producto.');
  }

  if (!producto.tipo_evaluacion) {
    errors.push('Debe seleccionar el tipo de evaluación.');
  }

  const activeConfigs = (producto.configuraciones || []).filter((item) => item.activo !== false);

  if (activeConfigs.length === 0) {
    errors.push('Debe registrar al menos una configuración activa para el producto.');
    return errors;
  }

  activeConfigs.forEach((config, index) => {
    const row = index + 1;
    const montoDesde = toNumberOrNull(config.monto_desde);
    const montoHasta = toNumberOrNull(config.monto_hasta);
    const tasaMin = toNumberOrNull(config.tasa_min);
    const tasaMax = toNumberOrNull(config.tasa_max);
    const cuotasMin = toNumberOrNull(config.cuotas_min);
    const cuotasMax = toNumberOrNull(config.cuotas_max);

    if (!config.periodicidad_id) {
      errors.push(`Configuración ${row}: debe seleccionar una periodicidad.`);
    }

    if (montoDesde === null || montoDesde < 0) {
      errors.push(`Configuración ${row}: monto desde es obligatorio y debe ser válido.`);
    }

    if (montoHasta !== null && montoDesde !== null && montoHasta < montoDesde) {
      errors.push(`Configuración ${row}: monto hasta no puede ser menor que monto desde.`);
    }

    if (tasaMin === null || tasaMin < 0) {
      errors.push(`Configuración ${row}: tasa mínima es obligatoria.`);
    }

    if (tasaMax === null || tasaMax < 0) {
      errors.push(`Configuración ${row}: tasa máxima es obligatoria.`);
    }

    if (tasaMin !== null && tasaMax !== null && tasaMax < tasaMin) {
      errors.push(`Configuración ${row}: tasa máxima no puede ser menor que tasa mínima.`);
    }

    if (cuotasMin === null || cuotasMin <= 0) {
      errors.push(`Configuración ${row}: cuotas mínimas es obligatorio.`);
    }

    if (cuotasMax === null || cuotasMax <= 0) {
      errors.push(`Configuración ${row}: cuotas máximas es obligatorio.`);
    }

    if (cuotasMin !== null && cuotasMax !== null && cuotasMax < cuotasMin) {
      errors.push(`Configuración ${row}: cuotas máximas no puede ser menor que cuotas mínimas.`);
    }
  });

  for (let i = 0; i < activeConfigs.length; i += 1) {
    for (let j = i + 1; j < activeConfigs.length; j += 1) {
      const left = activeConfigs[i];
      const right = activeConfigs[j];
      if (left.periodicidad_key !== right.periodicidad_key) continue;

      const leftMontoDesde = toNumberOrNull(left.monto_desde);
      const leftMontoHasta = toNumberOrNull(left.monto_hasta);
      const rightMontoDesde = toNumberOrNull(right.monto_desde);
      const rightMontoHasta = toNumberOrNull(right.monto_hasta);
      const leftCuotasMin = toNumberOrNull(left.cuotas_min);
      const leftCuotasMax = toNumberOrNull(left.cuotas_max);
      const rightCuotasMin = toNumberOrNull(right.cuotas_min);
      const rightCuotasMax = toNumberOrNull(right.cuotas_max);

      if (
        leftMontoDesde !== null
        && rightMontoDesde !== null
        && leftCuotasMin !== null
        && rightCuotasMin !== null
        && rangesOverlap(leftMontoDesde, leftMontoHasta, rightMontoDesde, rightMontoHasta)
        && rangesOverlap(leftCuotasMin, leftCuotasMax, rightCuotasMin, rightCuotasMax)
      ) {
        errors.push(
          `Las configuraciones ${i + 1} y ${j + 1} de ${left.periodicidad_label} se traslapan en monto y cuotas.`
        );
      }
    }
  }

  return errors;
};