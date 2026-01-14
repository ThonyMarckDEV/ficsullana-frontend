import React, { useState, useEffect, useRef } from 'react';
import { getProspectos } from 'services/prospectoService';
import { MagnifyingGlassIcon, UserPlusIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';

const ProspectoSearchSelect = ({ onSelect, selectedId, initialName = '', onOpenModal }) => {
    const [inputValue, setInputValue] = useState(initialName);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!selectedId) setInputValue('');
        else if (initialName) setInputValue(initialName);
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

    const fetchProspectos = async (searchTerm) => {
        if (!searchTerm) return;
        setLoading(true);
        try {
            const response = await getProspectos(1, searchTerm);
            setSuggestions(response.data || []);
            setShowSuggestions(true);
            setHasSearched(true);
        } catch (error) {
            console.error("Error buscando prospectos", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchProspectos(inputValue);
        }
    };

    const handleSelect = (prospecto) => {
        const nombreCompleto = `${prospecto.nombres} ${prospecto.apellido_paterno} ${prospecto.apellido_materno}`;
        setInputValue(nombreCompleto);
        setShowSuggestions(false);
        onSelect({ id: prospecto.id, nombre: nombreCompleto, dni: prospecto.dni });
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                Buscar Prospecto
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
                    placeholder="Buscar Prospecto..."
                    className={`w-full border rounded-md shadow-sm py-2 pl-3 pr-10 outline-none text-sm transition-colors ${
                        selectedId 
                            ? 'border-green-500 bg-green-50 text-green-800 font-bold' 
                            : 'border-gray-300 focus:border-fic-red focus:ring-1 focus:ring-fic-red'
                    }`}
                />

                <button
                    type="button"
                    onClick={() => fetchProspectos(inputValue)}
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

                {/* DROPDOWN CON LÓGICA DE NUEVO */}
                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl animate-fade-in-down">
                        {suggestions.length > 0 ? (
                            suggestions.map((pros) => (
                                <li
                                    key={pros.id}
                                    onClick={() => handleSelect(pros)}
                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm border-b border-gray-100 last:border-none flex items-center gap-3 group"
                                >
                                    <div className="bg-orange-50 p-2 rounded-full group-hover:bg-white transition-all">
                                        <UserPlusIcon className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 uppercase text-xs">
                                            {pros.nombres} {pros.apellido_paterno}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-mono">
                                            DNI: {pros.dni}
                                        </p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-3 bg-slate-50 text-center">
                                <p className="text-xs text-slate-500 mb-2 italic">No se encontraron resultados.</p>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowSuggestions(false);
                                        onOpenModal(); // <--- ABRE EL MODAL AQUÍ
                                    }}
                                    className="bg-green-600 text-white text-xs px-4 py-2 rounded-md font-bold shadow hover:bg-green-700 w-full flex items-center justify-center gap-2"
                                >
                                    <PlusIcon className="w-3 h-3" /> Registrar Nuevo Prospecto
                                </button>
                            </li>
                        )}
                    </ul>
                )}
            </div>
            
            {/* Si no ha buscado y no hay selección, mostramos el botón directo */}
            {!selectedId && !inputValue && (
                <div className="mt-2 text-right">
                    <button 
                        type="button" 
                        onClick={onOpenModal} 
                        className="text-[10px] text-fic-red font-bold hover:underline flex items-center justify-end gap-1 w-full"
                    >
                        <PlusIcon className="w-3 h-3"/> ¿No existe? Registrar Nuevo
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProspectoSearchSelect;