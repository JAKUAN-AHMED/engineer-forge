'use client';
import { useRef, useState } from 'react';

/**
 * Sandboxed JS runner. Executes user code in a Web Worker created from a Blob URL
 * with an empty origin. No access to DOM, window, fetch, localStorage, or the host page.
 * Captured stdout/stderr are streamed back as messages.
 */
const WORKER_SOURCE = `
self.addEventListener('message', (ev) => {
  const { code, id } = ev.data;
  const logs = [];
  const push = (kind, args) => {
    const serialized = args.map(a => {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch { return String(a); }
    }).join(' ');
    logs.push({ kind, text: serialized });
    self.postMessage({ id, type: 'log', kind, text: serialized });
  };
  const console = {
    log:   (...a) => push('log', a),
    info:  (...a) => push('info', a),
    warn:  (...a) => push('warn', a),
    error: (...a) => push('error', a),
  };
  try {
    const fn = new Function('console', '"use strict";' + code);
    const result = fn(console);
    Promise.resolve(result).then(() => {
      // Let one macrotask run so setTimeout(fn, 0) can fire before we exit.
      setTimeout(() => self.postMessage({ id, type: 'done' }), 30);
    }).catch((err) => {
      self.postMessage({ id, type: 'error', message: String(err && err.stack || err) });
    });
  } catch (err) {
    self.postMessage({ id, type: 'error', message: String(err && err.stack || err) });
  }
});
`;

interface LogEntry {
  kind: 'log' | 'info' | 'warn' | 'error';
  text: string;
}

export function CodeRunner({ initial = '', title = 'Try it' }: { initial?: string; title?: string }) {
  const [code, setCode] = useState(initial);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  function run() {
    setLogs([]);
    setRunning(true);

    // Create a fresh worker every run for isolation + to kill runaway async.
    const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    workerRef.current = worker;
    URL.revokeObjectURL(url);

    const id = crypto.randomUUID();
    const killTimer = setTimeout(() => {
      worker.terminate();
      setLogs((l) => [...l, { kind: 'error', text: '[timeout after 2000ms]' }]);
      setRunning(false);
    }, 2000);

    worker.onmessage = (ev: MessageEvent) => {
      const data = ev.data as { id: string; type: string; kind?: LogEntry['kind']; text?: string; message?: string };
      if (data.id !== id) return;
      if (data.type === 'log' && data.kind && data.text !== undefined) {
        setLogs((l) => [...l, { kind: data.kind!, text: data.text! }]);
      } else if (data.type === 'error' && data.message) {
        setLogs((l) => [...l, { kind: 'error', text: data.message! }]);
        clearTimeout(killTimer);
        worker.terminate();
        setRunning(false);
      } else if (data.type === 'done') {
        clearTimeout(killTimer);
        worker.terminate();
        setRunning(false);
      }
    };

    worker.onerror = (err) => {
      setLogs((l) => [...l, { kind: 'error', text: String(err.message) }]);
      clearTimeout(killTimer);
      worker.terminate();
      setRunning(false);
    };

    worker.postMessage({ code, id });
  }

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-ink-800 bg-ink-900">
        <div className="text-xs uppercase tracking-wide text-ink-400 font-semibold">{title}</div>
        <button
          onClick={run}
          disabled={running}
          className="text-xs px-3 py-1 rounded bg-brand-500 text-ink-950 font-semibold hover:bg-brand-400 disabled:opacity-50"
        >
          {running ? 'Running…' : '▶ Run'}
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="w-full bg-ink-950 text-ink-100 font-mono text-sm p-4 min-h-[160px] outline-none resize-y"
      />
      <div className="border-t border-ink-800 bg-ink-900 px-4 py-3 min-h-[80px]">
        <div className="text-xs uppercase tracking-wide text-ink-400 font-semibold mb-2">Output</div>
        {logs.length === 0 && <div className="text-ink-500 text-sm italic">— run the code to see output —</div>}
        {logs.map((l, i) => (
          <pre
            key={i}
            className={`text-sm whitespace-pre-wrap ${
              l.kind === 'error' ? 'text-red-400' : l.kind === 'warn' ? 'text-yellow-400' : 'text-ink-100'
            }`}
          >
            {l.text}
          </pre>
        ))}
      </div>
    </div>
  );
}
