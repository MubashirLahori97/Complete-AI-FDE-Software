import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Cloud,
  Code2,
  Download,
  Eye,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { downloadFile } from './state';
import { transferPoint, visualAccents, websiteDocument, type VisualAccent } from './visual-website';
import './visual-website.css';

const scenes = [
  {
    tab: 'Content',
    title: 'Change the words. Watch the page.',
    lead: 'A browser turns instructions into something you can see. Start with just the heading.',
    color: '#79d2f2',
    word: 'HTML',
    meaning: 'what is on the page',
    next: 'Now change how it looks',
    takeaway: 'You changed the content. The browser displayed your words.',
  },
  {
    tab: 'Appearance',
    title: 'Same words. A different appearance.',
    lead: 'Keep the heading. Change only its colour or size. Notice which part of the page responds.',
    color: '#e9cb77',
    word: 'CSS',
    meaning: 'how the page looks',
    next: 'Now make something happen',
    takeaway: 'The words stayed the same. CSS changed how they looked.',
  },
  {
    tab: 'Behaviour',
    title: 'A click needs a rule.',
    lead: 'Press Contact inside the page. Then remove the click rule and try again. What changes?',
    color: '#c8a4f7',
    word: 'JavaScript',
    meaning: 'what happens after an action',
    next: 'How does a visitor get this page?',
    takeaway:
      'The details open inside this browser. No message is sent and no database is involved.',
  },
  {
    tab: 'Delivery',
    title: 'Your browser needs a copy of the files.',
    lead: 'This open tab already has a copy. Turn hosting off, then try opening the site for a new visitor.',
    color: '#8edbb5',
    word: 'Hosting',
    meaning: 'where visitors get the files',
    next: 'Build my own useful website',
    takeaway:
      'An open page can keep working after hosting goes offline. A new visitor still needs to fetch the files.',
  },
];

export default function VisualWebsiteLesson({
  onBuild,
  onText,
  standalone = false,
}: {
  onBuild?: () => void;
  onText?: () => void;
  standalone?: boolean;
}) {
  const [scene, setScene] = useState(0);
  const [title, setTitle] = useState('Welcome.');
  const [accent, setAccent] = useState<VisualAccent>('violet');
  const [size, setSize] = useState(30);
  const [rule, setRule] = useState(true);
  const [contact, setContact] = useState(false);
  const [frameHeight, setFrameHeight] = useState(400);
  const [newFrameHeight, setNewFrameHeight] = useState(400);
  const [attempted, setAttempted] = useState(false);
  const [host, setHost] = useState(true);
  const [requested, setRequested] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [newLoaded, setNewLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [motion, setMotion] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const frame = useRef<HTMLIFrameElement>(null);
  const newFrame = useRef<HTMLIFrameElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const instance = useId();
  const channel = useMemo(
    () => `${instance}:${title}:${accent}:${size}:${rule}`,
    [instance, title, accent, size, rule],
  );
  const active = scenes[scene];
  const document = useMemo(
    () => websiteDocument({ title, accent, size, rule, channel }),
    [title, accent, size, rule, channel],
  );
  const point = transferPoint(scene === 3 ? progress : 100);
  const touch = () => setPulse((value) => value + 1);
  useEffect(() => {
    setContact(false);
    setAttempted(false);
  }, [document]);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow &&
        event.source !== newFrame.current?.contentWindow
      )
        return;
      const data = event.data;
      if (!data || typeof data !== 'object' || data.channel !== channel) return;
      if (
        data.type === 'fde-visual-height' &&
        typeof data.height === 'number' &&
        Number.isFinite(data.height) &&
        data.height >= 250 &&
        data.height <= 1200
      ) {
        const height = Math.max(330, Math.min(700, data.height));
        if (event.source === frame.current?.contentWindow) setFrameHeight(height);
        else setNewFrameHeight(height);
      }
      if (
        data.type === 'fde-visual-click' &&
        typeof data.open === 'boolean' &&
        typeof data.hasRule === 'boolean'
      ) {
        if (event.source === frame.current?.contentWindow) {
          setContact(data.open);
          setAttempted(true);
        }
        touch();
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [channel]);
  useEffect(() => {
    if (!playing || !host || scene !== 3) return;
    if (!motion) {
      setProgress(100);
      setNewLoaded(true);
      setPlaying(false);
      return;
    }
    let animation = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = now - previous;
      previous = now;
      setProgress((value) => Math.min(100, value + elapsed / 26));
      animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
  }, [playing, host, scene, motion]);
  useEffect(() => {
    if (progress >= 100 && requested && !failed) {
      setPlaying(false);
      setNewLoaded(true);
    }
  }, [progress, requested, failed]);
  const chooseScene = (value: number) => {
    setScene(value);
    setPlaying(false);
    touch();
    requestAnimationFrame(() => {
      heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      heading.current?.focus({ preventScroll: true });
    });
  };
  const visit = () => {
    setRequested(true);
    setNewLoaded(false);
    setProgress(0);
    setFailed(!host);
    setPlaying(host);
    touch();
  };
  const toggleHost = () => {
    if (host && playing) {
      setPlaying(false);
      setFailed(true);
    }
    setHost(!host);
    touch();
  };
  const scrub = (value: number) => {
    setPlaying(false);
    setRequested(true);
    if (!host) {
      setFailed(true);
      setNewLoaded(false);
      return;
    }
    setFailed(false);
    setNewLoaded(value === 100);
    setProgress(value);
  };
  const reset = () => {
    setScene(0);
    setTitle('Welcome.');
    setAccent('violet');
    setSize(30);
    setRule(true);
    setContact(false);
    setAttempted(false);
    setHost(true);
    setRequested(false);
    setProgress(0);
    setPlaying(false);
    setNewLoaded(false);
    setFailed(false);
    touch();
  };
  const caption =
    scene === 0
      ? title === 'Welcome.'
        ? '“Welcome” does not tell a visitor what you do. Give the page a useful heading.'
        : `“${title || 'Your page title'}” is now the heading in the actual page.`
      : scene === 1
        ? `${visualAccents[accent].name} · ${size}px. The content is still “${title || 'Your page title'}”.`
        : scene === 2
          ? !rule
            ? attempted
              ? 'You clicked. With no action rule, the details stayed hidden.'
              : 'The button is still visible. Its action rule is removed. Try Contact.'
            : contact
              ? 'Click → JavaScript rule → details appear. This all happens in the browser.'
              : attempted
                ? 'The same click rule hid the details again. Try it another time.'
                : 'Press Contact in the page. Watch its details appear.'
          : failed
            ? 'The new visitor cannot get the files. Your already-open tab still has its copy.'
            : newLoaded
              ? host
                ? 'Files arrived. The new browser can display the page.'
                : 'Hosting is offline now. Both loaded tabs still have their copies.'
              : requested
                ? `Follow the journey: ${progress < 35 ? 'the browser requests the files' : progress < 85 ? 'the files arrive' : 'the browser builds the visible page'}.`
                : 'Your open tab already works. Will a new visitor be able to open it?';
  return (
    <section
      className={`visual-lesson ${!motion ? 'visual-still' : ''} ${standalone ? 'visual-standalone' : ''}`}
      style={{ '--scene-color': active.color } as CSSProperties}
      aria-label="Visual website lesson"
    >
      <header className="visual-lesson-top">
        <span>
          <span className="visual-label-dot" /> MISSION 01 · A VISUAL EXPLANATION
        </span>
        <div>
          <button
            onClick={() => setMotion(!motion)}
            aria-pressed={motion}
            className="visual-quiet-button"
          >
            {motion ? <Pause size={13} /> : <Play size={13} />}Motion {motion ? 'on' : 'off'}
          </button>
          <button
            onClick={reset}
            className="visual-quiet-button"
            aria-label="Restart visual lesson"
          >
            <RotateCcw size={14} />
            <span>Restart</span>
          </button>
        </div>
      </header>
      <nav className="visual-scene-nav" aria-label="Visual lesson scenes">
        {scenes.map((item, index) => (
          <button
            key={item.tab}
            aria-current={scene === index ? 'step' : undefined}
            onClick={() => chooseScene(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.tab}
          </button>
        ))}
      </nav>
      <div className="visual-story-heading">
        <span className="visual-chapter">ONE IDEA · {scene + 1} / 4</span>
        <h2 ref={heading} tabIndex={-1}>
          {active.title}
        </h2>
        <p>{active.lead}</p>
      </div>
      <div className={`visual-drawing-board ${scene === 3 ? 'visual-delivery-board' : ''}`}>
        <div className="visual-instruction-column">
          <div className="visual-source-card" key={`source-${scene}`}>
            <span className="visual-card-label">
              {scene === 3 ? 'ON ANOTHER COMPUTER' : 'ONE PART OF YOUR WEBSITE'}
            </span>
            <div className="visual-technology">
              <span>
                {scene === 0 ? (
                  <Code2 />
                ) : scene === 1 ? (
                  <Eye />
                ) : scene === 2 ? (
                  <MousePointer2 />
                ) : (
                  <Cloud />
                )}
              </span>
              <div>
                <strong>{active.word}</strong>
                <small>{active.meaning}</small>
              </div>
            </div>
            {scene === 0 && (
              <>
                <label className="visual-field" htmlFor={`visual-heading-${channel}`}>
                  The page heading
                  <input
                    id={`visual-heading-${channel}`}
                    maxLength={70}
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      touch();
                    }}
                  />
                </label>
                <button
                  className="visual-action"
                  onClick={() => {
                    setTitle('Repairs near you.');
                    touch();
                  }}
                >
                  Give it a useful heading
                  <ArrowRight size={16} />
                </button>
                <p className="visual-control-help">
                  Then try your own words. Watch the same words arrive in the page.
                </p>
              </>
            )}
            {scene === 1 && (
              <>
                <span className="visual-field-label">Heading colour</span>
                <div className="visual-swatches" role="group" aria-label="Heading colour">
                  {(Object.keys(visualAccents) as VisualAccent[]).map((key) => (
                    <button
                      key={key}
                      aria-label={`${visualAccents[key].name} heading`}
                      aria-pressed={accent === key}
                      onClick={() => {
                        setAccent(key);
                        touch();
                      }}
                      style={{ '--swatch': visualAccents[key].color } as CSSProperties}
                    >
                      {accent === key ? <Check size={16} /> : null}
                    </button>
                  ))}
                </div>
                <label className="visual-field" htmlFor={`visual-size-${channel}`}>
                  Heading size <output aria-live="off">{size}px</output>
                  <input
                    id={`visual-size-${channel}`}
                    type="range"
                    min={22}
                    max={38}
                    value={size}
                    onChange={(event) => {
                      setSize(Number(event.target.value));
                      touch();
                    }}
                  />
                </label>
                <p className="visual-control-help">
                  The heading's words do not change. Its CSS rules do.
                </p>
              </>
            )}
            {scene === 2 && (
              <>
                <div className={`visual-rule-card ${!rule ? 'rule-removed' : ''}`}>
                  <span>WHEN</span>
                  <strong>Contact is clicked</strong>
                  <ChevronRight size={16} />
                  <span>THEN</span>
                  <strong>{rule ? 'show or hide the details' : 'no action is defined'}</strong>
                </div>
                <button
                  className="visual-action visual-action-secondary"
                  aria-pressed={rule}
                  onClick={() => {
                    setRule(!rule);
                    touch();
                  }}
                >
                  {rule ? 'Remove the click rule' : 'Restore the click rule'}
                  <MousePointer2 size={16} />
                </button>
                <p className="visual-control-help">
                  Try the Contact button with and without its rule. The page is actual browser code.
                </p>
              </>
            )}
            {scene === 3 && (
              <>
                <div className={`visual-host ${host ? '' : 'host-offline'}`}>
                  <span className="visual-host-light" />
                  <strong>Hosting is {host ? 'online' : 'offline'}</strong>
                  <button
                    onClick={toggleHost}
                    aria-label={host ? 'Turn hosting off' : 'Turn hosting on'}
                  >
                    {host ? 'Turn off' : 'Turn on'}
                  </button>
                </div>
                <div className="visual-file-stack">
                  <span>
                    HTML <small>content</small>
                  </span>
                  <span>
                    CSS <small>appearance</small>
                  </span>
                  <span>
                    JS <small>behaviour</small>
                  </span>
                </div>
                <button className="visual-action" onClick={visit}>
                  Try a new visitor
                  <ArrowRight size={16} />
                </button>
                <div className="visual-transfer-controls">
                  <label className="visual-field" htmlFor={`visual-time-${channel}`}>
                    Follow the file journey <output aria-live="off">{Math.round(progress)}%</output>
                    <input
                      id={`visual-time-${channel}`}
                      type="range"
                      min={0}
                      max={100}
                      value={progress}
                      onChange={(event) => scrub(Number(event.target.value))}
                    />
                  </label>
                  <button
                    className="visual-quiet-button"
                    disabled={!host || !requested || failed || newLoaded}
                    onClick={() => setPlaying(!playing)}
                  >
                    {playing ? <Pause size={14} /> : <Play size={14} />}{' '}
                    {playing ? 'Pause journey' : 'Play journey'}
                  </button>
                </div>
                <p className="visual-control-help">
                  Pause the journey or move the slider yourself. The hosting connection is a
                  teaching model.
                </p>
              </>
            )}
          </div>
          <div className="visual-definition">
            <span className="visual-definition-mark">↳</span>
            <p>
              {scene === 0
                ? 'HTML gives the browser the content and structure.'
                : scene === 1
                  ? 'CSS gives the browser rules for appearance.'
                  : scene === 2
                    ? 'JavaScript lets an action change the page.'
                    : 'Hosting keeps files available for browsers to request.'}
            </p>
          </div>
        </div>
        <div
          className={`visual-connection ${scene === 3 && !host ? 'connection-offline' : ''}`}
          aria-hidden="true"
        >
          <span>{scene === 3 ? 'files travel' : 'BROWSER'}</span>
          <svg key={pulse} viewBox="0 0 190 150">
            <path className="visual-wire-base" d="M12 75C60 12 120 138 178 75" />
            <path
              className={scene === 3 ? 'visual-wire-transfer' : 'visual-wire-draw'}
              d="M12 75C60 12 120 138 178 75"
              pathLength="1"
              style={scene === 3 ? { strokeDasharray: `${progress / 100} 1` } : undefined}
            />
            <circle
              className={scene === 3 ? 'visual-packet-static' : 'visual-packet'}
              cx={point.x}
              cy={point.y}
              r="5"
            />
            {scene < 3 && (
              <g className="visual-browser-symbol">
                <circle className="visual-browser-node" cx="95" cy="75" r="24" />
                <rect x="82" y="64" width="26" height="21" rx="4" />
                <path d="M82 70h26M87 77h8m-8 4h16" />
              </g>
            )}
          </svg>
          <strong>
            {scene === 3
              ? 'request → receive'
              : scene === 0
                ? 'reads content'
                : scene === 1
                  ? 'applies styles'
                  : 'runs the rule'}
          </strong>
        </div>
        <div className="visual-browser-column">
          <div className="visual-browser-frame">
            <div className="visual-browser-chrome">
              <span className="visual-window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>fix-and-co.example</span>
              <span className="visual-tab-label">YOUR OPEN TAB</span>
            </div>
            <iframe
              ref={frame}
              title="Your live website"
              srcDoc={document}
              sandbox="allow-scripts"
              className={`visual-site-frame ${pulse ? 'site-changed' : ''}`}
              style={{ '--preview-tint': active.color, height: frameHeight } as CSSProperties}
            />
            <div className="visual-browser-footnote">
              <span />
              Runs in your browser · no server or AI call for these changes
            </div>
          </div>
          {scene === 3 && (
            <div className="visual-new-visitor" aria-label="New visitor result">
              <div className="visual-new-visitor-heading">
                <span className="visual-window-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <strong>A NEW VISITOR'S TAB</strong>
                <span>
                  {failed
                    ? 'No files'
                    : newLoaded
                      ? 'Copy received'
                      : requested
                        ? 'Waiting'
                        : 'Not opened yet'}
                </span>
              </div>
              {newLoaded ? (
                <iframe
                  ref={newFrame}
                  title="New visitor website"
                  sandbox="allow-scripts"
                  srcDoc={document}
                  style={{ height: newFrameHeight }}
                />
              ) : (
                <div
                  className={`visual-visitor-state ${failed ? 'visitor-failed' : ''}`}
                  role="status"
                >
                  {failed ? (
                    <>
                      <Cloud size={28} />
                      <strong>Cannot load the page.</strong>
                      <p>Hosting is offline. This visitor has no copy yet.</p>
                    </>
                  ) : requested ? (
                    <>
                      <span className="visual-download-meter">
                        <i style={{ width: `${progress}%` }} />
                      </span>
                      <strong>
                        {progress < 35
                          ? 'Requesting files…'
                          : progress < 85
                            ? 'Files are arriving…'
                            : 'The browser builds the page…'}
                      </strong>
                      <p>Use the slider to follow each part.</p>
                    </>
                  ) : (
                    <>
                      <Eye size={27} />
                      <strong>Someone opens the URL.</strong>
                      <p>Try it with hosting on. Then try it with hosting off.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="visual-observation" role="status" aria-live="polite" aria-atomic="true">
        <span className="visual-observation-dot" />
        <p>{caption}</p>
      </div>
      <div className="visual-understanding">
        <span>THE IDEA TO KEEP</span>
        <p>{active.takeaway}</p>
      </div>
      {scene === 3 && (
        <div className="visual-ai-bridge">
          <div
            className="visual-ai-map"
            aria-label="AI building and website execution are separate"
          >
            <span>Your goal</span>
            <ArrowRight />
            <span>AI builds files</span>
            <ArrowRight />
            <span>Browser runs them</span>
          </div>
          <h3>AI can make the files. You can understand the system.</h3>
          <p>
            This sample uses HTML, CSS and JavaScript. Your own AI builder may choose a framework
            too. Inspect the actual result and explain what each part does.
          </p>
          <button
            className="visual-quiet-button"
            onClick={() =>
              downloadFile(
                'my-first-service-site.html',
                websiteDocument({ title, accent, size, rule }),
                'text/html',
              )
            }
          >
            <Download size={15} />
            Download the page you changed
          </button>
        </div>
      )}
      <footer className="visual-scene-footer">
        <button
          className="visual-quiet-button"
          disabled={scene === 0}
          onClick={() => chooseScene(scene - 1)}
        >
          <ArrowLeft size={16} />
          Back one idea
        </button>
        {scene < 3 ? (
          <button className="visual-action" onClick={() => chooseScene(scene + 1)}>
            {active.next}
            <ArrowRight size={17} />
          </button>
        ) : onBuild ? (
          <button className="visual-action" onClick={onBuild}>
            {active.next}
            <ArrowRight size={17} />
          </button>
        ) : (
          <a className="visual-action" href="#/mission/1?step=2">
            {active.next}
            <ArrowRight size={17} />
          </a>
        )}
      </footer>
      <p className="visual-scope-note">
        First-lesson sample · Your changes reset when you leave. The page preview runs real HTML,
        CSS and JavaScript; the hosting journey is a model. Exploring does not complete a mission.{' '}
        <a
          href="#/mission/1?step=1"
          onClick={
            onText
              ? (event) => {
                  event.preventDefault();
                  onText();
                }
              : undefined
          }
        >
          Read the text explanation
        </a>
      </p>
    </section>
  );
}
