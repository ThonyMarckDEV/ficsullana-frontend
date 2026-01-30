import React from 'react';
import Pagination from '../Pagination';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Table = ({
    columns,
    data,
    loading = false,
    pagination = null,
    
    // Props para Filtros Dinámicos
    filterConfig = [], // Array de configuración de filtros
    filters = {},      // Estado actual de los filtros
    onFilterChange,    // Handler para cambios (input/select)
    onFilterSubmit,    // Handler para botón buscar 
    onFilterClear      // Handler para limpiar filtros
}) => {

    return (
        <div className="w-full space-y-4">
            
            {/* --- SECCIÓN DE FILTROS DINÁMICOS --- */}
            {filterConfig.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        
                        {/* Renderizado de Inputs Configurados */}
                        {filterConfig.map((field) => (
                            <div key={field.name} className={`col-span-12 ${field.colSpan || 'md:col-span-4'}`}>
                                {field.label && (
                                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
                                        {field.label}
                                    </label>
                                )}

                                {/* TIPO: TEXT / DATE / NUMBER */}
                                {(field.type === 'text' || field.type === 'date' || field.type === 'number') && (
                                    <div className="relative">
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={filters[field.name] || ''}
                                            onChange={(e) => onFilterChange(field.name, e.target.value)}
                                            placeholder={field.placeholder || ''}
                                            className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all"
                                            onKeyDown={(e) => e.key === 'Enter' && onFilterSubmit && onFilterSubmit()}
                                        />
                                        {field.type === 'text' && (
                                            <div className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                                                <MagnifyingGlassIcon className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TIPO: SELECT */}
                                {field.type === 'select' && (
                                    <div className="relative">
                                        <select
                                            name={field.name}
                                            value={filters[field.name] || ''}
                                            onChange={(e) => onFilterChange(field.name, e.target.value)}
                                            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none appearance-none cursor-pointer"
                                        >
                                            {field.options?.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                                            <FunnelIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                )}

                                {/* TIPO: CUSTOM (Para componentes como Comboboxes) */}
                                {field.type === 'custom' && field.render && (
                                    field.render({
                                        value: filters[field.name],
                                        onChange: onFilterChange
                                    })
                                )}
                            </div>
                        ))}

                        {/* Botones de Acción (Buscar / Limpiar) */}
                        <div className="col-span-12 md:col-span-12 flex justify-end gap-2 mt-2 pt-2 border-t border-slate-50 md:border-none md:mt-0 md:pt-0">
                            {onFilterClear && (
                                <button
                                    onClick={onFilterClear}
                                    className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                                    title="Limpiar filtros"
                                >
                                    <XMarkIcon className="w-4 h-4" /> Limpiar
                                </button>
                            )}
                            
                            {/* El botón buscar es opcional si usas debounce, pero útil para forzar búsqueda */}
                            {onFilterSubmit && (
                                <button
                                    onClick={onFilterSubmit}
                                    className="flex items-center gap-1 px-4 py-2 bg-slate-900 text-white hover:bg-black rounded-lg text-sm font-bold shadow-sm transition-colors"
                                >
                                    <MagnifyingGlassIcon className="w-4 h-4" /> Buscar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- VISTA MÓVIL (CARDS) --- */}
            <div className={`grid grid-cols-1 gap-4 md:hidden ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <div key={row.id || rowIndex} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            {columns.map((col, colIndex) => (
                                <div key={colIndex} className="flex flex-col border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                                        {col.header}
                                    </span>
                                    <div className="text-sm font-medium text-slate-700">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
                        No hay datos disponibles.
                    </div>
                )}
            </div>

            {/* --- VISTA ESCRITORIO (TABLA) --- */}
            <div className={`hidden md:flex bg-white shadow-xl rounded-xl border border-slate-100 transition-opacity duration-300 flex-col ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="overflow-x-auto w-full block max-w-full scrollbar-thin scrollbar-thumb-slate-300">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead>
                            <tr className="bg-fic-dark text-white text-left uppercase text-xs tracking-widest">
                                {columns.map((col, index) => (
                                    <th key={index} scope="col" className="px-6 py-4 font-black whitespace-nowrap">
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {data.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <tr key={row.id || rowIndex} className="hover:bg-red-50/30 transition-colors group">
                                        {columns.map((col, colIndex) => (
                                            <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-12">
                                        <p className="font-bold text-slate-400">No se encontraron datos.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- PAGINACIÓN --- */}
            {pagination && (
                <div className="flex justify-center md:justify-end py-2">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Table;