// src/services/asesorService.js
import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

export const createAsesor = async (data) => {
  const url = `${API_BASE_URL}/api/asesores/store`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const getAsesores = async (page = 1, search = '') => {
  const url = `${API_BASE_URL}/api/asesores/index?page=${page}&search=${search}`;
  const response = await fetchWithAuth(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
  return handleResponse(response);
};

export const showAsesor = async (id) => {
  const url = `${API_BASE_URL}/api/asesores/show/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};

export const updateAsesor = async (id, data) => {
  const url = `${API_BASE_URL}/api/asesores/update/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const toggleAsesorEstado = async (id, nuevoEstado) => {
    const url = `${API_BASE_URL}/api/asesores/cambiar-estado/${id}`;
    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    return handleResponse(response);
};