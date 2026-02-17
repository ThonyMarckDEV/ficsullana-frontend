const ADMISION_COPY_COMMON = {
  FALLBACK: {
    NA: 'N/A',
    SIN_NOMBRE: 'Sin nombre',
    NO_REGISTRADO: 'No registrado',
    SIN_MOTIVO: 'Sin motivo registrado.',
    SIN_COMENTARIO_REVISION: 'Sin comentario de revisión.',
    SIN_OBSERVACIONES: 'Sin observaciones registradas.',
    SIN_DETALLE: 'Sin detalle.',
  },
  COUNTERS: {
    ENTIDADES: 'N.° entidades',
    TIENDAS: 'N.° tiendas',
  },
  ACTIONS: {
    CERRAR: 'Cerrar',
    CANCELAR: 'Cancelar',
    PROCESANDO: 'Procesando...',
  },
  LABELS: {
    SOLICITANTE: 'Solicitante',
    TIPO_PRESTAMO: 'Tipo de préstamo',
    ESTADO_EXCEPCION: 'Estado excepción',
    MOTIVO_ASESOR: 'Motivo del asesor',
    OBSERVACION_ASESOR: 'Observación del asesor',
    COMENTARIO_REVISION: 'Comentario de revisión',
  },
};

const ADMISION_COPY_DETAIL_MODAL = {
  TABS: [
    { id: 'resumen', label: 'Resumen' },
    { id: 'excepciones', label: 'Excepciones' },
    { id: 'financiero', label: 'Financiero' },
    { id: 'auditoria', label: 'Auditoría' },
  ],
  HEADER: {
    TITLE: 'Ficha de Admisión',
    SUBTITLE_LOADING: 'Cargando...',
    SUBTITLE_PREFIX: 'Evaluación',
    SUBTITLE_CREATED_AT: 'Creado el',
    EXPORT_FILE_PREFIX: 'Ficha-Admision',
  },
  STATES: {
    SIN_EXCEPCION: 'Sin excepción',
    CON_EXCEPCION: 'Excepción',
  },
  EMPTY: {
    SIN_EXCEPCIONES: 'No se registraron excepciones.',
    SIN_REGLAS_BLOQUEANTES: 'No se registraron reglas bloqueantes.',
    SIN_SELECCIONES: 'No se registraron selecciones.',
    SIN_DEUDAS: 'Sin deudas registradas.',
    SIN_PROTESTOS: 'Sin protestos registrados.',
  },
  SECTION_TITLES: {
    EXCEPCIONES_DETECTADAS: 'Excepciones detectadas',
    REGLAS_BLOQUEANTES: 'Reglas bloqueantes',
    EXCEPCIONES_ASESOR: 'Excepciones seleccionadas por asesor',
    FINANCIERO: 'Financiero',
    DEUDAS: 'Deudas',
    PROTESTOS: 'Protestos',
    RESUMEN: 'Resumen',
    AUDITORIA: 'Auditoría',
  },
};

const ADMISION_COPY_EXCEPTION_MODAL = {
  REVIEW: {
    TITLE: 'Revisión de excepción',
    SUBTITLE: 'Revise el contexto de la admisión antes de resolver.',
    LOADING_DETAIL: 'Cargando información de la admisión...',
    ESTADO_PENDIENTE: 'PENDIENTE',
    ESTADO_NO_PENDIENTE: 'NO PENDIENTE',
    EXCEPCIONES_DETECTADAS: 'Excepciones detectadas',
    EXCEPCIONES_ASESOR: 'Excepciones seleccionadas por asesor',
    SIN_EXCEPCIONES: 'No se encontraron excepciones registradas.',
    SIN_SELECCION: 'No hay selección registrada.',
    COMENTARIO_REVISOR: 'Comentario del revisor (opcional)',
    PLACEHOLDER_COMENTARIO: 'Agregue una observación de revisión...',
    RECHAZANDO: 'Rechazando...',
    APROBANDO: 'Aprobando...',
    RECHAZAR: 'Rechazar',
    APROBAR: 'Aprobar',
  },
  SELECTION: {
    TITLE: 'Solicitud de Excepción',
    SUBTITLE: 'Seleccione todas las excepciones detectadas y detalle el motivo para continuar.',
    SUBTITLE_UPDATE: 'Seleccione todas las excepciones detectadas para actualizar la admisión en estado observado.',
    CONFIRM_TEXT: 'Confirmar excepción',
    SELECTED_TITLE: 'Selección de excepciones',
    MISSING_TITLE: 'Faltan excepciones por seleccionar',
    REASON_PLACEHOLDER: 'Detalle el motivo de excepción...',
  },
};

const ADMISION_COPY_ALERTS = {
  CAPITAL_RCS_SIN_SALDO: 'Cliente RCS sin saldo pendiente detectado en FICSULLANA. Se autocompletará saldo en 0.',
  STORE: {
    CLIENTE_SELECCIONADO: 'Cliente seleccionado.',
    PROSPECTO_SELECCIONADO: 'Prospecto seleccionado. Aplica solo a primer crédito.',
    PROSPECTO_CREADO: 'Prospecto creado y asignado correctamente.',
    RESULTADO_OK: 'Evaluación registrada exitosamente.',
    ERR_REGISTRO: 'Error al registrar la admisión',
    ERR_CARGA_CAPITAL: 'No se pudo consultar el capital pendiente de FICSULLANA.',
    ERR_REGLAS_BLOQUEANTES: 'La admisión incumple reglas bloqueantes.',
    ERR_PERMISO_EXCEPCION: 'No tiene permiso para solicitar excepciones de admisión.',
  },
  UPDATE: {
    RESULTADO_OK: 'Admisión actualizada correctamente.',
    ERR_ACTUALIZACION: 'Error al actualizar la admisión',
    ERR_CARGA_ADMISION: 'No se pudo cargar la información de la admisión.',
    ERR_CARGA_CAPITAL: 'No se pudo consultar el capital pendiente de FICSULLANA.',
    ERR_REGLAS_BLOQUEANTES: 'La admisión incumple reglas bloqueantes.',
    ERR_PERMISO_EXCEPCION: 'No tiene permiso para solicitar excepciones de admisión.',
  },
  EXCEPCION: {
    MOTIVO_REQUERIDO: 'Debe ingresar el motivo de excepción.',
    REGLAS_INCOMPLETAS: 'Debe seleccionar todas las excepciones detectadas.',
  },
  PROSPECTO: {
    EXCEPCION_INFO: 'Este prospecto se puede registrar, pero en admisión requerirá excepción.',
  },
};

export {
  ADMISION_COPY_COMMON,
  ADMISION_COPY_DETAIL_MODAL,
  ADMISION_COPY_EXCEPTION_MODAL,
  ADMISION_COPY_ALERTS,
};
