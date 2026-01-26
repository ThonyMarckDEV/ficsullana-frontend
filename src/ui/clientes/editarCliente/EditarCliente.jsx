import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showCliente, updateCliente } from 'services/clienteService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import ClienteForm from '../components/formularios/ClienteForm';
import ContactosForm from '../components/formularios/ContactosForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const cleanNulls = (obj) => {
  if (!obj) return {};
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => { if (newObj[key] === null) newObj[key] = ''; });
  return newObj;
};

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await showCliente(id);
        const cli = response.data;
        setFormData({
          datos_cliente: cleanNulls(cli.datos_cliente),
          contactos: cleanNulls(cli.contactos?.[0])
        });
      } catch (err) {
        setAlert({ type: 'error', message: "No se pudo cargar el cliente." });
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [id]);

  const handleChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [name]: type === 'checkbox' ? checked : value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await updateCliente(id, formData);
        setAlert({ type: 'success', message: 'Cliente actualizado correctamente.' });
        setTimeout(() => navigate('/clientes/listar'), 1500);
    } catch (err) {
        setAlert(handleApiError(err, 'Error al actualizar'));
    } finally {
        setLoading(false);
    }
  };

  if (loading && !formData) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Edición Maestro de Cliente"
        subtitle={`Socio: ${formData.datos_cliente.nombre} ${formData.datos_cliente.apellidoPaterno}`}
        icon={PencilSquareIcon}
        buttonText="← Volver"
        buttonLink="/clientes/listar"
      />

      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <form onSubmit={handleSubmit} className="max-w-[1600px] mx-auto">
        {/* DISEÑO EN PARALELO (GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA PRINCIPAL (8/12) */}
          <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
              <div className="w-1.5 h-8 bg-fic-red rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Información del Titular</h2>
            </div>
            <ClienteForm data={formData.datos_cliente} handleChange={(e) => handleChange(e, 'datos_cliente')} />
          </div>

          {/* COLUMNA LATERAL (4/12) */}
          <div className="lg:col-span-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
              <div className="w-1.5 h-8 bg-fic-yellow rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Contacto</h2>
            </div>
            <ContactosForm data={formData.contactos} handleChange={(e) => handleChange(e, 'contactos')} />
            
            <div className="mt-10 p-5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Resumen de cambios</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Al guardar, se actualizarán los datos de contacto y la información personal en el core del sistema.
                </p>
            </div>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex justify-end mt-12 gap-4 py-8 border-t border-slate-200">
          <button 
            type="button" 
            onClick={() => navigate('/clientes/listar')} 
            className="px-8 py-3 text-slate-500 bg-white border border-slate-300 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            Descartar Cambios
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-12 py-3 bg-fic-red text-white font-black uppercase rounded-xl shadow-xl shadow-fic-red/20 hover:bg-red-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Guardando...' : 'Confirmar Actualización'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarCliente;