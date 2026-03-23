const isNonEmptyText = (value) => String(value ?? '').trim() !== '';

const stripTransientFields = (item = {}) => {
  const { __rowKey, ...rest } = item;
  return rest;
};

const sanitizeAdmisionDeudas = (deudas, options = {}) => {
  const { filterEmpty = true } = options;

  return (Array.isArray(deudas) ? deudas : [])
    .map(stripTransientFields)
    .filter((deuda) => !filterEmpty || isNonEmptyText(deuda?.nombre_entidad));
};

const sanitizeAdmisionProtestos = (protestos, options = {}) => {
  const { filterEmpty = true } = options;

  return (Array.isArray(protestos) ? protestos : [])
    .map(stripTransientFields)
    .filter((protesto) => !filterEmpty || isNonEmptyText(protesto?.entidad_acreedora));
};

const buildAdmisionPayload = ({
  header,
  deudas,
  protestos,
  includeEstado = false,
  filterEmptyDeudas = true,
  filterEmptyProtestos = true,
}) => {
  const payload = {
    cliente_id: header?.tipo_solicitante === 'CLIENTE' ? header?.cliente_id : header?.cliente_id || null,
    prospecto_id: header?.tipo_solicitante === 'PROSPECTO' ? header?.prospecto_id : header?.prospecto_id || null,
    tipo_prestamo: header?.tipo_prestamo || '',
    observaciones: header?.observaciones || '',
    deudas: sanitizeAdmisionDeudas(deudas, { filterEmpty: filterEmptyDeudas }),
    protestos: sanitizeAdmisionProtestos(protestos, { filterEmpty: filterEmptyProtestos }),
  };

  if (includeEstado) {
    payload.estado = Number(header?.estado ?? 0);
  }

  return payload;
};

const validateStoreAdmisionHeader = (header) => {
  if (header?.tipo_solicitante === 'CLIENTE' && !header?.cliente_id) {
    return 'Debe buscar y seleccionar un Cliente.';
  }

  if (header?.tipo_solicitante === 'PROSPECTO' && !header?.prospecto_id) {
    return 'Debe buscar o crear un Prospecto.';
  }

  if (!header?.tipo_prestamo) {
    return 'Error: No se ha determinado el tipo de préstamo.';
  }

  return null;
};

export {
  buildAdmisionPayload,
  sanitizeAdmisionDeudas,
  sanitizeAdmisionProtestos,
  validateStoreAdmisionHeader,
};