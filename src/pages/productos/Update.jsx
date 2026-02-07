import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showProducto, updateProducto } from 'services/productoService';
import ProductoForm from 'components/Shared/Formularios/Producto/ProductoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { CubeIcon } from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';

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
        setFormData({
            nombre: data.nombre,
            rango_tasa: data.rango_tasa
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setAlert(null);

      try {
        const response = await updateProducto(id, formData);
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
            <ProductoForm data={formData} handleChange={handleChange} />

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