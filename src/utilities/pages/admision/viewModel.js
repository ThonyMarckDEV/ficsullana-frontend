import {
  getExceptionRuleName,
  getExceptionRules,
  stripSystemAlertPrefix,
} from 'utilities/pages/admision/exceptionRules';
import {
  ADMISION_COPY_COMMON,
  ADMISION_COPY_DETAIL_MODAL,
} from 'utilities/pages/admision/copy';

const CALIFICACION_LABELS = {
  0: 'NORMAL',
  1: 'PROBLEMAS POTENCIALES',
  2: 'DEFICIENTE',
  3: 'DUDOSO',
  4: 'PÉRDIDA',
};

export const buildFullName = (persona, type) => {
  if (!persona) return ADMISION_COPY_COMMON.FALLBACK.SIN_NOMBRE;
  if (type === 'CLIENTE') {
    return `${persona.nombre || ''} ${persona.apellidoPaterno || ''} ${persona.apellidoMaterno || ''}`.trim() || ADMISION_COPY_COMMON.FALLBACK.SIN_NOMBRE;
  }
  return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim() || ADMISION_COPY_COMMON.FALLBACK.SIN_NOMBRE;
};

export const formatDateTime = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export const formatDateOnly = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const buildReviewerName = (reviewer) => {
  if (!reviewer) return ADMISION_COPY_COMMON.FALLBACK.NO_REGISTRADO;
  if (reviewer.nombre_completo) return reviewer.nombre_completo;
  return reviewer.username || reviewer.email || ADMISION_COPY_COMMON.FALLBACK.NO_REGISTRADO;
};

export const toNumeric = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

export const formatMoney = (value) =>
  toNumeric(value).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const getCalificacionLabel = (value) => {
  if (value === '' || value === null || value === undefined) return 'SIN CALIFICACIÓN';
  const numericValue = Number(value);
  return CALIFICACION_LABELS[numericValue] || String(value);
};

export const getCalificacionTone = (value) => {
  const numericValue = Number(value);
  if (numericValue === 0) return 'green';
  if (numericValue === 1) return 'yellow';
  if (numericValue === 2) return 'orange';
  if (numericValue === 3) return 'red';
  if (numericValue === 4) return 'dark';
  return 'slate';
};

export const getExceptionStatusLabel = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return ADMISION_COPY_COMMON.FALLBACK.NA;
  return numericValue > 0
    ? ADMISION_COPY_DETAIL_MODAL.STATES.CON_EXCEPCION
    : ADMISION_COPY_DETAIL_MODAL.STATES.SIN_EXCEPCION;
};

export const buildAdmisionViewModel = (data) => {
  if (!data) {
    return {
      id: null,
      solicitante: ADMISION_COPY_COMMON.FALLBACK.NA,
      solicitanteDni: ADMISION_COPY_COMMON.FALLBACK.NA,
      asesor: ADMISION_COPY_COMMON.FALLBACK.NA,
      sede: ADMISION_COPY_COMMON.FALLBACK.NA,
      tipoPrestamo: ADMISION_COPY_COMMON.FALLBACK.NA,
      estado: ADMISION_COPY_COMMON.FALLBACK.NA,
      estadoExcepcion: ADMISION_COPY_COMMON.FALLBACK.NA,
      totalDeuda: '0.00',
      totalProtestos: '0.00',
      totalIfis: 0,
      totalCuota: '0.00',
      totalLineaCredito: '0.00',
      totalTiendas: 0,
      isProspecto: false,
      reglasExcepcion: [],
      reglasBloqueantes: [],
      selectedExceptionNames: [],
      motivoAsesor: ADMISION_COPY_COMMON.FALLBACK.SIN_MOTIVO,
      comentarioRevision: ADMISION_COPY_COMMON.FALLBACK.SIN_COMENTARIO_REVISION,
      comentarioFinanciero: ADMISION_COPY_COMMON.FALLBACK.SIN_COMENTARIO_REVISION,
      observacionAsesor: ADMISION_COPY_COMMON.FALLBACK.SIN_OBSERVACIONES,
      revisor: ADMISION_COPY_COMMON.FALLBACK.NO_REGISTRADO,
      revisadoAt: ADMISION_COPY_COMMON.FALLBACK.NA,
      createdAt: ADMISION_COPY_COMMON.FALLBACK.NA,
      updatedAt: ADMISION_COPY_COMMON.FALLBACK.NA,
      deudas: [],
      protestos: [],
    };
  }

  const evaluacion = data.resultado_evaluacion || {};
  const reglasExcepcion = getExceptionRules(evaluacion);
  const reglasBloqueantes = Array.isArray(evaluacion.blocking_rules) ? evaluacion.blocking_rules : [];
  const selectedExceptionNames = Array.isArray(evaluacion.selected_exception_names) && evaluacion.selected_exception_names.length > 0
    ? evaluacion.selected_exception_names
    : reglasExcepcion.map((rule) => getExceptionRuleName(rule));
  const persona = data.cliente ? data.cliente?.datos : data.prospecto;
  const deudas = Array.isArray(data.deudas) ? data.deudas : [];
  const totalCuota = deudas.reduce((acc, deuda) => acc + toNumeric(deuda?.monto_cuota), 0);
  const totalLineaCredito = deudas.reduce((acc, deuda) => acc + toNumeric(deuda?.linea_credito), 0);
  const totalTiendas = deudas.reduce((acc, deuda) => acc + (Boolean(deuda?.es_tienda_departamento) ? 1 : 0), 0);

  return {
    id: data.id,
    solicitante: buildFullName(persona, data.cliente ? 'CLIENTE' : 'PROSPECTO'),
    solicitanteDni: persona?.dni || 'N/A',
    asesor: data.asesor?.datos
      ? buildFullName(data.asesor.datos, 'CLIENTE')
      : data.asesor?.username || 'Desconocido',
    sede: data.sede?.nombre || ADMISION_COPY_COMMON.FALLBACK.NA,
    tipoPrestamo: data.tipo_prestamo || ADMISION_COPY_COMMON.FALLBACK.NA,
    estado: data.estado_label || ADMISION_COPY_COMMON.FALLBACK.NA,
    estadoExcepcion: getExceptionStatusLabel(data.excepcion_estado),
    totalDeuda: String(data.total_deuda || '0.00'),
    totalProtestos: String(data.total_protestos || '0.00'),
    totalIfis: data.total_ifis ?? 0,
    totalCuota: String(totalCuota),
    totalLineaCredito: String(totalLineaCredito),
    totalTiendas,
    isProspecto: Boolean(data.prospecto_id) || Boolean(data.prospecto),
    reglasExcepcion,
    reglasBloqueantes,
    selectedExceptionNames,
    motivoAsesor: data.excepcion_motivo_asesor || ADMISION_COPY_COMMON.FALLBACK.SIN_MOTIVO,
    comentarioRevision:
      data.comentario_excepcion
      || data.excepcion_revision_comentario
      || ADMISION_COPY_COMMON.FALLBACK.SIN_COMENTARIO_REVISION,
    comentarioFinanciero: data.comentario_financiero || ADMISION_COPY_COMMON.FALLBACK.SIN_COMENTARIO_REVISION,
    observacionAsesor: stripSystemAlertPrefix(data.observaciones || '') || ADMISION_COPY_COMMON.FALLBACK.SIN_OBSERVACIONES,
    revisor: buildReviewerName(data.excepcion_revisor),
    revisadoAt: formatDateTime(data.excepcion_revisado_at),
    createdAt: formatDateTime(data.created_at),
    updatedAt: formatDateTime(data.updated_at),
    deudas,
    protestos: Array.isArray(data.protestos) ? data.protestos : [],
  };
};