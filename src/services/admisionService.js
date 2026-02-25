import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/admisiones`;

export const getAdmisiones = async (page = 1, filters = {}) => {
  
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    estado: filters.estado || ''
  });

  const url = `${API_BASE_URL}/api/admisiones/index?${params.toString()}`;
  
  const response = await fetchWithAuth(url, { 
      method: 'GET', 
      headers: { 'Accept': 'application/json' } 
  });
  
  return handleResponse(response);
};

export const createAdmision = async (data) => {
  const url = `${BASE_URL}/store`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const evaluarAdmision = async (data) => {
  const url = `${BASE_URL}/evaluar`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const getCapitalPendienteFicsullana = async (clienteId) => {
  const url = `${BASE_URL}/capital-pendiente/${clienteId}`;
  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
};

export const showAdmision = async (id) => {
  const url = `${BASE_URL}/show/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};

export const updateAdmision = async (id, data) => {
  const url = `${BASE_URL}/update/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const updateEstado = async (id, data) => {
  const url = `${BASE_URL}/update-estado/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};


export const resolverExcepcionAdmision = async (id, data) => {
  const url = `${BASE_URL}/resolver-excepcion/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};
