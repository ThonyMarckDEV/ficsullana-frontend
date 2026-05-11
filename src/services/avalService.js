import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/avales`;

export const getAvalesCombobox = async (page = 1, search = '') => {
  const params = new URLSearchParams({
    page,
    search,
  });

  const response = await fetchWithAuth(`${BASE_URL}/index-combobox?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  return handleResponse(response);
};
