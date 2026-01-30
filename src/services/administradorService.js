// src/services/administradorService.js
import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

export const createAdministrador = async (data) => {
  const url = `${API_BASE_URL}/api/administradores/store`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const getAdministradores = async (page = 1, filters = {}) => {
  
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    estado: filters.estado || '',
    sede_id: filters.sede_id || ''
  });

  const url = `${API_BASE_URL}/api/administradores/index?${params.toString()}`;
  
  const response = await fetchWithAuth(url, { 
      method: 'GET', 
      headers: { 'Accept': 'application/json' } 
  });
  
  return handleResponse(response);
};
export const showAdministrador = async (id) => {
  const url = `${API_BASE_URL}/api/administradores/show/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};

export const updateAdministrador = async (id, data) => {
  const url = `${API_BASE_URL}/api/administradores/update/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const toggleAdminEstado = async (id) => {
    const url = `${API_BASE_URL}/api/administradores/cambiar-estado/${id}`;
    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};