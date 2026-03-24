import { useCallback, useState } from 'react';
import { getCapitalPendienteFicsullana } from 'services/admisionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { ADMISION_COPY_ALERTS } from 'utilities/pages/admision/copy';

const useCapitalPendienteFicsullana = ({ setAlert, errorMessage }) => {
  const [capitalPendienteFicsullana, setCapitalPendienteFicsullana] = useState(0);
  const [capitalLoading, setCapitalLoading] = useState(false);

  const resetCapitalPendiente = useCallback(() => {
    setCapitalPendienteFicsullana(0);
    setCapitalLoading(false);
  }, []);

  const loadCapitalPendiente = useCallback(async (clienteId) => {
    if (!clienteId) {
      resetCapitalPendiente();
      return 0;
    }

    setCapitalLoading(true);
    try {
      const response = await getCapitalPendienteFicsullana(clienteId);
      const capitalPendiente = Number(response?.data?.capital_pendiente_ficsullana ?? 0);
      const normalizedCapital = Number.isFinite(capitalPendiente) ? capitalPendiente : 0;

      setCapitalPendienteFicsullana(normalizedCapital);

      if (normalizedCapital <= 0) {
        setAlert({
          type: 'info',
          message: ADMISION_COPY_ALERTS.CAPITAL_RCS_SIN_SALDO,
        });
      }

      return normalizedCapital;
    } catch (error) {
      setCapitalPendienteFicsullana(0);
      setAlert(handleApiError(error, errorMessage));
      return 0;
    } finally {
      setCapitalLoading(false);
    }
  }, [errorMessage, resetCapitalPendiente, setAlert]);

  return {
    capitalPendienteFicsullana,
    capitalLoading,
    loadCapitalPendiente,
    resetCapitalPendiente,
  };
};

export default useCapitalPendienteFicsullana;