import { buildAddressLine } from 'utilities/addressFormatter';

export const EMPTY_CLIENTE_DIRECCION = {
  tipoVia: '',
  nombreVia: '',
  numeroMzLt: '',
  urbanizacion: '',
  direccion: '',
  departamento: '',
  provincia: '',
  distrito: '',
};

export const createInitialClienteForm = () => ({
  datos_cliente: {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    apellidoConyuge: '',
    estadoCivil: '',
    sexo: '',
    dni: '',
    fechaNacimiento: '',
    fechaCaducidadDni: '',
    nacionalidad: 'Peruana',
    residePeru: true,
    nivelEducativo: '',
    profesion: '',
    enfermedadesPreexistentes: false,
    ruc: '',
    expuestaPoliticamente: false,
    esCarnetExtranjeria: false,
  },
  direcciones_cliente: {
    fiscal: { ...EMPTY_CLIENTE_DIRECCION },
    correspondencia: { ...EMPTY_CLIENTE_DIRECCION },
  },
  contactos: {
    telefono: '',
    telefonoFijo: '',
    correo: '',
  },
  banco: {
    entidad_financiera_id: '',
    numero_cuenta: '',
    cci: '',
  },
});

export const normalizeClienteValue = (name, value) => {
  if (typeof value !== 'string') return value;
  if (name === 'correo') return value.toLowerCase();
  return value.toUpperCase();
};

export const applyClienteSectionChange = (previousForm, { section, name, value, type, checked }) => ({
  ...previousForm,
  [section]: {
    ...previousForm[section],
    [name]: type === 'checkbox' ? checked : normalizeClienteValue(name, value),
  },
});

export const applyClienteDireccionChange = (previousForm, { tipo, name, value }) => ({
  ...previousForm,
  direcciones_cliente: {
    ...previousForm.direcciones_cliente,
    [tipo]: {
      ...previousForm.direcciones_cliente[tipo],
      [name]: normalizeClienteValue(name, value),
    },
  },
});

export const cleanClienteNulls = (obj, defaultStructure = {}) => {
  if (!obj) return defaultStructure;

  const nextObject = { ...obj };
  Object.keys(nextObject).forEach((key) => {
    if (nextObject[key] === null || nextObject[key] === undefined) {
      nextObject[key] = '';
    }
  });

  return nextObject;
};

export const extractLegacyClienteDireccion = (datosCliente = {}) => ({
  tipoVia: datosCliente.tipoVia || '',
  nombreVia: datosCliente.nombreVia || '',
  numeroMzLt: datosCliente.numeroMzLt || '',
  urbanizacion: datosCliente.urbanizacion || '',
  direccion: datosCliente.direccion || '',
  departamento: datosCliente.departamento || '',
  provincia: datosCliente.provincia || '',
  distrito: datosCliente.distrito || '',
});

export const buildClientePayload = (formData) => {
  const {
    tipoVia,
    nombreVia,
    numeroMzLt,
    urbanizacion,
    direccion,
    departamento,
    provincia,
    distrito,
    ...datosPersonales
  } = formData?.datos_cliente || {};

  const payload = {
    datos_cliente: datosPersonales,
    direcciones_cliente: {
      fiscal: {
        ...(formData?.direcciones_cliente?.fiscal || EMPTY_CLIENTE_DIRECCION),
        direccion: buildAddressLine(formData?.direcciones_cliente?.fiscal || EMPTY_CLIENTE_DIRECCION),
      },
      correspondencia: {
        ...(formData?.direcciones_cliente?.correspondencia || EMPTY_CLIENTE_DIRECCION),
        direccion: buildAddressLine(formData?.direcciones_cliente?.correspondencia || EMPTY_CLIENTE_DIRECCION),
      },
    },
    cliente_datos_contacto: {
      telefono: formData?.contactos?.telefono || '',
      telefonoFijo: formData?.contactos?.telefonoFijo || '',
      correo: String(formData?.contactos?.correo || '').toLowerCase(),
    },
    rol_id: 8,
  };

  const banco = {
    entidad_financiera_id: formData?.banco?.entidad_financiera_id || '',
    numero_cuenta: formData?.banco?.numero_cuenta || '',
    cci: formData?.banco?.cci || '',
  };

  if (banco.entidad_financiera_id) {
    payload.cliente_cuentas_bancarias = banco;
  }

  return payload;
};

export const normalizeClienteApiResponse = (responseData = {}) => {
  const data = responseData?.datos_cliente ? responseData : responseData?.data || responseData;
  const {
    datos_cliente,
    cliente_datos_contacto,
    cliente_cuentas_bancarias,
    direcciones_cliente,
  } = data;

  const datosClienteLimpios = cleanClienteNulls({ ...datos_cliente });
  datosClienteLimpios.sexo = String(datosClienteLimpios.sexo || '').toUpperCase();
  datosClienteLimpios.estadoCivil = String(datosClienteLimpios.estadoCivil || '').toUpperCase();
  datosClienteLimpios.esCarnetExtranjeria = String(datosClienteLimpios.dni || '').length === 9;

  const fiscalRaw = direcciones_cliente?.fiscal || extractLegacyClienteDireccion(datos_cliente);
  const correspondenciaRaw = direcciones_cliente?.correspondencia || fiscalRaw;
  const primerBanco = Array.isArray(cliente_cuentas_bancarias)
    ? (cliente_cuentas_bancarias[0] || {})
    : (cliente_cuentas_bancarias || {});

  return {
    datos_cliente: datosClienteLimpios,
    direcciones_cliente: {
      fiscal: cleanClienteNulls(fiscalRaw, { ...EMPTY_CLIENTE_DIRECCION }),
      correspondencia: cleanClienteNulls(correspondenciaRaw, { ...EMPTY_CLIENTE_DIRECCION }),
    },
    contactos: cleanClienteNulls(cliente_datos_contacto, {
      telefono: '',
      telefonoFijo: '',
      correo: '',
    }),
    banco: cleanClienteNulls(primerBanco, {
      entidad_financiera_id: '',
      numero_cuenta: '',
      cci: '',
    }),
  };
};