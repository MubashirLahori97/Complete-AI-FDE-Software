import { useEffect, useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';
import { casesForStep, domChecks, javascriptChecks, parseChecks, pythonChecks } from './harness';
import { CHECK_MARKER, type CheckResult, type CourseExercise } from './types';

export default function ExerciseRunner({
  exercise,
  code,
  step,
  onResults,
}: {
  exercise: CourseExercise;
  code: string;
  step: number;
  onResults: (results: CheckResult[], checkedCode: string) => void;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [ready, setReady] = useState(false);
  const workerFrame = useRef<HTMLIFrameElement>(null);
  const domFrame = useRef<HTMLIFrameElement>(null);
  const current = useRef({ id: 0, code, nonce: '', results: [] as CheckResult[] });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef({ exercise, code, step, onResults });
  latest.current = { exercise, code, step, onResults };
  const stop = () => {
    clearTimeout(timer.current);
    workerFrame.current?.contentWindow?.postMessage({ type: 'fde:stop' }, '*');
    current.current.id++;
    current.current.nonce = '';
  };
  const fail = (message: string) => {
    stop();
    setStatus('error');
    setError(message);
  };
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const expected = casesForStep(latest.current.exercise, latest.current.step);
      if (
        event.source === domFrame.current?.contentWindow &&
        event.data?.source === 'fde-course-dom' &&
        event.data.nonce === current.current.nonce
      ) {
        clearTimeout(timer.current);
        if (event.data.error) {
          fail(String(event.data.error).slice(0, 1000));
          return;
        }
        const results = parseChecks(CHECK_MARKER + JSON.stringify(event.data.results), expected);
        if (!results || results.length !== expected.length) {
          fail('The preview did not return all its checks. Look for a script error and try again.');
          return;
        }
        if (current.current.code === latest.current.code)
          latest.current.onResults(results, current.current.code);
        setStatus('done');
        return;
      }
      if (
        event.source !== workerFrame.current?.contentWindow ||
        event.data?.source !== 'fde-runner'
      )
        return;
      const message = event.data;
      if (message.type === 'loaded') {
        setReady(true);
        return;
      }
      if (message.id !== current.current.id) return;
      if (message.type === 'ready') {
        clearTimeout(timer.current);
        setStatus('running');
        timer.current = setTimeout(
          () => fail('Stopped after five seconds. Check that your loop or request can finish.'),
          5000,
        );
      }
      if (message.type === 'output' && typeof message.text === 'string') {
        const results = parseChecks(message.text, expected);
        if (results)
          current.current.results = [
            ...new Map(
              [...current.current.results, ...results].map((result) => [result.id, result]),
            ).values(),
          ];
      }
      if (message.type === 'error') {
        fail(String(message.text || 'The program could not run.').slice(0, 1200));
      }
      if (message.type === 'done') {
        clearTimeout(timer.current);
        workerFrame.current?.contentWindow?.postMessage({ type: 'fde:stop' }, '*');
        const results = current.current.results;
        if (results.length !== expected.length) {
          fail('The program did not finish its checks. Check your code and run it again.');
          return;
        }
        if (current.current.code === latest.current.code)
          latest.current.onResults(results, current.current.code);
        setStatus('done');
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
      clearTimeout(timer.current);
      workerFrame.current?.contentWindow?.postMessage({ type: 'fde:stop' }, '*');
    };
  }, []);
  useEffect(() => {
    stop();
    setStatus('idle');
    setError('');
    setPreview('');
  }, [code, step]);
  useEffect(() => {
    if (preview) domFrame.current?.scrollIntoView({ block: 'nearest' });
  }, [preview]);
  const run = async () => {
    stop();
    setError('');
    setStatus('loading');
    const id = current.current.id;
    current.current.code = code;
    current.current.results = [];
    if (exercise.language === 'html' || exercise.language === 'react') {
      try {
        const { compileScript, instrumentHtml } = await import('./compiler');
        const nonce = crypto.randomUUID();
        current.current.nonce = nonce;
        const guard = `let __fdeIterations=0; function __fdeTick(){if(++__fdeIterations>100000)throw new Error('This loop ran too many times. Check its stopping rule.');}`;
        let html;
        if (exercise.language === 'react') {
          const response = await fetch(`${import.meta.env.BASE_URL}course-runtime/react.js`);
          if (!response.ok) throw new Error('The React preview could not load. Try again.');
          const runtime = await response.text();
          const compiled = await compileScript(code, true);
          html = `<div id="root"></div><script>${runtime}\nconst React=window.FDEReact; const module={exports:{}}; const exports=module.exports; function require(name){if(name==='react')return React; throw new Error('Use the supplied React imports in this exercise.');} ${compiled} window.FDEMount(module.exports.default);</script>`;
        } else html = await instrumentHtml(code);
        if (current.current.id !== id || latest.current.code !== code) return;
        const errors = `window.addEventListener('error',event=>parent.postMessage({source:'fde-course-dom',nonce:${JSON.stringify(nonce)},error:event.message},'*')); window.addEventListener('unhandledrejection',event=>parent.postMessage({source:'fde-course-dom',nonce:${JSON.stringify(nonce)},error:String(event.reason?.message||event.reason)},'*'));`;
        const policy =
          "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; form-action 'none'\">";
        setPreview(
          `<!doctype html><html lang="en"><head>${policy}<style>body{font:17px/1.5 system-ui;padding:16px;color:#254b3e}button,input,textarea{font:inherit}button{cursor:pointer}*{box-sizing:border-box}</style><script>${guard}${errors}</script></head><body>${html}<script>${domChecks(casesForStep(exercise, step), nonce).replace(/<\/script/gi, '<\\/script')}</script></body></html>`,
        );
        setStatus('running');
        timer.current = setTimeout(() => {
          setPreview('');
          fail('The preview did not finish. Check your script, then run it again.');
        }, 8000);
      } catch (error) {
        fail(error instanceof Error ? error.message : 'Check the code and try again.');
      }
      return;
    }
    const source =
      exercise.language === 'python'
        ? pythonChecks(exercise, code, step)
        : javascriptChecks(exercise, code, step);
    workerFrame.current?.contentWindow?.postMessage(
      { type: 'fde:run', id, code: source, language: exercise.language },
      '*',
    );
    timer.current = setTimeout(
      () =>
        fail(
          exercise.language === 'python'
            ? 'Python did not load. It needs the public Pyodide CDN on its first run. Try again, or use the downloaded Python exercise on your computer.'
            : 'The runner did not start. Reload the lesson and try again.',
        ),
      60000,
    );
  };
  const busy = status === 'loading' || status === 'running';
  return (
    <div className="guided-runner">
      <button
        className="course-button"
        disabled={busy || (!ready && !['html', 'react'].includes(exercise.language))}
        onClick={() => void run()}
      >
        <Play size={17} aria-hidden="true" />
        Check this step
      </button>
      {busy && (
        <button
          className="course-link-button"
          onClick={() => {
            stop();
            setStatus('idle');
            setPreview('');
          }}
        >
          <Square size={15} aria-hidden="true" />
          Stop
        </button>
      )}
      <p className="course-small" role="status">
        {status === 'loading'
          ? exercise.language === 'python'
            ? 'Preparing Python. The first run downloads its runtime; later runs use the browser cache.'
            : 'Preparing your exercise…'
          : status === 'running'
            ? 'Running your code and checking the result…'
            : status === 'done'
              ? 'Checks finished. Review the results below.'
              : ''}
      </p>
      {error && (
        <p className="course-feedback" role="alert">
          {error}
        </p>
      )}
      <iframe
        ref={workerFrame}
        src={`${import.meta.env.BASE_URL}sandbox.html`}
        title="Isolated course code runner"
        sandbox="allow-scripts"
        hidden
      />
      {preview && (
        <iframe
          ref={domFrame}
          title="Your exercise preview"
          sandbox="allow-scripts"
          srcDoc={preview}
          className="course-preview"
        />
      )}
    </div>
  );
}
