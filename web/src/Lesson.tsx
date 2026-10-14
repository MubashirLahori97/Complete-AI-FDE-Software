import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Code2,
  ExternalLink as LinkIcon,
} from 'lucide-react';
import { lessons, quizzes, projectDefinitions, REPO, type Lesson as LessonData } from './data';
import { canComplete, localDate, type Progress } from './state';
import { Checkbox, ExternalLink } from './ui';
import Markdown from './Markdown';
import Playground from './Playground';

function ConceptCheck({
  day,
  progress,
  update,
}: {
  day: number;
  progress: Progress;
  update: (next: Progress) => void;
}) {
  const questions = quizzes[day];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = questions.filter((question, index) => answers[index] === question.answer).length;
  const check = () => {
    setSubmitted(true);
    if (score === questions.length && !progress.quizPassed.includes(day))
      update({ ...progress, quizPassed: [...progress.quizPassed, day] });
  };
  return (
    <section className="quiz">
      <div className="quiz-heading">
        <div>
          <p className="eyebrow">CHECK YOUR UNDERSTANDING</p>
          <h2>Can you explain the idea?</h2>
          <p className="muted">Two quick questions. Feedback is part of learning.</p>
        </div>
        <span className="badge">{questions.length} questions</span>
      </div>
      {questions.map((question, index) => (
        <fieldset className="question" key={question.prompt}>
          <legend>
            <span className="question-number">{index + 1}</span>
            {question.prompt}
          </legend>
          <div className="answer-options">
            {question.options.map((option, optionIndex) => (
              <label
                key={option}
                className={`answer-option ${answers[index] === optionIndex ? 'selected' : ''} ${submitted && optionIndex === question.answer ? 'correct' : ''} ${submitted && answers[index] === optionIndex && optionIndex !== question.answer ? 'incorrect' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${day}-${index}`}
                  checked={answers[index] === optionIndex}
                  onChange={() => {
                    setAnswers((old) => ({ ...old, [index]: optionIndex }));
                    setSubmitted(false);
                  }}
                />
                <span>{option}</span>
                {submitted && optionIndex === question.answer && <CheckCircle2 size={17} />}
              </label>
            ))}
          </div>
          {submitted && <p className="answer-feedback">{question.explanation}</p>}
        </fieldset>
      ))}
      <div className="quiz-footer">
        <button
          className="button primary"
          disabled={Object.keys(answers).length !== questions.length}
          onClick={check}
        >
          <ClipboardCheck size={17} />
          Check answers
        </button>
        {submitted && (
          <p role="status" className={score === questions.length ? 'success-text' : 'muted'}>
            {score} / {questions.length} correct.{' '}
            {score === questions.length
              ? 'Concept check passed. Now record what you built.'
              : 'Read the feedback, then try again.'}
          </p>
        )}
      </div>
    </section>
  );
}

export default function Lesson({
  lesson,
  progress,
  update,
}: {
  lesson: LessonData;
  progress: Progress;
  update: (next: Progress) => void;
}) {
  const [tab, setTab] = useState('learn');
  const { day } = lesson;
  const notes = progress.notes[day] || '';
  const checks = progress.checkpoints[day] || [false, false];
  const completed = !!progress.completed[day];
  const passed = progress.quizPassed.includes(day);
  const group = lessons.filter((item) => item.track === lesson.track);
  const project = projectDefinitions.find((item) => item.day === day);
  const statusItems = [passed, notes.trim().length >= 20, checks.every(Boolean)];
  const complete = () => {
    if (!canComplete(progress, day)) return;
    update({ ...progress, completed: { ...progress.completed, [day]: localDate() } });
  };
  return (
    <>
      <a className="back-link" href="#/curriculum">
        <ArrowLeft size={15} />
        Learning path
      </a>
      <div className="lesson-heading">
        <p className="eyebrow">
          LESSON {String(day).padStart(2, '0')} <span className="dot-divider">/</span>{' '}
          {lesson.track.toUpperCase()}
        </p>
        <h1>{lesson.title}</h1>
        <p className="muted">{lesson.summary}</p>
        <div className="lesson-heading-meta">
          <span>
            <BookOpen size={15} />
            Learn at your pace
          </span>
          <span>
            <Code2 size={15} />
            Practical build
          </span>
          {completed && (
            <span className="success-text">
              <CheckCircle2 size={15} />
              Completed
            </span>
          )}
        </div>
      </div>
      <div className="lesson-layout">
        <div className="lesson-content">
          <div className="tabs" role="tablist" aria-label="Lesson activities">
            {[
              ['learn', BookOpen, 'Learn'],
              ['practice', Code2, 'Practise'],
              ['build', ClipboardCheck, 'Record your build'],
            ].map(([id, Icon, label]) => {
              const ActivityIcon = Icon as typeof BookOpen;
              return (
                <button
                  key={String(id)}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(String(id))}
                >
                  <ActivityIcon size={16} />
                  {String(label)}
                </button>
              );
            })}
          </div>
          {tab === 'learn' && (
            <div className="reading-card">
              <div className="source-note">
                <BookOpen size={15} />
                <span>
                  Original course notes · Read, experiment, then check your understanding.
                </span>
              </div>
              <Markdown folder={lesson.folder} />
              <div className="reading-footer">
                <button
                  className="button primary"
                  onClick={() => {
                    setTab('practice');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                >
                  Practise the concept
                  <ArrowRight size={17} />
                </button>
                <ExternalLink href={`${REPO}/tree/main/${lesson.folder}`}>View source</ExternalLink>
              </div>
            </div>
          )}
          {tab === 'practice' && (
            <>
              <ConceptCheck day={day} progress={progress} update={update} />
              <div className="practice-divider">
                <h2>Make it run. Then change it.</h2>
                <p className="muted">
                  The lab reinforces a related concept. Complete today’s full build on your own
                  machine.
                </p>
              </div>
              <Playground key={day} day={day} progress={progress} update={update} />
              <button
                className="button primary practice-next"
                onClick={() => {
                  setTab('build');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                Record your build
                <ArrowRight size={17} />
              </button>
            </>
          )}
          {tab === 'build' && (
            <section className="build-card">
              <p className="eyebrow">TURN PRACTICE INTO EVIDENCE</p>
              <h2>Your build: lesson {day}</h2>
              <p className="build-task">{lesson.build}</p>
              <p className="muted">
                Use the course notes for the full requirements. Record what you built, a test you
                ran, and what you learned. A link to your work is useful too.
              </p>
              <label className="form-label" htmlFor="build-notes">
                Build evidence & reflection
              </label>
              <textarea
                id="build-notes"
                className="notes-field"
                rows={8}
                placeholder="I built… I tested… I learned… Link to my code or demo…"
                value={notes}
                maxLength={10000}
                onChange={(event) =>
                  update({ ...progress, notes: { ...progress.notes, [day]: event.target.value } })
                }
              />
              <p className="field-help">
                {notes.trim().length < 20
                  ? 'Write at least 20 characters to begin recording useful evidence.'
                  : 'Saved in this browser. Use Export in Settings to back up your work.'}
              </p>
              <div className="build-checks">
                <Checkbox
                  checked={checks[0]}
                  onChange={(value) =>
                    update({
                      ...progress,
                      checkpoints: { ...progress.checkpoints, [day]: [value, checks[1]] },
                    })
                  }
                >
                  I can explain today’s concept in my own words.
                </Checkbox>
                <Checkbox
                  checked={checks[1]}
                  onChange={(value) =>
                    update({
                      ...progress,
                      checkpoints: { ...progress.checkpoints, [day]: [checks[0], value] },
                    })
                  }
                >
                  I built something, tested it, and checked a failure or boundary case.
                </Checkbox>
              </div>
              {!passed && (
                <p className="inline-warning">
                  Pass the concept check in the Practise tab before completing this lesson.
                </p>
              )}
              <div className="build-footer">
                {completed ? (
                  <span className="success-text">
                    <CheckCircle2 size={18} />
                    Lesson completed on {progress.completed[day]}
                  </span>
                ) : (
                  <button
                    className="button primary"
                    disabled={!canComplete(progress, day)}
                    onClick={complete}
                  >
                    <CheckCircle2 size={17} />
                    Mark lesson complete
                  </button>
                )}
                {completed && (
                  <a className="button light" href={day < 30 ? `#/lesson/${day + 1}` : '#/phase/2'}>
                    {day < 30 ? 'Next lesson' : 'Explore the next phase'}
                    <ArrowRight size={17} />
                  </a>
                )}
              </div>
              <p className="field-help">
                Completion records your self-reported practice. It does not independently verify
                your project or certify professional readiness.
              </p>
              {project && (
                <a href="#/portfolio" className="text-link portfolio-prompt">
                  Add {project.title.toLowerCase()} to your portfolio
                  <LinkIcon size={15} />
                </a>
              )}
            </section>
          )}
        </div>
        <aside className="lesson-aside">
          <div className="aside-card">
            <p className="eyebrow">YOUR LEARNING CHECKLIST</p>
            {[
              'Pass the concept check',
              'Record build evidence',
              'Explain and test the concept',
            ].map((label, index) => (
              <div className={`checklist-item ${statusItems[index] ? 'done' : ''}`} key={label}>
                {statusItems[index] ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                <span>{label}</span>
              </div>
            ))}
            <p className="field-help">Understanding + a working build. Both matter.</p>
          </div>
          <div className="aside-card lesson-outline">
            <p className="eyebrow">{lesson.track.toUpperCase()}</p>
            {group.map((item) => (
              <a
                href={`#/lesson/${item.day}`}
                aria-current={item.day === day ? 'page' : undefined}
                className={item.day === day ? 'current' : ''}
                key={item.day}
              >
                <span>
                  {progress.completed[item.day] ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    String(item.day).padStart(2, '0')
                  )}
                </span>
                {item.title}
              </a>
            ))}
          </div>
          <div className="aside-tip">
            <strong>Use AI as a learning partner.</strong>
            <p>
              Ask for a hint, explain its answer, and test the result. Keep ownership of the
              decisions.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
