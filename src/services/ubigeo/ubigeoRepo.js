import peruData from "data/peru/peruData";

const TIPOS_VIA = [
  "URBANO",
  "INTERURBANO",
  "RURAL",
];

/**
 * API de lectura para UBIGEO local.
 * Devuelve arrays listos para combos.
 */
export function getDepartamentos() {
  return Object.keys(peruData);
}

export function getProvincias(departamentoKey) {
  if (!departamentoKey) return [];
  return Object.keys(peruData[departamentoKey] ?? {});
}

export function getDistritos(departamentoKey, provinciaKey) {
  if (!departamentoKey || !provinciaKey) return [];
  return peruData[departamentoKey]?.[provinciaKey] ?? [];
}

export function getTiposVia() {
  return TIPOS_VIA;
 }

export function formatUbigeoLabel(value = "") {
  return String(value).replaceAll("_", " ");
}