import React, { useState } from 'react';
import { File, FilePlus, FolderOpen } from 'lucide-react';
import type { File as CodeFile } from '../types';
import ContextMenu from './ContextMenu';

interface SidebarProps {
  files: CodeFile[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onNewFile: () => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onDeleteFile: (fileId: string) => void;
}

export default function Sidebar({ 
  files, 
  activeFileId, 
  onFileSelect, 
  onNewFile,
  onRenameFile,
  onDeleteFile 
}: SidebarProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: CodeFile;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, file: CodeFile) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file
    });
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">EXPLORER</span>
        <div className="flex space-x-2">
          <button 
            onClick={onNewFile}
            className="p-1 hover:bg-slate-700 rounded-md"
            title="New File"
          >
            <FilePlus className="w-4 h-4 text-slate-400" />
          </button>
          <button 
            className="p-1 hover:bg-slate-700 rounded-md"
            title="Open Folder"
          >
            <FolderOpen className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => onFileSelect(file.id)}
            onContextMenu={(e) => handleContextMenu(e, file)}
            className={`w-full flex items-center px-4 py-2 text-sm ${
              activeFileId === file.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <File className="w-4 h-4 mr-2" />
            {file.name}
          </button>
        ))}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          file={contextMenu.file}
          onRename={onRenameFile}
          onDelete={onDeleteFile}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}