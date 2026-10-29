'use client';

import React from 'react';
import { X, Plus } from 'lucide-react';

interface TagsInputFieldProps {
  label: string;
  placeholder: string;
  tags: string[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  isDanger?: boolean;
  idPrefix: string;
}

/**
 * Componente modular para entrada e gerenciamento de tags (keywords, termos proibidos).
 */
export function TagsInputField({
  label,
  placeholder,
  tags,
  inputValue,
  onInputChange,
  onAddTag,
  onRemoveTag,
  isDanger = false,
  idPrefix
}: TagsInputFieldProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {/* Lista de tags */}
      <div className="tags-input-container">
        {tags.map((tag) => (
          <span
            key={tag}
            className="tag-badge-removable"
            style={isDanger ? { borderColor: 'var(--accent-danger)' } : undefined}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              id={`btn-remove-${idPrefix}-${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Campo de adição rápida */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <input
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          id={`input-add-${idPrefix}`}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onAddTag}
          id={`btn-add-${idPrefix}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
