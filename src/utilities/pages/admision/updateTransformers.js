import {
  normalizeAdmisionState,
} from 'utilities/pages/admision/status';

const toOptionalNumber = (value) => {
  if (value === null || value === undefined || value === '') return '';

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : '';
};

const normalizeEstado = normalizeAdmisionState;

const buildSolicitanteName = (data) => {
  const persona = data?.cliente ? data.cliente?.datos : data?.prospecto;
  if (!persona) return '';

  if (data?.cliente) {
    return `${persona.nombre || ''} ${persona.apellidoPaterno || ''} ${persona.apellidoMaterno || ''}`.trim();
  }

  return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim();
};

const buildAsesorName = (data) => {
  const asesorDatos = data?.asesor?.datos;
  if (!asesorDatos) return 'Desconocido';
  return `${asesorDatos.nombre || ''} ${asesorDatos.apellidoPaterno || ''} ${asesorDatos.apellidoMaterno || ''}`.trim();
};

const mapHeaderFromAdmision = (data) => {
  const persona = data?.cliente ? data?.cliente?.datos : data?.prospecto;

  return {
    cliente_id: data?.cliente_id || null,
    prospecto_id: data?.prospecto_id || null,
    tipo_prestamo: data?.tipo_prestamo || 'NUEVO',
    estado: normalizeEstado(data?.estado),
    observaciones: data?.observaciones || '',
    solicitanteName: buildSolicitanteName(data),
    solicitanteDni: persona?.dni || '',
    tipoPersona: data?.cliente ? 'CLIENTE RECURRENTE' : 'PROSPECTO NUEVO',
    asesorFullName: buildAsesorName(data),
    sedeName: data?.sede?.nombre || 'Sede desconocida',
  };
};

const mapDeudasFromAdmision = (deudas) => {
  if (!Array.isArray(deudas)) return [];

  return deudas.map((d) => ({
    persona_tipo: d.persona_tipo,
    dni_relacionado: d.dni_relacionado,
    nombre_entidad: d.nombre_entidad,
    calificacion_banco: Number(d.calificacion_banco ?? 0),
    dias_atraso: d.dias_atraso ?? '',
    es_tienda_departamento: Boolean(d.es_tienda_departamento),
    tipo_credito: d.tipo_credito,
    saldo_capital: parseFloat(d.saldo_capital || 0),
    linea_credito: parseFloat(d.linea_credito || 0),
    plazo_pendiente: parseInt(d.plazo_pendiente || 0, 10),
    monto_cuota: toOptionalNumber(d.monto_cuota),
    frecuencia_pago: d.frecuencia_pago || '',
    fecha_pago: d.fecha_pago ? d.fecha_pago.split('T')[0] : '',
    porcentaje_cancelacion: parseFloat(d.porcentaje_cancelacion || 0),
  }));
};

const mapProtestosFromAdmision = (protestos) => {
  if (!Array.isArray(protestos)) return [];

  return protestos.map((p) => ({
    entidad_acreedora: p.entidad_acreedora,
    documento_tipo: p.documento_tipo,
    monto_deuda: parseFloat(p.monto_deuda || 0),
    dias_vencimiento: parseInt(p.dias_vencimiento || 0, 10),
  }));
};

export {
  mapHeaderFromAdmision,
  mapDeudasFromAdmision,
  mapProtestosFromAdmision,
  normalizeEstado,
};
