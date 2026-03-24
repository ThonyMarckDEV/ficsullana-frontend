import { useCallback, useEffect, useRef, useState } from 'react';
import useSearchDropdown from './useSearchDropdown';

export const mapRemoteSearchResults = (response) => {
  const source = response?.data ?? response;
  if (Array.isArray(source)) {
    return source;
  }

  if (Array.isArray(source?.data)) {
    return source.data;
  }

  return [];
};

const defaultMinSearchMessage = (minSearchLength) => (
  `Ingresa al menos ${minSearchLength} caracteres para buscar.`
);

const useRemoteSearchSelect = ({
  selectedId,
  initialValue = '',
  disabled = false,
  minSearchLength = 0,
  minSearchMessage,
  searchFn,
  mapResults = mapRemoteSearchResults,
  recoverSelectedLabel,
}) => {
  const isSearchingRef = useRef(false);
  const skipNextClearRef = useRef(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const {
    wrapperRef,
    inputValue,
    setInputValue,
    showSuggestions,
    setShowSuggestions,
    reopenSuggestions: reopenDropdownSuggestions,
    resetDropdownState,
  } = useSearchDropdown({
    initialInputValue: initialValue,
    syncInputValue: false,
  });

  useEffect(() => {
    if (!selectedId) {
      if (skipNextClearRef.current) {
        skipNextClearRef.current = false;
        return;
      }

      setInputValue('');
      return;
    }

    setInputValue(initialValue || '');
  }, [initialValue, selectedId, setInputValue]);

  useEffect(() => {
    if (!recoverSelectedLabel || !selectedId || initialValue || inputValue) {
      return undefined;
    }

    let isMounted = true;

    const recoverLabel = async () => {
      try {
        setLoading(true);
        const recoveredLabel = await recoverSelectedLabel(selectedId);
        if (isMounted && recoveredLabel) {
          setInputValue(recoveredLabel);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    recoverLabel();

    return () => {
      isMounted = false;
    };
  }, [initialValue, inputValue, recoverSelectedLabel, selectedId, setInputValue]);

  const fetchSuggestions = useCallback(async (searchTerm = '') => {
    if (isSearchingRef.current || disabled) {
      return [];
    }

    isSearchingRef.current = true;
    setLoading(true);
    setSearchError('');

    try {
      const response = await searchFn(searchTerm);
      const nextSuggestions = mapResults(response);
      setSuggestions(nextSuggestions);
      setShowSuggestions(true);
      return nextSuggestions;
    } catch (error) {
      setSuggestions([]);
      setSearchError(error?.message || 'No se pudo completar la búsqueda.');
      setShowSuggestions(true);
      return [];
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [disabled, mapResults, searchFn, setShowSuggestions]);

  const runSearch = useCallback((term = inputValue) => {
    const searchTerm = String(term || '').trim();

    if (minSearchLength > 0 && searchTerm.length < minSearchLength) {
      setSearchError(minSearchMessage || defaultMinSearchMessage(minSearchLength));
      setSuggestions([]);
      setShowSuggestions(false);
      return Promise.resolve([]);
    }

    return fetchSuggestions(searchTerm);
  }, [fetchSuggestions, inputValue, minSearchLength, minSearchMessage, setShowSuggestions]);

  const markSelectionClearedInternally = useCallback(() => {
    skipNextClearRef.current = true;
  }, []);

  const reopenSuggestions = useCallback(() => {
    reopenDropdownSuggestions(suggestions.length);
  }, [reopenDropdownSuggestions, suggestions.length]);

  const resetSearchState = useCallback(() => {
    setSearchError('');
    resetDropdownState();
  }, [resetDropdownState]);

  return {
    wrapperRef,
    inputValue,
    setInputValue,
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    loading,
    searchError,
    setSearchError,
    fetchSuggestions,
    runSearch,
    reopenSuggestions,
    resetSearchState,
    markSelectionClearedInternally,
  };
};

export default useRemoteSearchSelect;
