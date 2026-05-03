export const FICSULLANA_ENTITY = 'FICSULLANA';
export const LOSS_RATING = 4;

let debtRowSequence = 0;

export const calificacionClassMap = {
  0: 'border-green-200 bg-green-50 text-green-700',
  1: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  2: 'border-orange-200 bg-orange-50 text-orange-700',
  3: 'border-red-200 bg-red-50 text-red-700',
  4: 'border-slate-900 bg-slate-900 text-white',
};

export const calificacionLabelMap = {
  0: 'NORMAL',
  1: 'CPP',
  2: 'DEFICIENTE',
  3: 'DUDOSO',
  4: 'PÉRDIDA',
};

export const baseFieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-fic-red focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400';
export const selectFieldClass = `${baseFieldClass} cursor-pointer appearance-none pr-10`;
export const labelClass = 'mb-1.5 block text-[11px] font-black uppercase tracking-[0.08em] text-slate-500';
export const sectionCardClass = 'rounded-2xl border border-slate-200 bg-slate-50/80 p-4';
export const calificacionToneClassMap = {
  0: 'border-green-300 focus:border-green-400 focus:ring-green-100',
  1: 'border-amber-300 focus:border-amber-400 focus:ring-amber-100',
  2: 'border-orange-300 focus:border-orange-400 focus:ring-orange-100',
  3: 'border-red-300 focus:border-red-400 focus:ring-red-100',
  4: 'border-slate-400 focus:border-slate-600 focus:ring-slate-200',
};

export const sanitizeEntityNameInput = (value = '') => (
  String(value)
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L} ]/gu, '')
    .toUpperCase()
);

export const normalizeEntityName = (value = '') => (
  sanitizeEntityNameInput(value).trim().replace(/\s+/g, ' ')
);

const toNumberOrZero = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const buildDebtRowKey = () => {
  debtRowSequence += 1;
  return `deuda-row-${debtRowSequence}`;
};

const ensureDebtRowKey = (row) => row?.__rowKey || buildDebtRowKey();

export const buildBaseRow = () => ({
  persona_tipo: 'TITULAR',
  dni_relacionado: '',
  nombre_entidad: '',
  es_tienda_departamento: false,
  tipo_credito: 'CONSUMO',
  calificacion_banco: '',
  dias_atraso: '',
  saldo_capital: '',
  linea_credito: 0,
  plazo_pendiente: '',
  monto_cuota: '',
  frecuencia_pago: '',
  fecha_pago: '',
  porcentaje_cancelacion: 0,
});

export const normalizeCalificacion = (value) => {
  if (value === '' || value === null || value === undefined) return '';

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : '';
};

export const shouldEnableDiasAtraso = (calificacion) => (
  calificacion !== '' && Number(calificacion) >= 1
);

export const isLossRating = (calificacion) => Number(calificacion) === LOSS_RATING;

export const sanitizeDebtRow = (row) => {
  const nextRow = {
    ...buildBaseRow(),
    ...row,
    __rowKey: ensureDebtRowKey(row),
    nombre_entidad: sanitizeEntityNameInput(row?.nombre_entidad ?? ''),
    calificacion_banco: normalizeCalificacion(row?.calificacion_banco),
    es_tienda_departamento: Boolean(row?.es_tienda_departamento),
  };

  if (!nextRow.es_tienda_departamento) {
    nextRow.linea_credito = 0;
  }

  nextRow.dias_atraso = shouldEnableDiasAtraso(nextRow.calificacion_banco)
    ? (row?.dias_atraso ?? '')
    : '';

  if (isLossRating(nextRow.calificacion_banco)) {
    nextRow.monto_cuota = '';
    nextRow.frecuencia_pago = '';
    nextRow.fecha_pago = '';
  }

  return nextRow;
};

export const isProtectedDebtRow = (row, isRcsClient) => (
  Boolean(isRcsClient)
  && row?.persona_tipo === 'TITULAR'
  && normalizeEntityName(row?.nombre_entidad) === FICSULLANA_ENTITY
);

export const areDebtRowsEqual = (leftRow = {}, rightRow = {}) => {
  const safeLeftRow = leftRow || {};
  const safeRightRow = rightRow || {};

  return (
    safeLeftRow.__rowKey === safeRightRow.__rowKey
    && safeLeftRow.persona_tipo === safeRightRow.persona_tipo
    && safeLeftRow.dni_relacionado === safeRightRow.dni_relacionado
    && safeLeftRow.nombre_entidad === safeRightRow.nombre_entidad
    && Boolean(safeLeftRow.es_tienda_departamento) === Boolean(safeRightRow.es_tienda_departamento)
    && safeLeftRow.tipo_credito === safeRightRow.tipo_credito
    && String(safeLeftRow.calificacion_banco ?? '') === String(safeRightRow.calificacion_banco ?? '')
    && String(safeLeftRow.dias_atraso ?? '') === String(safeRightRow.dias_atraso ?? '')
    && String(safeLeftRow.saldo_capital ?? '') === String(safeRightRow.saldo_capital ?? '')
    && String(safeLeftRow.linea_credito ?? '') === String(safeRightRow.linea_credito ?? '')
    && String(safeLeftRow.plazo_pendiente ?? '') === String(safeRightRow.plazo_pendiente ?? '')
    && String(safeLeftRow.monto_cuota ?? '') === String(safeRightRow.monto_cuota ?? '')
    && String(safeLeftRow.frecuencia_pago ?? '') === String(safeRightRow.frecuencia_pago ?? '')
    && String(safeLeftRow.fecha_pago ?? '') === String(safeRightRow.fecha_pago ?? '')
    && String(safeLeftRow.porcentaje_cancelacion ?? '') === String(safeRightRow.porcentaje_cancelacion ?? '')
  );
};

const reuseDebtRowIfUnchanged = (previousRow, nextRow) => (
  areDebtRowsEqual(previousRow, nextRow) ? previousRow : nextRow
);

export const normalizeRowsByRules = ({
  rows,
  tipoPrestamo,
  tipoSolicitante,
  solicitanteDni,
  capitalPendienteFicsullana,
}) => {
  const isRcsClient = tipoPrestamo === 'RCS' && tipoSolicitante === 'CLIENTE';

  const normalizedRows = (Array.isArray(rows) ? rows : []).map((row) => {
    const personaTipo = row?.persona_tipo === 'AVAL' ? 'AVAL' : 'TITULAR';
    const isTienda = Boolean(row?.es_tienda_departamento);

    const nextRow = sanitizeDebtRow({
      ...buildBaseRow(),
      ...row,
      persona_tipo: personaTipo,
      dni_relacionado: personaTipo === 'TITULAR' ? (solicitanteDni || '') : (row?.dni_relacionado || ''),
      tipo_credito: row?.tipo_credito === 'PYME' ? 'PYME' : 'CONSUMO',
      es_tienda_departamento: isTienda,
      linea_credito: isTienda ? (row?.linea_credito ?? 0) : 0,
      porcentaje_cancelacion: tipoPrestamo === 'RCS' ? (row?.porcentaje_cancelacion ?? 0) : null,
    });

    return reuseDebtRowIfUnchanged(row, nextRow);
  });

  if (!isRcsClient) {
    return normalizedRows;
  }

  const protectedIndex = normalizedRows.findIndex((row) => isProtectedDebtRow(row, true));
  const currentProtectedRow = protectedIndex >= 0 ? normalizedRows[protectedIndex] : null;
  const currentDate = new Date().toISOString().slice(0, 10);

  const protectedDebt = reuseDebtRowIfUnchanged(currentProtectedRow, sanitizeDebtRow({
    ...buildBaseRow(),
    ...(currentProtectedRow || {}),
    persona_tipo: 'TITULAR',
    dni_relacionado: solicitanteDni || '',
    nombre_entidad: FICSULLANA_ENTITY,
    tipo_credito: 'CONSUMO',
    calificacion_banco: currentProtectedRow?.calificacion_banco ?? 0,
    dias_atraso: currentProtectedRow?.dias_atraso ?? '',
    es_tienda_departamento: false,
    linea_credito: 0,
    saldo_capital: toNumberOrZero(capitalPendienteFicsullana),
    plazo_pendiente: currentProtectedRow?.plazo_pendiente || 1,
    monto_cuota: currentProtectedRow?.monto_cuota || 0.01,
    frecuencia_pago: currentProtectedRow?.frecuencia_pago || 'MENSUAL',
    fecha_pago: currentProtectedRow?.fecha_pago || currentDate,
    porcentaje_cancelacion: currentProtectedRow?.porcentaje_cancelacion ?? 0,
  }));

  if (protectedIndex >= 0) {
    const nextRows = [...normalizedRows];
    nextRows[protectedIndex] = protectedDebt;
    return nextRows;
  }

  return [...normalizedRows, protectedDebt];
};

export const shouldReplaceDebtRows = (previousRows, nextRows) => (
  previousRows.length !== nextRows.length
  || previousRows.some((row, index) => row !== nextRows[index])
);
