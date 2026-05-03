import {
  AVAL_GARANTIA_VALUE,
  MAX_AVALES,
  SIMPLE_GARANTIA_VALUE,
  getActiveAvalSlots,
  normalizeAvalSlot,
} from 'utilities/pages/evaluacion/consumo/transformers';

export const DOCUMENTO_GARANTIA_OPTIONS = [
  { value: '', label: 'SELECCIONE...' },
  { value: 'DECLARACION_JURADA', label: 'DECLARACION JURADA' },
];

export const TIPO_GARANTIA_OPTIONS = [
  { value: '', label: 'SELECCIONE...' },
  { value: 'BIEN', label: 'BIEN' },
];

export const CLASE_GARANTIA_OPTIONS = [
  { value: SIMPLE_GARANTIA_VALUE, label: 'SIMPLE' },
  { value: AVAL_GARANTIA_VALUE, label: 'AVAL' },
];

export const STATUS_STYLES = {
  complete: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  partial: 'border-amber-200 bg-amber-50 text-amber-700',
  pending: 'border-slate-200 bg-slate-100 text-slate-600',
};

export const baseInputClass = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-fic-red';
export const baseTextareaClass = `${baseInputClass} min-h-[88px] resize-none`;
export const labelClass = 'mb-1 block text-xs font-bold uppercase text-slate-500';

export const buildAvalOptions = (garantias = [], currentSlot) => {
  const normalizedCurrentSlot = normalizeAvalSlot(currentSlot);
  const slotSet = new Set(getActiveAvalSlots(garantias));

  if (normalizedCurrentSlot !== null) {
    slotSet.add(normalizedCurrentSlot);
  }

  const sortedSlots = Array.from(slotSet)
    .filter((slot) => slot >= 1 && slot <= MAX_AVALES)
    .sort((left, right) => left - right);

  const resolvedSlots = sortedSlots.length > 0 ? sortedSlots : [1];

  return resolvedSlots.map((slot) => ({
    value: String(slot),
    label: `Aval ${slot}`,
  }));
};
