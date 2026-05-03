/**
 * Aval state factories and helpers.
 */

let avalClientIdSequence = 0;

const AVAL_STRING_FIELDS = [
  'aval_id', 'selected_label', 'tipo_documento', 'numero_documento',
  'apellido_paterno', 'apellido_materno', 'nombres', 'telefono_fijo',
  'telefono_movil', 'tipo_vivienda', 'referencia_domiciliaria',
  'tipoVia', 'nombreVia', 'numeroMzLt', 'urbanizacion', 'direccion',
  'departamento', 'provincia', 'distrito',
];

const createAvalClientId = () => {
  avalClientIdSequence += 1;
  return `aval-${avalClientIdSequence}`;
};

export const buildAvalFullName = (aval = {}) => (
  [aval?.nombres, aval?.apellido_paterno, aval?.apellido_materno]
    .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
);

export const buildAvalDireccion = (aval = {}) => {
  const directAddress = String(aval?.direccion || '').trim();
  if (directAddress) return directAddress;

  const via = [aval?.tipoVia, aval?.nombreVia].filter(Boolean).join(' ').trim();
  const principal = [via, aval?.numeroMzLt, aval?.urbanizacion]
    .filter(Boolean).join(', ').replace(/\s+/g, ' ').trim();
  const ubigeo = [aval?.distrito, aval?.provincia, aval?.departamento]
    .filter(Boolean).join(', ').replace(/\s+/g, ' ').trim();

  return [principal, ubigeo].filter(Boolean).join(', ').trim();
};

export const hasAvalContent = (aval = {}) => (
  Object.entries(aval || {}).some(([key, value]) => {
    if (key === 'client_id' || key === 'is_existing' || key === 'manual_mode' || key === 'tipo_documento') return false;
    if (key === 'aval_id') return Boolean(value);
    return value !== null && value !== undefined && String(value).trim() !== '';
  })
);

export const hasAvales = (avales = []) => Array.isArray(avales) && avales.length > 0;

export const createAvalState = (overrides = {}) => {
  const nextState = {
    client_id: createAvalClientId(), aval_id: '', selected_label: '',
    is_existing: false, manual_mode: false, tipo_documento: 'DNI',
    numero_documento: '', apellido_paterno: '', apellido_materno: '',
    nombres: '', telefono_fijo: '', telefono_movil: '', tipo_vivienda: '',
    referencia_domiciliaria: '', tipoVia: '', nombreVia: '', numeroMzLt: '',
    urbanizacion: '', direccion: '', departamento: '', provincia: '', distrito: '',
    garantias_registradas: [],
  };

  if (Object.prototype.hasOwnProperty.call(overrides || {}, 'tipo_documento')) {
    const td = String(overrides.tipo_documento || '').toUpperCase();
    nextState.tipo_documento = td === 'CE' ? 'CE' : 'DNI';
  } else if (Object.prototype.hasOwnProperty.call(overrides || {}, 'es_carnet_extranjeria')) {
    nextState.tipo_documento = overrides.es_carnet_extranjeria ? 'CE' : 'DNI';
  }

  nextState.is_existing = Boolean(overrides?.is_existing ?? overrides?.aval_id);
  nextState.manual_mode = Boolean(overrides?.manual_mode);

  AVAL_STRING_FIELDS.forEach((field) => {
    const value = overrides?.[field];
    if (value !== undefined && value !== null) nextState[field] = String(value);
  });

  if (Object.prototype.hasOwnProperty.call(overrides || {}, 'client_id') && overrides.client_id) {
    nextState.client_id = String(overrides.client_id);
  }

  if (Array.isArray(overrides?.garantias_registradas)) {
    nextState.garantias_registradas = overrides.garantias_registradas;
  }

  if (!String(nextState.direccion || '').trim()) {
    nextState.direccion = buildAvalDireccion(nextState);
  }

  return nextState;
};

export const mapAvalLookupToState = (aval = null) => {
  if (!aval) return createAvalState();

  return createAvalState({
    aval_id: aval.id,
    selected_label: buildAvalFullName(aval),
    is_existing: true, manual_mode: false,
    tipo_documento: aval.es_carnet_extranjeria ? 'CE' : 'DNI',
    numero_documento: aval.numero_documento,
    nombres: aval.nombres,
    apellido_paterno: aval.apellido_paterno,
    apellido_materno: aval.apellido_materno,
    tipo_vivienda: aval.tipo_vivienda,
    telefono_fijo: aval.contacto?.telefono_fijo || '',
    telefono_movil: aval.contacto?.telefono_movil || '',
    referencia_domiciliaria: aval.direccion?.referencia_domiciliaria || '',
    tipoVia: aval.direccion?.tipoVia || '',
    nombreVia: aval.direccion?.nombreVia || '',
    numeroMzLt: aval.direccion?.numeroMzLt || '',
    urbanizacion: aval.direccion?.urbanizacion || '',
    direccion: aval.direccion?.direccion || '',
    departamento: aval.direccion?.departamento || '',
    provincia: aval.direccion?.provincia || '',
    distrito: aval.direccion?.distrito || '',
    garantias_registradas: Array.isArray(aval.garantias) ? aval.garantias : [],
  });
};
