import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAdmision, updateAdmision } from 'services/admisionService';
import DeudasGrid from '../components/DeudasGrid';
import ProtestosGrid from '../components/ProtestosGrid';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { UserIcon, IdentificationIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const EditarAdmision = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- ESTADOS ---
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    // Datos de Cabecera (Editables y de Lectura)
    const [header, setHeader] = useState({
        tipo_prestamo: 'NUEVO',
        estado: 'PENDIENTE',
        observaciones: '',
        // Datos informativos (Solo lectura)
        solicitanteName: '',
        solicitanteDni: '',
        tipoPersona: '', // CLIENTE o PROSPECTO
        asesorName: '',
        sedeName: ''
    });

    // Datos de Grillas
    const [deudas, setDeudas] = useState([]);
    const [protestos, setProtestos] = useState([]);

    // --- CARGAR DATOS ---
    useEffect(() => {
        const fetchAdmision = async () => {
            try {
                const response = await showAdmision(id);
                const data = response.data;

                // Determinar nombre del solicitante (Cliente vs Prospecto)
                const persona = data.cliente ? data.cliente.datos : data.prospecto;
                const nombreCompleto = data.cliente 
                    ? `${persona.nombre} ${persona.apellidoPaterno}` 
                    : `${persona.nombres} ${persona.apellido_paterno}`;

                setHeader({
                    tipo_prestamo: data.tipo_prestamo,
                    estado: data.estado,
                    observaciones: data.observaciones || '',
                    
                    // Info de solo lectura para mostrar en UI
                    solicitanteName: nombreCompleto,
                    solicitanteDni: persona.dni,
                    tipoPersona: data.cliente ? 'CLIENTE RECURRENTE' : 'PROSPECTO NUEVO',
                    asesorName: data.asesor?.datos?.nombre || 'Desconocido',
                    sedeName: data.sede?.nombre || 'Sede desconocida'
                });

                setDeudas(data.deudas || []);
                setProtestos(data.protestos || []);

            } catch (err) {
                setAlert({ type: 'error', message: 'No se pudo cargar la información de la admisión.' });
            } finally {
                setLoading(false);
            }
        };
        fetchAdmision();
    }, [id]);

    // --- MANEJADORES ---
    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setHeader(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        const payload = {
            tipo_prestamo: header.tipo_prestamo,
            estado: header.estado,
            observaciones: header.observaciones,
            deudas: deudas,
            protestos: protestos
        };

        try {
            const response = await updateAdmision(id, payload);
            
            setAlert({
                type: 'success',
                message: response.message || 'Admisión actualizada correctamente.'
            });
            
            // Recargamos datos del grid con la respuesta del servidor (útil si hubo recálculos)
            if(response.data) {
                setDeudas(response.data.deudas);
                setProtestos(response.data.protestos);
            }

            setTimeout(() => navigate('/asesor/listar-admisiones'), 1500);

        } catch (error) {
            setAlert(handleApiError(error, 'Error al actualizar la admisión'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6 border-b-2 border-fic-red pb-4">
                <div>
                    <h1 className="text-3xl font-black text-fic-dark">Editar Evaluación #{id}</h1>
                    <p className="text-sm text-slate-500 font-bold">Solicitante: {header.solicitanteName}</p>
                </div>
                <button 
                    onClick={() => navigate('/asesor/listar-admisiones')} 
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

            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: DATOS GENERALES Y ESTADO */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Tarjeta de Información Estática */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h2 className="text-sm font-bold text-slate-500 uppercase mb-4 border-b pb-2">Información Base</h2>
                        
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <UserIcon className="w-5 h-5 text-fic-red mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-700">{header.solicitanteName}</p>
                                    <p className="text-slate-500 text-xs">DNI: {header.solicitanteDni}</p>
                                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-600 mt-1 inline-block">
                                        {header.tipoPersona}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 pt-2">
                                <IdentificationIcon className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="font-bold text-slate-600 text-xs uppercase">Asesor Registrador</p>
                                    <p className="text-slate-700">{header.asesorName}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="font-bold text-slate-600 text-xs uppercase">Sede</p>
                                    <p className="text-slate-700">{header.sedeName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Edición de Estado */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">1. Configuración</h2>
                        
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Estado de Evaluación</label>
                            <select 
                                name="estado" 
                                value={header.estado} 
                                onChange={handleHeaderChange}
                                className={`w-full px-3 py-2 border rounded-md outline-none text-sm font-bold ${
                                    header.estado === 'APROBADO' ? 'text-green-700 bg-green-50 border-green-200' : 
                                    header.estado === 'RECHAZADO' ? 'text-red-700 bg-red-50 border-red-200' : 
                                    'text-slate-700'
                                }`}
                            >
                                <option value="PENDIENTE">PENDIENTE</option>
                                <option value="APROBADO">APROBADO</option>
                                <option value="OBSERVADO">OBSERVADO</option>
                                <option value="RECHAZADO">RECHAZADO</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo de Préstamo</label>
                            <select 
                                name="tipo_prestamo" 
                                value={header.tipo_prestamo} 
                                onChange={handleHeaderChange}
                                className="w-full px-3 py-2 border rounded-md outline-none text-sm"
                            >
                                <option value="NUEVO">NUEVO (Cliente Nuevo)</option>
                                <option value="RCS">RCS (Recurrente con Saldo)</option>
                                <option value="RSS">RSS (Recurrente sin Saldo)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Observaciones</label>
                            <textarea 
                                name="observaciones" 
                                value={header.observaciones} 
                                onChange={handleHeaderChange}
                                className="w-full px-3 py-2 border rounded-md outline-none text-sm h-32 resize-none"
                                placeholder="Notas del asesor..."
                            />
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: GRIDS FINANCIEROS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 min-h-[500px]">
                        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">2. Evaluación Financiera</h2>
                        
                        <DeudasGrid deudas={deudas} setDeudas={setDeudas} />
                        
                        <ProtestosGrid protestos={protestos} setProtestos={setProtestos} />

                        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-4">
                            <button 
                                type="button"
                                onClick={() => navigate('/asesor/listar-admisiones')}
                                className="px-6 py-2 text-slate-600 font-bold bg-slate-100 rounded hover:bg-slate-200"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-fic-yellow text-fic-dark px-8 py-2 rounded font-black uppercase shadow-lg hover:bg-yellow-400 disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default EditarAdmision;