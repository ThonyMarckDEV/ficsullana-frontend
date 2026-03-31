import { FREQUENCY_VALUE_MAP } from './calculations';
import { normalizeEvaluacionConsumoState } from './status';

const toNullableNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toStringValue = (value) => (value === null || value === undefined ? '' : String(value));

export const parseRangoTasa = (rango = '') => {
  const clean = String(rango || '')
    .replace(',', '.')
    .replace(/\s+/g, ' ')
    .trim();

  const matches = clean.match(/\d+(\.\d+)?/g) || [];
  if (matches.length < 2) {
    return { min: null, max: null, label: clean || 'N/A' };
  }

  const min = Number(matches[0]);
  const max = Number(matches[1]);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: null, max: null, label: clean || 'N/A' };
  }

  return {
    min,
    max,
    label: `${min}% - ${max}%`,
  };
};

export const createIngresoRow = () => ({
  tipo_ingreso_id: '',
  ingreso: '',
  veces_sueldo: '',
  monto_maximo_otorgar: 0,
});

export const createGarantiaRow = (overrides = {}) => ({
  moneda_id: '',
  clase_garantia: '',
  documento_garantia: '',
  tipo_garantia: '',
  descripcion: '',
  direccion: '',
  usar_direccion_solicitante: false,
  monto_garantias: '',
  valor_comercial: '',
  valor_realizacion: '',
  ficha_registral: '',
  fecha_ultima_evaluacion: '',
  ...overrides,
});

export const mapApiToForm = (record) => {
  const normalizedState = normalizeEvaluacionConsumoState(record.estado);
  const tipoFrecuencia = record.tipo_frecuencia || '';
  const ingresos = (record.ingresos || []).map((row) => ({
    tipo_ingreso_id: row.tipo_ingreso_id ? String(row.tipo_ingreso_id) : '',
    ingreso: row.ingreso !== null && row.ingreso !== undefined ? String(row.ingreso) : '',
    veces_sueldo: row.veces_sueldo !== null && row.veces_sueldo !== undefined ? String(row.veces_sueldo) : '',
    monto_maximo_otorgar: Number(row.monto_maximo_otorgar || 0),
  }));
  const garantias = Array.isArray(record.garantias) && record.garantias.length > 0
    ? record.garantias.map((row) => createGarantiaRow({
      moneda_id: row.moneda_id ? String(row.moneda_id) : '',
      clase_garantia: row.clase_garantia || '',
      documento_garantia: row.documento_garantia || '',
      tipo_garantia: row.tipo_garantia || '',
      descripcion: row.descripcion || '',
      direccion: row.direccion || '',
      usar_direccion_solicitante: Boolean(row.usar_direccion_solicitante),
      monto_garantias: toStringValue(row.monto_garantias),
      valor_comercial: toStringValue(row.valor_comercial),
      valor_realizacion: toStringValue(row.valor_realizacion),
      ficha_registral: row.ficha_registral || '',
      fecha_ultima_evaluacion: row.fecha_ultima_evaluacion || '',
    }))
    : [createGarantiaRow()];

  return {
    id: record.id,
    admision_id: record.admision_id ? String(record.admision_id) : '',
    categoria_id: record.categoria_id ? String(record.categoria_id) : '',
    antiguedad_laboral_texto: record.antiguedad_laboral_texto || '',
    plan_inversion: record.plan_inversion || '',
    moneda_id: record.moneda_id ? String(record.moneda_id) : '',
    garantias,
    monto: record.monto !== null && record.monto !== undefined ? String(record.monto) : '',
    clase_prestamo_snapshot: record.clase_prestamo_snapshot || '',
    tipo_frecuencia: tipoFrecuencia,
    valor_frecuencia: FREQUENCY_VALUE_MAP[tipoFrecuencia] ?? (record.valor_frecuencia ? String(record.valor_frecuencia) : ''),
    numero_cuotas: record.numero_cuotas !== null && record.numero_cuotas !== undefined ? String(record.numero_cuotas) : '',
    propuesta: record.propuesta !== null && record.propuesta !== undefined ? String(record.propuesta) : '',
    cuota: record.cuota !== null && record.cuota !== undefined ? String(record.cuota) : '',
    tasa: record.tasa !== null && record.tasa !== undefined ? String(record.tasa) : '',
    producto_id: record.producto_id ? String(record.producto_id) : '',
    expuesto_rcc: Boolean(record.expuesto_rcc),
    tasa_interes_solicitada: record.tasa_interes_solicitada !== null && record.tasa_interes_solicitada !== undefined
      ? String(record.tasa_interes_solicitada)
      : '',
    motivos: record.motivos || '',
    estado: normalizedState,
    decision_comentario: record.decision_comentario || '',
    solicitante_nombre_snapshot: record.solicitante_nombre_snapshot || '',
    solicitante_dni_snapshot: record.solicitante_dni_snapshot || '',
    direccion_snapshot: record.direccion_snapshot || '',
    distrito_snapshot: record.distrito_snapshot || '',
    provincia_snapshot: record.provincia_snapshot || '',
    departamento_snapshot: record.departamento_snapshot || '',
    fecha_evaluacion: record.fecha_evaluacion,
    ingresos,
    actividad_no_sensible_id: record.actividad_no_sensible_id ? String(record.actividad_no_sensible_id) : '',
    otros_ingresos_sector_snapshot: record.otros_ingresos_sector_snapshot || '',
    otros_ingresos_actividad_snapshot: record.otros_ingresos_actividad_snapshot || '',
    otros_ingresos_margen_maximo_snapshot: toStringValue(record.otros_ingresos_margen_maximo_snapshot),
    otros_ingresos_tipo_negocio: record.otros_ingresos_tipo_negocio || '',
    otros_ingresos_ventas: toStringValue(record.otros_ingresos_ventas),
    otros_ingresos_costo: toStringValue(record.otros_ingresos_costo),
    otros_ingresos_gasto: toStringValue(record.otros_ingresos_gasto),
    otros_ingresos_utilidad: toStringValue(record.otros_ingresos_utilidad),
    ingreso_neto: toStringValue(record.ingreso_neto),
    sumatoria_cuotas: toStringValue(record.sumatoria_cuotas),
    sumatoria_cuotas_consumo: toStringValue(record.sumatoria_cuotas_consumo),
    sumatoria_cuotas_pyme: toStringValue(record.sumatoria_cuotas_pyme),
    deuda_total: toStringValue(record.deuda_total),
    numero_ifis: toStringValue(record.numero_ifis),
    apalancamiento: toStringValue(record.apalancamiento),
    capacidad_endeudamiento: toStringValue(record.capacidad_endeudamiento),
    boleta_basica: toStringValue(record.boleta_basica),
    boleta_variable_mes_1: toStringValue(record.boleta_variable_mes_1),
    boleta_variable_mes_2: toStringValue(record.boleta_variable_mes_2),
    boleta_variable_mes_3: toStringValue(record.boleta_variable_mes_3),
    gasto_alimentacion: toStringValue(record.gasto_alimentacion),
    gasto_servicios: toStringValue(record.gasto_servicios),
    gasto_educacion: toStringValue(record.gasto_educacion),
    gasto_movilidad: toStringValue(record.gasto_movilidad),
    gasto_imprevistos: toStringValue(record.gasto_imprevistos),
    total_gasto_unidad: toStringValue(record.total_gasto_unidad),
    gasto_obligaciones: toStringValue(record.gasto_obligaciones),
    gasto_otros_egresos: toStringValue(record.gasto_otros_egresos),
    criterio_entorno: record.criterio_entorno || '',
    criterio_direccion: record.criterio_direccion || '',
    criterio_capacidad_pago: record.criterio_capacidad_pago || '',
    criterio_moral_pago: record.criterio_moral_pago || '',
    criterio_situacion_financiera: record.criterio_situacion_financiera || '',
    criterio_plan_inversion: record.criterio_plan_inversion || '',
    criterio_colaterales: record.criterio_colaterales || '',
    criterio_condiciones: record.criterio_condiciones || '',
  };
};

export const mapFormToPayload = (form) => ({
  admision_id: Number(form.admision_id),
  categoria_id: Number(form.categoria_id),
  antiguedad_laboral_texto: form.antiguedad_laboral_texto,
  plan_inversion: String(form.plan_inversion || '').trim(),
  moneda_id: Number(form.moneda_id),
  monto: Number(form.monto),
  tipo_frecuencia: form.tipo_frecuencia,
  numero_cuotas: Number(form.numero_cuotas),
  propuesta: Number(form.propuesta),
  producto_id: Number(form.producto_id),
  motivos: form.motivos,
  actividad_no_sensible_id: toNullableNumber(form.actividad_no_sensible_id),
  otros_ingresos_tipo_negocio: String(form.otros_ingresos_tipo_negocio || '').trim() || null,
  otros_ingresos_ventas: toNullableNumber(form.otros_ingresos_ventas),
  otros_ingresos_costo: toNullableNumber(form.otros_ingresos_costo),
  otros_ingresos_gasto: toNullableNumber(form.otros_ingresos_gasto),
  otros_ingresos_utilidad: toNullableNumber(form.otros_ingresos_utilidad),
  ingreso_neto: toNullableNumber(form.ingreso_neto),
  boleta_basica: toNullableNumber(form.boleta_basica),
  boleta_variable_mes_1: toNullableNumber(form.boleta_variable_mes_1),
  boleta_variable_mes_2: toNullableNumber(form.boleta_variable_mes_2),
  boleta_variable_mes_3: toNullableNumber(form.boleta_variable_mes_3),
  gasto_alimentacion: toNullableNumber(form.gasto_alimentacion),
  gasto_servicios: toNullableNumber(form.gasto_servicios),
  gasto_educacion: toNullableNumber(form.gasto_educacion),
  gasto_movilidad: toNullableNumber(form.gasto_movilidad),
  gasto_imprevistos: toNullableNumber(form.gasto_imprevistos),
  criterio_entorno: String(form.criterio_entorno || '').trim() || null,
  criterio_direccion: String(form.criterio_direccion || '').trim() || null,
  criterio_capacidad_pago: String(form.criterio_capacidad_pago || '').trim() || null,
  criterio_moral_pago: String(form.criterio_moral_pago || '').trim() || null,
  criterio_situacion_financiera: String(form.criterio_situacion_financiera || '').trim() || null,
  criterio_plan_inversion: String(form.criterio_plan_inversion || '').trim() || null,
  criterio_colaterales: String(form.criterio_colaterales || '').trim() || null,
  criterio_condiciones: String(form.criterio_condiciones || '').trim() || null,
  ingresos: (form.ingresos || []).map((row) => ({
    tipo_ingreso_id: Number(row.tipo_ingreso_id),
    ingreso: Number(row.ingreso),
    veces_sueldo: Number(row.veces_sueldo),
  })),
});