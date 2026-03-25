import { findTipoIngresoIdsByKey, TIPO_INGRESO_KEYS } from './tipoIngreso';

export const FREQUENCY_VALUE_MAP = {
  SEMANAL: 4,
  CATORCENAL: 2,
  MENSUAL: 1,
};

export const OTROS_INGRESOS_UTILIDAD_MAX_SHARE = 0.6;
export const OTROS_INGRESOS_UTILIDAD_LIMIT_EXCEEDED_MESSAGE = 'Otros ingresos: la utilidad calculada supera el 60% permitido del ingreso total en ingresos principales. Debe elegir otro tipo de evaluación.';

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const isBlank = (value) => value === '' || value === null || value === undefined;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeVecesSueldo = (value, maxVecesSueldo) => {
  const maximo = Number(maxVecesSueldo);
  if (isBlank(value)) {
    return Number.isFinite(maximo) && maximo > 0 ? String(maximo) : '';
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : '';
};

const hasLegacyOtrosIngresosOnly = (form = {}) => (
  !isBlank(form?.otros_ingresos_tipo_negocio)
  && isBlank(form?.actividad_no_sensible_id)
  && isBlank(form?.otros_ingresos_ventas)
);

export const hasCatalogOtrosIngresosFlow = (form = {}) => {
  if (hasLegacyOtrosIngresosOnly(form)) {
    return false;
  }

  return [
    form?.actividad_no_sensible_id,
    form?.otros_ingresos_ventas,
    form?.otros_ingresos_gasto,
    form?.otros_ingresos_costo,
    form?.otros_ingresos_utilidad,
  ].some((value) => !isBlank(value));
};

export const recalculateIngresos = (rows = []) => {
  const safeRows = Array.isArray(rows) ? rows : [];
  let ingresoTotal = 0;
  let montoMaximoTotal = 0;

  const mapped = safeRows.map((row) => {
    const ingreso = toNumber(row.ingreso);
    const veces = toNumber(row.veces_sueldo);
    const maximo = round2(ingreso * veces);

    ingresoTotal += ingreso;
    montoMaximoTotal += maximo;

    return {
      ...row,
      ingreso: row.ingreso,
      veces_sueldo: row.veces_sueldo,
      monto_maximo_otorgar: maximo,
    };
  });

  return {
    rows: mapped,
    ingresoTotal: round2(ingresoTotal),
    montoMaximoTotal: round2(montoMaximoTotal),
  };
};

export const calculateLoan = (credito, interesPercent, cuotas) => {
  const principal = parseFloat(credito);
  const tasaInteres = parseFloat(interesPercent);
  const periods = parseInt(cuotas, 10);

  if (Number.isNaN(principal) || Number.isNaN(tasaInteres) || Number.isNaN(periods) || periods <= 0) {
    return {
      total: '',
      cuota: '',
      percentTotal: '',
      interesGenerado: '',
      montoDeOtros: '',
      otrosPorCuota: [],
    };
  }

  const paso1 = round2(principal * 0.01);
  const sumaInicial = round2(principal + paso1);
  const interesCalculado = round2(sumaInicial * (tasaInteres / 100));
  const totalAPagar = round2(sumaInicial + interesCalculado);

  const cuota = round2(totalAPagar / periods);
  const totalAPagarReal = round2(cuota * periods);

  const interesDelCapital = round2(principal * (tasaInteres / 100));
  const montoDeOtros = round2(totalAPagarReal - principal - interesDelCapital);

  const otrosPorCuota = [];
  const otrosUnit = periods > 0 ? round2(montoDeOtros / periods) : 0;
  let acumulado = 0;

  for (let i = 0; i < periods; i += 1) {
    if (i < periods - 1) {
      otrosPorCuota.push(otrosUnit);
      acumulado = round2(acumulado + otrosUnit);
    } else {
      otrosPorCuota.push(round2(montoDeOtros - acumulado));
    }
  }

  const percentTotal = `${((totalAPagarReal / principal) * 100).toFixed(2)}%`;

  return {
    total: totalAPagarReal.toFixed(2),
    cuota: cuota.toFixed(2),
    percentTotal,
    interesGenerado: interesDelCapital.toFixed(2),
    montoDeOtros: montoDeOtros.toFixed(2),
    otrosPorCuota,
  };
};

export const resolveNivelDiscrecionalidad = (
  nivelesDiscrecionalidad = [],
  { tipoEvaluacion = 'CONSUMO', monto, numeroCuotas, tasa } = {}
) => {
  const montoValue = Number(monto);
  const cuotasValue = Number(numeroCuotas);
  const tasaValue = Number(tasa);
  const tipo = String(tipoEvaluacion || '').trim().toUpperCase();

  if (!Number.isFinite(montoValue) || !Number.isFinite(cuotasValue) || !Number.isFinite(tasaValue) || !tipo) {
    return null;
  }

  return (nivelesDiscrecionalidad || []).find((item) => {
    const montoMin = Number(item?.monto_min);
    const montoMax = Number(item?.monto_max);
    const cuotasMin = Number(item?.cuotas_min);
    const cuotasMax = Number(item?.cuotas_max);
    const tasaMin = Number(item?.tasa_min);
    const tasaMax = Number(item?.tasa_max);

    return (
      String(item?.tipo_evaluacion || '').trim().toUpperCase() === tipo
      && Number.isFinite(montoMin)
      && Number.isFinite(montoMax)
      && Number.isFinite(cuotasMin)
      && Number.isFinite(cuotasMax)
      && Number.isFinite(tasaMin)
      && Number.isFinite(tasaMax)
      && montoValue >= montoMin
      && montoValue <= montoMax
      && cuotasValue >= cuotasMin
      && cuotasValue <= cuotasMax
      && tasaValue >= tasaMin
      && tasaValue <= tasaMax
    );
  }) || null;
};

export const calculateHouseholdSubtotal = (form = {}) => {
  const values = [
    form?.gasto_alimentacion,
    form?.gasto_servicios,
    form?.gasto_educacion,
    form?.gasto_movilidad,
    form?.gasto_imprevistos,
  ];

  if (values.every(isBlank)) {
    return '';
  }

  const total = values.reduce((sum, value) => sum + toNumber(value), 0);
  return round2(total).toFixed(2);
};

export const calculateIngresoNeto = (ingresoTotalPrincipal, otrosIngresosUtilidad) => {
  const ingresoTotalNumero = isBlank(ingresoTotalPrincipal) ? null : Number(ingresoTotalPrincipal);
  const utilidadNumero = isBlank(otrosIngresosUtilidad) ? 0 : Number(otrosIngresosUtilidad);
  const hasIngresoTotal = Number.isFinite(ingresoTotalNumero) && ingresoTotalNumero > 0;
  const hasUtilidad = !isBlank(otrosIngresosUtilidad) && Number.isFinite(utilidadNumero);

  if (!hasIngresoTotal && !hasUtilidad) {
    return '';
  }

  const total = (hasIngresoTotal ? ingresoTotalNumero : 0) + (hasUtilidad ? utilidadNumero : 0);
  return round2(total).toFixed(2);
};

export const calculateDependienteFormalIngreso = (form = {}) => {
  const boletaFields = [
    form?.boleta_basica,
    form?.boleta_variable_mes_1,
    form?.boleta_variable_mes_2,
    form?.boleta_variable_mes_3,
  ];

  if (boletaFields.every(isBlank)) {
    return '';
  }

  const promedioVariables = round2((
    toNumber(form?.boleta_variable_mes_1)
    + toNumber(form?.boleta_variable_mes_2)
    + toNumber(form?.boleta_variable_mes_3)
  ) / 3);

  return round2(toNumber(form?.boleta_basica) + promedioVariables).toFixed(2);
};

export const calculateOtrosIngresosCosto = (ventas, margenMaximo) => {
  if (isBlank(ventas) || isBlank(margenMaximo)) {
    return '';
  }

  const ventasNumero = Number(ventas);
  const margenNumero = Number(margenMaximo);

  if (!Number.isFinite(ventasNumero) || !Number.isFinite(margenNumero)) {
    return '';
  }

  return round2(ventasNumero * ((100 - margenNumero) / 100)).toFixed(2);
};

export const calculateOtrosIngresosUtilidad = (ventas, costo, gasto) => {
  if (isBlank(ventas) || isBlank(costo)) {
    return '';
  }

  const ventasNumero = Number(ventas);
  const costoNumero = Number(costo);
  const gastoNumero = isBlank(gasto) ? 0 : Number(gasto);

  if (!Number.isFinite(ventasNumero) || !Number.isFinite(costoNumero) || !Number.isFinite(gastoNumero)) {
    return '';
  }

  return round2(ventasNumero - costoNumero - gastoNumero).toFixed(2);
};

export const evaluateOtrosIngresosUtilidadLimit = ({
  ingresoTotalPrincipal,
  utilidad,
} = {}) => {
  const hasUtilidad = !isBlank(utilidad);
  const utilidadNumero = hasUtilidad ? Number(utilidad) : null;
  const ingresoTotalNumero = isBlank(ingresoTotalPrincipal) ? 0 : Number(ingresoTotalPrincipal);

  if (!hasUtilidad || !Number.isFinite(utilidadNumero) || !Number.isFinite(ingresoTotalNumero)) {
    return {
      ingresoTotalPrincipal: Number.isFinite(ingresoTotalNumero) ? round2(ingresoTotalNumero) : 0,
      limiteUtilidadOtrosIngresos: Number.isFinite(ingresoTotalNumero)
        ? round2(ingresoTotalNumero * OTROS_INGRESOS_UTILIDAD_MAX_SHARE)
        : 0,
      utilidadOtrosIngresos: Number.isFinite(utilidadNumero) ? round2(utilidadNumero) : null,
      hasUtilidadCalculable: false,
      excedeLimiteUtilidadOtrosIngresos: false,
    };
  }

  const ingresoTotalPrincipalNormalizado = round2(ingresoTotalNumero);
  const limiteUtilidadOtrosIngresos = round2(
    ingresoTotalPrincipalNormalizado * OTROS_INGRESOS_UTILIDAD_MAX_SHARE
  );
  const utilidadOtrosIngresos = round2(utilidadNumero);

  return {
    ingresoTotalPrincipal: ingresoTotalPrincipalNormalizado,
    limiteUtilidadOtrosIngresos,
    utilidadOtrosIngresos,
    hasUtilidadCalculable: true,
    excedeLimiteUtilidadOtrosIngresos: utilidadOtrosIngresos > limiteUtilidadOtrosIngresos,
  };
};

export const deriveEvaluacionConsumoFields = (
  form,
  { tiposIngreso = [], maxVecesSueldo = 0 } = {}
) => {
  const tipoFrecuencia = String(form?.tipo_frecuencia || '').trim();
  const propuestaRaw = form?.propuesta;
  const hasPropuesta = !(propuestaRaw === '' || propuestaRaw === null || propuestaRaw === undefined);
  const cuota = calculateLoan(form?.monto, propuestaRaw, form?.numero_cuotas).cuota;
  const totalGastoUnidad = calculateHouseholdSubtotal(form);
  const gastoObligaciones = !isBlank(form?.sumatoria_cuotas_consumo)
    ? String(form.sumatoria_cuotas_consumo)
    : (isBlank(form?.gasto_obligaciones) ? '' : String(form.gasto_obligaciones));
  const gastoOtrosEgresos = !isBlank(form?.sumatoria_cuotas_pyme)
    ? String(form.sumatoria_cuotas_pyme)
    : (isBlank(form?.gasto_otros_egresos) ? '' : String(form.gasto_otros_egresos));
  const dependienteFormalIngreso = calculateDependienteFormalIngreso(form);
  const dependienteFormalIds = new Set(findTipoIngresoIdsByKey(
    tiposIngreso,
    TIPO_INGRESO_KEYS.DEPENDIENTE_FORMAL
  ));
  const hasCatalogOtrosIngresos = hasCatalogOtrosIngresosFlow(form);
  const otrosIngresosMargen = form?.otros_ingresos_margen_maximo_snapshot;
  const hasOtrosIngresosIdentity = !isBlank(form?.actividad_no_sensible_id);
  const hasOtrosIngresosVentas = !isBlank(form?.otros_ingresos_ventas);
  let otrosIngresosCosto = form?.otros_ingresos_costo ?? '';
  let otrosIngresosUtilidad = form?.otros_ingresos_utilidad ?? '';

  if (hasCatalogOtrosIngresos) {
    if (hasOtrosIngresosIdentity && hasOtrosIngresosVentas && !isBlank(otrosIngresosMargen)) {
      otrosIngresosCosto = calculateOtrosIngresosCosto(form?.otros_ingresos_ventas, otrosIngresosMargen);
      otrosIngresosUtilidad = calculateOtrosIngresosUtilidad(
        form?.otros_ingresos_ventas,
        otrosIngresosCosto,
        form?.otros_ingresos_gasto
      );
    } else {
      otrosIngresosCosto = '';
      otrosIngresosUtilidad = '';
    }
  }

  const ingresosDerivados = recalculateIngresos((form?.ingresos || []).map((row) => {
    const tipoIngresoId = Number(row?.tipo_ingreso_id);
    const nextVecesSueldo = normalizeVecesSueldo(row?.veces_sueldo, maxVecesSueldo);

    if (!dependienteFormalIds.has(tipoIngresoId)) {
      return {
        ...row,
        veces_sueldo: nextVecesSueldo,
      };
    }

    return {
      ...row,
      ingreso: dependienteFormalIngreso,
      veces_sueldo: nextVecesSueldo,
    };
  }));
  const ingresoNeto = calculateIngresoNeto(
    ingresosDerivados.ingresoTotal,
    otrosIngresosUtilidad
  );

  return {
    ...form,
    valor_frecuencia: tipoFrecuencia ? (FREQUENCY_VALUE_MAP[tipoFrecuencia] ?? '') : '',
    cuota,
    tasa_interes_solicitada: hasPropuesta ? String(propuestaRaw) : '',
    ingresos: ingresosDerivados.rows,
    otros_ingresos_costo: otrosIngresosCosto,
    otros_ingresos_utilidad: otrosIngresosUtilidad,
    ingreso_neto: ingresoNeto,
    total_gasto_unidad: totalGastoUnidad,
    gasto_obligaciones: gastoObligaciones,
    gasto_otros_egresos: gastoOtrosEgresos,
  };
};
