import React, { useEffect, useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import {
  showParametroEvaluacionConsumo,
  updateParametroEvaluacionConsumo,
} from 'services/evaluacionConsumoService';

const Configuracion = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [maxVecesSueldo, setMaxVecesSueldo] = useState('1');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await showParametroEvaluacionConsumo();
        const source = response.data || response;
        setMaxVecesSueldo(source.max_veces_sueldo !== null && source.max_veces_sueldo !== undefined
          ? String(source.max_veces_sueldo)
          : '1');
      } catch (error) {
        setAlert(handleApiError(error, 'No se pudo cargar la configuración de evaluación consumo.'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const response = await updateParametroEvaluacionConsumo({
        max_veces_sueldo: Number(maxVecesSueldo),
      });

      const source = response.data || response;
      setMaxVecesSueldo(String(source.max_veces_sueldo));
      setAlert({
        type: 'success',
        message: response.message || 'Configuración de evaluación consumo actualizada correctamente.',
      });
    } catch (error) {
      setAlert(handleApiError(error, 'No se pudo actualizar la configuración de evaluación consumo.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Configuración Evaluación Consumo"
        subtitle="Parámetros globales para la evaluación"
        icon={Cog6ToothIcon}
        buttonText="← Volver a evaluación"
        buttonLink="/evaluacion/consumo/listar"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-700 mb-2 border-b pb-4">
            Máximo de Veces Sueldo
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Este valor se aplicará globalmente en evaluación consumo para limitar el campo de veces sueldo.
          </p>

          <div>
            <label htmlFor="max-veces-sueldo" className="block text-xs font-bold text-slate-500 mb-1 uppercase">
              Máximo permitido
            </label>
            <input
              id="max-veces-sueldo"
              type="number"
              min="0.01"
              max="99.99"
              step="0.01"
              value={maxVecesSueldo}
              onChange={(event) => setMaxVecesSueldo(event.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-fic-red text-white px-8 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Configuracion;