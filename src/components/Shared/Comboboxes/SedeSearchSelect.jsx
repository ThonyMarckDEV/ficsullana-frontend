import React, { useCallback } from 'react';
import { getSedesCombobox } from 'services/sedeService'; 
import { MagnifyingGlassIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import useRemoteSearchSelect from 'hooks/useRemoteSearchSelect';

const SedeSearchSelect = ({ onSelect, selectedId, initialName = '' }) => {
    const searchSedes = useCallback(
        (searchTerm = '') => getSedesCombobox(1, searchTerm),
        []
    );

    const {
        wrapperRef,
        inputValue,
        setInputValue,
        suggestions,
        showSuggestions,
        loading,
        runSearch,
        markSelectionClearedInternally,
    } = useRemoteSearchSelect({
        selectedId,
        initialValue: initialName,
        searchFn: searchSedes,
    });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runSearch(inputValue);
        }
    };

    const handleSelect = (sede) => {
        setInputValue(sede.nombre);
        
        onSelect({ 
            id: sede.id, 
            nombre: sede.nombre,
            direccion: sede.direccion
        });
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                Buscar Sede
            </label>
            
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        if (selectedId) {
                            markSelectionClearedInternally();
                            onSelect(null);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    onClick={() => {
                        if (!showSuggestions) {
                            runSearch(inputValue);
                        }
                    }}
                    placeholder="Buscar Sede..."
                    className={`w-full border rounded-md shadow-sm py-2 pl-3 pr-10 outline-none text-sm transition-colors ${
                        selectedId 
                            ? 'border-green-500 bg-green-50 text-green-800 font-bold' 
                            : 'border-gray-300 focus:border-fic-red focus:ring-1 focus:ring-fic-red'
                    }`}
                    autoComplete="off"
                />

                <button
                    type="button"
                    onClick={() => runSearch(inputValue)}
                    disabled={loading}
                    className="absolute right-2 text-gray-400 hover:text-fic-red p-1"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-fic-red rounded-full animate-spin"></div>
                    ) : selectedId ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    ) : (
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    )}
                </button>

                {/* DROPDOWN DE SUGERENCIAS */}
                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl animate-fade-in-down">
                        {suggestions.length > 0 ? (
                            suggestions.map((sede) => (
                                <li
                                    key={sede.id}
                                    onClick={() => handleSelect(sede)}
                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm border-b border-gray-100 last:border-none flex items-center gap-3 group"
                                >
                                    <div className="bg-slate-100 p-2 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <BuildingOfficeIcon className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 uppercase text-xs">
                                            {sede.nombre}
                                        </p>
                                        {sede.direccion && (
                                            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                                                {sede.direccion}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-slate-500 text-xs italic text-center">
                                No se encontraron sedes.
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SedeSearchSelect;
