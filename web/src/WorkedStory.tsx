import { useState } from 'react';
import type { Mission } from './mission-types';
import './lesson-pacing.css';
export default function WorkedStory({ example }: { example: Mission['example'] }) {
  const [moment, setMoment] = useState(0);
  const moments = [
    { label: 'Before', question: 'What is the situation?', text: example.before },
    { label: 'Direction', question: 'What change is requested?', text: example.action },
    { label: 'Result', question: 'What result does the example describe?', text: example.after },
    { label: 'Takeaway', question: 'What idea can you use again?', text: example.lesson },
  ];
  const current = moments[moment];
  return (
    <section
      className="mission-worked worked-story"
      aria-label="Worked example, one moment at a time"
    >
      <header>
        <div>
          <span className="eyebrow">FOLLOW ONE SMALL STORY</span>
          <h3>A worked example</h3>
        </div>
        <span>{moment + 1} / 4</span>
      </header>
      <div className="worked-moments" role="group" aria-label="Choose an example moment">
        {moments.map((item, index) => (
          <button key={item.label} aria-pressed={moment === index} onClick={() => setMoment(index)}>
            <span>{index + 1}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className="worked-story-page" aria-live="polite">
        <span aria-hidden="true">0{moment + 1}</span>
        <div className="worked-story-copy" key={moment}>
          <h4>{current.question}</h4>
          <p>{current.text}</p>
        </div>
      </div>
      <div className="worked-story-controls">
        <button disabled={moment === 0} onClick={() => setMoment(moment - 1)}>
          Previous moment
        </button>
        <button onClick={() => setMoment(moment === 3 ? 0 : moment + 1)}>
          {moment === 3 ? 'Replay the example' : 'Next moment'}
        </button>
      </div>
      <p className="field-help">
        Authored teaching example. Your own project needs its own observations. Moving through this
        story does not record completion.
      </p>
    </section>
  );
}
