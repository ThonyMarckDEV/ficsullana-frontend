import React, { useEffect, useRef, useState } from 'react';
import { getEntidadesFinancieras } from 'services/entidadFinancieraService';
import { MagnifyingGlassIcon, CheckCircleIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

const EntidadFinancieraSearchSelect = ({ onSelect, selectedId, initialName = '' }) => {
  const [inputValue, setInputValue] = useState(initialName);
  const [suggestions, setSuggestions] = useState([]);
  const [allEntidades, setAllEntidades] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!selectedId) setInputValue('');
    else if (initialName) setInputValue(initialName);
  }, [selectedId, initialName]);

  useEffect(() => {
    const loadEntidades = async () => {
      setLoading(true);
      try {
        const response = await getEntidadesFinancieras();
        const data = response.data || [];
        setAllEntidades(data);
        setSuggestions(data);
      } catch (error) {
        setAllEntidades([]);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    loadEntidades();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filterEntidades = (term = '') => {
    const q = term.trim().toLowerCase();
    const filtered = q
      ? allEntidades.filter(entidad => entidad.nombre?.toLowerCase().includes(q))
      : allEntidades;
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      filterEntidades(inputValue);
    }
  };

  const handleInputClick = () => {
    if (!showSuggestions) {
      filterEntidades(inputValue);
    }
  };

  const handleSelect = (entidad) => {
    setInputValue(entidad.nombre || '');
    setShowSuggestions(false);
    onSelect(entidad);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
        Entidad Financiera
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
          placeholder="Buscar Entidad..."
          className={`w-full border rounded-md shadow-sm py-2 pl-3 pr-10 outline-none text-sm transition-colors ${
            selectedId
              ? 'border-green-500 bg-green-50 text-green-800 font-bold'
              : 'border-gray-300 focus:border-fic-red focus:ring-1 focus:ring-fic-red'
          }`}
          autoComplete="off"
        />

        <button
          type="button"
          onClick={() => filterEntidades(inputValue)}
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
              suggestions.map((entidad) => (
                <li
                  key={entidad.id}
                  onClick={() => handleSelect(entidad)}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm border-b border-gray-100 last:border-none flex items-center gap-3 group"
                >
                  <div className="bg-slate-100 p-2 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
                    <BuildingLibraryIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 uppercase text-xs">
                      {entidad.nombre}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {entidad.tipo}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-slate-500 text-xs italic text-center">
                No se encontraron entidades.
              </li>
            )}
          </ul>
        )}
      </div>

      {selectedId && (
        <p className="text-[10px] text-green-600 mt-1 font-bold animate-pulse">✓ Entidad seleccionada</p>
      )}
    </div>
  );
};

export default EntidadFinancieraSearchSelect;