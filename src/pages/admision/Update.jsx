import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAdmision, updateAdmision } from 'services/admisionService';
import DeudasGrid from './components/DeudasGrid';
import ProtestosGrid from './components/ProtestosGrid';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { UserIcon, IdentificationIcon, BuildingOfficeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const [header, setHeader] = useState({
        tipo_prestamo: 'NUEVO',
        estado: 'PENDIENTE',
        observaciones: '',
        solicitanteName: '',
        solicitanteDni: '',
        tipoPersona: '',
        asesorFullName: '',
        sedeName: ''
    });

    const [deudas, setDeudas] = useState([]);
    const [protestos, setProtestos] = useState([]);

    useEffect(() => {
        const fetchAdmision = async () => {
            try {
                const response = await showAdmision(id);
                const data = response.data;

                // Nombre Completo del Solicitante
                const persona = data.cliente ? data.cliente.datos : data.prospecto;
                const nombreSolicitante = data.cliente 
                    ? `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno || ''}` 
                    : `${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno || ''}`;

                // Nombre Completo del Asesor
                const asesorDatos = data.asesor?.datos;
                const nombreAsesor = asesorDatos 
                    ? `${asesorDatos.nombre} ${asesorDatos.apellidoPaterno} ${asesorDatos.apellidoMaterno || ''}` 
                    : 'Desconocido';

                // Setear Cabecera
                setHeader({
                    tipo_prestamo: data.tipo_prestamo,
                    estado: data.estado,
                    observaciones: data.observaciones || '',
                    solicitanteName: nombreSolicitante.trim(),
                    solicitanteDni: persona.dni,
                    tipoPersona: data.cliente ? 'CLIENTE RECURRENTE' : 'PROSPECTO NUEVO',
                    asesorFullName: nombreAsesor.trim(),
                    sedeName: data.sede?.nombre || 'Sede desconocida'
                });

                // Setear Grids (Conversión de tipos segura)
                if (data.deudas && Array.isArray(data.deudas)) {
                    setDeudas(data.deudas.map(d => ({
                        persona_tipo: d.persona_tipo,
                        dni_relacionado: d.dni_relacionado,
                        nombre_entidad: d.nombre_entidad,
                        tipo_credito: d.tipo_credito,
                        saldo_capital: parseFloat(d.saldo_capital || 0),
                        plazo_pendiente: parseInt(d.plazo_pendiente || 0),
                        monto_cuota: parseFloat(d.monto_cuota || 0),
                        frecuencia_pago: d.frecuencia_pago,
                        fecha_pago: d.fecha_pago ? d.fecha_pago.split('T')[0] : '',
                    })));
                }

                if (data.protestos && Array.isArray(data.protestos)) {
                    setProtestos(data.protestos.map(p => ({
                        entidad_acreedora: p.entidad_acreedora,
                        documento_tipo: p.documento_tipo,
                        monto_deuda: parseFloat(p.monto_deuda || 0),
                        dias_vencimiento: parseInt(p.dias_vencimiento || 0)
                    })));
                }

            } catch (err) {
                setAlert({ type: 'error', message: 'No se pudo cargar la información de la admisión.' });
            } finally {
                setLoading(false);
            }
        };
        fetchAdmision();
    }, [id]);

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
            setAlert({ type: 'success', message: response.message || 'Admisión actualizada correctamente.' });
            
            if(response.data) {
                setHeader(prev => ({ ...prev, estado: response.data.estado }));
            }
            setTimeout(() => navigate('/gestion/listar-admisiones'), 1500);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al actualizar la admisión'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">

            <PageHeader 
                title={`Editar Admisión #${id}`}
                subtitle={`Solicitante: ${header.solicitanteName}`}
                icon={PencilSquareIcon}
                buttonText="← Volver al listado"
                buttonLink="/gestion/listar-admisiones"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Tarjeta Informativa */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider border-b pb-2">Datos del Expediente</h2>
                        
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-full border border-slate-200">
                                    <UserIcon className="w-5 h-5 text-fic-red" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Solicitante</p>
                                    <p className="font-bold text-slate-800 text-sm">{header.solicitanteName}</p>
                                    <p className="text-slate-500 text-xs font-mono">DNI: {header.solicitanteDni}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-black mt-1 inline-block ${header.tipoPersona.includes('PROSPECTO') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {header.tipoPersona}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-full border border-slate-200">
                                    <IdentificationIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Asesor Responsable</p>
                                    <p className="font-bold text-slate-700 text-sm">{header.asesorFullName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-full border border-slate-200">
                                    <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sede</p>
                                    <p className="font-bold text-slate-700 text-sm">{header.sedeName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Configuración */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">1. Configuración</h2>
                        
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Estado de Evaluación</label>
                            <select 
                                name="estado" 
                                value={header.estado} 
                                onChange={handleHeaderChange}
                                className={`w-full px-3 py-2 border rounded-md outline-none text-sm font-bold shadow-sm focus:ring-2 focus:ring-fic-red ${
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
                                // Si es prospecto, bloqueamos para que no cambien a recurrente por error
                                disabled={header.tipoPersona.includes('PROSPECTO')}
                                className="w-full px-3 py-2 border rounded-md outline-none text-sm shadow-sm focus:border-fic-red disabled:bg-slate-100 disabled:text-slate-500"
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
                                className="w-full px-3 py-2 border rounded-md outline-none text-sm h-32 resize-none shadow-sm focus:border-fic-red"
                                placeholder="Notas del asesor..."
                            />
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 min-h-[600px]">
                        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">2. Evaluación Financiera</h2>
                        
                        <DeudasGrid deudas={deudas} setDeudas={setDeudas} />
                        
                        <ProtestosGrid protestos={protestos} setProtestos={setProtestos} />

                        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-4">
                            <button 
                                type="button" 
                                onClick={() => navigate('/gestion/listar-admisiones')} 
                                className="px-6 py-2 text-slate-600 font-bold bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-fic-yellow text-fic-dark px-8 py-2 rounded font-black uppercase shadow-lg hover:bg-yellow-400 disabled:opacity-50 transition-all transform active:scale-95"
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

export default Update;