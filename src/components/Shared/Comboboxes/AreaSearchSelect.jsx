import React, { useCallback } from 'react';
import { getAreasCombobox } from 'services/areaService'; 
import { MagnifyingGlassIcon, CheckCircleIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import useRemoteSearchSelect from 'hooks/useRemoteSearchSelect';

const AreaSearchSelect = ({ onSelect, selectedId, initialName = '' }) => {
    const searchAreas = useCallback(async (searchTerm = '') => {
            const response = await getAreasCombobox(); 
            const data = response.data || response;
            
            const filtered = searchTerm 
                ? data.filter((area) => area.nombre_area.toLowerCase().includes(searchTerm.toLowerCase()))
                : data;

            return Array.isArray(filtered) ? filtered : [];
    }, []);

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
        searchFn: searchAreas,
        mapResults: (results) => results,
    });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runSearch(inputValue);
        }
    };

    const handleSelect = (area) => {
        setInputValue(area.nombre_area);
        onSelect(area);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wide">
                Área
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
                    placeholder="Buscar Área..."
                    className={`w-full px-3 py-2.5 border rounded-lg shadow-sm pr-10 outline-none text-sm font-medium transition-all ${
                        selectedId
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-slate-300 focus:border-fic-red focus:ring-2 focus:ring-fic-red text-slate-700 placeholder:font-normal'
                    }`}
                    autoComplete="off"
                />

                <button
                    type="button"
                    onClick={() => runSearch(inputValue)}
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-fic-red p-1"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-fic-red rounded-full animate-spin"></div>
                    ) : selectedId ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    ) : (
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    )}
                </button>

                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl animate-fade-in-down">
                        {suggestions.length > 0 ? (
                            suggestions.map((area) => (
                                <li
                                    key={area.id}
                                    onClick={() => handleSelect(area)}
                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm border-b border-gray-100 last:border-none flex items-center gap-3 group"
                                >
                                    <div className="bg-amber-50 p-2 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <Squares2X2Icon className="w-4 h-4 text-amber-700" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 uppercase text-xs">
                                            {area.nombre_area}
                                        </p>
                                        {area.descripcion && (
                                            <p className="text-[10px] text-slate-400">
                                                {area.descripcion}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-slate-500 text-xs italic text-center">
                                No se encontraron áreas.
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {selectedId && (
                <p className="text-[10px] text-green-600 mt-1 font-bold animate-pulse">✓ Área seleccionada</p>
            )}
        </div>
    );
};

export default AreaSearchSelect;
