let pyodideInstance: any = null;

export async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
  document.head.appendChild(script);

  return new Promise((resolve) => {
    script.onload = async () => {
      // @ts-ignore
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });
      resolve(pyodideInstance);
    };
  });
}