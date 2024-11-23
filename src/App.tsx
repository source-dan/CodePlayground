import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/Editor';
import Output from './components/Output';
import Settings from './components/Settings';
import Terminal from './components/Terminal';
import Preview from './components/Preview';
import { CodeState, Settings as SettingsType } from './types';
import { createNewFile, getLanguageFromFileName } from './utils/fileUtils';
import { loadPyodide } from './utils/pyodide';

const initialSettings: SettingsType = {
  mode: 'normal',
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  showOutput: true,
  showTerminal: false,
  minimap: true,
  wordWrap: false
};

const initialFiles = [
  {
    id: '1',
    name: 'index.html',
    content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
    language: 'html'
  },
  {
    id: '2',
    name: 'styles.css',
    content: 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
    language: 'css'
  },
  {
    id: '3',
    name: 'script.js',
    content: '// Your JavaScript code here\nconsole.log("Hello from JavaScript!");',
    language: 'javascript'
  }
];

function App() {
  const [state, setState] = useState<CodeState>({
    files: initialFiles,
    activeFileId: '1',
    output: ''
  });
  
  const [settings, setSettings] = useState<SettingsType>(initialSettings);
  const [showSettings, setShowSettings] = useState(false);

  const activeFile = state.files.find(f => f.id === state.activeFileId);

  const handleCodeChange = (content: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(f => 
        f.id === state.activeFileId ? { ...f, content } : f
      )
    }));
  };

  const handleRun = async () => {
    if (!activeFile) return;
    
    try {
      let output = '';
      
      switch (activeFile.language) {
        case 'python': {
          const pyodide = await loadPyodide();
          try {
            await pyodide.loadPackagesFromImports(activeFile.content);
            output = await pyodide.runPythonAsync(activeFile.content);
          } catch (err) {
            output = String(err);
          }
          break;
        }
        
        case 'javascript': {
          const consoleLog = console.log;
          const logs: string[] = [];
          console.log = (...args) => {
            logs.push(args.map(arg => String(arg)).join(' '));
          };
          
          try {
            const result = new Function(activeFile.content)();
            output = logs.join('\n') + (result !== undefined ? '\n' + String(result) : '');
          } catch (err) {
            output = String(err);
          } finally {
            console.log = consoleLog;
          }
          break;
        }
        
        case 'html':
        case 'css':
          output = 'Preview updated';
          break;
        
        default:
          output = 'Language not supported for execution';
      }
      
      setState(prev => ({ ...prev, output: String(output) }));
    } catch (error) {
      setState(prev => ({ ...prev, output: String(error) }));
    }
  };

  const handleNewFile = () => {
    const newFile = createNewFile();
    setState(prev => ({
      ...prev,
      files: [...prev.files, newFile],
      activeFileId: newFile.id
    }));
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(f => 
        f.id === fileId 
          ? { ...f, name: newName, language: getLanguageFromFileName(newName) }
          : f
      )
    }));
  };

  const handleDeleteFile = (fileId: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId),
      activeFileId: prev.activeFileId === fileId 
        ? prev.files[0]?.id || null
        : prev.activeFileId
    }));
  };

  const toggleTerminal = () => {
    setSettings(prev => ({ ...prev, showTerminal: !prev.showTerminal }));
  };

  const handleSettingsClick = useCallback(() => {
    setShowSettings(true);
  }, []);

  const hasPreviewableFiles = state.files.some(f => 
    f.name.endsWith('.html') || f.name.endsWith('.css') || f.name.endsWith('.js')
  );

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <Header onSettingsClick={handleSettingsClick} />
      
      <div className="flex-1 flex">
        <Sidebar
          files={state.files}
          activeFileId={state.activeFileId}
          onFileSelect={(id) => setState(prev => ({ ...prev, activeFileId: id }))}
          onNewFile={handleNewFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
        />
        
        <main className="flex-1 flex flex-col">
          <div className={`flex-1 flex ${settings.showOutput ? 'space-x-2' : ''}`}>
            <div className={`${settings.showOutput ? 'w-1/2' : 'w-full'}`}>
              <CodeEditor
                file={activeFile}
                settings={settings}
                onCodeChange={handleCodeChange}
                onRun={handleRun}
                onToggleTerminal={toggleTerminal}
              />
            </div>
            
            {settings.showOutput && (
              <div className="w-1/2 flex flex-col">
                {hasPreviewableFiles && <Preview files={state.files} />}
                <Output output={state.output} />
              </div>
            )}
          </div>
          
          {settings.showTerminal && <Terminal visible={settings.showTerminal} />}
        </main>
      </div>

      {showSettings && (
        <Settings
          isOpen={showSettings}
          settings={settings}
          onClose={() => setShowSettings(false)}
          onUpdate={setSettings}
        />
      )}
    </div>
  );
}

export default App;