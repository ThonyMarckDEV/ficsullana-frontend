import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/garantias`;

export const getGarantiasByOwner = async ({ admisionId = null, evaluacionConsumoAvalId = null } = {}) => {
  const params = new URLSearchParams();

  if (admisionId) {
    params.set('admision_id', String(admisionId));
  }

  if (evaluacionConsumoAvalId) {
    params.set('evaluacion_consumo_aval_id', String(evaluacionConsumoAvalId));
  }

  const response = await fetchWithAuth(`${BASE_URL}/by-owner?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  return handleResponse(response);
};
