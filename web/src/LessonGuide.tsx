import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { lessonTeaching } from './lesson-content';
import { localDate, type Progress } from './state';
import { Companion, WinMoment } from './MissionUI';
import LessonExperiment from './LessonExperiment';

export default function LessonGuide({
  day,
  progress,
  update,
  onPractice,
}: {
  day: number;
  progress: Progress;
  update: (next: Progress) => void;
  onPractice: () => void;
}) {
  const { guide, teaching } = lessonTeaching(day);
  const step = progress.readingSteps[day] || 0;
  const attempt = progress.quickChecks[day] || { choice: null, checked: false, hints: 0 };
  const [solution, setSolution] = useState(false);
  const [newWin, setNewWin] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const setStep = (next: number) => {
    update({ ...progress, readingSteps: { ...progress.readingSteps, [day]: next } });
    setTimeout(() => heading.current?.focus(), 0);
  };
  const changeAttempt = (change: Partial<typeof attempt>) =>
    update({
      ...progress,
      quickChecks: { ...progress.quickChecks, [day]: { ...attempt, ...change } },
    });
  return (
    <section className="guided-reading" aria-label="Guided lesson">
      <div className="lesson-coach">
        <Companion
          mood={attempt.checked ? (attempt.choice === guide.answer ? 'win' : 'thinking') : 'ready'}
        />
        <div>
          <span>YOUR NEXT SMALL WIN</span>
          <strong>
            {attempt.checked && attempt.choice === guide.answer
              ? 'You spotted it. That is how understanding starts.'
              : step === 2
                ? 'Your turn. A guess is a good place to start.'
                : step === 1
                  ? 'Follow the example. Watch what changes.'
                  : 'One idea. One small experiment. You have got this.'}
          </strong>
        </div>
      </div>
      <div className="guide-progress" aria-label="Reading steps">
        {['One idea', 'An example', 'Your small task'].map((label, index) => (
          <button
            key={label}
            aria-current={step === index ? 'step' : undefined}
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span>
            {label}
          </button>
        ))}
      </div>
      <p className="eyebrow">
        STEP {step + 1} OF 3 · {step === 2 ? 'TRY IT YOURSELF' : 'FOLLOW ALONG'}
      </p>
      <h2 ref={heading} tabIndex={-1}>
        {step === 0
          ? guide.title
          : step === 1
            ? 'Follow one worked example'
            : 'Make one small decision'}
      </h2>
      {step === 0 && (
        <>
          <p className="guide-situation">{guide.situation}</p>
          <LessonExperiment day={day} progress={progress} update={update} />
          <p className="guide-explanation">{guide.explanation}</p>
          <button className="curiosity-button" onClick={() => setStep(2)}>
            Curious? Try the challenge before reading
            <ArrowRight size={15} />
          </button>
          <details className="guide-details">
            <summary>New words, in simple English</summary>
            <dl>
              {guide.terms.map(([word, meaning]) => (
                <div key={word}>
                  <dt>{word}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          </details>
          <p className="guide-connection">
            <strong>How this fits your journey</strong>
            {guide.connection}
          </p>
        </>
      )}
      {step === 1 && (
        <>
          <p>{teaching.example.context}</p>
          <div className="guide-code-label">
            {teaching.example.filename} ·{' '}
            {teaching.example.language === 'markdown'
              ? 'Document example'
              : teaching.example.language === 'bash'
                ? 'Local terminal commands'
                : 'Worked example'}
          </div>
          <pre className="guide-code">
            <code>{teaching.example.code}</code>
          </pre>
          <ol className="guide-walkthrough">
            {guide.walkthrough.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <details className="guide-details">
            <summary>
              {['markdown', 'bash'].includes(teaching.example.language)
                ? 'See the expected outcome'
                : 'See the expected output'}
            </summary>
            <pre className="guide-code expected-output">
              <code>{teaching.example.output}</code>
            </pre>
            <p>{teaching.example.run}</p>
          </details>
          <p className="field-help">
            Reading the example is the first step. You can edit and run code in Practise. Commands
            and document tasks are completed locally.
          </p>
        </>
      )}
      {step === 2 && (
        <>
          <p className="guide-task">{guide.question}</p>
          <div className="guide-choices" role="group" aria-label="Choose your answer">
            {guide.options.map(([label], index) => (
              <button
                key={label}
                className={attempt.choice === index ? 'selected' : ''}
                aria-pressed={attempt.choice === index}
                onClick={() => {
                  setNewWin(false);
                  changeAttempt({ choice: index, checked: false });
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            className="button primary"
            disabled={attempt.choice === null}
            onClick={() => {
              const first = attempt.choice === guide.answer && !progress.conceptWins[day];
              setNewWin(first);
              update({
                ...progress,
                quickChecks: { ...progress.quickChecks, [day]: { ...attempt, checked: true } },
                conceptWins: first
                  ? { ...progress.conceptWins, [day]: localDate() }
                  : progress.conceptWins,
              });
            }}
          >
            Check my thinking
          </button>
          {attempt.checked && attempt.choice !== null && (
            <p
              className={`guide-feedback ${attempt.choice === guide.answer ? 'is-correct' : ''}`}
              role="status"
            >
              {attempt.choice === guide.answer && <CheckCircle2 size={19} />}
              {guide.options[attempt.choice][1]}
            </p>
          )}
          {attempt.checked && attempt.choice === guide.answer && progress.conceptWins[day] && (
            <WinMoment
              title={newWin ? 'Discovery collected. +15 XP' : 'Discovery saved in your collection.'}
            >
              You connected the rule to the result. Try it in code next.
            </WinMoment>
          )}
          <div className="guide-hints">
            {guide.hints.slice(0, attempt.hints).map((hint, index) => (
              <p key={hint}>
                <strong>Hint {index + 1}:</strong> {hint}
              </p>
            ))}
            {attempt.hints < 2 ? (
              <button
                className="text-button"
                onClick={() => changeAttempt({ hints: attempt.hints + 1 })}
              >
                <Lightbulb size={16} />
                {attempt.hints ? 'Give me another hint' : 'Give me a small hint'}
              </button>
            ) : (
              <button
                className="text-button"
                aria-expanded={solution}
                onClick={() => setSolution(!solution)}
              >
                {solution ? 'Hide the explanation' : 'Show the answer and why'}
              </button>
            )}
            {solution && (
              <p className="guide-feedback">
                <strong>{guide.options[guide.answer][0]}</strong> {guide.options[guide.answer][1]}
              </p>
            )}
          </div>
          <p className="field-help">
            This is a learning exercise. Try again or continue when you are ready; it does not mark
            your project complete.
          </p>
        </>
      )}
      <div className="guide-navigation">
        {step > 0 && (
          <button className="button light" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={16} />
            Back
          </button>
        )}
        <button
          className="button primary"
          onClick={() => (step < 2 ? setStep(step + 1) : onPractice())}
        >
          {step === 0
            ? 'Show me an example'
            : step === 1
              ? 'Let me try a small task'
              : 'Continue to Practise'}
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
