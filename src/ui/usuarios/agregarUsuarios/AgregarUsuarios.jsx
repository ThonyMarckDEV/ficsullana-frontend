import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlusIcon, CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createUsuario } from 'services/usuarioService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import DatosForm from 'components/Shared/Formularios/Empleado/DatosForm';
import CuentaForm from 'components/Shared/Formularios/Empleado/CuentaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { useAuth } from 'context/AuthContext';

const AgregarUsuario = ({ rolId: propRolId, rolNombre: propRolNombre }) => {
    const navigate = useNavigate();
    const { idRol: urlRolId } = useParams();
    
    const rolId = propRolId || urlRolId;

    const { roles } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [dynamicRoleName, setDynamicRoleName] = useState("");

    const [formData, setFormData] = useState({
        rol_id: parseInt(rolId),
        datos_empleado: { 
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', 
            fechaNacimiento: '', fechaIngreso: '', sexo: '', estadoCivil: '',
            direccion: '', departamento: '', provincia: '', distrito: '',
            telefono: '', area_id: '', cuentaBancaria: '', cci: '', banco: ''
        },
        username: '',  
        email: '',
        password: '', 
        password_confirmation: ''
    });

    useEffect(() => {
        if (!propRolNombre && roles && rolId) {
            const role = roles.find(r => r.id === parseInt(rolId));
            if (role) setDynamicRoleName(role.nombre.replace(/_/g, ' ').toUpperCase());
        }
    }, [rolId, propRolNombre, roles]);


    const STEPS = [{ id: 1, name: 'Datos Personales' }, { id: 2, name: 'Cuenta Acceso' }];

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await createUsuario(formData);
            setAlert({ type: 'success', message: response.message });
            setTimeout(() => {
                navigate(`/personal/listar/${rolId}`);
            }, 1500);
        } catch (error) {
            setAlert(handleApiError(error, `Error al registrar personal`));
        } finally {
            setLoading(false);
        }
    };

    const finalRoleName = propRolNombre || dynamicRoleName || "Usuario";

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <PageHeader 
                title={`Nuevo ${finalRoleName}`}
                subtitle={`Registro de personal administrativo`}
                icon={UserPlusIcon}
                buttonText="← Volver"
                buttonLink={`/personal/listar/${rolId}`} 
            />

            <AlertMessage {...alert} onClose={() => setAlert(null)} />
            
            <div className="mb-10 max-w-3xl mx-auto flex items-center w-full relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 rounded"></div>
                {STEPS.map((step) => (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-4 transition-all duration-300 z-10 
                            ${currentStep >= step.id ? 'bg-fic-red border-white text-white shadow-lg scale-110' : 'bg-white border-slate-300 text-slate-400'}`}>
                            {currentStep > step.id ? <CheckIcon className="w-6 h-6"/> : step.id}
                        </div>
                        <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${currentStep >= step.id ? 'text-fic-red' : 'text-slate-400'}`}>{step.name}</span>
                    </div>
                ))}
            </div>

            <form className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100 min-h-[400px] flex flex-col justify-between">
                <div className="animate-fade-in">
                    {currentStep === 1 
                        ? (
                            <DatosForm 
                                data={formData.datos_empleado} 
                                email={formData.email}
                                handleRootChange={(e) => handleChange(e)}
                                handleChange={(e) => handleChange(e, 'datos_empleado')} 
                            />
                        )
                        : <CuentaForm data={formData} handleChange={(e) => handleChange(e)} />
                    }
                </div>

                <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={() => setCurrentStep(1)} 
                        disabled={currentStep === 1 || loading} 
                        className="px-8 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-bold transition-all"
                    >
                        ← Anterior
                    </button>
                    
                    {currentStep === 1 ? (
                        <button 
                            type="button" 
                            onClick={() => setCurrentStep(2)} 
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
                            {loading ? 'Guardando...' : `Finalizar Registro`}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AgregarUsuario;