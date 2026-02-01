import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProducto } from 'services/productoService';
import ProductoForm from 'components/Shared/Formularios/Producto/ProductoForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler'; 
import { CubeIcon } from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';

const AgregarProducto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '', 
    rango_tasa: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await createProducto(formData);
      
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
            <ProductoForm data={formData} handleChange={handleChange} />
            
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

export default AgregarProducto;