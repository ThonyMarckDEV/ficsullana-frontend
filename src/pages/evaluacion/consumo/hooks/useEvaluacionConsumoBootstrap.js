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
  const [contexto, setContexto] = useState(createEmptyEvaluacionContext());
  const [contextLoading, setContextLoading] = useState(false);

  const loadCatalogos = useCallback(async () => {
    const response = await getCatalogosEvaluacionConsumo();
    const nextCatalogos = normalizeEvaluacionCatalogos(response.data || {});

    setCatalogos(nextCatalogos);
    setForm((previousForm) => applyEvaluacionConsumoDerivedFields(previousForm, nextCatalogos));

    return nextCatalogos;
  }, [setForm]);

  const loadAdmisionesElegibles = useCallback(async () => {
    const response = await getAdmisionesElegiblesConsumo();
    setAdmisiones(response.data || []);
  }, []);

  const loadById = useCallback(async (recordId, currentCatalogos) => {
    const response = await showEvaluacionConsumo(recordId);
    const source = response.data || response;
    const mapped = mapApiToForm(source);

    setForm(applyEvaluacionConsumoDerivedFields(mapped, currentCatalogos));
    setContexto(normalizeEvaluacionContext(source.contexto));
  }, [setForm]);

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
        const nextCatalogos = await loadCatalogos();
        if (isEditMode) {
          await loadById(id, nextCatalogos);
        } else {
          await loadAdmisionesElegibles();
        }
      } catch (error) {
        setAlert(handleApiError(error, 'No se pudo cargar el formulario de evaluación consumo.'));
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEditMode, loadAdmisionesElegibles, loadById, loadCatalogos, setAlert]);

  return {
    loading,
    catalogos,
    admisiones,
    contexto,
    setContexto,
    contextLoading,
    loadAdmisionContext,
  };
};

export default useEvaluacionConsumoBootstrap;