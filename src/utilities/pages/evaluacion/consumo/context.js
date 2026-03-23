export const createEmptyEvaluacionContext = () => ({
  is_prospecto: false,
  historial_interno: {
    visible: false,
    rows: [],
  },
  historial_externo: {
    deudas: [],
    protestos: [],
  },
  excepciones: [],
});

export const EMPTY_EVALUACION_CONTEXTO = createEmptyEvaluacionContext();

export const normalizeEvaluacionContext = (contexto) => ({
  is_prospecto: Boolean(contexto?.is_prospecto),
  historial_interno: {
    visible: Boolean(contexto?.historial_interno?.visible),
    rows: Array.isArray(contexto?.historial_interno?.rows) ? contexto.historial_interno.rows : [],
  },
  historial_externo: {
    deudas: Array.isArray(contexto?.historial_externo?.deudas) ? contexto.historial_externo.deudas : [],
    protestos: Array.isArray(contexto?.historial_externo?.protestos) ? contexto.historial_externo.protestos : [],
  },
  excepciones: Array.isArray(contexto?.excepciones) ? contexto.excepciones : [],
});