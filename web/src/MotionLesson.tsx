import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import gsap from 'gsap';
import script from './motion-script.json';
import timing from './motion-timing.json';
import { motionDocument, type MotionLayers } from './motion-document';
import { downloadFile } from './state';
import './motion-lesson.css';

const full: MotionLayers = { html: true, css: true, js: true };
const layerInfo = [
  { key: 'html', name: 'Content', language: 'HTML', color: '#7dcde5', hint: 'What is on the page' },
  {
    key: 'css',
    name: 'Appearance',
    language: 'CSS',
    color: '#e6bf7a',
    hint: 'How those things look',
  },
  {
    key: 'js',
    name: 'Behaviour',
    language: 'JavaScript',
    color: '#b5a0ed',
    hint: 'What an action does',
  },
] as const;
const total = timing.duration;
const formatTime = (time: number) => `0:${String(Math.floor(time)).padStart(2, '0')}`;
const partAt = (time: number) =>
  timing.cues.reduce((part, cue, index) => (cue.start <= time ? index : part), 0);

function LayerDrawing({ kind }: { kind: 'html' | 'css' | 'js' }) {
  return (
    <svg
      className={`motion-layer-drawing drawing-${kind}`}
      viewBox="0 0 360 280"
      aria-hidden="true"
    >
      <rect className="layer-paper" x="1" y="1" width="358" height="278" rx="12" />
      <path className="layer-header" d="M1 38h358" />
      <circle className="layer-dot" cx="19" cy="20" r="3" />
      <circle className="layer-dot" cx="31" cy="20" r="3" />
      <circle className="layer-dot" cx="43" cy="20" r="3" />
      {kind === 'html' ? (
        <g className="layer-content-lines">
          <text x="25" y="81">
            A heading.
          </text>
          <path d="M26 97h198M26 108h140" />
          <rect x="25" y="128" width="212" height="39" rx="3" />
          <path d="M26 190h170M26 201h197M26 212h133" />
          <rect x="25" y="231" width="84" height="25" rx="3" />
        </g>
      ) : kind === 'css' ? (
        <g className="layer-style-art">
          <circle cx="119" cy="143" r="66" />
          <rect x="159" y="97" width="83" height="121" rx="41" />
          <path d="M72 224h196" />
          <text x="31" y="80">
            Aa
          </text>
          <text x="262" y="242">
            Aa
          </text>
          <circle cx="287" cy="85" r="11" />
          <circle cx="287" cy="117" r="11" />
          <circle cx="287" cy="149" r="11" />
        </g>
      ) : (
        <g className="layer-rule-art">
          <path
            className="rule-trail"
            pathLength="1"
            d="M62 144C117 144 105 83 179 83S233 144 297 144M62 144C124 144 113 205 180 205S240 144 297 144"
          />
          <circle cx="62" cy="144" r="22" />
          <circle cx="179" cy="83" r="15" />
          <circle cx="180" cy="205" r="15" />
          <circle cx="297" cy="144" r="22" />
          <text x="62" y="190" textAnchor="middle">
            click
          </text>
          <text x="297" y="190" textAnchor="middle">
            result
          </text>
          <circle className="rule-signal" cx="62" cy="144" r="7" />
        </g>
      )}
    </svg>
  );
}

export default function MotionLesson() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const cursor = useRef(0);
  const lastUi = useRef(0);
  const fallback = useRef(false);
  const synth = useRef<AudioContext | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [part, setPart] = useState(0);
  const [sound, setSound] = useState(true);
  const [audioFailed, setAudioFailed] = useState(false);
  const [frameHeight, setFrameHeight] = useState(440);
  const [layers, setLayers] = useState<MotionLayers>(full);
  const [title, setTitle] = useState('Keep the things you love.');
  const [observation, setObservation] = useState(
    'Try removing Appearance. Predict what the same words will look like.',
  );
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const instance = useId();
  const finished = time >= total - 0.08;
  const practice = finished;
  const effective = practice
    ? layers
    : { html: true, css: part !== 2, js: part >= 4 || part === 0 };
  const openDemo = !practice && part === 4 && time >= timing.cues[4].start + 3;
  const channel = `${instance}:${effective.html}:${effective.css}:${effective.js}:${title}:${openDemo}`;
  const document = useMemo(
    () => motionDocument(effective, title, channel, openDemo),
    [effective.html, effective.css, effective.js, title, channel, openDemo],
  );

  const chime = (enabled = true) => {
    if (!sound) return;
    try {
      const context = (synth.current ||= new AudioContext());
      void context.resume();
      const start = context.currentTime;
      [enabled ? 392 : 329.63, enabled ? 587.33 : 246.94].forEach((frequency, index) => {
        const note = context.createOscillator();
        const gain = context.createGain();
        note.type = 'sine';
        note.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start + index * 0.065);
        gain.gain.linearRampToValueAtTime(0.035, start + index * 0.065 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, start + index * 0.065 + 0.28);
        note.connect(gain);
        gain.connect(context.destination);
        note.start(start + index * 0.065);
        note.stop(start + index * 0.065 + 0.3);
      });
    } catch {
      /* Captions and visual feedback remain usable without an audio device. */
    }
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.data?.channel !== channel ||
        !['motion-contact', 'motion-height'].includes(event.data.type)
      )
        return;
      if (event.data.type === 'motion-height') {
        if (typeof event.data.height === 'number' && Number.isFinite(event.data.height))
          setFrameHeight(Math.max(330, Math.min(690, event.data.height)));
        return;
      }
      if (!practice) return;
      setObservation(
        event.data.hasRule
          ? event.data.open
            ? 'Click → JavaScript rule → details appear. The page responds inside your browser.'
            : 'Click again → the same rule hides the details.'
          : 'The button is still here. Without its JavaScript rule, clicking does not reveal the details.',
      );
      chime(Boolean(event.data.hasRule));
      const trail = root.current?.querySelector('.motion-flow-pulse');
      if (trail && event.data.hasRule && !reduced)
        gsap.fromTo(
          trail,
          { strokeDashoffset: 1, opacity: 1 },
          { strokeDashoffset: 0, opacity: 0, duration: 1, ease: 'power2.out' },
        );
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [channel, practice, sound, reduced]);
  useEffect(() => {
    if (audio.current) audio.current.muted = !sound;
  }, [sound]);
  useEffect(() => {
    const host = stage.current;
    if (!host) return;
    let context: gsap.Context | undefined;
    const layout = () => {
      context?.revert();
      context = gsap.context(() => {
        const small = host.clientWidth < 700;
        const shift = small ? 0 : Math.min(210, host.clientWidth * 0.205);
        const spread = small ? 80 : Math.min(305, host.clientWidth * 0.29);
        const page = '.motion-page-plane';
        const html = '.motion-layer-html';
        const css = '.motion-layer-css';
        const js = '.motion-layer-js';
        const planes = [html, css, js];
        gsap.set(page, {
          xPercent: -50,
          yPercent: -50,
          x: small ? 12 : 100,
          y: -10,
          scale: small ? 0.86 : 0.98,
          rotationZ: -4,
          rotationY: -8,
          opacity: 1,
        });
        planes.forEach((selector, index) =>
          gsap.set(selector, {
            xPercent: -50,
            yPercent: -50,
            x: (index - 1) * (small ? 38 : 75) - 65,
            y: (index - 1) * -23 + 10,
            scale: small ? 0.72 : 0.89,
            rotationZ: -12 + index * 5,
            rotationY: -12,
            opacity: 0.65 - index * 0.08,
          }),
        );
        gsap.set('.motion-stage-connector', { opacity: 0 });
        gsap.set('.motion-layer-controls', { autoAlpha: 0, y: 15 });
        const tl = gsap.timeline({ paused: true });
        tl.to(
          page,
          {
            x: 0,
            rotationZ: 0,
            rotationY: 0,
            scale: small ? 0.87 : 1,
            duration: 1.3,
            ease: 'power2.inOut',
          },
          0,
        );
        tl.to(planes, { opacity: 0.15, duration: 1.1 }, 0);
        const split = timing.cues[1].start;
        tl.to(
          page,
          {
            y: small ? -10 : -100,
            scale: 0.5,
            opacity: 0,
            rotationZ: 0,
            duration: 1.2,
            ease: 'power3.inOut',
          },
          split,
        );
        planes.forEach((selector, index) =>
          tl.to(
            selector,
            {
              x: (index - 1) * spread,
              y: small ? (index - 1) * 135 : 0,
              scale: small ? 0.66 : 0.75,
              rotationZ: (index - 1) * 5,
              rotationY: 0,
              opacity: 1,
              duration: 1.35,
              ease: 'power3.inOut',
            },
            split + index * 0.1,
          ),
        );
        [2, 3, 4].forEach((partIndex, index) => {
          const at = timing.cues[partIndex].start;
          planes.forEach((selector, planeIndex) =>
            tl.to(
              selector,
              {
                x: planeIndex === index ? (small ? 0 : -shift - 65) : (planeIndex - 1) * spread,
                y: planeIndex === index ? (small ? -155 : 0) : small ? (planeIndex - 1) * 135 : 0,
                scale: planeIndex === index ? (small ? 0.48 : 0.8) : 0.5,
                rotationZ: planeIndex === index ? -4 : (planeIndex - 1) * 7,
                opacity: planeIndex === index ? 1 : 0,
                duration: 1.05,
                ease: 'power3.inOut',
              },
              at,
            ),
          );
          tl.to(
            page,
            {
              x: shift,
              y: small ? 95 : 0,
              scale: small ? 0.83 : 1,
              rotationZ: 0,
              rotationY: 0,
              opacity: 1,
              duration: 1.05,
              ease: 'power3.inOut',
            },
            at,
          );
          tl.fromTo(
            '.motion-stage-connector',
            { strokeDashoffset: 1, opacity: 0 },
            { strokeDashoffset: 0, opacity: small ? 0 : 0.7, duration: 1.5 },
            at + 0.6,
          );
        });
        tl.fromTo(
          '.rule-trail',
          { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0.8 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.6,
            ease: 'power2.inOut',
            immediateRender: false,
          },
          timing.cues[4].start + 1.4,
        );
        const end = timing.cues[5].start;
        tl.to(
          planes,
          { x: 0, y: 0, scale: 0.7, rotationZ: 0, opacity: 0, duration: 1.3, ease: 'power3.inOut' },
          end,
        );
        tl.to(
          page,
          {
            x: small ? 0 : shift,
            y: small ? -55 : 0,
            scale: small ? 0.78 : 1,
            force3D: false,
            rotationZ: 0,
            duration: 1.3,
            ease: 'power3.inOut',
          },
          end,
        );
        tl.to('.motion-stage-connector', { opacity: 0, duration: 0.5 }, end);
        tl.to(
          '.motion-layer-controls',
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          end + 1.25,
        );
        tl.to({}, { duration: 0.1 }, total - 0.1);
        timeline.current = tl;
        tl.time(cursor.current, true);
      }, root);
    };
    const observer = new ResizeObserver(layout);
    observer.observe(host);
    layout();
    return () => {
      observer.disconnect();
      context?.revert();
      timeline.current = null;
    };
  }, []);
  useEffect(() => {
    if (!playing) return;
    let animation = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - previous) / 1000;
      previous = now;
      const next = Math.min(
        total,
        fallback.current
          ? cursor.current + elapsed
          : (audio.current?.currentTime ?? cursor.current),
      );
      cursor.current = next;
      timeline.current?.time(reduced ? total : next, true);
      if (now - lastUi.current > 80 || next >= total - 0.08) {
        setTime(next);
        setPart(partAt(next));
        lastUi.current = now;
      }
      if (next >= total - 0.08) {
        setTime(total);
        cursor.current = total;
        setPlaying(false);
        return;
      }
      animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
  }, [playing, reduced]);
  useEffect(() => {
    const player = audio.current;
    return () => {
      player?.pause();
      void synth.current?.close();
    };
  }, []);

  const seek = (value: number) => {
    setPlaying(false);
    audio.current?.pause();
    cursor.current = value;
    setTime(value);
    setPart(partAt(value));
    setStarted(true);
    if (audio.current) audio.current.currentTime = value;
    timeline.current?.time(reduced ? total : value, true);
  };
  const togglePlay = async () => {
    if (playing) {
      audio.current?.pause();
      setPlaying(false);
      return;
    }
    if (finished) {
      cursor.current = 0;
      setTime(0);
      setPart(0);
      if (audio.current) audio.current.currentTime = 0;
    }
    setStarted(true);
    setLayers(full);
    if (audio.current) {
      try {
        audio.current.muted = !sound;
        await audio.current.play();
        fallback.current = false;
      } catch {
        fallback.current = true;
        setAudioFailed(true);
      }
    } else fallback.current = true;
    setPlaying(true);
    if (!started) stage.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
  };
  const jumpToPlay = () => {
    seek(total);
    setLayers(full);
    chime();
  };
  const toggleLayer = (key: keyof MotionLayers) => {
    const next = { ...layers, [key]: !layers[key] };
    setLayers(next);
    chime(next[key]);
    setObservation(
      !next.html
        ? 'No HTML content: the browser has no heading, words or button to display.'
        : !next.css
          ? 'Same content, browser defaults. CSS was giving the page its appearance.'
          : !next.js
            ? 'The page still looks the same. Try its button now: the action rule is gone.'
            : 'All three are back together. Try the button, or change the words.',
    );
  };
  const reset = () => {
    seek(0);
    setStarted(false);
    setLayers(full);
    setTitle('Keep the things you love.');
    setObservation('Try removing Appearance. Predict what the same words will look like.');
  };
  const currentTitle = practice
    ? 'What happens if you remove a layer?'
    : !started
      ? 'One page. Three layers.'
      : script[part].title;
  return (
    <main
      ref={root}
      className={`motion-lesson ${started ? 'motion-started' : ''} ${practice ? 'motion-practice' : ''} ${reduced ? 'motion-reduced' : ''}`}
      style={{ '--motion-frame-height': `${frameHeight}px` } as CSSProperties}
    >
      <header className="motion-topbar">
        <a href="#/" className="motion-brand">
          <span className="motion-brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          FDE <span>Academy</span>
        </a>
        <span className="motion-edition">
          THE VISUAL STUDIO <span> / </span> 001
        </span>
        <a href="#/mission/1" className="motion-exit">
          <ArrowLeft size={14} />
          <span>Back to the academy</span>
        </a>
      </header>
      <section className="motion-content" aria-label="One page, three layers">
        <div className="motion-heading">
          <span className="motion-eyebrow">A LITTLE EXPLANATION YOU CAN TAKE APART</span>
          <h1>{currentTitle}</h1>
          <p>
            {practice
              ? 'Your changes affect the real page. Nothing here sends a message.'
              : !started
                ? 'A website looks like one thing. Let’s see what your browser is putting together.'
                : 'Follow what changes. The same small website stays with us.'}
          </p>
        </div>
        <div className="motion-transport" aria-label="Story playback">
          <button
            className="motion-play"
            onClick={
              practice ? () => void togglePlay() : reduced ? jumpToPlay : () => void togglePlay()
            }
            aria-label={
              playing
                ? 'Pause story'
                : finished
                  ? 'Replay story'
                  : started
                    ? 'Resume story'
                    : reduced
                      ? 'Explore without animation'
                      : 'Play the visual story'
            }
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
            <span>
              {playing
                ? 'Pause'
                : finished
                  ? 'Replay the story'
                  : started
                    ? 'Continue'
                    : reduced
                      ? 'Start exploring'
                      : 'Watch it come together'}
            </span>
            {!started && !reduced && <small>{Math.ceil(total)} sec</small>}
          </button>
          {started && (
            <label className="motion-seek">
              <span className="sr-only">Story position in seconds</span>
              <input
                type="range"
                min="0"
                max={total}
                step="0.05"
                value={time}
                onChange={(e) => seek(Number(e.target.value))}
              />
              <span>
                {formatTime(time)} <span>/ {formatTime(total)}</span>
              </span>
            </label>
          )}
          <button
            className="motion-sound"
            onClick={() => setSound(!sound)}
            aria-pressed={sound}
            aria-label={sound ? 'Mute sound' : 'Enable sound'}
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            <span>Sound {sound ? 'on' : 'off'}</span>
          </button>
          {!practice && (
            <button className="motion-skip" onClick={jumpToPlay}>
              Let me try
              <ArrowRight size={13} />
            </button>
          )}
        </div>
        <div ref={stage} className="motion-stage" aria-label="Animated website layers">
          <div className="motion-orbit orbit-one" aria-hidden="true" />
          <div className="motion-orbit orbit-two" aria-hidden="true" />
          <svg
            className="motion-connections"
            viewBox="0 0 1100 520"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="motion-stage-connector"
              d="M350 260C470 260 470 260 600 260"
              pathLength="1"
            />
            <path
              className="motion-flow-pulse"
              d="M310 350C450 350 440 260 610 260"
              pathLength="1"
            />
          </svg>
          {layerInfo.map((layer) => (
            <div
              key={layer.key}
              className={`motion-layer-plane motion-layer-${layer.key}`}
              style={{ '--layer-color': layer.color } as CSSProperties}
            >
              <LayerDrawing kind={layer.key} />
              <div className="motion-plane-label">
                <span>{layer.language}</span>
                {layer.name}
              </div>
            </div>
          ))}
          <div className="motion-page-plane">
            <div className="motion-page-chrome">
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>fix-and-co.example</span>
              <span className="motion-page-tag">LIVE PAGE</span>
            </div>
            <iframe
              ref={frame}
              title="The website you can change"
              sandbox="allow-scripts"
              srcDoc={document}
              tabIndex={practice ? 0 : -1}
              style={{ pointerEvents: practice ? 'auto' : 'none', height: frameHeight }}
            />
            <div className="motion-page-edge" />
          </div>
          <div className="motion-layer-controls" aria-label="Website layers" inert={!practice}>
            <span className="motion-control-intro">TAKE SOMETHING AWAY.</span>
            {layerInfo.map((layer) => (
              <button
                key={layer.key}
                className={`motion-layer-toggle ${layers[layer.key] ? '' : 'layer-is-off'}`}
                onClick={() => toggleLayer(layer.key)}
                aria-pressed={layers[layer.key]}
                aria-label={`${layer.name} layer`}
                style={{ '--layer-color': layer.color } as CSSProperties}
              >
                <span className="motion-layer-number">
                  {layers[layer.key] ? <Check size={14} /> : <span>−</span>}
                </span>
                <span>
                  <strong>{layer.name}</strong>
                  <small>{layer.language}</small>
                </span>
                <span className="motion-layer-switch" aria-hidden="true">
                  <i />
                </span>
              </button>
            ))}
            <label className="motion-edit-title">
              Or change what the page says
              <input
                aria-label="Your website heading"
                value={title}
                maxLength={60}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setObservation(
                    'Those are your words. HTML provides the content; CSS gives it its appearance.',
                  );
                }}
              />
            </label>
          </div>
          <div className="motion-caption" aria-live="polite">
            <span className="motion-caption-dot" />
            {practice ? (
              observation
            ) : started ? (
              script[part].text
            ) : (
              <span>Press play. Then pull it apart yourself.</span>
            )}
          </div>
        </div>
        <div className="motion-bottom">
          <div className="motion-bottom-note">
            <Headphones size={16} />
            <span>
              {audioFailed
                ? 'Audio could not play. Captions and the visual story still work.'
                : 'Narrated motion prototype · sound starts only when you press play.'}
              <small>Temporary synthetic narration. Original diagrams and sound cues.</small>
            </span>
          </div>
          <div className="motion-bottom-actions">
            <button onClick={reset} aria-label="Restart this prototype">
              <RotateCcw size={14} />
              Restart
            </button>
            {practice && (
              <a href="#/mission/1?step=2">
                Make your own website
                <ChevronRight size={15} />
              </a>
            )}
          </div>
        </div>
        <details className="motion-transcript">
          <summary>Read the explanation instead</summary>
          {script.map((cue) => (
            <p key={cue.id}>
              <strong>{cue.title}</strong> {cue.text}
            </p>
          ))}
          <p>
            These three roles describe this small example. Real projects can use frameworks,
            servers, databases and AI services too. Inspect the actual technologies in your project.
          </p>
          <button onClick={jumpToPlay}>
            Open the experiment
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() =>
              downloadFile('my-website.html', motionDocument(layers, title, ''), 'text/html')
            }
          >
            Download this page
          </button>
        </details>
      </section>
      <audio
        ref={audio}
        src={`${import.meta.env.BASE_URL}motion-story/narration.mp3`}
        preload="metadata"
        onError={() => {
          setAudioFailed(true);
          fallback.current = true;
        }}
        onEnded={() => {
          cursor.current = total;
          timeline.current?.time(total, true);
          setTime(total);
          setPart(5);
          setPlaying(false);
        }}
      />
    </main>
  );
}
