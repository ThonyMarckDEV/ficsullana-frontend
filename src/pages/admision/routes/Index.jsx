import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { enviarRevisionAdmision, getAdmisiones, showAdmision } from 'services/admisionService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import Table from 'components/Shared/Tables/Table';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import AdmisionDetailModal from '../components/Modals/AdmisionDetailModal';
import {
    PencilSquareIcon,
    EyeIcon,
    UserIcon,
    ClipboardDocumentCheckIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { useAuth } from 'context/AuthContext';
import {
    ADMISION_BADGE_STYLES,
    formatAdmisionState,
    getAdmisionStateFilterOptions,
    isAdmisionEditable,
    normalizeAdmisionListFilters,
    normalizeAdmisionState,
} from 'utilities/pages/admision/status';

const buildFullName = (persona, type) => {
    if (!persona) return 'Sin nombre';

    if (type === 'CLIENTE') {
        return `${persona.nombre || ''} ${persona.apellidoPaterno || ''} ${persona.apellidoMaterno || ''}`.trim() || 'Sin nombre';
    }

    return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim() || 'Sin nombre';
};

const EXCEPCION_BADGE = { label: 'EXCEPCIÓN', color: 'bg-orange-100 text-orange-700 border-orange-200' };

const Index = () => {
    const { checkPermission } = useAuth(); 
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [sendConfirmRow, setSendConfirmRow] = useState(null);
    const [sendLoadingId, setSendLoadingId] = useState(null);
    const canManageState = checkPermission('admisiones.gestionar.estado');
    const canSeeAllAdmisiones = canManageState
        || checkPermission('admisiones.excepciones.aprobar')
        || checkPermission('admisiones.excepciones.rechazar');
    const stateFilterOptions = useMemo(
        () => getAdmisionStateFilterOptions({ canReviewQueue: canManageState }),
        [canManageState]
    );
    const fetchListRows = useCallback((page, nextFilters) => getAdmisiones(
        page,
        normalizeAdmisionListFilters(nextFilters, { canReviewQueue: canManageState })
    ), [canManageState]);
    const {
        loading,
        alert,
        setAlert,
        rows: admisiones,
        paginationInfo,
        filters,
        fetchRows: fetchAdmisiones,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear,
    } = usePaginatedIndex({
        initialFilters: { search: '', estado: '' },
        fetcher: fetchListRows,
        onError: (error) => handleApiError(error, 'Error al cargar las admisiones.'),
    });

    const filterConfig = useMemo(() => [
        {
            name: 'search',
            type: 'text',
            label: 'Buscador',
            placeholder: 'ID, DNI o Nombre...',
            colSpan: 'md:col-span-8',
        },
        {
            name: 'estado',
            type: 'select',
            label: 'Estado',
            options: stateFilterOptions,
            colSpan: 'md:col-span-4',
        },
    ], [stateFilterOptions]);

    const handleViewAdmision = useCallback(async (id) => {
        setIsDetailOpen(true);
        setDetailLoading(true);
        try {
            const response = await showAdmision(id);
            setDetailData(response.data);
        } catch (error) {
            setAlert(handleApiError(error, 'No se pudo cargar el detalle de la admisión.'));
            setIsDetailOpen(false);
        } finally {
            setDetailLoading(false);
        }
    }, [setAlert]);

    const handleSendToReview = useCallback(async (id) => {
        setSendLoadingId(id);
        setAlert(null);

        try {
            const response = await enviarRevisionAdmision(id);
            setAlert({
                type: 'success',
                message: response.message || 'Admisión enviada a revisión correctamente.',
            });
            await fetchAdmisiones(paginationInfo.currentPage);
            return response.data || response;
        } catch (error) {
            setAlert(handleApiError(error, 'No se pudo enviar la admisión a revisión.'));
            return null;
        } finally {
            setSendLoadingId(null);
        }
    }, [fetchAdmisiones, paginationInfo.currentPage, setAlert]);

    const hasAnyActionPermission = checkPermission('admisiones.mostrar') || checkPermission('admisiones.editar');

    const columns = useMemo(() => [
        {
            header: 'Solicitante',
            render: (row) => {
                const persona = row.cliente ? row.cliente.datos : row.prospecto;
                const nombre = buildFullName(persona, row.cliente ? 'CLIENTE' : 'PROSPECTO');

                return (
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${row.cliente ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-black text-fic-dark block uppercase tracking-tight text-xs">{nombre}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{persona?.dni || 'N/A'}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            header: 'Tipo',
            render: (row) => (
                <span className="font-bold text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {row.tipo_prestamo}
                </span>
            ),
        },
        {
            header: 'Endeudamiento',
            render: (row) => (
                <div className="text-xs">
                    <div className="flex justify-between w-32">
                        <span className="text-slate-500">Deuda:</span>
                        <span className="font-bold text-slate-700">S/ {row.total_deuda}</span>
                    </div>
                    <div className="flex justify-between w-32">
                        <span className="text-slate-500">Protestos:</span>
                        <span className={`font-bold ${parseFloat(row.total_protestos) > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                            S/ {row.total_protestos}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Estado',
            render: (row) => {
                const estadoValue = normalizeAdmisionState(row.estado);
                const badgeClass = ADMISION_BADGE_STYLES[estadoValue] || 'bg-gray-100 text-gray-700 border-gray-200';
                const excepcionState = Number(row.excepcion_estado || 0);
                const hasException = excepcionState > 0;
                const badgeBaseClass = 'inline-flex items-center rounded-full border font-black uppercase leading-none';

                return (
                    <div className="flex flex-col items-start gap-2">
                        <span className={`${badgeBaseClass} px-3 py-1 text-[10px] ${badgeClass}`}>
                            {row.estado_label || formatAdmisionState(row.estado)}
                        </span>
                        {hasException && (
                            <span className={`${badgeBaseClass} px-3 py-1 text-[10px] ${EXCEPCION_BADGE.color}`}>
                                {EXCEPCION_BADGE.label}
                            </span>
                        )}
                    </div>
                );
            },
        },
        hasAnyActionPermission ? {
            header: 'Acciones',
            render: (row) => {
                const canOpenEditForm = checkPermission('admisiones.editar')
                    && !canManageState
                    && isAdmisionEditable(row.estado);
                const canSendToReview = checkPermission('admisiones.editar')
                    && !canManageState
                    && isAdmisionEditable(row.estado);
                const isSending = Number(sendLoadingId) === Number(row.id);

                return (
                    <div className="flex items-center gap-3">
                        {checkPermission('admisiones.mostrar') && (
                            <button
                                type="button"
                                onClick={() => handleViewAdmision(row.id)}
                                className="inline-flex items-center gap-1 text-xs font-black uppercase text-slate-600 hover:text-slate-900"
                            >
                                <EyeIcon className="w-4 h-4" /> Ver
                            </button>
                        )}

                        {canOpenEditForm ? (
                            <Link
                                to={`/gestion/editar-admision/${row.id}`}
                                className="inline-flex items-center gap-1 text-xs font-black uppercase text-amber-600 hover:text-amber-700"
                            >
                                <PencilSquareIcon className="w-4 h-4" /> Editar
                            </Link>
                        ) : null}

                        {canSendToReview ? (
                            <button
                                type="button"
                                onClick={() => setSendConfirmRow(row)}
                                disabled={isSending}
                                className="inline-flex items-center gap-1 text-xs font-black uppercase text-fic-red hover:text-red-700 disabled:opacity-50"
                            >
                                <PaperAirplaneIcon className="w-4 h-4" /> {isSending ? 'Enviando...' : 'Enviar a revisión'}
                            </button>
                        ) : null}
                    </div>
                );
            },
        } : null
    ].filter(Boolean), [canManageState, checkPermission, handleViewAdmision, hasAnyActionPermission, sendLoadingId]);

    if (loading && admisiones.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader
                title={canSeeAllAdmisiones ? 'Admisiones' : 'Mis Admisiones'}
                subtitle={canSeeAllAdmisiones
                    ? 'Evaluación crediticia de clientes y prospectos'
                    : 'Solo se muestran las admisiones registradas por su usuario'}
                icon={ClipboardDocumentCheckIcon}
                buttonText={checkPermission('admisiones.crear') ? "+ Nueva Admisión" : undefined}
                buttonLink="/gestion/nueva-admision"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <AdmisionDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                loading={detailLoading}
                data={detailData}
                onUpdateSuccess={() => fetchAdmisiones(paginationInfo.currentPage).catch(() => {})}
            />

            {sendConfirmRow ? (
                <ConfirmModal
                    title="Enviar a revisión"
                    message={`¿Deseas enviar la admisión #${sendConfirmRow.id} a revisión?`}
                    confirmText="Enviar"
                    cancelText="Cancelar"
                    onConfirm={async () => {
                        const targetId = sendConfirmRow.id;
                        setSendConfirmRow(null);
                        await handleSendToReview(targetId);
                    }}
                    onCancel={() => setSendConfirmRow(null)}
                />
            ) : null}

            <div className="rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    data={admisiones}
                    loading={loading}
                    filterConfig={filterConfig}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    onFilterClear={handleFilterClear}
                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchAdmisiones(page).catch(() => {}),
                    }}
                />
            </div>
        </div>
    );
};

export default Index;
