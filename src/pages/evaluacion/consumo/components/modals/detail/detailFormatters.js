export const money = (value) =>
  Number(value || 0).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const hasValue = (value) => {
  if (value === 0 || value === false) {
    return true;
  }

  if (value === null || value === undefined) {
    return false;
  }

  return String(value).trim() !== '';
};

export const textOrNA = (value) => (hasValue(value) ? String(value).trim() : 'N/A');
export const moneyOrNA = (value) => (hasValue(value) ? `S/ ${money(value)}` : 'N/A');
export const percentOrNA = (value) => (hasValue(value) ? `${value}%` : 'N/A');

export const formatDateOrNA = (value, withTime = false) => {
  if (!hasValue(value)) {
    return 'N/A';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return textOrNA(value);
  }

  return withTime
    ? parsed.toLocaleString('es-PE')
    : parsed.toLocaleDateString('es-PE');
};

export const boolToYesNo = (value) => (value ? 'SI' : 'NO');

export const buildAvalFullName = (aval = {}) => (
  [
    aval?.nombres,
    aval?.apellido_paterno,
    aval?.apellido_materno,
  ]
    .filter((part) => hasValue(part))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
);

export const buildAvalAddress = (aval = {}) => {
  if (hasValue(aval?.direccion)) {
    return String(aval.direccion).trim();
  }

  const via = [aval?.tipoVia, aval?.nombreVia]
    .filter((part) => hasValue(part))
    .join(' ')
    .trim();

  const principal = [via, aval?.numeroMzLt, aval?.urbanizacion]
    .filter((part) => hasValue(part))
    .join(', ')
    .replace(/\s+/g, ' ')
    .trim();

  const ubigeo = [aval?.distrito, aval?.provincia, aval?.departamento]
    .filter((part) => hasValue(part))
    .join(', ')
    .replace(/\s+/g, ' ')
    .trim();

  return [principal, ubigeo].filter((part) => hasValue(part)).join(', ').trim() || 'N/A';
};
