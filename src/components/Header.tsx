import React from 'react';
import { Github, Settings, Code2 } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold">CodePlayground</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Github className="w-5 h-5" />
          </button>
          <button 
            onClick={onSettingsClick}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}