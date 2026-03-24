import { deriveEvaluacionConsumoFields } from 'utilities/pages/evaluacion/consumo/calculations';
import { normalizeProducto } from 'utilities/productos';

export const createInitialEvaluacionCatalogos = () => ({
  monedas: [],
  categorias: [],
  tipos_ingreso: [],
  productos: [],
  niveles_discrecionalidad: [],
  max_veces_sueldo_consumo: 1,
});

export const normalizeEvaluacionCatalogos = (source = {}) => ({
  ...createInitialEvaluacionCatalogos(),
  ...source,
  productos: (source.productos || []).map(normalizeProducto),
});

export const applyEvaluacionConsumoDerivedFields = (form, catalogos = createInitialEvaluacionCatalogos()) => (
  deriveEvaluacionConsumoFields(form, {
    tiposIngreso: catalogos.tipos_ingreso || [],
    maxVecesSueldo: catalogos.max_veces_sueldo_consumo,
  })
);

export const updateEvaluacionConsumoForm = (previousForm, updater, catalogos) => {
  const nextForm = typeof updater === 'function' ? updater(previousForm) : updater;
  return applyEvaluacionConsumoDerivedFields(nextForm, catalogos);
};