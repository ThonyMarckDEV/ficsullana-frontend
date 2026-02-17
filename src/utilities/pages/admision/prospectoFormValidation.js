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
  fecha_caducidad_dni: '',
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
    correo: '',
  },
});

const buildInitialTouched = () => ({
  dni: false,
  nombres: false,
  apellido_paterno: false,
  apellido_materno: false,
  fecha_nacimiento: false,
  fecha_caducidad_dni: false,
  prospecto_direccion: Object.fromEntries(ADDRESS_FIELD_KEYS.map((key) => [key, false])),
  prospecto_contacto: {
    celular: false,
    correo: false,
  },
});

const buildInitialErrors = () => ({
  dni: '',
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimiento: '',
  fecha_caducidad_dni: '',
  prospecto_direccion: Object.fromEntries(ADDRESS_FIELD_KEYS.map((key) => [key, ''])),
  prospecto_contacto: {
    celular: '',
    correo: '',
  },
});

const getMaxBirthDate = () => {
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 19);
  return toDateInputValue(limit);
};

const getMinBirthDate = () => {
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 71);
  return toDateInputValue(limit);
};

const getGeneralBirthDateRange = () => {
  const youngerLimit = new Date();
  youngerLimit.setFullYear(youngerLimit.getFullYear() - 21);

  const olderLimit = new Date();
  olderLimit.setFullYear(olderLimit.getFullYear() - 69);
  olderLimit.setMonth(olderLimit.getMonth() - 11);

  return {
    younger: toDateInputValue(youngerLimit),
    older: toDateInputValue(olderLimit),
  };
};

const getProspectoExceptionMessages = (data, maxBirthDate, minBirthDate) => {
  const messages = [];
  const birthDate = String(data.fecha_nacimiento || '');
  const dniExpirationDate = String(data.fecha_caducidad_dni || '');
  const today = toDateInputValue(new Date());
  const { younger, older } = getGeneralBirthDateRange();

  const isBirthDateInExceptionRange =
    birthDate &&
    birthDate >= minBirthDate &&
    birthDate <= maxBirthDate &&
    (birthDate > younger || birthDate < older);

  if (isBirthDateInExceptionRange) {
    messages.push('Edad fuera del rango general (21 a 69 años 11 meses). En admisión pedirá excepción.');
  }

  if (dniExpirationDate && dniExpirationDate < today) {
    messages.push('DNI/CE vencido. En admisión pedirá excepción.');
  }

  return messages;
};

const validateProspectoForm = (data, documentoLength, maxBirthDate, minBirthDate) => {
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
  } else if (data.fecha_nacimiento < minBirthDate) {
    errors.fecha_nacimiento = 'No debe superar 71 años exactos.';
  } else if (data.fecha_nacimiento > maxBirthDate) {
    errors.fecha_nacimiento = 'Debe tener al menos 19 años exactos.';
  }

  if (!data.fecha_caducidad_dni) {
    errors.fecha_caducidad_dni = 'La fecha de caducidad del DNI/CE es obligatoria.';
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

  const correo = String(data.prospecto_contacto?.correo || '').trim();
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errors.prospecto_contacto.correo = 'El correo no es válido.';
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
    data.fecha_caducidad_dni ||
    data.esCarnetExtranjeria ||
    data.prospecto_contacto?.celular ||
    data.prospecto_contacto?.correo
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
  getMinBirthDate,
  getMaxBirthDate,
  getProspectoExceptionMessages,
  hasAnyError,
  isDirtyForm,
  validateProspectoForm,
};
