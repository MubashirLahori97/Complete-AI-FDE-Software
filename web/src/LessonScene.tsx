import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import { labSpec, labValues, type LabResult, type LabValue, type LabValues } from './mission-labs';
import { labStories } from './lab-stories';
import { missions } from './missions';
import { sceneLessons } from './scene-lessons';
import LessonIllustration from './LessonIllustration';
import './lesson-scenes.css';

export default function LessonScene({
  id,
  values,
  outcome,
  onChange,
  onCue,
}: {
  id: number;
  values: LabValues;
  outcome: LabResult;
  onChange: (patch: Record<string, LabValue>) => void;
  onCue: () => void;
}) {
  const [position, setPosition] = useState(0),
    [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const frame = useRef<number | null>(null),
    cursor = useRef(0);
  const signature = JSON.stringify(values);
  const stop = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setPlaying(false);
  };
  useLayoutEffect(() => {
    stop();
    cursor.current = 0;
    setPosition(0);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [signature]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => {
      setReduced(media.matches);
      if (media.matches) stop();
    };
    media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, []);
  const seek = (next: number) => {
    stop();
    cursor.current = next;
    setPosition(next);
  };
  const play = () => {
    stop();
    onCue();
    const start = cursor.current >= 3 ? 0 : cursor.current;
    cursor.current = start;
    setPosition(start);
    if (reduced) {
      seek(3);
      return;
    }
    setPlaying(true);
    let began: number | null = null;
    const tick = (now: number) => {
      began ??= now;
      const next = Math.min(3, start + (now - began) / 900);
      cursor.current = next;
      setPosition(next);
      if (next < 3) frame.current = requestAnimationFrame(tick);
      else {
        frame.current = null;
        setPlaying(false);
      }
    };
    frame.current = requestAnimationFrame(tick);
  };
  const [title, question, parts, why] = sceneLessons[id - 1];
  const labels = parts.split('|');
  const moment = Math.min(2, Math.floor(position));
  const mission = missions[id - 1];
  const choices = labStories[id - 1].comparisons.map((pair) => {
    const [key, target] = Object.entries(pair.change)[0];
    const baseline = labValues(id, pair.before)[key];
    const next = values[key] === target ? baseline : target;
    const control = labSpec(id).controls.find((c) => c.id === key)!;
    const valueLabel =
      control.options?.find((option) => option[0] === next)?.[1] ??
      (typeof next === 'boolean'
        ? next
          ? 'On'
          : 'Off'
        : String(next).trim() === ''
          ? 'Blank'
          : String(next));
    return { key, next, title: pair.title, label: control.label, valueLabel };
  });
  return (
    <section className="lesson-scene" aria-label={`Lesson ${id} illustrated scene`} data-scene={id}>
      <header className="ls-intro">
        <span>CHANGE A CAUSE / SEE A CONSEQUENCE</span>
        <h4>{title}</h4>
        <p>{question}</p>
      </header>
      <div className="ls-stage">
        <div className="ls-place-labels">
          <span>{labels[0]}</span>
          <span>{labels[2]}</span>
        </div>
        <LessonIllustration id={id} values={values} outcome={outcome} moment={position} />
        {id === 20 && (
          <p className="ls-key">
            ✓ Correct alert · × Missed urgent case · ! False alert · · Correctly left quiet
          </p>
        )}
        {id === 24 && (
          <p className="ls-key">
            Each circle is a read: C = cached copy, S = source, Q = queued. Peach means stale data.
          </p>
        )}
        <div className="ls-playbar">
          <button className="ls-play" onClick={playing ? stop : play}>
            {playing ? <Pause size={16} /> : <Play size={16} />}{' '}
            {playing
              ? 'Pause explanation'
              : position >= 3
                ? 'Replay explanation'
                : position > 0
                  ? 'Continue explanation'
                  : 'Follow the idea'}
          </button>
          <button aria-label="Restart explanation" onClick={() => seek(0)}>
            <RotateCcw size={16} />
          </button>
          <span>Illustrated local model</span>
        </div>
      </div>
      <nav className="ls-moments" aria-label="Inspect an explanation moment">
        {labels.map((label, i) => (
          <button key={label} aria-pressed={moment === i} onClick={() => seek(i)}>
            <span>{i + 1}</span>
            {label}
          </button>
        ))}
      </nav>
      <div className="ls-observation" role="status">
        <span>WHAT CHANGED</span>
        <strong>{outcome.headline}</strong>
        <p>{why}</p>
      </div>
      <dl className="ls-facts">
        {outcome.facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="ls-choices">
        {choices.map((choice, i) => (
          <button key={i} onClick={() => onChange({ [choice.key]: choice.next })}>
            <span>{choice.title}</span>
            <strong>{choice.label}</strong>
            <small>
              Change to: {choice.valueLabel.slice(0, 85)}
              {choice.valueLabel.length > 85 ? '…' : ''}
            </small>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
      <div className="ls-project">
        <span>USE THIS IN YOUR PROJECT</span>
        <strong>{mission.project.title}</strong>
        <p>{mission.project.steps[0]}</p>
        <a href={`#/mission/${id}?step=2`}>
          Build this with AI <ArrowRight size={16} />
        </a>
      </div>
      <p className="ls-boundary">
        Changes update the local lesson model immediately. Playback highlights the explanation, not
        measured execution or a real service. Some illustration labels are shortened; inspect the
        details for full values. Your project needs its own observations.
      </p>
    </section>
  );
}
