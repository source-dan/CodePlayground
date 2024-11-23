import React from 'react';
import type { Settings as SettingsType, Theme, EditorMode } from '../types';

interface SettingsProps {
  isOpen: boolean;
  settings: SettingsType;
  onClose: () => void;
  onUpdate: (settings: SettingsType) => void;
}

const themes: Theme[] = ['vs-dark', 'vs-light', 'hc-black', 'github-dark', 'monokai'];
const modes: EditorMode[] = ['normal', 'vim', 'emacs'];

export default function Settings({ isOpen, settings, onClose, onUpdate }: SettingsProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-800 rounded-lg w-[500px] shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => onUpdate({ ...settings, theme: e.target.value as Theme })}
                className="bg-slate-700 rounded px-2 py-1 text-sm"
              >
                {themes.map(theme => (
                  <option key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Editor Mode</label>
              <select
                value={settings.mode}
                onChange={(e) => onUpdate({ ...settings, mode: e.target.value as EditorMode })}
                className="bg-slate-700 rounded px-2 py-1 text-sm"
              >
                {modes.map(mode => (
                  <option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Font Size</label>
              <input
                type="number"
                value={settings.fontSize}
                onChange={(e) => onUpdate({ ...settings, fontSize: Number(e.target.value) })}
                className="bg-slate-700 rounded px-2 py-1 text-sm w-20"
                min="8"
                max="32"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Tab Size</label>
              <input
                type="number"
                value={settings.tabSize}
                onChange={(e) => onUpdate({ ...settings, tabSize: Number(e.target.value) })}
                className="bg-slate-700 rounded px-2 py-1 text-sm w-20"
                min="2"
                max="8"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Show Minimap</label>
              <input
                type="checkbox"
                checked={settings.minimap}
                onChange={(e) => onUpdate({ ...settings, minimap: e.target.checked })}
                className="rounded bg-slate-700"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Word Wrap</label>
              <input
                type="checkbox"
                checked={settings.wordWrap}
                onChange={(e) => onUpdate({ ...settings, wordWrap: e.target.checked })}
                className="rounded bg-slate-700"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Show Output Panel</label>
              <input
                type="checkbox"
                checked={settings.showOutput}
                onChange={(e) => onUpdate({ ...settings, showOutput: e.target.checked })}
                className="rounded bg-slate-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}