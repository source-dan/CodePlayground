import React from 'react';
import { Terminal } from 'lucide-react';

interface OutputProps {
  output: string;
}

export default function Output({ output }: OutputProps) {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="flex items-center px-4 py-2 border-b border-slate-800">
        <Terminal className="w-4 h-4 mr-2 text-slate-400" />
        <h2 className="text-sm font-medium">Output</h2>
      </div>
      
      <div className="flex-1 p-4 font-mono text-sm overflow-auto">
        {output ? (
          <pre className="text-slate-300">{output}</pre>
        ) : (
          <div className="text-slate-500 italic">Run your code to see the output</div>
        )}
      </div>
    </div>
  );
}