import { v4 as uuidv4 } from 'uuid';
import type { Language } from '../types';

export function getLanguageFromFileName(fileName: string): Language {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'js':
    case 'jsx':
    default:
      return 'javascript';
  }
}

export function createNewFile(name: string = 'untitled.js') {
  return {
    id: uuidv4(),
    name,
    content: '',
    language: getLanguageFromFileName(name)
  };
}