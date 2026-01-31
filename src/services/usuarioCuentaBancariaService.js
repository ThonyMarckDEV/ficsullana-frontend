import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/usuarios`;

export const getUsuarioCuentasBancarias = async (usuarioId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${usuarioId}/cuentas-bancarias`, { method: 'GET' });
  return handleResponse(response);
};

export const createUsuarioCuentaBancaria = async (usuarioId, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/${usuarioId}/cuentas-bancarias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateUsuarioCuentaBancaria = async (usuarioId, cuentaId, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/${usuarioId}/cuentas-bancarias/${cuentaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};