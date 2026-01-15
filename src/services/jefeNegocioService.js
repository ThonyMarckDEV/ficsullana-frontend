import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

export const createJefeNegocio = async (data) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/jefenegocios/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const getJefesNegocio = async (page = 1, search = '') => {
  const url = `${API_BASE_URL}/api/jefenegocios/index?page=${page}&search=${search}`;
  const response = await fetchWithAuth(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
  return handleResponse(response);
};

export const showJefeNegocio = async (id) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/jefenegocios/show/${id}`, { method: 'GET' });
  return handleResponse(response);
};

export const updateJefeNegocio = async (id, data) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/jefenegocios/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const toggleJefeEstado = async (id, nuevoEstado) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/jefenegocios/cambiar-estado/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    return handleResponse(response);
};