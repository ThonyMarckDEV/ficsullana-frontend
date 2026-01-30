import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

export const createRol = async (data) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/roles/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const getRoles = async (page = 1, filters = {}) => {
  
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '', 
    estado: filters.estado || ''  
  });

  const url = `${API_BASE_URL}/api/roles/index?${params.toString()}`;
  
  const response = await fetchWithAuth(url, { 
      method: 'GET', 
      headers: { 'Accept': 'application/json' } 
  });
  
  return handleResponse(response);
};

export const showRol = async (id) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/roles/show/${id}`, { method: 'GET' });
  return handleResponse(response);
};

export const updateRol = async (id, data) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/roles/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const toggleRolEstado = async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/roles/cambiar-estado/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
    return handleResponse(response);
};

// NUEVO: Obtener la lista completa de permisos para llenar el formulario
export const getPermisosDisponibles = async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/roles/permisos-disponibles`, { method: 'GET' });
    return handleResponse(response);
};