import { useCallback, useEffect, useRef, useState } from 'react';

const useSearchDropdown = ({ initialInputValue = '', syncInputValue = true } = {}) => {
  const wrapperRef = useRef(null);
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!syncInputValue) {
      return;
    }

    setInputValue(initialInputValue);
  }, [initialInputValue, syncInputValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openSuggestions = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  const closeSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, []);

  const reopenSuggestions = useCallback((itemsCount = 0) => {
    if (itemsCount > 0) {
      setShowSuggestions(true);
    }
  }, []);

  const resetDropdownState = useCallback(() => {
    setShowSuggestions(false);
  }, []);

  return {
    wrapperRef,
    inputValue,
    setInputValue,
    showSuggestions,
    setShowSuggestions,
    openSuggestions,
    closeSuggestions,
    reopenSuggestions,
    resetDropdownState,
  };
};

export default useSearchDropdown;
