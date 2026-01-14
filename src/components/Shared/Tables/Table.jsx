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
            {/* --- BUSCADOR --- */}
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

            {/* --- CONTENEDOR DE LA TABLA (CARD) --- */}
            <div className={`bg-white shadow-xl rounded-xl border border-slate-100 transition-opacity duration-300 flex flex-col ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                
                {/* Contenedor de Scroll Horizontal */}
                <div className="overflow-x-auto w-full block max-w-full touch-pan-x scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    
                    {/* Contenedor interno para alineación perfecta */}
                    <div className="inline-block min-w-full align-middle">
                        
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
                                                    {col.render
                                                        ? col.render(row)
                                                        : <span className="block">{row[col.accessor]}</span>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
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