import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createCliente } from 'services/clienteService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
//Formularios
import ClienteForm from 'components/Shared/Formularios/Cliente/ClienteForm';
import ContactosForm from 'components/Shared/Formularios/Cliente/ContactosForm';
import CuentasBancarias from 'components/Shared/Formularios/CuentasBancarias';

const initialFormData = {
  datos_cliente: {
    nombre: '', apellidoPaterno: '', apellidoMaterno: '', apellidoConyuge: '',
    estadoCivil: '', sexo: '', dni: '', fechaNacimiento: '', fechaCaducidadDni: '',
    nacionalidad: 'Peruana', residePeru: true, nivelEducativo: '', profesion: '',
    enfermedadesPreexistentes: false, ruc: '', expuestaPoliticamente: false,
  },
  contactos: { telefonoMovil: '', telefonoFijo: '', correo: '' },
  banco: { entidad_financiera_id: '', numero_cuenta: '', cci: '' }
};

const STEPS = [
  { id: 1, name: 'Datos Personales' },
  { id: 2, name: 'Contacto' },
  { id: 3, name: 'Datos Bancarios' },
];

const AgregarCliente = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e, section) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
          ...prev,
          [section]: {
              ...prev[section],
              [name]: type === 'checkbox' ? checked : value,
          }
      }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setAlert(null); 
    
    try {
      const payload = {
          datos_cliente: formData.datos_cliente,
          
          cliente_datos_contacto: {
              telefono: formData.contactos.telefonoMovil,
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

      const response = await createCliente(payload);
      setAlert({ type: 'success', message: response.message || 'Cliente registrado exitosamente.' });
      
      setTimeout(() => navigate('/clientes/listar'), 1500);

    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar el cliente'));
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
      switch(currentStep) {
          case 1: 
              return <ClienteForm data={formData.datos_cliente} handleChange={(e) => handleChange(e, 'datos_cliente')} />;
          case 2: 
              return <ContactosForm data={formData.contactos} handleChange={(e) => handleChange(e, 'contactos')} />;
          case 3: 
              return <CuentasBancarias data={formData.banco} handleChange={(e) => handleChange(e, 'banco')} />;
          default: return null;
      }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <PageHeader 
        title="Registro de Cliente"
        subtitle="Nuevo socio comercial"
        icon={UserPlusIcon}
        buttonText="← Volver al listado"
        buttonLink="/clientes/listar"
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      {/* Indicador de Pasos */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="flex items-center w-full relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 rounded"></div>
            {STEPS.map((step) => {
                const isActive = currentStep >= step.id;
                const isCompleted = currentStep > step.id;
                return (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base border-4 transition-all duration-300 z-10
                            ${isActive ? 'bg-fic-red border-white text-white shadow-lg scale-110' : 'bg-white border-slate-300 text-slate-400'}`}>
                            {isCompleted ? <CheckIcon className="w-5 h-5"/> : step.id}
                        </div>
                        <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-fic-red' : 'text-slate-400'}`}>
                            {step.name}
                        </span>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Contenedor del Formulario */}
      <div className="max-w-[1600px] mx-auto">
        <form className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl border border-slate-100">
          <div className="min-h-[300px] animate-fade-in">
            {renderStep()}
          </div>

          <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="px-8 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-bold transition-all"
            >
              ← Anterior
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-10 py-3 text-white bg-fic-red rounded-xl hover:bg-red-700 font-black uppercase tracking-wide shadow-lg transition-all"
              >
                Siguiente <ChevronRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-12 py-3 text-fic-dark bg-fic-yellow rounded-xl hover:bg-yellow-400 font-black uppercase tracking-wide shadow-lg transition-all"
              >
                {loading ? 'Guardando...' : 'Finalizar Registro'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarCliente;