export type Language = 
  | 'javascript' 
  | 'typescript' 
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'yaml';

export type EditorMode = 'normal' | 'vim' | 'emacs';

export type Theme = 
  | 'vs-dark'
  | 'vs-light'
  | 'hc-black'
  | 'github-dark'
  | 'monokai';

export interface Settings {
  mode: EditorMode;
  theme: Theme;
  fontSize: number;
  tabSize: number;
  showOutput: boolean;
  showTerminal: boolean;
  minimap: boolean;
  wordWrap: boolean;
}

export interface File {
  id: string;
  name: string;
  content: string;
  language: Language;
}

export interface CodeState {
  files: File[];
  activeFileId: string | null;
  output: string;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  file: File;
  onRename: (fileId: string, newName: string) => void;
  onDelete: (fileId: string) => void;
  onClose: () => void;
}