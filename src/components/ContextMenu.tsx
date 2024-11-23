import React, { useEffect, useRef } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { ContextMenuProps } from '../types';

export default function ContextMenu({ x, y, file, onRename, onDelete, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleRename = () => {
    const newName = prompt('Enter new file name:', file.name);
    if (newName && newName !== file.name) {
      onRename(file.id, newName);
    }
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      onDelete(file.id);
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-slate-800 rounded-lg shadow-lg py-1 border border-slate-700 w-48 z-50"
      style={{ top: y, left: x }}
    >
      <button
        onClick={handleRename}
        className="w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center"
      >
        <Pencil className="w-4 h-4 mr-2" />
        Rename
      </button>
      <button
        onClick={handleDelete}
        className="w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </button>
    </div>
  );
}