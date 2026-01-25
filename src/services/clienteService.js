import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

export const createCliente = async (clienteData) => {
  const url = `${API_BASE_URL}/api/clientes/store`;

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

export const getClientes = async (page = 1) => {
  const url = `${API_BASE_URL}/api/clientes/index?page=${page}`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
  });

  return handleResponse(response);
};

export const getClientesCombobox = async (page = 1) => {
  const url = `${API_BASE_URL}/api/clientes/index-combobox?page=${page}`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
  });

  return handleResponse(response);
};

export const showCliente = async (id) => {
  const url = `${API_BASE_URL}/api/clientes/show/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};


export const updateCliente = async (id, clienteData) => {
  const url = `${API_BASE_URL}/api/clientes/update/${id}`;
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
    const url = `${API_BASE_URL}/api/clientes/cambiar-estado/${id}`;
    
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