import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/evaluaciones-consumo`;

export const getEvaluacionesConsumo = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    estado: filters.estado || '',
  });

  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const showEvaluacionConsumo = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const createEvaluacionConsumo = async (payload) => {
  const response = await fetchWithAuth(`${BASE_URL}/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const updateEvaluacionConsumo = async (id, payload) => {
  const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const updateEstadoEvaluacionConsumo = async (id, payload) => {
  const response = await fetchWithAuth(`${BASE_URL}/update-estado/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const getCatalogosEvaluacionConsumo = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/catalogos`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const getAdmisionesElegiblesConsumo = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/admisiones-elegibles`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const getAdmisionContextEvaluacionConsumo = async (admisionId) => {
  const response = await fetchWithAuth(`${BASE_URL}/admisiones-contexto/${admisionId}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const showParametroEvaluacionConsumo = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/evaluaciones-consumo-parametros/show`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const updateParametroEvaluacionConsumo = async (payload) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/evaluaciones-consumo-parametros/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};
