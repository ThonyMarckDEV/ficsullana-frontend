import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showCliente, updateCliente } from 'services/clienteService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

// Formularios
import ClienteForm from 'components/Shared/Formularios/Cliente/ClienteForm';
import ContactosForm from 'components/Shared/Formularios/Cliente/ContactosForm';
import CuentasBancarias from 'components/Shared/Formularios/CuentasBancarias';

const cleanNulls = (obj, defaultStructure = {}) => {
  if (!obj) return defaultStructure;
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => { 
      if (newObj[key] === null || newObj[key] === undefined) {
          newObj[key] = ''; 
      }
  });
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
        
        const data = response.data.datos_cliente ? response.data : response.data.data;
        const { datos_cliente, cliente_datos_contacto, cliente_cuentas_bancarias } = data;
        
        const primerBanco = Array.isArray(cliente_cuentas_bancarias) 
            ? (cliente_cuentas_bancarias[0] || {}) 
            : (cliente_cuentas_bancarias || {});

        setFormData({
          datos_cliente: cleanNulls(datos_cliente),
          contactos: cleanNulls(cliente_datos_contacto, { telefono: '', telefonoFijo: '', correo: '' }),
          banco: cleanNulls(primerBanco, { entidad_financiera_id: '', numero_cuenta: '', cci: '' })
        });

      } catch (err) {
        setAlert({ type: 'error', message: "No se pudo cargar la información del cliente." });
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
    setAlert(null);

    try {
        const payload = {
            datos_cliente: formData.datos_cliente,
            cliente_datos_contacto: {
                telefono: formData.contactos.telefono,
                telefonoFijo: formData.contactos.telefonoFijo,
                correo: formData.contactos.correo
            },
            cliente_cuentas_bancarias: {
                entidad_financiera_id: formData.banco.entidad_financiera_id,
                numero_cuenta: formData.banco.numero_cuenta,
                cci: formData.banco.cci
            },
            rol_id: 8 
        };

        if (!payload.cliente_cuentas_bancarias.entidad_financiera_id) {
             delete payload.cliente_cuentas_bancarias; 
        }

        await updateCliente(id, payload);
        
        setAlert({ type: 'success', message: 'Cliente actualizado correctamente.' });
        setTimeout(() => navigate('/clientes/listar'), 1500);

    } catch (err) {
        const errorData = handleApiError(err, 'Error al actualizar el cliente');
        setAlert(errorData);
    } finally {
        setLoading(false);
    }
  };

  if (loading || !formData) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Edición Maestro de Cliente"
        subtitle={`Socio: ${formData.datos_cliente.nombre} ${formData.datos_cliente.apellidoPaterno}`}
        icon={PencilSquareIcon}
        buttonText="← Volver"
        buttonLink="/clientes/listar"
      />

      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

      <form onSubmit={handleSubmit} className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-8 border-b pb-4">
                    <div className="w-1.5 h-8 bg-fic-red rounded-full"></div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Información del Titular</h2>
                </div>
                <ClienteForm data={formData.datos_cliente} handleChange={(e) => handleChange(e, 'datos_cliente')} />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Datos Bancarios</h2>
              </div>
              <CuentasBancarias data={formData.banco} handleChange={(e) => handleChange(e, 'banco')} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6 sticky top-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <div className="w-1.5 h-8 bg-fic-yellow rounded-full"></div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Contacto</h2>
              </div>
              <ContactosForm data={formData.contactos} handleChange={(e) => handleChange(e, 'contactos')} />
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Nota de seguridad</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Los cambios sensibles (DNI) actualizarán automáticamente las credenciales de acceso del usuario asociado.
                </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-12 gap-4 py-8 border-t border-slate-200">
          <button 
            type="button" 
            onClick={() => navigate('/clientes/listar')} 
            className="px-8 py-3 text-slate-500 bg-white border border-slate-300 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-12 py-3 bg-fic-red text-white font-black uppercase rounded-xl shadow-xl shadow-fic-red/20 hover:bg-red-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarCliente;