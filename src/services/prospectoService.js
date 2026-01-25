import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/prospectos`;

export const getProspectos = async (page = 1, search = '') => {
  const term = encodeURIComponent(search);
  const url = `${BASE_URL}/index?page=${page}&search=${term}`;
  const response = await fetchWithAuth(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
  return handleResponse(response);
};

export const getProspectosCombobox = async (page = 1, search = '') => {
  const term = encodeURIComponent(search);
  const url = `${BASE_URL}/index-combobox?page=${page}&search=${term}`;
  const response = await fetchWithAuth(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
  return handleResponse(response);
};

export const createProspecto = async (data) => {
  const url = `${BASE_URL}/store`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const showProspectoByDni = async (dni) => {
  const url = `${BASE_URL}/show/${dni}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};