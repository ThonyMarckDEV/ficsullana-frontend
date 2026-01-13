// src/components/Shared/Table.jsx
import React from 'react';
import Pagination from '../Pagination';

const Table = ({ 
    columns, 
    data, 
    loading = false, 
    pagination = null,
    onSearch,
    searchPlaceholder = "Buscar..."
}) => {
    
    return (
        <div className="w-full space-y-4">
            {/* Buscador opcional con colores de la marca */}
            {onSearch && (
                <div className="relative max-w-sm">
                    <input
                        type="text"
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-4 pr-10 py-2 border-2 border-slate-200 rounded-lg focus:border-fic-red focus:ring-0 outline-none transition-all text-sm font-medium"
                    />
                    <div className="absolute right-3 top-2.5 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Contenedor de la tabla */}
            <div className={`bg-white shadow-xl rounded-xl overflow-hidden border border-slate-100 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            {/* Encabezado con el Rojo de Fic Sullana */}
                            <tr className="bg-fic-dark text-white text-left uppercase text-xs tracking-widest">
                                {columns.map((col, index) => (
                                    <th key={index} className="px-6 py-4 font-black">
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <tr key={row.id || rowIndex} className="hover:bg-red-50/30 transition-colors group">
                                        {columns.map((col, colIndex) => (
                                            <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 text-sm font-medium text-slate-700">
                                                {col.render 
                                                    ? col.render(row) 
                                                    : <span className="truncate block">{row[col.accessor]}</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-12">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="box-open" />
                                            </svg>
                                            <p className="font-bold">No se encontraron datos.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación con margen superior */}
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