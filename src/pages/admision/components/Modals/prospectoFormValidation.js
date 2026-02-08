const ADDRESS_FIELD_KEYS = [
  'tipoVia',
  'nombreVia',
  'numeroMzLt',
  'urbanizacion',
  'departamento',
  'provincia',
  'distrito',
];

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildInitialFormData = () => ({
  dni: '',
  esCarnetExtranjeria: false,
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimiento: '',
  prospecto_direccion: {
    tipoVia: '',
    nombreVia: '',
    numeroMzLt: '',
    urbanizacion: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
  },
  prospecto_contacto: {
    celular: '',
  },
});

const buildInitialTouched = () => ({
  dni: false,
  nombres: false,
  apellido_paterno: false,
  apellido_materno: false,
  fecha_nacimiento: false,
  prospecto_direccion: Object.fromEntries(ADDRESS_FIELD_KEYS.map((key) => [key, false])),
  prospecto_contacto: {
    celular: false,
  },
});

const buildInitialErrors = () => ({
  dni: '',
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimiento: '',
  prospecto_direccion: Object.fromEntries(ADDRESS_FIELD_KEYS.map((key) => [key, ''])),
  prospecto_contacto: {
    celular: '',
  },
});

const getMaxBirthDate = () => {
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 19);
  limit.setMonth(limit.getMonth() - 11);
  return toDateInputValue(limit);
};

const validateProspectoForm = (data, documentoLength, maxBirthDate) => {
  const errors = buildInitialErrors();

  const dni = String(data.dni || '').trim();
  if (!dni) {
    errors.dni = 'El documento es obligatorio.';
  } else if (!/^\d+$/.test(dni)) {
    errors.dni = 'El documento solo debe contener números.';
  } else if (dni.length !== documentoLength) {
    errors.dni = 'Debe tener 8 dígitos (DNI) o 9 si marca CE.';
  }

  const nombres = String(data.nombres || '').trim();
  const paterno = String(data.apellido_paterno || '').trim();
  const materno = String(data.apellido_materno || '').trim();

  if (!nombres) errors.nombres = 'Los nombres son obligatorios.';
  if (!paterno) errors.apellido_paterno = 'El apellido paterno es obligatorio.';
  if (!materno) errors.apellido_materno = 'El apellido materno es obligatorio.';

  if (!data.fecha_nacimiento) {
    errors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
  } else if (data.fecha_nacimiento > maxBirthDate) {
    errors.fecha_nacimiento = 'Debe ser mayor o igual a 19 años y 11 meses.';
  }

  ADDRESS_FIELD_KEYS.forEach((key) => {
    if (!String(data.prospecto_direccion?.[key] || '').trim()) {
      errors.prospecto_direccion[key] = 'Este campo es obligatorio.';
    }
  });

  const celular = String(data.prospecto_contacto?.celular || '').trim();
  if (!celular) {
    errors.prospecto_contacto.celular = 'El celular es obligatorio.';
  } else if (!/^9[0-9]{8}$/.test(celular)) {
    errors.prospecto_contacto.celular = 'Debe tener 9 dígitos e iniciar con 9.';
  }

  return errors;
};

const hasAnyError = (obj) =>
  Object.values(obj).some((value) => {
    if (typeof value === 'string') return Boolean(value);
    if (value && typeof value === 'object') return hasAnyError(value);
    return false;
  });

const isDirtyForm = (data) => {
  if (
    data.dni ||
    data.nombres ||
    data.apellido_paterno ||
    data.apellido_materno ||
    data.fecha_nacimiento ||
    data.esCarnetExtranjeria ||
    data.prospecto_contacto?.celular
  ) {
    return true;
  }

  return ADDRESS_FIELD_KEYS.some((key) => String(data.prospecto_direccion?.[key] || '').trim() !== '');
};

export {
  ADDRESS_FIELD_KEYS,
  buildInitialErrors,
  buildInitialFormData,
  buildInitialTouched,
  getMaxBirthDate,
  hasAnyError,
  isDirtyForm,
  validateProspectoForm,
};