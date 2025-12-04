import React from 'react';
import { useTextSelection } from '../hooks/useTextSelection';

interface SelectionQueryProps {
  onQuery: (text: string) => void;
}

export default function SelectionQuery({ onQuery }: SelectionQueryProps) {
  const { selectedText, position, clearSelection } = useTextSelection();

  if (!selectedText || !position) {
    return null;
  }

  const handleClick = () => {
    onQuery(selectedText);
    clearSelection();
  };

  return (
    <button
      className="selection-query-btn"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
      }}
      onClick={handleClick}
    >
      🔍 Ask about this
    </button>
  );
}
