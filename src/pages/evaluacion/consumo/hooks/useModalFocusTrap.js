import { useEffect } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (node) => (
  node ? Array.from(node.querySelectorAll(FOCUSABLE_SELECTOR)) : []
);

const useModalFocusTrap = ({
  isOpen,
  dialogRef,
  initialFocusRef,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = getFocusableElements(dialogRef.current);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const frameId = window.requestAnimationFrame(() => {
      const target = initialFocusRef?.current || getFocusableElements(dialogRef.current)[0];
      target?.focus?.();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener('keydown', handleKeyDown);

      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus?.();
      }
    };
  }, [dialogRef, initialFocusRef, isOpen, onClose]);
};

export default useModalFocusTrap;
