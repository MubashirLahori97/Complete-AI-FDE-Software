import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Square, Terminal, Lightbulb, Code2, ChevronDown } from 'lucide-react';
import { labs, lessonLab, type Lab } from './labs';
import type { Progress } from './state';
import { PageHeading } from './ui';

export default function Playground({
  progress,
  update,
  day,
}: {
  progress: Progress;
  update: (next: Progress) => void;
  day?: number;
}) {
  const [lab, setLab] = useState<Lab>(day ? lessonLab(day) : labs[0]);
  const code = progress.drafts[lab.id] ?? lab.code;
  const [output, setOutput] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'done' | 'error'>('idle');
  const [hint, setHint] = useState(false);
  const [preview, setPreview] = useState('');
  const [runnerReady, setRunnerReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const runId = useRef(0);
  const stop = () => {
    clearTimeout(timer.current);
    frame.current?.contentWindow?.postMessage({ type: 'fde:stop' }, '*');
  };
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.source !== 'fde-runner')
        return;
      const message = event.data;
      if (message.type === 'loaded') {
        setRunnerReady(true);
        return;
      }
      if (message.id !== runId.current) return;
      if (message.type === 'ready') {
        setStatus('running');
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          stop();
          runId.current++;
          setStatus('error');
          setOutput((old) => [
            ...old,
            'Stopped after 5 seconds. Check your loop’s stop condition.',
          ]);
        }, 5000);
      }
      if (message.type === 'output' && typeof message.text === 'string')
        setOutput((old) => (old.length < 200 ? [...old, message.text.slice(0, 4000)] : old));
      if (message.type === 'done' || message.type === 'error') {
        clearTimeout(timer.current);
        setStatus(message.type === 'done' ? 'done' : 'error');
        if (message.type === 'error')
          setOutput((old) => [
            ...old,
            String(message.text || 'The program failed.').slice(0, 6000),
          ]);
        frame.current?.contentWindow?.postMessage({ type: 'fde:stop' }, '*');
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
      clearTimeout(timer.current);
      frame.current?.contentWindow?.postMessage({ type: 'fde:stop' }, '*');
    };
  }, []);
  const run = () => {
    stop();
    setOutput([]);
    runId.current++;
    if (lab.language === 'html') {
      setPreview(code);
      setStatus('done');
      return;
    }
    setStatus('loading');
    frame.current?.contentWindow?.postMessage(
      { type: 'fde:run', id: runId.current, code, language: lab.language },
      '*',
    );
    timer.current = setTimeout(() => {
      stop();
      runId.current++;
      setStatus('error');
      setOutput([
        'The runtime did not load within 60 seconds. Python needs a connection to cdn.jsdelivr.net. Try JavaScript or run Python locally.',
      ]);
    }, 60000);
  };
  const changeLab = (id: string) => {
    stop();
    runId.current++;
    setLab(labs.find((item) => item.id === id)!);
    setOutput([]);
    setStatus('idle');
    setHint(false);
    setPreview('');
  };
  const busy = status === 'loading' || status === 'running';
  return (
    <>
      {!day && (
        <PageHeading
          eyebrow="LEARN BY DOING"
          title="Your practice lab"
          description="Predict the result. Run it. Change one thing. Explain what happened."
        />
      )}
      <div className="lab-controls">
        {!day && (
          <div className="select-wrap">
            <Code2 size={17} />
            <label className="sr-only" htmlFor="lab-select">
              Choose an exercise
            </label>
            <select
              id="lab-select"
              value={lab.id}
              onChange={(event) => changeLab(event.target.value)}
            >
              {labs.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} · {item.language === 'html' ? 'HTML / CSS' : item.language}
                </option>
              ))}
            </select>
            <ChevronDown size={15} />
          </div>
        )}
        <span className="badge">
          {lab.language === 'html'
            ? 'HTML + CSS + JS'
            : lab.language === 'python'
              ? 'Python'
              : 'JavaScript'}
        </span>
      </div>
      <div className="lab-brief">
        <div className="eyebrow">YOUR CHALLENGE</div>
        <h2>{lab.title}</h2>
        <p>{lab.task}</p>
        <button className="text-button" onClick={() => setHint(!hint)} aria-expanded={hint}>
          <Lightbulb size={16} />
          {hint ? 'Hide hint' : 'Give me a hint'}
        </button>
        {hint && <p className="hint">{lab.hint}</p>}
      </div>
      <div className="playground">
        <div className="editor-pane">
          <div className="editor-heading">
            <span>
              <span className="window-dot" />
              <span className="window-dot" />
              <span className="window-dot" />
            </span>
            <span>
              {lab.language === 'python'
                ? 'main.py'
                : lab.language === 'html'
                  ? 'index.html'
                  : 'main.js'}
            </span>
            <button
              aria-label="Reset exercise code"
              title="Reset code"
              onClick={() => {
                if (
                  code !== lab.code &&
                  !window.confirm('Replace your edits with the starter code?')
                )
                  return;
                stop();
                runId.current++;
                update({ ...progress, drafts: { ...progress.drafts, [lab.id]: lab.code } });
                setStatus('idle');
                setOutput([]);
                setPreview('');
              }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
          <label className="sr-only" htmlFor="code-editor">
            Code editor
          </label>
          <textarea
            id="code-editor"
            className="code-editor"
            spellCheck={false}
            value={code}
            aria-describedby="code-editor-help"
            onChange={(event) =>
              update({
                ...progress,
                drafts: { ...progress.drafts, [lab.id]: event.target.value.slice(0, 50000) },
              })
            }
          />
          <div className="editor-footer">
            <span>
              {code.split('\n').length} lines <span className="dot-divider">·</span> {lab.language}
            </span>
            {busy ? (
              <button
                className="button light small"
                onClick={() => {
                  stop();
                  runId.current++;
                  setStatus('idle');
                  setOutput((old) => [...old, 'Execution stopped.']);
                }}
              >
                <Square size={13} />
                Stop
              </button>
            ) : (
              <button
                className="button lime small"
                onClick={run}
                disabled={lab.language !== 'html' && !runnerReady}
              >
                <Play size={14} />
                {lab.language === 'html' ? 'Preview' : 'Run code'}
              </button>
            )}
          </div>
        </div>
        <div className="output-pane">
          <div className="output-heading">
            <span>
              <Terminal size={15} />
              {lab.language === 'html' ? 'Live preview' : 'Output'}
            </span>
            <span className={`runner-status ${status}`}>
              {status === 'loading'
                ? 'Loading runtime…'
                : status === 'running'
                  ? 'Running…'
                  : status === 'done'
                    ? 'Finished'
                    : status === 'error'
                      ? 'Check the error'
                      : 'Ready'}
            </span>
          </div>
          {lab.language === 'html' && preview ? (
            <iframe
              title="Your HTML preview"
              className="html-preview"
              srcDoc={preview}
              sandbox="allow-scripts"
            />
          ) : (
            <div className="console-output" role="log" aria-live="polite">
              {output.length ? (
                output.map((line, index) => <pre key={index}>{line}</pre>)
              ) : (
                <p className="console-placeholder">
                  {busy
                    ? 'Preparing your program…'
                    : 'Your output will appear here.\nMake a prediction before you press Run.'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <p className="lab-note" id="code-editor-help">
        Use spaces for indentation; Tab moves to the next control. Execution stops after 5 seconds.
        Python downloads its runtime on first use; use variables instead of <code>input()</code>. If
        it cannot load, download today's starter kit and run it locally. Browser files belong to a
        temporary environment. No model API key is needed; these examples do not call a live model.
      </p>
      <iframe
        ref={frame}
        title="Code execution runner"
        src={`${import.meta.env.BASE_URL}sandbox.html`}
        sandbox="allow-scripts"
        className="runner-frame"
        aria-hidden="true"
        tabIndex={-1}
      />
      {!day && (
        <div className="callout">
          <Lightbulb size={22} />
          <div>
            <strong>The result is only half the exercise.</strong>
            <p>
              Try a boundary case. Read an error. Explain the fix in plain words. That’s how a
              useful experiment becomes a skill.
            </p>
          </div>
          <a href={`#/lesson/${lab.day}`} className="text-link">
            Read the lesson
          </a>
        </div>
      )}
    </>
  );
}
