import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProducto } from 'services/productoService';
import ProductoForm from 'components/Shared/Formularios/Producto/ProductoForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler'; 
import { CubeIcon } from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import {
  buildProductoPayload,
  createEmptyProductoConfiguracion,
  getPeriodicidadOptionById,
  validateProductoForm,
} from 'utilities/productos';

const Store = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '', 
    tipo_evaluacion: '',
    activo: true,
    configuraciones: [createEmptyProductoConfiguracion()],
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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
      const response = await createProducto(payload);
      
      setAlert({
        type: 'success',
        message: response.message || 'Producto registrado exitosamente.'
      });
      
      setTimeout(() => navigate('/productos/listar'), 2000);

    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar el producto'));
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="container mx-auto p-6">
      
      <PageHeader 
        title="Nuevo Producto"
        subtitle="Configuración de nuevo producto financiero"
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
                💳 Información del Producto
            </h2>
            <ProductoForm
              data={formData}
              handleChange={handleChange}
              onConfigChange={handleConfigChange}
              onAddConfig={handleAddConfig}
              onRemoveConfig={handleRemoveConfig}
            />
            
            <div className="flex justify-end mt-6">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="bg-fic-red text-white px-10 py-3 rounded-lg font-black uppercase shadow-fic-red/20 shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Guardando...' : 'Registrar Producto'}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default Store;
