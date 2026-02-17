// src/components/Shared/Modals/InfoModal.jsx
import React from 'react';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { BtnExportPdf } from 'components/Shared/Buttons/ExportButtons';

const InfoItem = ({ label, value, className = '', fullWidth = false }) => {
    const hasValue = value !== null && value !== undefined && value !== '';
    const isCustomValue = React.isValidElement(value);

    return (
        <div className={`${fullWidth ? 'col-span-2 md:col-span-4' : 'col-span-1'}`}>
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                {label}
            </span>

            {!hasValue ? (
                <span className="block text-sm text-slate-300 italic break-words">No registrado</span>
            ) : isCustomValue ? (
                <div className={`break-words ${className}`}>{value}</div>
            ) : (
                <span className={`block text-sm font-bold text-fic-dark break-words ${className}`}>{value}</span>
            )}
        </div>
    );
};

const InfoModal = ({ 
    isOpen, 
    onClose, 
    title = "Detalle", 
    subtitle, 
    loading = false, 
    sections = []
}) => {
    if (!isOpen) return null;

    // ID único para identificar qué div capturar
    const EXPORT_CONTAINER_ID = "info-modal-export-content";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fic-dark/80 backdrop-blur-sm transition-opacity animate-fade-in">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
                
                {/* HEADER */}
                <div className="bg-fic-red px-6 py-4 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/20 rounded-full text-white">
                            <DocumentTextIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                                {title}
                            </h3>
                            {subtitle && (
                                <p className="text-red-100 text-xs font-medium mt-1">
                                    {loading ? 'Cargando...' : subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* --- ZONA DE BOTONES DE EXPORTACIÓN --- */}
                        {!loading && sections.length > 0 && (
                            <>
                                <BtnExportPdf 
                                    elementId={EXPORT_CONTAINER_ID} 
                                    fileName={`Reporte-${title}.pdf`} 
                                />
                                {/* Separador visual */}
                                <div className="h-6 w-px bg-white/20 mx-1"></div> 
                            </>
                        )}
                        
                        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* BODY (SCROLLABLE) */}
                {/* Nota: El id NO va en este div con overflow, sino en el hijo directo */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 bg-white">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fic-red"></div>
                        </div>
                    ) : (
                        // --- ESTE ES EL DIV QUE CAPTURAREMOS ---
                        // Al capturar este div interno, html2canvas tomará toda su altura real,
                        // ignorando el scroll del padre.
                        <div id={EXPORT_CONTAINER_ID} className="bg-white p-2"> 
                            {sections.map((section, idx) => {
                                const Icon = section.icon || DocumentTextIcon;
                                return (
                                    <section key={idx} className="mb-8 last:mb-0">
                                        {/* Título de Sección */}
                                        <div className="flex items-center gap-2 mb-4 border-b-2 border-fic-yellow pb-2">
                                            <Icon className="w-5 h-5 text-fic-yellow" />
                                            <h4 className="text-lg font-black text-fic-dark uppercase">
                                                {section.title}
                                            </h4>
                                        </div>
                                        
                                        {/* Grid de Datos */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                            {section.items.map((item, itemIdx) => (
                                                <InfoItem
                                                    key={itemIdx}
                                                    label={item.label}
                                                    value={item.value}
                                                    className={item.className}
                                                    fullWidth={item.fullWidth}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-fic-dark text-white font-bold rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-wide text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
