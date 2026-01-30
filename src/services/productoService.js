import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

export const createProducto = async (data) => {
  const url = `${API_BASE_URL}/api/productos/store`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const getProductos = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
  });

  const url = `${API_BASE_URL}/api/productos/index?${params.toString()}`;
  
  const response = await fetchWithAuth(url, { 
      method: 'GET', 
      headers: { 'Accept': 'application/json' } 
  });
  
  return handleResponse(response);
};

export const showProducto = async (id) => {
  const url = `${API_BASE_URL}/api/productos/show/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};

export const updateProducto = async (id, data) => {
  const url = `${API_BASE_URL}/api/productos/update/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};