import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/admisiones`;

export const getAdmisiones = async (page = 1, search = '', estado = '') => {
  const term = encodeURIComponent(search);
  const url = `${BASE_URL}/index?page=${page}&search=${term}&estado=${estado}`;
  const response = await fetchWithAuth(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
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