import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/entidades-financieras`;

export const getEntidadesFinancieras = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    tipo: filters.tipo || '',    
    estado: filters.estado || ''  
  });

  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
  return handleResponse(response);
};

export const getEntidadesFinancierasCombobox = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/index-combobox`, { method: 'GET' });
  return handleResponse(response);
};

export const createEntidadFinanciera = async (data) => {
  const response = await fetchWithAuth(`${BASE_URL}/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const showEntidadFinanciera = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
  return handleResponse(response);
};

export const updateEntidadFinanciera = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const toggleEntidadFinancieraEstado = async (id, estado) => {
  const response = await fetchWithAuth(`${BASE_URL}/cambiar-estado/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });
  return handleResponse(response);
};