import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showCliente, updateCliente } from 'services/clienteService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';

import { handleApiError } from 'utilities/Errors/apiErrorHandler';

import ClienteForm from '../components/formularios/ClienteForm';
import ContactosForm from '../components/formularios/ContactosForm';

const initialFormData = {
  datos_cliente: {
    nombre: '', apellidoPaterno: '', apellidoMaterno: '', apellidoConyuge: '',
    estadoCivil: '', sexo: '', dni: '', fechaNacimiento: '', fechaCaducidadDni: '',
    nacionalidad: '', residePeru: false, nivelEducativo: '', profesion: '',
    enfermedadesPreexistentes: false, ruc: '', expuestaPoliticamente: false,
  },
  contactos: { telefonoMovil: '', telefonoFijo: '', correo: '' },
};

const cleanNulls = (obj) => {
  if (obj === null || obj === undefined) return {};
  const newObj = { ...obj };
  for (const key in newObj) {
    if (newObj[key] === null) {
      newObj[key] = '';
    }
  }
  return newObj;
};

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await showCliente(id);
        const clienteData = response.data; 

        // IMPORTANTE: El backend devuelve datos_cliente (con guion bajo)
        const datosApi = cleanNulls(clienteData.datos_cliente);
        const contactosApi = cleanNulls(clienteData.contactos?.[0]);
        
        const structuredData = {
          // CAMBIO: Asegurar que la clave sea datos_cliente
          datos_cliente: {
            ...initialFormData.datos_cliente,
            ...datosApi,
            sexo: datosApi.sexo || '',
            residePeru: !!datosApi.residePeru,
            enfermedadesPreexistentes: !!datosApi.enfermedadesPreexistentes,
            expuestaPoliticamente: !!datosApi.expuestaPoliticamente,
          },
          contactos: { 
            ...initialFormData.contactos, 
            ...contactosApi 
          },
        };
        
        setFormData(structuredData);
      } catch (err) {
        setError("No se pudo cargar la información del cliente.");
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await updateCliente(id, formData);
        setAlert({ type: 'success', message: 'Cliente actualizado con éxito' });
        setTimeout(() => navigate('/asesor/listar-clientes'), 2000);
    } catch (err) {
        setAlert(handleApiError(err, 'Error al actualizar el cliente'));
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };


  if (loading) return <LoadingScreen />;
  if (error) return <div className="text-center p-8 text-red-600 font-bold border-2 border-red-100 rounded-lg m-4">{error}</div>;

  return (
    <div className="container mx-auto p-6 ">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">
        Editando Cliente: <span className="text-fic-red">{formData?.datos_cliente?.nombre} {formData?.datos_cliente?.apellidoPaterno}</span>
      </h1>
      
      {/* ALERTA (Mantiene 'details' para mostrar lista de errores) */}
      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          {formData && (
            <>
              <div className="bg-white p-8 rounded-lg shadow-md border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">Datos Personales</h2>
                  <ClienteForm data={formData.datos_cliente} handleChange={(e) => handleChange(e, 'datos_cliente')} />
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">Información de Contacto</h2>
                  <ContactosForm data={formData.contactos} handleChange={(e) => handleChange(e, 'contactos')} />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end mt-8 gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/asesor/listar-clientes')} 
            className="px-6 py-2 text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 font-bold"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-2 text-white bg-fic-yellow text-fic-dark font-black uppercase rounded-md hover:bg-yellow-500 shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarCliente;