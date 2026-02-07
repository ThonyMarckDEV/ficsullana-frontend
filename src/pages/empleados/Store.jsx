import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlusIcon, CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createEmpleado } from 'services/empleadoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { buildAddressLine } from 'utilities/addressFormatter';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { useAuth } from 'context/AuthContext';

import DatosForm from 'components/Shared/Formularios/Empleado/DatosForm';
import CuentasBancariasMultiples from 'components/Shared/Formularios/CuentasBancariasMultiples';
import CuentaForm from 'components/Shared/Formularios/Empleado/CuentaForm';

const EMPTY_BANK_ACCOUNT = {
    entidad_financiera_id: '',
    numero_cuenta: '',
    cci: ''
};

const Store = ({ rolId: propRolId, rolNombre: propRolNombre }) => {
    const navigate = useNavigate();
    const { idRol: urlRolId } = useParams();
    const rolId = propRolId || urlRolId;
    const { roles } = useAuth();
    
    const STEPS = [{ id: 1, name: 'Datos Personales' }, { id: 2, name: 'Datos Bancarios' }, { id: 3, name: 'Cuenta Acceso' }];
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [dynamicRoleName, setDynamicRoleName] = useState("");
    const [isCuentaAccesoValida, setIsCuentaAccesoValida] = useState(false);

    const [formData, setFormData] = useState({
        rol_id: parseInt(rolId),
        // 1. Datos Personales 
        datos_empleado: { 
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', 
            fechaNacimiento: '', fechaIngreso: '', sexo: '', estadoCivil: '',
            tipoVia: '', nombreVia: '', numeroMzLt: '', urbanizacion: '',
            direccion: '', departamento: '', provincia: '', distrito: '',
            area_id: '',
            esCarnetExtranjeria: false,
        },
        // 2. Contacto 
        empleado_datos_contacto: {
            telefono: '',
            correo: '',
            correos: ['']
        },
        // 3. Login
        username: '', 
        password: '', 
        password_confirmation: '',
        // 4. Banco
        empleado_cuentas_bancarias: [{ ...EMPTY_BANK_ACCOUNT }]
    });

    useEffect(() => {
        if (!propRolNombre && roles && rolId) {
            const role = roles.find(r => r.id === parseInt(rolId));
            if (role) setDynamicRoleName(role.nombre.replace(/_/g, ' ').toUpperCase());
        }
    }, [rolId, propRolNombre, roles]);

    const normalizeValue = (name, value, section) => {
        if (typeof value !== 'string') return value;
        if (name === 'correo' || name === 'email') return value.toLowerCase();
        if (!section && ['username', 'password', 'password_confirmation'].includes(name)) return value;
        return value.toUpperCase();
    };

    const handleChange = (e, section) => {
        const { name, value, type, checked } = e.target;
        const nextValue = type === 'checkbox' ? checked : normalizeValue(name, value, section);
        
        if (name === 'telefono' && section === 'datos_empleado') {
             setFormData(prev => ({ 
                ...prev, 
                empleado_datos_contacto: { ...prev.empleado_datos_contacto, telefono: nextValue } 
            }));
            return;
        }

        if (name === 'email' || name === 'correo') {
            const correoValue = String(nextValue || '').toLowerCase();
            setFormData(prev => ({ 
               ...prev, 
               empleado_datos_contacto: { ...prev.empleado_datos_contacto, correo: correoValue, correos: [correoValue] }
           }));
           return;
       }

        if (section) {
            setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: nextValue } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: nextValue }));
        }
    };

    const handleCuentasBancariasChange = (cuentas) => {
        setFormData(prev => ({ ...prev, empleado_cuentas_bancarias: cuentas }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!isCuentaAccesoValida) {
            setAlert({
                type: 'error',
                message: 'Valida la cuenta de acceso: contraseña mínima de 8 caracteres, carácter especial y confirmación.'
            });
            return;
        }

        setLoading(true);
        
        try {
            const payload = { ...formData };
            payload.datos_empleado = {
                ...payload.datos_empleado,
                direccion: buildAddressLine(payload.datos_empleado)
            };
            const correosLimpios = (payload.empleado_datos_contacto?.correos || [])
                .map(correo => String(correo || '').trim().toLowerCase())
                .filter(Boolean);

            payload.empleado_datos_contacto = {
                ...payload.empleado_datos_contacto,
                correos: correosLimpios,
                correo: correosLimpios[0] || ''
            };

            const cuentasLimpias = (payload.empleado_cuentas_bancarias || [])
                .map(cuenta => ({
                    entidad_financiera_id: cuenta.entidad_financiera_id,
                    numero_cuenta: cuenta.numero_cuenta,
                    cci: cuenta.cci || ''
                }))
                .filter(cuenta => cuenta.entidad_financiera_id || cuenta.numero_cuenta || cuenta.cci);

            if (cuentasLimpias.length === 0) {
                delete payload.empleado_cuentas_bancarias; 
            } else {
                payload.empleado_cuentas_bancarias = cuentasLimpias;
            }

            const response = await createEmpleado(payload);
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

    const renderStep = () => {
        switch(currentStep) {
            case 1:
                const datosCombinados = {
                    ...formData.datos_empleado,
                    telefono: formData.empleado_datos_contacto.telefono
                };

                return (
                    <DatosForm 
                        data={datosCombinados}
                        emails={formData.empleado_datos_contacto.correos}
                        onEmailsChange={(nextEmails) =>
                            setFormData(prev => ({
                                ...prev,
                                empleado_datos_contacto: {
                                    ...prev.empleado_datos_contacto,
                                    correos: nextEmails.map((email) => String(email || '').toLowerCase()),
                                    correo: String(nextEmails[0] || '').toLowerCase()
                                }
                            }))
                        }
                        handleRootChange={(e) => handleChange(e)}
                        handleChange={(e) => handleChange(e, 'datos_empleado')} 
                    />
                );
            case 2:
                return (
                    <CuentasBancariasMultiples
                        data={formData.empleado_cuentas_bancarias}
                        onChange={handleCuentasBancariasChange}
                    />
                );
            case 3:
                return (
                    <CuentaForm 
                        data={{...formData, email: formData.empleado_datos_contacto.correo}}
                        handleChange={(e) => handleChange(e)}
                        onValidationChange={setIsCuentaAccesoValida}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <PageHeader title={`Nuevo ${propRolNombre || dynamicRoleName || "Usuario"}`} subtitle={`Registro de personal administrativo`} icon={UserPlusIcon} buttonText="← Volver" buttonLink={`/personal/listar/${rolId}`} />
            <AlertMessage {...alert} onClose={() => setAlert(null)} />
            
            <div className="mb-12 max-w-5xl mx-auto flex items-center w-full relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 rounded"></div>
                {STEPS.map((step) => (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border-4 transition-all duration-300 z-10 ${currentStep >= step.id ? 'bg-fic-red border-white text-white shadow-lg scale-110' : 'bg-white border-slate-300 text-slate-400'}`}>
                            {currentStep > step.id ? <CheckIcon className="w-8 h-8"/> : step.id}
                        </div>
                        <span className={`mt-3 text-xs font-bold uppercase tracking-wider ${currentStep >= step.id ? 'text-fic-red' : 'text-slate-400'}`}>{step.name}</span>
                    </div>
                ))}
            </div>

            <form className="max-w-7xl mx-auto bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 min-h-[600px] flex flex-col justify-between">
                <div className="animate-fade-in">{renderStep()}</div>
                <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
                    <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 1 || loading} className="px-8 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-bold transition-all">← Anterior</button>
                    {currentStep < 3 ? (
                        <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="flex items-center gap-2 px-10 py-3 text-white bg-fic-red rounded-xl hover:bg-red-700 font-black uppercase tracking-wide shadow-lg transition-all">Siguiente <ChevronRightIcon className="w-4 h-4" /></button>
                    ) : (
                        <button type="button" onClick={handleSubmit} disabled={loading || !isCuentaAccesoValida} className="px-12 py-3 text-fic-dark bg-fic-yellow rounded-xl hover:bg-yellow-400 font-black uppercase tracking-wide shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Guardando...' : `Finalizar Registro`}</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Store;