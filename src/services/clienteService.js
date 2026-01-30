import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

// ID del Rol para Clientes (según tu base de datos es 8)
const ROL_CLIENTE = 8;

export const createCliente = async (clienteData) => {
  const url = `${API_BASE_URL}/api/usuarios/store`;

  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(clienteData)
  });

  return handleResponse(response);
};

export const getClientes = async (page = 1, filters = {}) => {
  
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    estado: filters.estado || '',
    rol_id: ROL_CLIENTE
  });

  const url = `${API_BASE_URL}/api/usuarios/index?${params.toString()}`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
  });

  return handleResponse(response);
};

export const getClientesCombobox = async (page = 1, search = '') => {
  const params = new URLSearchParams({
    page: page,
    search: search,
    rol_id: ROL_CLIENTE,
  });

  const url = `${API_BASE_URL}/api/usuarios/index?${params.toString()}`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
  });

  return handleResponse(response);
};

export const showCliente = async (id) => {
  const url = `${API_BASE_URL}/api/usuarios/show/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};


export const updateCliente = async (id, clienteData) => {
  const url = `${API_BASE_URL}/api/usuarios/update/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(clienteData)
  });
  return handleResponse(response);
};


export const toggleClienteEstado = async (id, nuevoEstado) => {
    const url = `${API_BASE_URL}/api/usuarios/cambiar-estado/${id}`;
    
    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        
        body: JSON.stringify({ estado: nuevoEstado })
    });

    return handleResponse(response);
};