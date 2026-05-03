import { useCallback, useEffect, useState } from 'react';
import {
  getAdmisionContextEvaluacionConsumo,
  getAdmisionesElegiblesConsumo,
  getCatalogosEvaluacionConsumo,
  showEvaluacionConsumo,
} from 'services/evaluacionConsumoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import {
  createEmptyEvaluacionContext,
  normalizeEvaluacionContext,
} from 'utilities/pages/evaluacion/consumo/context';
import { mapApiToForm } from 'utilities/pages/evaluacion/consumo/transformers';
import {
  applyEvaluacionConsumoDerivedFields,
  createInitialEvaluacionCatalogos,
  normalizeEvaluacionCatalogos,
} from 'utilities/pages/evaluacion/consumo/formState';

const useEvaluacionConsumoBootstrap = ({
  id,
  isEditMode,
  setAlert,
  setForm,
}) => {
  const [loading, setLoading] = useState(true);
  const [catalogos, setCatalogos] = useState(createInitialEvaluacionCatalogos);
  const [admisiones, setAdmisiones] = useState([]);
  const [admisionesLoading, setAdmisionesLoading] = useState(false);
  const [admisionesLoaded, setAdmisionesLoaded] = useState(false);
  const [admisionesError, setAdmisionesError] = useState(null);
  const [contexto, setContexto] = useState(createEmptyEvaluacionContext());
  const [contextLoading, setContextLoading] = useState(false);

  const loadCatalogos = useCallback(async ({ applyToCurrentForm = true } = {}) => {
    const response = await getCatalogosEvaluacionConsumo();
    const nextCatalogos = normalizeEvaluacionCatalogos(response.data || {});

    setCatalogos(nextCatalogos);
    if (applyToCurrentForm) {
      setForm((previousForm) => applyEvaluacionConsumoDerivedFields(previousForm, nextCatalogos));
    }

    return nextCatalogos;
  }, [setForm]);

  const loadAdmisionesElegibles = useCallback(async ({ force = false } = {}) => {
    if (admisionesLoading) {
      return admisiones;
    }

    if (admisionesLoaded && !force) {
      return admisiones;
    }

    setAdmisionesLoading(true);
    setAdmisionesError(null);

    try {
      const response = await getAdmisionesElegiblesConsumo();
      const nextAdmisiones = response.data || [];

      setAdmisiones(nextAdmisiones);
      setAdmisionesLoaded(true);

      return nextAdmisiones;
    } catch (error) {
      const nextAlert = handleApiError(error, 'No se pudieron cargar las admisiones elegibles.');
      setAdmisionesError(nextAlert.message);
      setAlert(nextAlert);
      throw error;
    } finally {
      setAdmisionesLoading(false);
    }
  }, [admisiones, admisionesLoaded, admisionesLoading, setAlert]);

  const loadAdmisionContext = useCallback(async (admisionId) => {
    if (!admisionId) {
      setContexto(createEmptyEvaluacionContext());
      return;
    }

    setContextLoading(true);
    try {
      const response = await getAdmisionContextEvaluacionConsumo(admisionId);
      const source = response.data || response;
      setContexto(normalizeEvaluacionContext(source));
    } finally {
      setContextLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (isEditMode) {
          const [nextCatalogos, detail] = await Promise.all([
            loadCatalogos({ applyToCurrentForm: false }),
            showEvaluacionConsumo(id),
          ]);
          const source = detail.data || detail;
          const mapped = mapApiToForm(source);

          setForm(applyEvaluacionConsumoDerivedFields(mapped, nextCatalogos));
          setContexto(normalizeEvaluacionContext(source.contexto));
        } else {
          await loadCatalogos();
        }
      } catch (error) {
        setAlert(handleApiError(error, 'No se pudo cargar el formulario de evaluación consumo.'));
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEditMode, loadCatalogos, setAlert, setForm]);

  return {
    loading,
    catalogos,
    admisiones,
    admisionesLoading,
    admisionesError,
    contexto,
    setContexto,
    contextLoading,
    loadAdmisionContext,
    loadAdmisionesElegibles,
  };
};

export default useEvaluacionConsumoBootstrap;
