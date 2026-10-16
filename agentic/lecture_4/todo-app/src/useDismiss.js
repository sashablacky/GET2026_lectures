import { useEffect } from 'react';

/** Calls `onDismiss` when the user clicks outside `ref` or presses Escape while `isOpen`. */
export function useDismiss(ref, isOpen, onDismiss) {
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event) {
      if (!ref.current?.contains(event.target)) onDismiss();
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') onDismiss();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, isOpen, onDismiss]);
}
