import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showProducto, updateProducto } from 'services/productoService';
import ProductoForm from 'components/Shared/Formularios/Producto/ProductoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { CubeIcon } from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import {
  buildProductoPayload,
  createEmptyProductoConfiguracion,
  getPeriodicidadOptionById,
  normalizeProducto,
  validateProductoForm,
} from 'utilities/productos';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await showProducto(id);
        const normalized = normalizeProducto(data);
        setFormData({
          ...normalized,
          configuraciones: (normalized.configuraciones || []).length > 0
            ? normalized.configuraciones
            : [createEmptyProductoConfiguracion()],
        });
      } catch (err) { 
        setAlert(handleApiError(err , 'No se pudo cargar la información del producto.')); 
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'activo' ? value === '1' : value,
    }));
  };

  const handleConfigChange = (index, field, value) => {
    setFormData((prev) => {
      const configuraciones = [...(prev.configuraciones || [])];
      const current = configuraciones[index];
      if (!current) return prev;

      if (field === 'periodicidad_id') {
        const periodicidad = getPeriodicidadOptionById(value);
        configuraciones[index] = {
          ...current,
          periodicidad_id: value,
          periodicidad_nombre: periodicidad.nombre,
          periodicidad_key: periodicidad.key,
          periodicidad_label: periodicidad.label,
          periodicidad_dias: periodicidad.dias,
        };
      } else {
        configuraciones[index] = {
          ...current,
          [field]: value,
        };
      }

      return {
        ...prev,
        configuraciones,
      };
    });
  };

  const handleAddConfig = () => {
    setFormData((prev) => ({
      ...prev,
      configuraciones: [...(prev.configuraciones || []), createEmptyProductoConfiguracion()],
    }));
  };

  const handleRemoveConfig = (index) => {
    setFormData((prev) => {
      const configuraciones = (prev.configuraciones || []).filter((_, currentIndex) => currentIndex !== index);
      return {
        ...prev,
        configuraciones: configuraciones.length > 0 ? configuraciones : [createEmptyProductoConfiguracion()],
      };
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const errors = validateProductoForm(formData);
      if (errors.length > 0) {
        setAlert({
          type: 'error',
          message: 'Complete la configuración del producto.',
          details: errors,
        });
        return;
      }

      setLoading(true);
      setAlert(null);

      try {
        const payload = buildProductoPayload(formData);
        const response = await updateProducto(id, payload);
        setAlert({ 
            type: 'success', 
            message: response.message || 'Producto actualizado correctamente.' 
        });
        setTimeout(() => navigate('/productos/listar'), 1500);

      } catch (err) {
        setAlert(handleApiError(err, 'Error al actualizar el producto'));
      } finally { 
        setLoading(false); 
      }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">

        <PageHeader 
          title="Datos del Producto"
          subtitle={`Actualizando: ${formData.nombre}`}
          icon={CubeIcon}
          buttonText="← Volver al listado"
          buttonLink="/productos/listar"
        />
      
      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 border-b pb-2">
                💳 Datos del Producto
            </h2>
            <ProductoForm
              data={formData}
              handleChange={handleChange}
              onConfigChange={handleConfigChange}
              onAddConfig={handleAddConfig}
              onRemoveConfig={handleRemoveConfig}
            />

            <div className="flex justify-end gap-4 mt-6">
                <button 
                    type="button" 
                    onClick={() => navigate('/productos/listar')} 
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="bg-fic-yellow text-fic-dark px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-yellow-500 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default Update;