import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteForm from '../components/formularios/ClienteForm';
import ContactosForm from '../components/formularios/ContactosForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createCliente } from 'services/clienteService';
import { UserPlusIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';

const initialFormData = {
  datos_cliente: {
    nombre: '', apellidoPaterno: '', apellidoMaterno: '', apellidoConyuge: '',
    estadoCivil: '', sexo: '', dni: '', fechaNacimiento: '', fechaCaducidadDni: '',
    nacionalidad: 'Peruana', residePeru: true, nivelEducativo: '', profesion: '',
    enfermedadesPreexistentes: false, ruc: '', expuestaPoliticamente: false,
  },
  contactos: { telefonoMovil: '', telefonoFijo: '', correo: '' }
};

const STEPS = [
  { id: 1, name: 'Datos Personales' },
  { id: 2, name: 'Contacto' },
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
      const response = await createCliente(formData);
      setAlert({ type: 'success', message: response.message || 'Cliente registrado exitosamente.' });
      setFormData(initialFormData);
      setTimeout(() => navigate('/clientes/listar'), 2000);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar el cliente'));
    } finally {
      setLoading(false);
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

      {/* FORMULARIO EXTENDIDO */}
      <div className="max-w-[1600px] mx-auto">
        <form className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl border border-slate-100">
          <div className="min-h-[300px]">
            {currentStep === 1 
              ? <ClienteForm data={formData.datos_cliente} handleChange={(e) => handleChange(e, 'datos_cliente')} />
              : <ContactosForm data={formData.contactos} handleChange={(e) => handleChange(e, 'contactos')} />
            }
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