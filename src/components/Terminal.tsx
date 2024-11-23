import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

interface TerminalProps {
  visible: boolean;
}

export default function Terminal({ visible }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const commandHistoryRef = useRef<string[]>([]);
  const currentCommandRef = useRef<string>('');
  const historyIndexRef = useRef<number>(-1);

  useEffect(() => {
    if (!terminalRef.current || !visible) return;

    const term = new XTerm({
      theme: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        cursor: '#e2e8f0',
      },
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      cursorBlink: true,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    term.write('Welcome to CodePlayground Terminal\r\n$ ');

    term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.keyCode === 13) { // Enter
        const command = currentCommandRef.current;
        if (command.trim()) {
          commandHistoryRef.current.push(command);
          historyIndexRef.current = commandHistoryRef.current.length;
        }
        term.write('\r\n');
        handleCommand(command, term);
        currentCommandRef.current = '';
        term.write('$ ');
      } else if (domEvent.keyCode === 8) { // Backspace
        if (currentCommandRef.current.length > 0) {
          currentCommandRef.current = currentCommandRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (domEvent.keyCode === 38) { // Up arrow
        if (historyIndexRef.current > 0) {
          historyIndexRef.current--;
          const command = commandHistoryRef.current[historyIndexRef.current];
          clearCurrentLine(term);
          term.write(command);
          currentCommandRef.current = command;
        }
      } else if (domEvent.keyCode === 40) { // Down arrow
        if (historyIndexRef.current < commandHistoryRef.current.length - 1) {
          historyIndexRef.current++;
          const command = commandHistoryRef.current[historyIndexRef.current];
          clearCurrentLine(term);
          term.write(command);
          currentCommandRef.current = command;
        } else {
          historyIndexRef.current = commandHistoryRef.current.length;
          clearCurrentLine(term);
          currentCommandRef.current = '';
        }
      } else if (printable) {
        term.write(key);
        currentCommandRef.current += key;
      }
    });

    xtermRef.current = term;

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });

    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
    };
  }, [visible]);

  const clearCurrentLine = (term: XTerm) => {
    term.write('\r$ ');
    for (let i = 0; i < currentCommandRef.current.length; i++) {
      term.write(' ');
    }
    term.write('\r$ ');
  };

  const handleCommand = (command: string, term: XTerm) => {
    const cmd = command.trim();
    if (!cmd) return;

    switch (cmd) {
      case 'clear':
        term.clear();
        break;
      case 'help':
        term.writeln('Available commands:');
        term.writeln('  clear - Clear the terminal');
        term.writeln('  help  - Show this help message');
        break;
      default:
        term.writeln(`Command not found: ${cmd}`);
    }
  };

  if (!visible) return null;

  return (
    <div className="h-64 bg-slate-900 border-t border-slate-700">
      <div ref={terminalRef} className="h-full" />
    </div>
  );
}