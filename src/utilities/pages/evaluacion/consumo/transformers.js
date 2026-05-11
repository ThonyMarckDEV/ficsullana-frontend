/**
 * Barrel re-export file for backward compatibility.
 *
 * All original exports are preserved — existing imports from
 * 'utilities/pages/evaluacion/consumo/transformers' continue to work.
 *
 * New code should import directly from:
 *   - garantiaFactory  — garantia row factories and helpers
 *   - avalFactory      — aval state factories and helpers
 *   - apiMappers       — API ↔ form data mappers
 */

// ── Garantia factories & helpers ────────────────────────────────────
export {
  SIMPLE_GARANTIA_VALUE,
  AVAL_GARANTIA_VALUE,
  MAX_AVALES,
  normalizeGarantiaClass,
  normalizeAvalSlot,
  isAvalGuarantee,
  hasGarantiaContent,
  createGarantiaRow,
  createSolicitanteGarantiaRow,
  createAvalGarantiaRow,
  createIngresoRow,
  getActiveAvalSlots,
  parseRangoTasa,
} from './garantiaFactory';

// ── Aval factories & helpers ────────────────────────────────────────
export {
  buildAvalFullName,
  buildAvalDireccion,
  hasAvalContent,
  hasAvales,
  createAvalState,
  mapAvalLookupToState,
} from './avalFactory';

// ── API ↔ Form mappers ─────────────────────────────────────────────
export {
  mapApiToForm,
  mapFormToPayload,
} from './apiMappers';