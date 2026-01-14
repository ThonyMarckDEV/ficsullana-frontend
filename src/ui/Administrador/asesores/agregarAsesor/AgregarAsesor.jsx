import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createAsesor } from 'services/asesorService';

// Componentes
import DatosAsesorForm from '../components/formularios/DatosAsesorForm';
import CuentaAsesorForm from '../components/formularios/CuentaAsesorForm';
import ContactosForm from '../components/formularios/ContactosAsesorForm';

const initialFormData = {
  datos: { nombres: '', apellidos: '', ci: '', fecha_nacimiento: ''},
  asesor: { username: '', password: '', password_confirmation: '' },
  contactos: { celular: '', telefono: '', email: '' }
};

const STEPS = [
  { id: 1, name: 'Datos Personales' },
  { id: 2, name: 'Cuenta Acceso' },
  { id: 3, name: 'Contacto' },
];

const AgregarAsesor = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e, section) => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          [section]: { ...prev[section], [name]: value }
      }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await createAsesor(formData);
      setAlert(response);
      setFormData(initialFormData);
      setCurrentStep(1);
      // setTimeout(() => navigate('/admin/listar-asesores'), 1500); 
    } catch (error) {
      setAlert(error);
    } finally {
      setLoading(false);
    }
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1: return <DatosAsesorForm data={formData.datos} handleChange={(e) => handleChange(e, 'datos')} />;
      case 2: return <CuentaAsesorForm data={formData.asesor} handleChange={(e) => handleChange(e, 'asesor')} />;
      case 3: return <ContactosForm data={formData.contactos} handleChange={(e) => handleChange(e, 'contactos')} />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b-4 border-fic-red pb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg text-fic-red">
                <UserPlusIcon className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-fic-dark uppercase">Nuevo Asesor</h1>
                <p className="text-slate-500 font-bold text-sm">Registro de personal operativo</p>
            </div>
        </div>
        <button onClick={() => navigate('/admin/listar-asesores')} className="font-bold text-slate-500 hover:text-fic-red">
            ← Cancelar
        </button>
      </div>

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      {/* STEPPER */}
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="flex items-center w-full relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 rounded"></div>
            {STEPS.map((step) => {
                const isActive = currentStep >= step.id;
                const isCompleted = currentStep > step.id;
                return (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-4 transition-all duration-300 z-10 ${isActive ? 'bg-fic-red border-white text-white shadow-lg scale-110' : 'bg-white border-slate-300 text-slate-400'}`}>
                            {isCompleted ? <CheckIcon className="w-6 h-6"/> : step.id}
                        </div>
                        <span className={`mt-2 text-xs font-bold uppercase ${isActive ? 'text-fic-red' : 'text-slate-400'}`}>{step.name}</span>
                    </div>
                );
            })}
        </div>
      </div>

      {/* FORMULARIO */}
      <div className="max-w-4xl mx-auto">
        <form className="bg-white p-8 rounded-xl shadow-xl border border-slate-100 min-h-[400px] flex flex-col justify-between">
          <div>{renderFormStep()}</div>

          <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
            <button type="button" onClick={handleBack} disabled={currentStep === 1 || loading} className="px-6 py-3 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 font-bold">
              ← Anterior
            </button>
            {currentStep < STEPS.length ? (
              <button type="button" onClick={handleNext} className="flex items-center gap-2 px-8 py-3 text-white bg-fic-red rounded-lg hover:bg-red-700 font-black uppercase shadow-lg">
                Siguiente <ChevronRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="px-8 py-3 text-fic-dark bg-fic-yellow rounded-lg hover:bg-yellow-400 font-black uppercase shadow-lg">
                {loading ? 'Guardando...' : 'Crear Asesor'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarAsesor;