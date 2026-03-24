import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/niveles-discrecionalidad`;

export const getNivelesDiscrecionalidad = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page,
    search: filters.search || '',
    tipo_evaluacion: filters.tipo_evaluacion || '',
    rol_autorizador_id: filters.rol_autorizador_id || '',
    estado: filters.estado || '',
  });

  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const getRolesAutorizadoresCombobox = async (page = 1, search = '') => {
  const params = new URLSearchParams({
    page,
    search,
  });

  const response = await fetchWithAuth(`${BASE_URL}/roles-autorizadores-combobox?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const createNivelDiscrecionalidad = async (data) => {
  const response = await fetchWithAuth(`${BASE_URL}/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const showNivelDiscrecionalidad = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const updateNivelDiscrecionalidad = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const toggleEstadoNivelDiscrecionalidad = async (id, estado) => {
  const response = await fetchWithAuth(`${BASE_URL}/cambiar-estado/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ estado }),
  });

  return handleResponse(response);
};
