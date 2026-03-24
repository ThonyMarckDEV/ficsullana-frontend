import { buildAddressLine } from 'utilities/addressFormatter';

export const EMPTY_EMPLOYEE_BANK_ACCOUNT = {
  entidad_financiera_id: '',
  numero_cuenta: '',
  cci: '',
};

export const createInitialEmpleadoForm = ({ rolId = null, sedeId = '' } = {}) => ({
  rol_id: rolId !== null && rolId !== undefined && rolId !== '' ? parseInt(rolId, 10) : undefined,
  datos_empleado: {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: '',
    fechaNacimiento: '',
    fechaIngreso: '',
    sexo: '',
    estadoCivil: '',
    tipoVia: '',
    nombreVia: '',
    numeroMzLt: '',
    urbanizacion: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    area_id: '',
    esCarnetExtranjeria: false,
  },
  empleado_datos_contacto: {
    telefono: '',
    correo: '',
    correos: [''],
  },
  empleado_cuentas_bancarias: [{ ...EMPTY_EMPLOYEE_BANK_ACCOUNT }],
  username: '',
  sede_id: sedeId,
  password: '',
  password_confirmation: '',
});

export const normalizeEmpleadoValue = (name, value, section) => {
  if (typeof value !== 'string') return value;
  if (name === 'correo' || name === 'email') return value.toLowerCase();
  if (!section && ['username', 'password', 'password_confirmation'].includes(name)) return value;
  return value.toUpperCase();
};

export const sanitizeEmpleadoEmailList = (emails) => (
  (Array.isArray(emails) ? emails : [])
    .map((email) => String(email || '').trim().toLowerCase())
    .filter(Boolean)
);

export const mapEmpleadoEmails = (emails) => {
  const correos = sanitizeEmpleadoEmailList(emails);
  return {
    correos: correos.length > 0 ? correos : [''],
    correo: correos[0] || '',
  };
};

export const applyEmpleadoChange = (previousForm, { section, name, value, type, checked }) => {
  const nextValue = type === 'checkbox' ? checked : normalizeEmpleadoValue(name, value, section);

  if (name === 'telefono' && section === 'datos_empleado') {
    return {
      ...previousForm,
      empleado_datos_contacto: {
        ...previousForm.empleado_datos_contacto,
        telefono: nextValue,
      },
    };
  }

  if (name === 'email' || name === 'correo') {
    const correoValue = String(nextValue || '').toLowerCase();
    return {
      ...previousForm,
      empleado_datos_contacto: {
        ...previousForm.empleado_datos_contacto,
        correo: correoValue,
        correos: [correoValue],
      },
    };
  }

  if (section) {
    return {
      ...previousForm,
      [section]: {
        ...previousForm[section],
        [name]: nextValue,
      },
    };
  }

  return {
    ...previousForm,
    [name]: nextValue,
  };
};

export const sanitizeEmpleadoBankAccounts = (cuentas) => (
  (Array.isArray(cuentas) ? cuentas : [])
    .map((cuenta) => ({
      entidad_financiera_id: cuenta?.entidad_financiera_id || '',
      numero_cuenta: cuenta?.numero_cuenta || '',
      cci: cuenta?.cci || '',
    }))
    .filter((cuenta) => cuenta.entidad_financiera_id || cuenta.numero_cuenta || cuenta.cci)
);

export const buildEmpleadoPayload = (formData, options = {}) => {
  const {
    includeRolId = false,
    includeSedeId = false,
    includePassword = false,
    optionalPassword = false,
  } = options;

  const datosEmpleado = { ...(formData?.datos_empleado || {}) };
  delete datosEmpleado.area;
  datosEmpleado.direccion = buildAddressLine(datosEmpleado);

  const correos = sanitizeEmpleadoEmailList(formData?.empleado_datos_contacto?.correos);
  const payload = {
    datos_empleado: datosEmpleado,
    empleado_datos_contacto: {
      ...(formData?.empleado_datos_contacto || {}),
      correos,
      correo: correos[0] || '',
    },
    username: formData?.username || '',
  };

  if (includeRolId && Number.isFinite(Number(formData?.rol_id))) {
    payload.rol_id = Number(formData.rol_id);
  }

  if (includeSedeId) {
    payload.sede_id = formData?.sede_id || '';
  }

  const cuentas = sanitizeEmpleadoBankAccounts(formData?.empleado_cuentas_bancarias);
  if (cuentas.length > 0) {
    payload.empleado_cuentas_bancarias = cuentas;
  }

  if (includePassword) {
    const hasPassword = Boolean(formData?.password);
    if (!optionalPassword || hasPassword) {
      payload.password = formData?.password || '';
      payload.password_confirmation = formData?.password_confirmation || '';
    }
  }

  return payload;
};

export const normalizeEmpleadoApiResponse = (source = {}) => {
  const {
    datos_empleado,
    empleado_datos_contacto,
    empleado_cuentas_bancarias,
    username,
    sede,
    rol_id,
  } = source;

  const cuentasArray = Array.isArray(empleado_cuentas_bancarias)
    ? empleado_cuentas_bancarias
    : empleado_cuentas_bancarias?.entidad_financiera_id
      ? [empleado_cuentas_bancarias]
      : [];

  const bancoState = cuentasArray.length > 0
    ? cuentasArray.map((cuenta) => ({
      entidad_financiera_id: cuenta.entidad_financiera_id || '',
      numero_cuenta: cuenta.numero_cuenta || '',
      cci: cuenta.cci || '',
      entidad_financiera: cuenta.entidad_financiera || null,
    }))
    : [{ ...EMPTY_EMPLOYEE_BANK_ACCOUNT }];

  const correosIniciales = Array.isArray(empleado_datos_contacto?.correos)
    ? empleado_datos_contacto.correos.filter(Boolean)
    : (empleado_datos_contacto?.correo ? [empleado_datos_contacto.correo] : []);

  const contactoState = {
    telefono: empleado_datos_contacto?.telefono || '',
    correo: empleado_datos_contacto?.correo || correosIniciales[0] || '',
    correos: correosIniciales.length > 0 ? correosIniciales : [''],
  };

  return {
    rolIdRedirect: rol_id,
    initialSedeName: sede?.nombre || '',
    formData: {
      ...createInitialEmpleadoForm({ sedeId: sede?.id || '' }),
      datos_empleado: {
        nombre: datos_empleado?.nombre || '',
        apellidoPaterno: datos_empleado?.apellidoPaterno || '',
        apellidoMaterno: datos_empleado?.apellidoMaterno || '',
        dni: datos_empleado?.dni || '',
        fechaNacimiento: datos_empleado?.fechaNacimiento || '',
        fechaIngreso: datos_empleado?.fechaIngreso || '',
        sexo: String(datos_empleado?.sexo || '').toUpperCase(),
        estadoCivil: String(datos_empleado?.estadoCivil || '').toUpperCase(),
        tipoVia: datos_empleado?.tipoVia || '',
        nombreVia: datos_empleado?.nombreVia || '',
        numeroMzLt: datos_empleado?.numeroMzLt || '',
        urbanizacion: datos_empleado?.urbanizacion || '',
        direccion: datos_empleado?.direccion || '',
        departamento: datos_empleado?.departamento || '',
        provincia: datos_empleado?.provincia || '',
        distrito: datos_empleado?.distrito || '',
        area_id: datos_empleado?.area_id || '',
        area: datos_empleado?.area,
        esCarnetExtranjeria: String(datos_empleado?.dni || '').length === 9,
      },
      empleado_datos_contacto: contactoState,
      empleado_cuentas_bancarias: bancoState,
      username: username || '',
      sede_id: sede?.id || '',
      password: '',
      password_confirmation: '',
    },
  };
};