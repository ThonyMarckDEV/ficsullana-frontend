import {
  AVAL_GARANTIA_VALUE,
  MAX_AVALES,
  buildAvalDireccion,
  buildAvalFullName,
  createAvalState,
  createGarantiaRow,
  getActiveAvalSlots,
  hasAvalContent,
  isAvalGuarantee,
  normalizeAvalSlot,
} from './transformers';

const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== '';

const isStrictDecimal = (value) => /^\d+(?:\.\d{1,2})?$/.test(String(value ?? '').trim());

const getRequiredAvalFields = (aval = {}) => [
  aval.numero_documento,
  aval.nombres,
  aval.apellido_paterno,
  aval.apellido_materno,
  aval.tipo_vivienda,
  aval.telefono_movil,
  aval.referencia_domiciliaria,
  aval.tipoVia,
  aval.nombreVia,
  aval.numeroMzLt,
  aval.urbanizacion,
  aval.departamento,
  aval.provincia,
  aval.distrito,
];

export const createAvalModalState = (overrides = {}) => ({
  isOpen: false,
  activeAvalSlot: null,
  openReason: null,
  dirtyState: false,
  exitConfirmOpen: false,
  pendingExit: null,
  ...overrides,
});

export const ensureAvalSlot = (avales = [], avalIndex = 0) => {
  const nextAvales = [...(Array.isArray(avales) ? avales : [])];

  while (nextAvales.length <= avalIndex && nextAvales.length < MAX_AVALES) {
    nextAvales.push(createAvalState());
  }

  return nextAvales;
};

export const getFirstAvailableAvalSlot = (garantias = [], preferredSlot = null) => {
  const normalizedPreferredSlot = normalizeAvalSlot(preferredSlot);
  if (normalizedPreferredSlot !== null) {
    return normalizedPreferredSlot;
  }

  const activeSlots = getActiveAvalSlots(garantias);

  for (let slot = 1; slot <= MAX_AVALES; slot += 1) {
    if (!activeSlots.includes(slot)) {
      return slot;
    }
  }

  return activeSlots[0] || 1;
};

export const resolveGarantiaDireccion = (form, garantia) => {
  if (!garantia?.usar_direccion_solicitante) {
    return garantia?.direccion || '';
  }

  if (isAvalGuarantee(garantia)) {
    const avalSlot = normalizeAvalSlot(garantia?.aval_slot);
    if (avalSlot === null) {
      return '';
    }

    return buildAvalDireccion((form?.avales || [])[avalSlot - 1] || {});
  }

  return form?.direccion_snapshot || '';
};

export const syncGarantiasWithAvalDireccion = (garantias = [], avalSlot, aval) => (
  (Array.isArray(garantias) ? garantias : []).map((garantia) => {
    if (
      !isAvalGuarantee(garantia)
      || normalizeAvalSlot(garantia?.aval_slot) !== avalSlot
      || !garantia?.usar_direccion_solicitante
    ) {
      return garantia;
    }

    return {
      ...garantia,
      direccion: buildAvalDireccion(aval),
    };
  })
);

export const clearLinkedGarantiaSelections = (garantias = [], avalSlot) => (
  (Array.isArray(garantias) ? garantias : []).map((garantia) => {
    if (normalizeAvalSlot(garantia?.aval_slot) !== avalSlot) {
      return garantia;
    }

    return createGarantiaRow({
      ...garantia,
      garantia_id: '',
    });
  })
);

export const normalizeAvalCollections = (garantias = [], avales = []) => {
  const activeSlots = getActiveAvalSlots(garantias);
  const slotMap = new Map(activeSlots.map((slot, index) => [slot, index + 1]));

  const normalizedGarantias = (Array.isArray(garantias) ? garantias : []).map((garantia) => {
    if (!isAvalGuarantee(garantia)) {
      return createGarantiaRow({
        ...garantia,
        aval_slot: '',
      });
    }

    const currentSlot = normalizeAvalSlot(garantia?.aval_slot);
    const nextSlot = currentSlot === null ? '' : slotMap.get(currentSlot) || '';

    return createGarantiaRow({
      ...garantia,
      aval_slot: nextSlot === '' ? '' : String(nextSlot),
    });
  });

  const normalizedAvales = activeSlots.map((slot) => createAvalState((avales || [])[slot - 1] || {}));

  return {
    garantias: normalizedGarantias,
    avales: normalizedAvales,
    activeSlots: activeSlots.map((_, index) => index + 1),
    requiresAval: activeSlots.length > 0,
  };
};

export const mapGarantiaLookupToRow = (garantia, currentRow = {}) => createGarantiaRow({
  ...currentRow,
  garantia_id: garantia?.id ? String(garantia.id) : '',
  moneda_id: garantia?.moneda_id ? String(garantia.moneda_id) : String(garantia?.moneda?.id || ''),
  clase_garantia: AVAL_GARANTIA_VALUE,
  documento_garantia: garantia?.documento_garantia || '',
  tipo_garantia: garantia?.tipo_garantia || '',
  descripcion: garantia?.descripcion || '',
  direccion: garantia?.direccion || '',
  usar_direccion_solicitante: false,
  monto_garantias: garantia?.valor_bien !== null && garantia?.valor_bien !== undefined
    ? String(garantia.valor_bien)
    : '',
  valor_comercial: hasValue(currentRow?.valor_comercial)
    ? currentRow.valor_comercial
    : (garantia?.valor_bien !== null && garantia?.valor_bien !== undefined ? String(garantia.valor_bien) : ''),
  valor_realizacion: currentRow?.valor_realizacion || '',
  ficha_registral: garantia?.ficha_registral || '',
  fecha_ultima_evaluacion: garantia?.fecha_ultima_evaluacion || '',
});

export const isAvalIdentityComplete = (aval = {}) => {
  if (Boolean(aval?.aval_id) && Boolean(aval?.is_existing)) {
    return true;
  }

  if (!Boolean(aval?.manual_mode) && !hasAvalContent(aval)) {
    return false;
  }

  const requiredFields = getRequiredAvalFields(aval);
  if (requiredFields.some((value) => !hasValue(value))) {
    return false;
  }

  const documentLength = aval?.tipo_documento === 'CE' ? 9 : 8;
  const documento = String(aval?.numero_documento || '').trim();

  if (!new RegExp(`^\\d{${documentLength}}$`).test(documento)) {
    return false;
  }

  return /^9\d{8}$/.test(String(aval?.telefono_movil || '').trim());
};

export const isAvalGuaranteeComplete = (garantia = {}) => {
  if (Boolean(garantia?.garantia_id)) {
    return true;
  }

  return [
    garantia?.moneda_id,
    garantia?.documento_garantia,
    garantia?.tipo_garantia,
    garantia?.descripcion,
    garantia?.direccion,
  ].every(hasValue)
    && isStrictDecimal(garantia?.monto_garantias)
    && isStrictDecimal(garantia?.valor_comercial)
    && (!hasValue(garantia?.valor_realizacion) || isStrictDecimal(garantia?.valor_realizacion));
};

export const getAvalGroupStatus = ({ aval, garantias }) => {
  const hasSelectedAval = Boolean(aval?.aval_id) && Boolean(aval?.is_existing);
  const hasManualAval = Boolean(aval?.manual_mode) || hasAvalContent(aval);
  const hasGarantias = Array.isArray(garantias) && garantias.length > 0;
  const avalComplete = isAvalIdentityComplete(aval);
  const guaranteesComplete = hasGarantias && garantias.every(isAvalGuaranteeComplete);

  if ((hasSelectedAval || hasManualAval) && avalComplete && guaranteesComplete) {
    return {
      code: 'complete',
      label: 'Completo',
      tone: 'emerald',
    };
  }

  if (hasSelectedAval || hasManualAval || hasGarantias) {
    return {
      code: 'partial',
      label: 'En progreso',
      tone: 'amber',
    };
  }

  return {
    code: 'pending',
    label: 'Pendiente',
    tone: 'slate',
  };
};

export const buildAvalGroups = ({ garantias = [], avales = [], canEdit = false } = {}) => {
  const activeSlots = getActiveAvalSlots(garantias);

  return activeSlots.map((slot) => {
    const avalIndex = slot - 1;
    const aval = createAvalState((avales || [])[avalIndex] || {});
    const linkedGarantias = (garantias || [])
      .map((garantia, index) => ({ ...garantia, formIndex: index }))
      .filter((garantia) => normalizeAvalSlot(garantia?.aval_slot) === slot);
    const status = getAvalGroupStatus({ aval, garantias: linkedGarantias });
    const isExisting = Boolean(aval?.aval_id) && Boolean(aval?.is_existing);
    const fullName = buildAvalFullName(aval);

    return {
      slot,
      avalIndex,
      aval,
      garantias: linkedGarantias,
      garantiaCount: linkedGarantias.length,
      displayName: fullName || `Aval ${slot}`,
      documentLabel: aval?.numero_documento
        ? `${aval?.tipo_documento === 'CE' ? 'CE' : 'DNI'} ${aval.numero_documento}`
        : 'Documento pendiente',
      modeLabel: isExisting ? 'Aval existente' : (aval?.manual_mode || hasAvalContent(aval) ? 'Registro manual' : 'Pendiente'),
      isExisting,
      isComplete: status.code === 'complete',
      status,
      canEdit,
      lookupEnabled: isExisting,
      lookupOptions: isExisting && Array.isArray(aval?.garantias_registradas)
        ? aval.garantias_registradas
        : null,
    };
  });
};
