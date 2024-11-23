import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Terminal as TerminalIcon } from 'lucide-react';
import type { File, Settings } from '../types';

interface EditorProps {
  file: File | undefined;
  settings: Settings;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onToggleTerminal: () => void;
}

export default function CodeEditor({ file, settings, onCodeChange, onRun, onToggleTerminal }: EditorProps) {
  if (!file) return null;

  return (
    <div className="flex flex-col h-full bg-slate-800">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">{file.language}</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onToggleTerminal}
            className="flex items-center space-x-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm"
            title="Toggle Terminal"
          >
            <TerminalIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={onRun}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm">
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          language={file.language}
          value={file.content}
          onChange={(value) => onCodeChange(value || '')}
          theme={settings.theme}
          options={{
            fontSize: settings.fontSize,
            tabSize: settings.tabSize,
            minimap: { enabled: settings.minimap },
            wordWrap: settings.wordWrap ? 'on' : 'off',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}