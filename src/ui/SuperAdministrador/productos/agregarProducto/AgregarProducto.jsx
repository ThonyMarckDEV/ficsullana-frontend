import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProducto } from 'services/productoService';
import ProductoForm from '../components/ProductoForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler'; 

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
      
      setTimeout(() => navigate('/superadmin/listar-productos'), 2000);

    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar el producto'));
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6 border-b-2 border-fic-red pb-4">
        <h1 className="text-3xl font-black text-fic-dark">Nuevo Producto Financiero</h1>
        <button 
            onClick={() => navigate('/superadmin/listar-productos')} 
            className="font-bold text-slate-500 hover:text-fic-red transition-colors"
        >
            ← Volver
        </button>
      </div>

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