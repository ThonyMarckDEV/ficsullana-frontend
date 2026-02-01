import React, { useState, useEffect, useRef } from 'react';
import { getAreasCombobox } from 'services/areaService'; 
import { MagnifyingGlassIcon, CheckCircleIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const AreaSearchSelect = ({ onSelect, selectedId, initialName = '' }) => {
    const [inputValue, setInputValue] = useState(initialName);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const wrapperRef = useRef(null);
    const isManualSelection = useRef(false);

    useEffect(() => {
        if (!selectedId) {
            setInputValue('');
            return;
        }
        if (isManualSelection.current) {
            isManualSelection.current = false;
            return;
        }
        if (initialName) {
            setInputValue(initialName);
        }
    }, [selectedId, initialName]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchAreas = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await getAreasCombobox(); 
            const data = response.data || response;
            
            const filtered = searchTerm 
                ? data.filter(a => a.nombre_area.toLowerCase().includes(searchTerm.toLowerCase()))
                : data;

            setSuggestions(Array.isArray(filtered) ? filtered : []);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error buscando áreas", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchAreas(inputValue);
        }
    };

    const handleInputClick = () => {
        if (!showSuggestions) {
            fetchAreas(inputValue);
        }
    };

    const handleSelect = (area) => {
        isManualSelection.current = true;
        setInputValue(area.nombre_area);
        setShowSuggestions(false);
        onSelect(area);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                Área
            </label>

            <div className="relative flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        if (selectedId) onSelect(null);
                    }}
                    onKeyDown={handleKeyDown}
                    onClick={handleInputClick}
                    placeholder="Buscar Área..."
                    className={`w-full border rounded-md shadow-sm py-2 pl-3 pr-10 outline-none text-sm transition-colors ${
                        selectedId
                            ? 'border-green-500 bg-green-50 text-green-800 font-bold'
                            : 'border-gray-300 focus:border-fic-red focus:ring-1 focus:ring-fic-red'
                    }`}
                    autoComplete="off"
                />

                <button
                    type="button"
                    onClick={() => fetchAreas(inputValue)}
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