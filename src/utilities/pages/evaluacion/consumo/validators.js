import {
  evaluateFinancialLimits,
  evaluateOtrosIngresosUtilidadLimit,
  hasCatalogOtrosIngresosFlow,
  OTROS_INGRESOS_UTILIDAD_LIMIT_EXCEEDED_MESSAGE,
} from './calculations';
import {
  AVAL_GARANTIA_VALUE,
  MAX_AVALES,
  SIMPLE_GARANTIA_VALUE,
  createAvalState,
  getActiveAvalSlots,
  isAvalGuarantee,
  normalizeAvalSlot,
} from './transformers';

const strictDecimalPattern = /^\d+(\.\d{1,2})?$/;

const hasGarantiaContent = (row = {}) => (
  Object.entries(row || {}).some(([key, value]) => {
    if (key === 'client_id' || key === 'clase_garantia' || key === 'usar_direccion_solicitante') {
      return false;
    }

    if (key === 'garantia_id') {
      return Boolean(value);
    }

    return value !== null && value !== undefined && String(value).trim() !== '';
  })
);

const validateGarantiaRow = ({
  row,
  index,
  errors,
  montoEvaluacion,
  labelPrefix,
  expectedClass,
}) => {
  if (!hasGarantiaContent(row)) {
    return false;
  }

  if (!row.moneda_id) errors.push(`${labelPrefix} ${index + 1}: moneda es obligatoria.`);
  if (String(row?.clase_garantia || '').trim().toUpperCase() !== expectedClass) {
    errors.push(`${labelPrefix} ${index + 1}: clase de garantía inválida.`);
  }
  if (expectedClass === AVAL_GARANTIA_VALUE && normalizeAvalSlot(row?.aval_slot) === null) {
    errors.push(`${labelPrefix} ${index + 1}: debe vincularse a un aval.`);
  }
  if (!row.documento_garantia) errors.push(`${labelPrefix} ${index + 1}: documento de garantía es obligatorio.`);
  if (!row.tipo_garantia) errors.push(`${labelPrefix} ${index + 1}: tipo de garantía es obligatorio.`);
  if (!String(row.descripcion || '').trim()) errors.push(`${labelPrefix} ${index + 1}: descripción es obligatoria.`);
  if (!String(row.direccion || '').trim()) errors.push(`${labelPrefix} ${index + 1}: dirección es obligatoria.`);

  const montoGarantias = String(row.monto_garantias ?? '').trim();
  if (!montoGarantias) {
    errors.push(`${labelPrefix} ${index + 1}: monto de garantías es obligatorio.`);
  } else if (!strictDecimalPattern.test(montoGarantias)) {
    errors.push(`${labelPrefix} ${index + 1}: monto de garantías solo acepta números sin espacios.`);
  } else if (Number.isFinite(montoEvaluacion) && Number(montoGarantias) < montoEvaluacion) {
    errors.push(`${labelPrefix} ${index + 1}: monto de garantías debe ser igual o exceder el monto del plan de inversión.`);
  }

  const valorComercial = String(row.valor_comercial ?? '').trim();
  if (!valorComercial) {
    errors.push(`${labelPrefix} ${index + 1}: valor comercial es obligatorio.`);
  } else if (!strictDecimalPattern.test(valorComercial)) {
    errors.push(`${labelPrefix} ${index + 1}: valor comercial solo acepta números sin espacios.`);
  }

  const valorRealizacion = String(row.valor_realizacion ?? '').trim();
  if (valorRealizacion && !strictDecimalPattern.test(valorRealizacion)) {
    errors.push(`${labelPrefix} ${index + 1}: valor de realización solo acepta números sin espacios.`);
  }

  return true;
};

export const validateEvaluacionConsumoForm = (form, options = {}) => {
  const errors = [];
  const maxVecesSueldo = Number(options.maxVecesSueldo || 0);
  const requiereDiscrecionalidad = Boolean(options.requiereDiscrecionalidad);
  const montoEvaluacion = Number(form.monto || 0);
  const garantias = Array.isArray(form.garantias) ? form.garantias : [];
  const activeAvalSlots = getActiveAvalSlots(garantias);
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
    ['apalancamiento', 'Análisis: apalancamiento debe ser un número válido.'],
    ['capacidad_endeudamiento', 'Análisis: capacidad de endeudamiento debe ser un número válido.'],
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
    ['criterio_entorno', 'Debe ingresar el criterio de entorno.'],
    ['criterio_direccion', 'Debe ingresar el criterio de dirección.'],
    ['criterio_capacidad_pago', 'Debe ingresar el criterio de capacidad de pago.'],
    ['criterio_moral_pago', 'Debe ingresar el criterio de moral de pago.'],
    ['criterio_situacion_financiera', 'Debe ingresar el criterio de situación financiera.'],
    ['criterio_plan_inversion', 'Debe ingresar el criterio de plan de inversión.'],
    ['criterio_colaterales', 'Debe ingresar el criterio de colaterales.'],
    ['criterio_condiciones', 'Debe ingresar el criterio de condiciones.'],
  ];

  if (requiereDiscrecionalidad) {
    requiredFields.push(['motivos', 'Debe ingresar el motivo de discrecionalidad.']);
  }

  requiredFields.forEach(([field, message]) => {
    const value = form[field];
    if (value === null || value === undefined || String(value).trim() === '') {
      errors.push(message);
    }
  });

  if (!Array.isArray(form.ingresos) || form.ingresos.length === 0) {
    errors.push('Debe registrar al menos una fila en Ingresos Principales.');
  }

  garantias.forEach((row, index) => {
    validateGarantiaRow({
      row,
      index,
      errors,
      montoEvaluacion,
      labelPrefix: 'Garantía',
      expectedClass: isAvalGuarantee(row) ? AVAL_GARANTIA_VALUE : SIMPLE_GARANTIA_VALUE,
    });
  });

  if (activeAvalSlots.length > MAX_AVALES) {
    errors.push('Solo puede registrar hasta 3 avales por evaluación.');
  }

  const documentosAval = new Set();

  activeAvalSlots.forEach((slot) => {
    const aval = createAvalState((form.avales || [])[slot - 1] || {});
    const avalLabel = `Aval ${slot}`;
    const garantiasAval = garantias.filter((row) => (
      isAvalGuarantee(row)
      && normalizeAvalSlot(row?.aval_slot) === slot
    ));
    const documento = String(aval?.numero_documento || '').trim();
    const tipoDocumento = String(aval?.tipo_documento || 'DNI').toUpperCase() === 'CE' ? 'CE' : 'DNI';

    if (!aval.is_existing && !aval.manual_mode) {
      errors.push(`${avalLabel}: debe seleccionar un aval existente o registrar uno nuevo.`);
    }

    if (!documento) {
      errors.push(`${avalLabel}: documento es obligatorio.`);
    } else {
      const expectedLength = tipoDocumento === 'CE' ? 9 : 8;
      if (!/^\d+$/.test(documento) || documento.length !== expectedLength) {
        errors.push(`${avalLabel}: el documento debe tener ${expectedLength} dígitos.`);
      }

      const documentKey = `${tipoDocumento}:${documento}`;
      if (documentosAval.has(documentKey)) {
        errors.push(`${avalLabel}: no puede repetir el mismo aval dentro de una evaluación.`);
      }
      documentosAval.add(documentKey);
    }

    if (!String(aval?.nombres || '').trim()) errors.push(`${avalLabel}: nombres es obligatorio.`);
    if (!String(aval?.apellido_paterno || '').trim()) errors.push(`${avalLabel}: apellido paterno es obligatorio.`);
    if (!String(aval?.apellido_materno || '').trim()) errors.push(`${avalLabel}: apellido materno es obligatorio.`);
    if (!String(aval?.tipo_vivienda || '').trim()) errors.push(`${avalLabel}: tipo de vivienda es obligatorio.`);
    if (!String(aval?.telefono_movil || '').trim()) {
      errors.push(`${avalLabel}: teléfono móvil es obligatorio.`);
    } else if (!/^9\d{8}$/.test(String(aval.telefono_movil || '').trim())) {
      errors.push(`${avalLabel}: teléfono móvil debe comenzar con 9 y tener 9 dígitos.`);
    }

    const telefonoFijo = String(aval?.telefono_fijo || '').trim();
    if (telefonoFijo && !/^\d{8}$/.test(telefonoFijo)) {
      errors.push(`${avalLabel}: teléfono fijo debe tener 8 dígitos.`);
    }

    if (!String(aval?.referencia_domiciliaria || '').trim()) errors.push(`${avalLabel}: referencia domiciliaria es obligatoria.`);
    if (!String(aval?.tipoVia || '').trim()) errors.push(`${avalLabel}: tipo de vía es obligatorio.`);
    if (!String(aval?.nombreVia || '').trim()) errors.push(`${avalLabel}: nombre de vía es obligatorio.`);
    if (!String(aval?.numeroMzLt || '').trim()) errors.push(`${avalLabel}: N/MZ-LT es obligatorio.`);
    if (!String(aval?.urbanizacion || '').trim()) errors.push(`${avalLabel}: urbanización es obligatoria.`);
    if (!String(aval?.departamento || '').trim()) errors.push(`${avalLabel}: departamento es obligatorio.`);
    if (!String(aval?.provincia || '').trim()) errors.push(`${avalLabel}: provincia es obligatoria.`);
    if (!String(aval?.distrito || '').trim()) errors.push(`${avalLabel}: distrito es obligatorio.`);

    const hasValidGarantia = garantiasAval.some((row, garantiaIndex) => validateGarantiaRow({
      row,
      index: garantiaIndex,
      errors,
      montoEvaluacion,
      labelPrefix: `${avalLabel} - Garantía`,
      expectedClass: AVAL_GARANTIA_VALUE,
    }));

    if (!hasValidGarantia) {
      errors.push(`${avalLabel}: debe registrar al menos una garantía.`);
    }
  });

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

  const financialLimits = evaluateFinancialLimits(form);
  const ingresoNeto = Number(form.ingreso_neto);
  if (
    financialLimits.ingresoNetoInvalido
    || (activeAvalSlots.length > 0 && (!Number.isFinite(ingresoNeto) || ingresoNeto <= 0))
  ) {
    errors.push('El ingreso neto debe ser mayor que 0.00 luego de descontar los gastos de unidad familiar.');
  }

  if (financialLimits.apalancamientoExcedido) {
    errors.push('El apalancamiento no puede ser mayor a 10.00.');
  }

  if (financialLimits.capacidadEndeudamientoExcedida) {
    errors.push('La capacidad de endeudamiento no puede ser mayor a 87.00%.');
  }

  return errors;
};
