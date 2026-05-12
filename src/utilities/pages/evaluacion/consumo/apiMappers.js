/**
 * API ↔ Form data mappers.
 *
 * mapApiToForm: converts API response → form state
 * mapFormToPayload: converts form state → API request payload
 */
import { FREQUENCY_VALUE_MAP } from './calculations';
import { normalizeEvaluacionConsumoState } from './status';
import {
  SIMPLE_GARANTIA_VALUE, AVAL_GARANTIA_VALUE,
  normalizeAvalSlot, isAvalGuarantee,
  hasGarantiaContent, createGarantiaRow, getActiveAvalSlots,
} from './garantiaFactory';
import {
  createAvalState, buildAvalFullName, buildAvalDireccion,
} from './avalFactory';

const toNullableNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toStringValue = (value) => (value === null || value === undefined ? '' : String(value));

const resolveApiRate = (record = {}) => {
  if (record.propuesta !== null && record.propuesta !== undefined && record.propuesta !== '') {
    return record.propuesta;
  }

  if (record.tasa !== null && record.tasa !== undefined && record.tasa !== '') {
    return record.tasa;
  }

  return record.tasa_interes_solicitada;
};

const mapGarantiaFromApi = (row = {}, overrides = {}) => createGarantiaRow({
  client_id: row.client_id || (row.id != null ? `garantia-${row.id}` : undefined),
  garantia_id: row.garantia_id ? String(row.garantia_id) : '',
  moneda_id: row.moneda_id ? String(row.moneda_id) : '',
  clase_garantia: overrides.clase_garantia ?? row.clase_garantia,
  aval_slot: overrides.aval_slot,
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
});

const mapLegacyGarantiasSolicitante = (record = {}) => (
  Array.isArray(record.garantias)
    ? record.garantias.filter((row) => !isAvalGuarantee(row))
    : []
);

const mapLegacyAvales = (record = {}) => {
  const garantiaRows = Array.isArray(record.garantias)
    ? record.garantias.filter(isAvalGuarantee)
    : [];
  const legacyAval = record.aval || null;
  const legacyAvalId = record.aval_id || record.aval?.aval_id || record.aval?.id || '';

  if (!legacyAval && !legacyAvalId && garantiaRows.length === 0) return [];

  return [{
    ...(legacyAval || {}),
    aval_id: legacyAvalId ? String(legacyAvalId) : '',
    garantias: garantiaRows,
  }];
};

export const mapApiToForm = (record = {}) => {
  const normalizedState = normalizeEvaluacionConsumoState(record.estado);
  const tipoFrecuencia = record.tipo_frecuencia || '';
  const decisionRate = resolveApiRate(record);
  const ingresos = (record.ingresos || []).map((row) => ({
    tipo_ingreso_id: row.tipo_ingreso_id ? String(row.tipo_ingreso_id) : '',
    ingreso: row.ingreso != null ? String(row.ingreso) : '',
    veces_sueldo: row.veces_sueldo != null ? String(row.veces_sueldo) : '',
    monto_maximo_otorgar: Number(row.monto_maximo_otorgar || 0),
  }));

  const garantiaRows = Array.isArray(record.garantias_solicitante)
    ? record.garantias_solicitante
    : mapLegacyGarantiasSolicitante(record);
  const avalRows = Array.isArray(record.avales)
    ? record.avales
    : mapLegacyAvales(record);

  const garantias = [];

  garantiaRows.forEach((row) => {
    garantias.push(mapGarantiaFromApi(row, { clase_garantia: SIMPLE_GARANTIA_VALUE }));
  });

  avalRows.forEach((avalRow, avalIndex) => {
    const slot = avalIndex + 1;
    (Array.isArray(avalRow.garantias) ? avalRow.garantias : []).forEach((row) => {
      garantias.push(mapGarantiaFromApi(row, {
        clase_garantia: AVAL_GARANTIA_VALUE,
        aval_slot: slot,
      }));
    });
  });

  const avales = avalRows.map((avalRow) => createAvalState({
    ...avalRow,
    aval_id: avalRow.aval_id ? String(avalRow.aval_id) : '',
    selected_label: buildAvalFullName(avalRow),
    is_existing: Boolean(avalRow.aval_id),
    manual_mode: !avalRow.aval_id,
    direccion: avalRow.direccion || buildAvalDireccion(avalRow),
  }));
  const requiereAval = getActiveAvalSlots(garantias).length > 0;

  return {
    id: record.id,
    admision_id: record.admision_id ? String(record.admision_id) : '',
    categoria_id: record.categoria_id ? String(record.categoria_id) : '',
    antiguedad_laboral_texto: record.antiguedad_laboral_texto || '',
    plan_inversion: record.plan_inversion || '',
    moneda_id: record.moneda_id ? String(record.moneda_id) : '',
    garantias: garantias.length > 0 ? garantias : [createGarantiaRow()],
    monto: record.monto != null ? String(record.monto) : '',
    clase_prestamo_snapshot: record.clase_prestamo_snapshot || '',
    tipo_frecuencia: tipoFrecuencia,
    valor_frecuencia: FREQUENCY_VALUE_MAP[tipoFrecuencia] ?? (record.valor_frecuencia ? String(record.valor_frecuencia) : ''),
    numero_cuotas: record.numero_cuotas != null ? String(record.numero_cuotas) : '',
    propuesta: toStringValue(decisionRate),
    cuota: record.cuota != null ? String(record.cuota) : '',
    tasa: toStringValue(decisionRate),
    producto_id: record.producto_id ? String(record.producto_id) : '',
    expuesto_rcc: Boolean(record.expuesto_rcc),
    tasa_interes_solicitada: toStringValue(decisionRate),
    motivos: record.motivos || '',
    dentro_politica: record.dentro_politica !== undefined ? Boolean(record.dentro_politica) : true,
    requiere_discrecionalidad: Boolean(record.requiere_discrecionalidad),
    desviaciones: Array.isArray(record.desviaciones) ? record.desviaciones : [],
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
    requiere_aval: requiereAval,
    avales,
  };
};

const serializeGarantiaRow = (row = {}, claseGarantia = SIMPLE_GARANTIA_VALUE) => ({
  garantia_id: row?.garantia_id ? Number(row.garantia_id) : null,
  moneda_id: row?.moneda_id ? Number(row.moneda_id) : null,
  clase_garantia: claseGarantia,
  documento_garantia: String(row?.documento_garantia || '').trim(),
  tipo_garantia: String(row?.tipo_garantia || '').trim(),
  descripcion: String(row?.descripcion || '').trim(),
  direccion: String(row?.direccion || '').trim(),
  usar_direccion_solicitante: Boolean(row?.usar_direccion_solicitante),
  monto_garantias: String(row?.monto_garantias ?? '').trim(),
  valor_comercial: String(row?.valor_comercial ?? '').trim(),
  valor_realizacion: String(row?.valor_realizacion ?? '').trim() || null,
  ficha_registral: String(row?.ficha_registral || '').trim() || null,
  fecha_ultima_evaluacion: String(row?.fecha_ultima_evaluacion || '').trim() || null,
});

export const mapFormToPayload = (form = {}) => {
  const garantias = Array.isArray(form.garantias) ? form.garantias : [];
  const activeSlots = getActiveAvalSlots(garantias);
  const garantiasSolicitante = garantias
    .filter((row) => !isAvalGuarantee(row))
    .map((row) => serializeGarantiaRow(row, SIMPLE_GARANTIA_VALUE))
    .filter(hasGarantiaContent);
  const avales = activeSlots.map((slot) => {
    const aval = createAvalState((form.avales || [])[slot - 1] || {});

    return {
      aval_id: aval?.aval_id ? Number(aval.aval_id) : null,
      es_carnet_extranjeria: aval?.tipo_documento === 'CE',
      numero_documento: String(aval?.numero_documento || '').trim(),
      nombres: String(aval?.nombres || '').trim(),
      apellido_paterno: String(aval?.apellido_paterno || '').trim(),
      apellido_materno: String(aval?.apellido_materno || '').trim(),
      tipo_vivienda: String(aval?.tipo_vivienda || '').trim(),
      telefono_fijo: String(aval?.telefono_fijo || '').trim() || null,
      telefono_movil: String(aval?.telefono_movil || '').trim(),
      referencia_domiciliaria: String(aval?.referencia_domiciliaria || '').trim(),
      tipoVia: String(aval?.tipoVia || '').trim(),
      nombreVia: String(aval?.nombreVia || '').trim(),
      numeroMzLt: String(aval?.numeroMzLt || '').trim(),
      urbanizacion: String(aval?.urbanizacion || '').trim(),
      direccion: String(aval?.direccion || buildAvalDireccion(aval)).trim() || null,
      departamento: String(aval?.departamento || '').trim(),
      provincia: String(aval?.provincia || '').trim(),
      distrito: String(aval?.distrito || '').trim(),
      garantias: garantias
        .filter((row) => isAvalGuarantee(row) && normalizeAvalSlot(row?.aval_slot) === slot)
        .map((row) => serializeGarantiaRow(row, AVAL_GARANTIA_VALUE)),
    };
  });
  const requiereAval = activeSlots.length > 0;

  return {
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
    garantias_solicitante: garantiasSolicitante,
    avales,
    requiere_aval: requiereAval,
    ingresos: (form.ingresos || []).map((row) => ({
      tipo_ingreso_id: Number(row.tipo_ingreso_id),
      ingreso: Number(row.ingreso),
      veces_sueldo: Number(row.veces_sueldo),
    })),
  };
};
