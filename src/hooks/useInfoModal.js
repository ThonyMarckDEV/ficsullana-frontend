import { useCallback, useMemo, useState } from 'react';

const EMPTY_MODAL_DATA = {
  title: '',
  subtitle: '',
  sections: [],
};

const DEFAULT_LOADING_DATA = {
  title: 'Cargando...',
  subtitle: '',
  sections: [],
};

const normalizeModalData = (data = EMPTY_MODAL_DATA) => ({
  title: data?.title || '',
  subtitle: data?.subtitle || '',
  sections: Array.isArray(data?.sections) ? data.sections : [],
});

const useInfoModal = ({ setAlert } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(EMPTY_MODAL_DATA);

  const closeInfoModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openInfoModal = useCallback(async ({
    fetcher,
    mapData,
    loadingData = DEFAULT_LOADING_DATA,
    onError,
  } = {}) => {
    if (typeof fetcher !== 'function' || typeof mapData !== 'function') {
      return null;
    }

    setIsOpen(true);
    setLoading(true);
    setModalData(normalizeModalData(loadingData));

    try {
      const response = await fetcher();
      setModalData(normalizeModalData(mapData(response)));
      return response;
    } catch (error) {
      setIsOpen(false);
      if (setAlert && typeof onError === 'function') {
        setAlert(onError(error));
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [setAlert]);

  const modalProps = useMemo(() => ({
    isOpen,
    onClose: closeInfoModal,
    title: modalData.title,
    subtitle: modalData.subtitle,
    sections: modalData.sections,
    loading,
  }), [closeInfoModal, isOpen, loading, modalData.sections, modalData.subtitle, modalData.title]);

  return {
    isInfoOpen: isOpen,
    infoLoading: loading,
    modalData,
    modalProps,
    setModalData,
    closeInfoModal,
    openInfoModal,
  };
};

export default useInfoModal;
