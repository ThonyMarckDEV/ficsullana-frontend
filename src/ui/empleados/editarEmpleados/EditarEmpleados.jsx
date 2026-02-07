import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showEmpleado, updateEmpleado } from 'services/empleadoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { buildAddressLine } from 'utilities/addressFormatter';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import DatosForm from 'components/Shared/Formularios/Empleado/DatosForm';
import CuentasBancariasMultiples from 'components/Shared/Formularios/CuentasBancariasMultiples';
import CuentaForm from 'components/Shared/Formularios/Empleado/CuentaForm';

const EMPTY_BANK_ACCOUNT = {
    entidad_financiera_id: '',
    numero_cuenta: '',
    cci: ''
};

const EditarEmpleado = ({ backPath }) => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [rolIdRedirect, setRolIdRedirect] = useState(null);
    const [isCuentaAccesoValida, setIsCuentaAccesoValida] = useState(true);

    // Estado inicial idéntico a AgregarEmpleado
    const [formData, setFormData] = useState({
        // Datos Personales
        datos_empleado: { 
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', 
            fechaNacimiento: '', fechaIngreso: '', sexo: '', estadoCivil: '',
            tipoVia: '', nombreVia: '', numeroMzLt: '', urbanizacion: '',
            direccion: '', departamento: '', provincia: '', distrito: '',
            area_id: '',
            esCarnetExtranjeria: false
        },
        // Contacto
        empleado_datos_contacto: {
            telefono: '',
            correo: '',
            correos: ['']
        },
        // Banco 
        empleado_cuentas_bancarias: [{ ...EMPTY_BANK_ACCOUNT }],
        // Login
        username: '', 
        sede_id: '', 
        password: '', 
        password_confirmation: ''
    });

    const [initialSedeName, setInitialSedeName] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await showEmpleado(id);
                const { 
                    datos_empleado, 
                    empleado_datos_contacto, 
                    empleado_cuentas_bancarias, 
                    username, 
                    sede, 
                    rol_id 
                } = res.data;

                setRolIdRedirect(rol_id); 

                const cuentasArray = Array.isArray(empleado_cuentas_bancarias)
                    ? empleado_cuentas_bancarias
                    : empleado_cuentas_bancarias?.entidad_financiera_id
                        ? [empleado_cuentas_bancarias]
                        : [];

                const bancoState = cuentasArray.length > 0
                    ? cuentasArray.map((cuenta) => ({
                        entidad_financiera_id: cuenta.entidad_financiera_id || '',
                        numero_cuenta: cuenta.numero_cuenta || '',
                        cci: cuenta.cci || '',
                        entidad_financiera: cuenta.entidad_financiera || null
                    }))
                    : [{ ...EMPTY_BANK_ACCOUNT }];

                const correosIniciales = Array.isArray(empleado_datos_contacto?.correos)
                    ? empleado_datos_contacto.correos.filter(Boolean)
                    : (empleado_datos_contacto?.correo ? [empleado_datos_contacto.correo] : []);

                const contactoState = {
                    telefono: empleado_datos_contacto?.telefono || '',
                    correo: empleado_datos_contacto?.correo || correosIniciales[0] || '',
                    correos: correosIniciales.length > 0 ? correosIniciales : ['']
                };

                setFormData({
                    datos_empleado: { 
                        nombre: datos_empleado.nombre, 
                        apellidoPaterno: datos_empleado.apellidoPaterno, 
                        apellidoMaterno: datos_empleado.apellidoMaterno, 
                        dni: datos_empleado.dni, 
                        fechaNacimiento: datos_empleado.fechaNacimiento,
                        fechaIngreso: datos_empleado.fechaIngreso,
                        sexo: String(datos_empleado.sexo || '').toUpperCase(),
                        estadoCivil: String(datos_empleado.estadoCivil || '').toUpperCase(),
                        tipoVia: datos_empleado.tipoVia || '',
                        nombreVia: datos_empleado.nombreVia || '',
                        numeroMzLt: datos_empleado.numeroMzLt || '',
                        urbanizacion: datos_empleado.urbanizacion || '',
                        direccion: datos_empleado.direccion,
                        departamento: datos_empleado.departamento,
                        provincia: datos_empleado.provincia,
                        distrito: datos_empleado.distrito,
                        area_id: datos_empleado.area_id,
                        area: datos_empleado.area,
                        esCarnetExtranjeria: String(datos_empleado.dni || '').length === 9
                    },
                    empleado_datos_contacto: contactoState,
                    empleado_cuentas_bancarias: bancoState, 
                    username: username || '',
                    sede_id: sede?.id || '',
                    password: '',
                    password_confirmation: ''
                });

                if (sede) setInitialSedeName(sede.nombre);

            } catch (err) {
                setAlert({ type: 'error', message: 'Error cargando datos del empleado.' });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

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

        if (section) setFormData(p => ({ ...p, [section]: { ...p[section], [name]: nextValue } }));
        else setFormData(p => ({ ...p, [name]: nextValue }));
    };

    const handleCuentasBancariasChange = (cuentas) => {
        setFormData(prev => ({ ...prev, empleado_cuentas_bancarias: cuentas }));
    };

   const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isCuentaAccesoValida) {
            setAlert({
                type: 'error',
                message: 'La nueva contraseña no cumple validación. Debe tener mínimo 8 caracteres, un carácter especial y confirmación correcta.'
            });
            return;
        }

        setLoading(true);
        setAlert(null);
        
        try {
            const datosLimpios = { ...formData.datos_empleado };
            
            delete datosLimpios.area; 
            datosLimpios.direccion = buildAddressLine(datosLimpios);

            const payload = { 
                datos_empleado: datosLimpios,
                empleado_datos_contacto: {
                    ...formData.empleado_datos_contacto,
                    correos: (formData.empleado_datos_contacto?.correos || [])
                        .map(correo => String(correo || '').trim().toLowerCase())
                        .filter(Boolean),
                },
                username: formData.username,
                sede_id: formData.sede_id,
                empleado_cuentas_bancarias: (formData.empleado_cuentas_bancarias || [])
                    .map(cuenta => ({
                        entidad_financiera_id: cuenta.entidad_financiera_id,
                        numero_cuenta: cuenta.numero_cuenta,
                        cci: cuenta.cci || ''
                    }))
                    .filter(cuenta => cuenta.entidad_financiera_id || cuenta.numero_cuenta || cuenta.cci)
            };

            if (formData.password) {
                payload.password = formData.password;
                payload.password_confirmation = formData.password_confirmation;
            }

            payload.empleado_datos_contacto.correo = payload.empleado_datos_contacto.correos[0] || '';
            
            if (payload.empleado_cuentas_bancarias.length === 0) {
                delete payload.empleado_cuentas_bancarias; 
            }
            
            await updateEmpleado(id, payload);
            setAlert({ type: 'success', message: 'Actualizado correctamente.' });
            setTimeout(() => navigate(rolIdRedirect ? `/personal/listar/${rolIdRedirect}` : backPath || '/home'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    const datosParaFormulario = {
        ...formData.datos_empleado,
        telefono: formData.empleado_datos_contacto.telefono
    };

    return (
        <div className="w-full px-6 py-4">
            <PageHeader title="Editar Personal" subtitle={`${formData.datos_empleado.nombre} ${formData.datos_empleado.apellidoPaterno}`} icon={PencilSquareIcon} buttonText="Volver" buttonLink={rolIdRedirect ? `/personal/listar/${rolIdRedirect}` : backPath} />
            <AlertMessage {...alert} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="w-full max-w-[98%] mx-auto">
                <div className="grid grid-cols-12 gap-6">
                    
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                            <DatosForm 
                                data={datosParaFormulario}
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
                                usuarioId={id}
                                handleRootChange={(e) => handleChange(e)}
                                handleChange={(e) => handleChange(e, 'datos_empleado')}
                                isEdit={true}
                                currentSedeId={formData.sede_id}
                                initialSedeName={initialSedeName}
                                onSedeChange={(newSedeId) => setFormData(p => ({ ...p, sede_id: newSedeId }))}
                            />
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                             <CuentasBancariasMultiples 
                                data={formData.empleado_cuentas_bancarias}
                                onChange={handleCuentasBancariasChange}
                             />
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm sticky top-4">
                            <h2 className="text-sm font-black text-slate-700 uppercase mb-4 border-b pb-2">Acceso</h2>
                            <CuentaForm 
                                data={{...formData, email: formData.empleado_datos_contacto.correo}} 
                                handleChange={(e) => handleChange(e)} 
                                onValidationChange={setIsCuentaAccesoValida}
                                isEdit={true} 
                            />
                            <div className="mt-6 flex flex-col gap-2">
                                <button type="submit" disabled={loading || !isCuentaAccesoValida} className="w-full py-2.5 bg-fic-red text-white rounded font-bold uppercase text-xs shadow hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button type="button" onClick={() => navigate(-1)} className="w-full py-2.5 bg-slate-100 text-slate-600 rounded font-bold uppercase text-xs hover:bg-slate-200">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditarEmpleado;