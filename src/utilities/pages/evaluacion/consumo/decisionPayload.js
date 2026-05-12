const isBlank = (value) => value === '' || value === null || value === undefined;

const toNumberOrNull = (value) => {
  if (isBlank(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isPositiveNumber = (value) => {
  const parsed = toNumberOrNull(value);
  return parsed !== null && parsed > 0;
};

export const resolveDecisionRate = (form = {}) => (
  !isBlank(form.propuesta)
    ? form.propuesta
    : (!isBlank(form.tasa) ? form.tasa : form.tasa_interes_solicitada)
);

export const buildDecisionPlanAdjustmentPayload = (form = {}) => {
  const tasa = resolveDecisionRate(form);

  return {
    monto: form.monto,
    tipo_frecuencia: form.tipo_frecuencia,
    numero_cuotas: Number(form.numero_cuotas),
    propuesta: tasa,
    tasa,
    tasa_interes_solicitada: tasa,
  };
};

export const validateDecisionPlanAdjustments = (form = {}) => {
  const errors = [];
  const tasa = resolveDecisionRate(form);
  const requiredFields = [
    [form.monto, 'Debe ingresar el monto para registrar la decisión.'],
    [form.tipo_frecuencia, 'Debe seleccionar la frecuencia para registrar la decisión.'],
    [form.numero_cuotas, 'Debe ingresar el número de cuotas para registrar la decisión.'],
    [tasa, 'Debe ingresar la tasa para registrar la decisión.'],
  ];

  requiredFields.forEach(([value, message]) => {
    if (isBlank(value)) errors.push(message);
  });

  if (!isBlank(form.monto) && !isPositiveNumber(form.monto)) {
    errors.push('El monto debe ser mayor a 0 para registrar la decisión.');
  }

  const cuotasNumber = toNumberOrNull(form.numero_cuotas);
  if (
    !isBlank(form.numero_cuotas)
    && (cuotasNumber === null || cuotasNumber <= 0 || !Number.isInteger(cuotasNumber))
  ) {
    errors.push('El número de cuotas debe ser un entero mayor a 0 para registrar la decisión.');
  }

  if (!isBlank(tasa) && !isPositiveNumber(tasa)) {
    errors.push('La tasa debe ser mayor a 0 para registrar la decisión.');
  }

  return errors;
};
