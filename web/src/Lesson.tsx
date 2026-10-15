import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Code2,
  ExternalLink as LinkIcon,
  FolderGit2,
} from 'lucide-react';
import {
  lessons,
  quizzes,
  projectDefinitions,
  dailyProjects,
  REPO,
  type Lesson as LessonData,
} from './data';
import {
  canComplete,
  localDate,
  lessonActivities,
  type LessonActivity,
  type Progress,
} from './state';
import { Checkbox, ExternalLink } from './ui';
import Markdown from './Markdown';
import Playground from './Playground';
import LessonProject from './LessonProject';
import LessonGuide from './LessonGuide';
import { lessonTeaching } from './lesson-content';
import { MissionMeter, XPChip, WinMoment } from './MissionUI';

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
              ? "Concept check passed. Continue to today's project."
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
  initialTab,
}: {
  lesson: LessonData;
  progress: Progress;
  update: (next: Progress) => void;
  initialTab?: string;
}) {
  const { day } = lesson;
  const [tab, setTab] = useState<LessonActivity>(
    lessonActivities.includes(initialTab as LessonActivity)
      ? (initialTab as LessonActivity)
      : progress.lessonActivities[day] || 'learn',
  );
  const { guide, teaching } = lessonTeaching(day);
  const [newBuild, setNewBuild] = useState(false);
  useEffect(() => {
    if (progress.lastLesson !== day || progress.lessonActivities[day] !== tab)
      update({
        ...progress,
        lastLesson: day,
        lessonActivities: { ...progress.lessonActivities, [day]: tab },
      });
  }, [day, tab, progress, update]);
  const goTo = (activity: LessonActivity) => {
    setTab(activity);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const notes = progress.notes[day] || '';
  const checks = progress.checkpoints[day] || [false, false];
  const completed = !!progress.completed[day];
  const passed = progress.quizPassed.includes(day);
  const group = lessons.filter((item) => item.track === lesson.track);
  const project = projectDefinitions.find((item) => item.day === day);
  const dailyProject = dailyProjects[day - 1];
  const projectDone =
    progress.lessonProjectChecks[day]?.filter(Boolean).length === dailyProject.acceptance.length;
  const statusItems = [passed, projectDone, notes.trim().length >= 20, checks.every(Boolean)];
  const complete = () => {
    if (!canComplete(progress, day)) return;
    setNewBuild(true);
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
      <div className="lesson-player-bar">
        <MissionMeter day={day} progress={progress} />
        <XPChip progress={progress} />
      </div>
      <section className="lesson-start" aria-label="Today's goal">
        <p className="eyebrow">ONE LESSON, ONE USEFUL RESULT</p>
        <p>
          <strong>{dailyProject.title}</strong>
        </p>
        <p>
          <strong>Your first action:</strong>{' '}
          {tab === 'learn'
            ? 'Try the experiment below. Change one input and watch the result. Nothing to install.'
            : tab === 'practice'
              ? 'Try the exercise below, then check your understanding.'
              : tab === 'project'
                ? guide.firstStep
                : 'Write what you built, how you tested it, and what you learned.'}
        </p>
        <div className="lesson-start-footer">
          <p className="field-help">
            Your place saves in this browser. Take as many sessions as you need.
          </p>
          {tab === 'learn' && (
            <>
              <button
                className="button primary"
                onClick={() => {
                  update({ ...progress, readingSteps: { ...progress.readingSteps, [day]: 0 } });
                  requestAnimationFrame(() => {
                    const experiment = document.getElementById(`lesson-experiment-${day}`);
                    experiment?.scrollIntoView({ block: 'start', behavior: 'instant' });
                    experiment?.focus({ preventScroll: true });
                  });
                }}
              >
                Try the experiment <ArrowRight size={14} />
              </button>
              <button className="text-button" onClick={() => goTo('project')}>
                Open project
                <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </section>
      <div className="lesson-layout">
        <div className="lesson-content">
          <div className="tabs" role="tablist" aria-label="Lesson activities">
            {[
              ['learn', BookOpen, 'Learn'],
              ['practice', Code2, 'Practise'],
              ['project', FolderGit2, 'Project'],
              ['build', ClipboardCheck, 'Record your build'],
            ].map(([id, Icon, label]) => {
              const ActivityIcon = Icon as typeof BookOpen;
              return (
                <button
                  key={String(id)}
                  role="tab"
                  id={`activity-${id}`}
                  aria-controls="lesson-activity-panel"
                  aria-selected={tab === id}
                  tabIndex={tab === id ? 0 : -1}
                  onClick={() => goTo(id as LessonActivity)}
                  onKeyDown={(event) => {
                    const index = lessonActivities.indexOf(tab);
                    const next =
                      event.key === 'ArrowRight'
                        ? (index + 1) % 4
                        : event.key === 'ArrowLeft'
                          ? (index + 3) % 4
                          : event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? 3
                              : -1;
                    if (next < 0) return;
                    event.preventDefault();
                    setTab(lessonActivities[next]);
                    document.getElementById(`activity-${lessonActivities[next]}`)?.focus();
                  }}
                >
                  <ActivityIcon size={16} />
                  {String(label)}
                </button>
              );
            })}
          </div>
          <div id="lesson-activity-panel" role="tabpanel" aria-labelledby={`activity-${tab}`}>
            {tab === 'learn' && (
              <div className="reading-card">
                <LessonGuide
                  day={day}
                  progress={progress}
                  update={update}
                  onPractice={() => goTo('practice')}
                />
                <details className="guide-details full-lesson-notes">
                  <summary>Full lesson notes, extra exercises, and references</summary>
                  <Markdown folder={lesson.folder} contents />
                </details>
                <div className="reading-footer">
                  <button
                    className="text-button"
                    onClick={() => {
                      goTo('practice');
                    }}
                  >
                    Skip to Practise
                    <ArrowRight size={17} />
                  </button>
                  <ExternalLink href={`${REPO}/tree/main/${lesson.folder}`}>
                    View source
                  </ExternalLink>
                </div>
              </div>
            )}
            {tab === 'practice' && (
              <>
                <div className="practice-divider">
                  <p className="eyebrow">GUIDED PRACTICE · A SMALL CHANGE</p>
                  <h2>
                    {['python', 'html'].includes(teaching.example.language)
                      ? 'Run it. Change one thing. Compare.'
                      : 'Try this with your own project'}
                  </h2>
                  <p className="muted">
                    {['python', 'html'].includes(teaching.example.language)
                      ? 'The editor starts with the worked example from this lesson. Your edits save in this browser. This exercise is preparation for the full project.'
                      : guide.codeTask}
                  </p>
                </div>
                {['python', 'html'].includes(teaching.example.language) ? (
                  <Playground key={day} day={day} progress={progress} update={update} />
                ) : (
                  <div className="reading-card local-practice">
                    <p className="eyebrow">COMPLETE THIS LOCALLY</p>
                    <p>{teaching.example.run}</p>
                    <pre className="guide-code">
                      <code>{teaching.example.code}</code>
                    </pre>
                    <p className="field-help">
                      This is a terminal or document exercise. It does not run inside the browser
                      code editor.
                    </p>
                  </div>
                )}
                <ConceptCheck day={day} progress={progress} update={update} />
                <button
                  className="button primary practice-next"
                  onClick={() => {
                    goTo('project');
                  }}
                >
                  Continue to today's project
                  <ArrowRight size={17} />
                </button>
              </>
            )}
            {tab === 'project' && (
              <LessonProject
                day={day}
                folder={lesson.folder}
                progress={progress}
                update={update}
                onRecord={() => {
                  goTo('build');
                }}
              />
            )}
            {tab === 'build' && (
              <section className="build-card">
                {newBuild && (
                  <WinMoment title="You built it. +80 XP">
                    Your project evidence is recorded. This is a good place to pause, or explore the
                    next mission.
                  </WinMoment>
                )}
                <p className="eyebrow">TURN PRACTICE INTO EVIDENCE</p>
                <h2>{dailyProject.title}</h2>
                <p className="build-task">{dailyProject.brief}</p>
                <p className="muted">
                  Use three short sentences: “I built…”, “I tested…”, and “I learned…”. Include an
                  actual input and observed result in your test sentence. Add a link to your work if
                  you have one.
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
                {!projectDone && (
                  <p className="inline-warning">
                    Finish the five acceptance checks in the Project tab before completing this
                    lesson.
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
                    <a
                      className="button light"
                      href={day < 30 ? `#/lesson/${day + 1}` : '#/phase/2'}
                    >
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
        </div>
        <aside className="lesson-aside">
          <div className="aside-card">
            <p className="eyebrow">YOUR LEARNING CHECKLIST</p>
            {[
              'Pass the concept check',
              'Verify the lesson project',
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
