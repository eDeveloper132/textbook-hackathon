import { useState, useEffect, useCallback } from 'react';

interface SelectionState {
  text: string | null;
  position: { x: number; y: number } | null;
}

export function useTextSelection() {
  const [selection, setSelection] = useState<SelectionState>({
    text: null,
    position: null,
  });

  const clearSelection = useCallback(() => {
    setSelection({ text: null, position: null });
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();

      if (text && text.length > 10) {
        const range = sel?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          setSelection({
            text,
            position: {
              x: rect.left + rect.width / 2,
              y: rect.top - 10,
            },
          });
        }
      } else {
        clearSelection();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [clearSelection]);

  return {
    selectedText: selection.text,
    position: selection.position,
    clearSelection,
  };
}
