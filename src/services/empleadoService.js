import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/empleados`;

export const getEmpleados = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({ page, ...filters });
  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
  return handleResponse(response);
};

export const createEmpleado = async (data) => {
  const response = await fetchWithAuth(`${BASE_URL}/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const showEmpleado = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
  return handleResponse(response);
};

export const updateEmpleado = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const toggleEmpleadoEstado = async (id, nuevoEstado) => {
  const response = await fetchWithAuth(`${BASE_URL}/cambiar-estado/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado })
  });
  return handleResponse(response);
};