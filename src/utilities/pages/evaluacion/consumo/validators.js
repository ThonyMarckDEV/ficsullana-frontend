import {
  evaluateOtrosIngresosUtilidadLimit,
  hasCatalogOtrosIngresosFlow,
  OTROS_INGRESOS_UTILIDAD_LIMIT_EXCEEDED_MESSAGE,
} from './calculations';

export const validateEvaluacionConsumoForm = (form, options = {}) => {
  const errors = [];
  const maxVecesSueldo = Number(options.maxVecesSueldo || 0);
  const optionalNumericFields = [
    ['otros_ingresos_ventas', 'Otros ingresos: ventas debe ser un número válido.'],
    ['otros_ingresos_costo', 'Otros ingresos: costo debe ser un número válido.'],
    ['otros_ingresos_gasto', 'Otros ingresos: gasto debe ser un número válido.'],
    ['otros_ingresos_utilidad', 'Otros ingresos: utilidad debe ser un número válido.'],
    ['ingreso_neto', 'Resumen de datos: ingreso neto debe ser un número válido.'],
    ['boleta_basica', 'Boletas: básica debe ser un número válido.'],
    ['boleta_variable_mes_1', 'Boletas: variable mes 1 debe ser un número válido.'],
    ['boleta_variable_mes_2', 'Boletas: variable mes 2 debe ser un número válido.'],
    ['boleta_variable_mes_3', 'Boletas: variable mes 3 debe ser un número válido.'],
    ['gasto_alimentacion', 'Gastos: alimentación debe ser un número válido.'],
    ['gasto_servicios', 'Gastos: servicios debe ser un número válido.'],
    ['gasto_educacion', 'Gastos: educación debe ser un número válido.'],
    ['gasto_movilidad', 'Gastos: movilidad debe ser un número válido.'],
    ['gasto_imprevistos', 'Gastos: imprevistos debe ser un número válido.'],
  ];

  const requiredFields = [
    ['admision_id', 'Debe seleccionar una admisión elegible.'],
    ['categoria_id', 'Debe seleccionar una categoría.'],
    ['antiguedad_laboral_texto', 'Debe ingresar la antigüedad laboral.'],
    ['plan_inversion', 'Debe ingresar el plan de inversión.'],
    ['moneda_id', 'Debe seleccionar una moneda.'],
    ['monto', 'Debe ingresar el monto.'],
    ['tipo_frecuencia', 'Debe seleccionar el tipo de frecuencia.'],
    ['numero_cuotas', 'Debe ingresar el número de cuotas.'],
    ['propuesta', 'Debe ingresar la tasa propuesta %.'],
    ['producto_id', 'Debe seleccionar un producto.'],
    ['motivos', 'Debe ingresar los motivos.'],
  ];

  requiredFields.forEach(([field, message]) => {
    const value = form[field];
    if (value === null || value === undefined || String(value).trim() === '') {
      errors.push(message);
    }
  });

  if (!Array.isArray(form.ingresos) || form.ingresos.length === 0) {
    errors.push('Debe registrar al menos una fila en Ingresos Principales.');
  }

  form.ingresos.forEach((row, index) => {
    const vecesSueldo = Number(row.veces_sueldo || maxVecesSueldo || 0);

    if (!row.tipo_ingreso_id) errors.push(`Fila ${index + 1}: tipo de ingreso es obligatorio.`);
    if (!row.ingreso || Number(row.ingreso) <= 0) errors.push(`Fila ${index + 1}: ingreso debe ser mayor a 0.`);
    if (!Number.isFinite(vecesSueldo) || vecesSueldo <= 0) errors.push(`Fila ${index + 1}: veces sueldo debe ser mayor a 0.`);
    if (maxVecesSueldo > 0 && vecesSueldo > maxVecesSueldo) {
      errors.push(`Fila ${index + 1}: veces sueldo no puede superar ${maxVecesSueldo}.`);
    }
  });

  if (hasCatalogOtrosIngresosFlow(form)) {
    if (!form.actividad_no_sensible_id) {
      errors.push('Otros ingresos: debe seleccionar un tipo de negocio.');
    }

    if (form.otros_ingresos_ventas === '' || form.otros_ingresos_ventas === null || form.otros_ingresos_ventas === undefined) {
      errors.push('Otros ingresos: debe registrar las ventas.');
    }

    if (
      form.otros_ingresos_utilidad !== ''
      && form.otros_ingresos_utilidad !== null
      && form.otros_ingresos_utilidad !== undefined
      && Number(form.otros_ingresos_utilidad) < 0
    ) {
      errors.push('Otros ingresos: la utilidad no puede ser negativa.');
    }

    const otrosIngresosLimit = evaluateOtrosIngresosUtilidadLimit({
      ingresoTotalPrincipal: (form.ingresos || []).reduce((sum, row) => {
        const ingreso = Number(row?.ingreso);
        return Number.isFinite(ingreso) ? sum + ingreso : sum;
      }, 0),
      utilidad: form.otros_ingresos_utilidad,
    });

    if (otrosIngresosLimit.excedeLimiteUtilidadOtrosIngresos) {
      errors.push(OTROS_INGRESOS_UTILIDAD_LIMIT_EXCEEDED_MESSAGE);
    }
  }

  if (form.monto && form.propuesta && form.numero_cuotas && !form.cuota) {
    errors.push('No se pudo calcular la cuota con los valores ingresados.');
  }

  optionalNumericFields.forEach(([field, message]) => {
    const value = form[field];
    if (value === '' || value === null || value === undefined) return;

    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      errors.push(message);
    }
  });

  return errors;
};
