import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/actividades-no-sensibles`;

export const getActividadesNoSensibles = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page,
    search: filters.search || '',
  });

  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const getActividadesNoSensiblesCombobox = async (page = 1, search = '') => {
  const params = new URLSearchParams({
    page,
    search,
  });

  const response = await fetchWithAuth(`${BASE_URL}/index-combobox?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const createActividadNoSensible = async (data) => {
  const response = await fetchWithAuth(`${BASE_URL}/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const showActividadNoSensible = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return handleResponse(response);
};

export const updateActividadNoSensible = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};
