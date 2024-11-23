import React, { useEffect, useRef } from 'react';
import { File } from '../types';

interface PreviewProps {
  files: File[];
}

export default function Preview({ files }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const htmlFile = files.find(f => f.name.endsWith('.html'));
    const cssFile = files.find(f => f.name.endsWith('.css'));
    const jsFile = files.find(f => f.name.endsWith('.js'));

    if (!htmlFile) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    let html = htmlFile.content;

    // Inject CSS if it exists
    if (cssFile) {
      html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
    }

    // Inject JS if it exists
    if (jsFile) {
      html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
    }

    doc.open();
    doc.write(html);
    doc.close();
  }, [files]);

  return (
    <div className="flex-1 bg-white">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
        title="preview"
      />
    </div>
  );
}