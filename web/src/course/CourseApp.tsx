import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Download, Sprout } from 'lucide-react';
import catalog from './catalog.json' with { type: 'json' };
import ExerciseRunner from './ExerciseRunner';
import { casesForStep } from './harness';
import {
  blankLesson,
  COURSE_KEY,
  loadGuided,
  parseGuided,
  projectReady,
  readinessGaps,
  skillNames,
  type GuidedProgress,
  type LessonRecord,
} from './progress';
import { loadProgress, parseProgress, STORAGE_KEY } from '../state';
import type { CheckResult, CourseLesson } from './types';
import './course.css';

const cache = new Map<number, CourseLesson>();
const download = (name: string, value: unknown) => {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const lessonHref = (day: number) => `#/learn/${day}`;
export default function CourseApp({ path }: { path: string }) {
  const [progress, setProgress] = useState(loadGuided),
    [notice, setNotice] = useState('');
  const match = path.match(/^\/learn\/(\d+)$/),
    day = match ? Number(match[1]) : 0;
  const [lesson, setLesson] = useState<CourseLesson | null>(day ? cache.get(day) || null : null),
    [loadError, setLoadError] = useState(''),
    [retry, setRetry] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null),
    input = useRef<HTMLInputElement>(null);
  const change = (next: GuidedProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(COURSE_KEY, JSON.stringify(next));
    } catch {
      setNotice('Your browser could not save this change. Download a backup before leaving.');
    }
  };
  const record = progress.lessons[String(day)] || (day >= 1 && day <= 30 ? blankLesson(day) : null);
  const patch = (values: Partial<LessonRecord>) => {
    if (!record) return;
    change({
      ...progress,
      last: day,
      lessons: { ...progress.lessons, [day]: { ...record, ...values } },
    });
  };
  useEffect(() => {
    let active = true;
    setLoadError('');
    if (!day || day > 30) {
      setLesson(null);
      return;
    }
    if (cache.has(day)) {
      setLesson(cache.get(day)!);
      return;
    }
    setLesson(null);
    void fetch(`${import.meta.env.BASE_URL}course/lesson-${String(day).padStart(2, '0')}.json`)
      .then((response) => {
        if (!response.ok) throw new Error('The lesson could not load.');
        return response.json() as Promise<CourseLesson>;
      })
      .then((value) => {
        if (value.day !== day || !value.exercise?.steps?.length)
          throw new Error('The lesson file is incomplete.');
        cache.set(day, value);
        if (active) setLesson(value);
      })
      .catch(() => {
        if (active)
          setLoadError(
            'The lesson could not load. Your saved work is kept. Check the connection and try again.',
          );
      });
    return () => {
      active = false;
    };
  }, [day, retry]);
  useEffect(() => {
    document.title = `${day ? catalog.find((item) => item.day === day)?.title || 'Lesson' : path === '/path' ? 'Your learning path' : path === '/evidence' ? 'Your evidence' : 'Learn with Amina'} · FDE Academy`;
    window.scrollTo(0, 0);
    heading.current?.focus({ preventScroll: true });
  }, [path, record?.stage, record?.step, lesson?.day]);
  const completed = Object.values(progress.lessons).filter((item) => item.completed).length;
  const backup = () =>
    download('amina-learning-backup.json', {
      format: 'amina-learning-backup-v1',
      guided: progress,
      legacy: loadProgress(),
    });
  const restore = async (file: File) => {
    try {
      if (file.size > 3_000_000) throw new Error('This backup is too large.');
      const value = JSON.parse(await file.text());
      if (!value || typeof value !== 'object') throw new Error('Choose an FDE Academy backup.');
      if (value.format === 'amina-learning-backup-v1') {
        const guided = parseGuided(value.guided);
        const legacy = parseProgress(value.legacy);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
        change(guided);
        setNotice('Guided lessons and earlier library records restored.');
      } else if (value.format === 'amina-guided-v1') {
        change(parseGuided(value));
        setNotice('Guided progress restored.');
      } else if (value.version === 1) {
        const legacy = parseProgress(value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
        setNotice(
          'Earlier library progress restored. The new lessons have their own practice records.',
        );
      } else throw new Error('Choose an FDE Academy backup.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'This backup could not be read.');
    }
    if (input.current) input.current.value = '';
  };
  return (
    <div className="course-page">
      <a
        href="#course-main"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('course-main')?.focus();
        }}
      >
        Skip to lesson
      </a>
      <header className="course-header">
        <a href="#/" className="course-brand">
          <Sprout size={23} aria-hidden="true" />
          Learn with Amina
        </a>
        <a href="#/path">Learning path</a>
      </header>
      <main
        id="course-main"
        tabIndex={-1}
        className={`course-main ${lesson && record?.stage === lesson.sections.length + 2 ? 'course-main-wide' : ''}`}
      >
        {path === '/' ? (
          <section className="course-card course-welcome">
            <p className="course-eyebrow">A small shop. Real engineering.</p>
            <h1 ref={heading} tabIndex={-1}>
              Start with one small thing.
            </h1>
            <p>Help Amina run her shop. Learn one idea, see it work, then build it yourself.</p>
            <a className="course-button" href={lessonHref(progress.last)}>
              {Object.keys(progress.lessons).length ? 'Continue your lesson' : 'Start lesson 1'}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <p className="course-small">
              No setup for your first exercise. Go at your pace; a lesson and its project may take
              more than one study session.
            </p>
            <details>
              <summary>What will I learn?</summary>
              <p>
                Thirty lessons connect programming, interfaces, services, AI, and working with a
                customer. Each has a guided exercise and a real project. Later projects run on your
                computer.
              </p>
              <p>
                You have completed {completed} of 30 lesson projects. Independent work and a
                reviewer’s evidence check come at the end.
              </p>
              <a href="#/evidence">View your evidence</a>
            </details>
          </section>
        ) : path === '/path' ? (
          <section>
            <h1 ref={heading} tabIndex={-1}>
              Your next small step
            </h1>
            <p>
              Follow the order, or revisit a lesson. Save the project evidence before marking it
              complete.
            </p>
            <a className="course-button" href={lessonHref(progress.last)}>
              Continue lesson {progress.last}
              <ArrowRight size={18} />
            </a>
            {[...new Set(catalog.map((item) => item.chapter))].map((chapter, i) => (
              <details
                className="course-path-group"
                key={chapter}
                open={catalog.find((item) => item.day === progress.last)?.chapter === chapter}
              >
                <summary>
                  {i + 1}. {chapter}
                </summary>
                <ol>
                  {catalog
                    .filter((item) => item.chapter === chapter)
                    .map((item) => (
                      <li key={item.day}>
                        <a href={lessonHref(item.day)}>
                          <span className="course-number">
                            {progress.lessons[item.day]?.completed ? <Check size={17} /> : item.day}
                          </span>
                          <span>
                            {item.title}
                            <small>{item.outcome}</small>
                          </span>
                        </a>
                      </li>
                    ))}
                </ol>
              </details>
            ))}
            <a href="#/evidence">Review project and independent evidence</a>
          </section>
        ) : path === '/evidence' ? (
          <Evidence progress={progress} change={change} heading={heading} />
        ) : day >= 1 && day <= 30 ? (
          loadError ? (
            <section className="course-card">
              <h1 ref={heading} tabIndex={-1}>
                Let’s reopen the lesson.
              </h1>
              <p role="alert">{loadError}</p>
              <button className="course-button" onClick={() => setRetry((value) => value + 1)}>
                Try again
              </button>
            </section>
          ) : lesson && record ? (
            <GuidedLesson
              key={day}
              lesson={lesson}
              record={record}
              patch={patch}
              heading={heading}
            />
          ) : (
            <p role="status">Opening Amina’s shop…</p>
          )
        ) : (
          <section className="course-card">
            <h1 ref={heading} tabIndex={-1}>
              That lesson is not on the path.
            </h1>
            <a href="#/path" className="course-button">
              Choose a lesson
            </a>
          </section>
        )}
        {notice && (
          <p className="course-feedback" role="status">
            {notice}
          </p>
        )}
      </main>
      <footer className="course-footer">
        <details>
          <summary>Your saved work and other resources</summary>
          <p>
            Drafts, checks, reflections, and project evidence stay in this browser. Download a
            backup to keep a copy or move to another device. Importing a guided backup replaces
            those guided records.
          </p>
          <div className="course-footer-actions">
            <button onClick={backup} className="course-link-button">
              <Download size={16} />
              Download progress backup
            </button>
            <label className="course-link-button" htmlFor="course-backup">
              Restore a backup
              <input
                ref={input}
                id="course-backup"
                type="file"
                accept=".json,application/json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void restore(file);
                }}
              />
            </label>
          </div>
          <p>
            <a href="#/library">Earlier course reference library</a> ·{' '}
            <a href="#/sample/amina">One-button sample</a> ·{' '}
            <a href="#/evidence">Independent evidence review</a>
          </p>
        </details>
      </footer>
    </div>
  );
}

function GuidedLesson({
  lesson,
  record,
  patch,
  heading,
}: {
  lesson: CourseLesson;
  record: LessonRecord;
  patch: (next: Partial<LessonRecord>) => void;
  heading: React.RefObject<HTMLHeadingElement | null>;
}) {
  const [results, setResults] = useState<CheckResult[]>([]),
    [solutionNotice, setSolutionNotice] = useState('');
  const exampleStage = lesson.sections.length + 1,
    exerciseStage = exampleStage + 1,
    projectStage = exerciseStage + 1;
  const stage = record.stage,
    exercise = lesson.exercise,
    step = record.step,
    task = exercise.steps[step],
    code = record.drafts[step] || exercise.starter;
  const expected = casesForStep(exercise, step),
    passed = record.passed[step] === code;
  const next = () => patch({ stage: Math.min(stage + 1, projectStage) });
  useEffect(() => {
    setResults([]);
    setSolutionNotice('');
  }, [step, stage]);
  const updateCode = (value: string) => {
    const drafts = [...record.drafts],
      checks = [...record.passed];
    drafts[step] = value;
    checks[step] = null;
    setResults([]);
    patch({ drafts, passed: checks, completed: '' });
  };
  const checked = (values: CheckResult[], checkedCode: string) => {
    if (checkedCode !== code) return;
    setResults(values);
    const checks = [...record.passed],
      drafts = [...record.drafts];
    drafts[step] = checkedCode;
    checks[step] =
      values.length === expected.length && values.every((item) => item.passed) ? checkedCode : null;
    patch({ passed: checks, drafts, completed: '' });
  };
  const useSolution = () => {
    const used = [...record.usedSolution];
    used[step] = true;
    const drafts = [...record.drafts],
      checks = [...record.passed];
    drafts[step] = task.solution;
    checks[step] = null;
    setResults([]);
    patch({ usedSolution: used, drafts, passed: checks, completed: '' });
    setSolutionNotice(
      'Reference loaded. Read it, then run the checks. This is guided practice; your project extension should be your own work.',
    );
  };
  return (
    <article>
      <div className="course-lesson-meta">
        <a href="#/path">Lesson {lesson.day} of 30</a>
        <span>
          {stage === 0
            ? 'Watch'
            : stage < exampleStage
              ? 'Understand'
              : stage === exampleStage
                ? 'Example'
                : stage === exerciseStage
                  ? 'Build'
                  : 'Project'}
        </span>
      </div>
      {stage === 0 ? (
        <section className="course-card">
          <p className="course-eyebrow">{lesson.title}</p>
          <h1 ref={heading} tabIndex={-1}>
            Help Amina with one change.
          </h1>
          <p>{lesson.story}</p>
          <div className="course-demo" aria-live="polite">
            {(record.frame === 0
              ? lesson.demo.initial
              : lesson.demo.frames[record.frame - 1].values
            ).map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          {record.frame < lesson.demo.frames.length ? (
            <>
              <p className="course-small">Try the button. Watch what changes.</p>
              <button className="course-button" onClick={() => patch({ frame: record.frame + 1 })}>
                {lesson.demo.frames[record.frame].action}
                <ArrowRight size={18} />
              </button>
              {record.frame > 0 && (
                <p className="course-feedback">
                  {lesson.demo.frames[record.frame - 1].explanation}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="course-feedback">{lesson.demo.frames.at(-1)!.explanation}</p>
              <button className="course-button" onClick={next}>
                Show me how it works
                <ArrowRight size={18} />
              </button>
              <button className="course-link-button" onClick={() => patch({ frame: 0 })}>
                Try the change again
              </button>
            </>
          )}
        </section>
      ) : stage < exampleStage ? (
        <section className="course-card">
          <p className="course-eyebrow">
            One idea · {stage} of {lesson.sections.length}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {lesson.sections[stage - 1].title}
          </h1>
          {lesson.sections[stage - 1].paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          <button className="course-button" onClick={next}>
            {stage === lesson.sections.length ? 'See a worked example' : 'Next small idea'}
            <ArrowRight size={18} />
          </button>
          <details>
            <summary>New words, in simple English</summary>
            <dl>
              {lesson.words.map((word) => (
                <div key={word.term}>
                  <dt>{word.term}</dt>
                  <dd>{word.meaning}</dd>
                </div>
              ))}
            </dl>
          </details>
        </section>
      ) : stage === exampleStage ? (
        <section className="course-card">
          <p className="course-eyebrow">Read this before changing code</p>
          <h1 ref={heading} tabIndex={-1}>
            Follow one example.
          </h1>
          <pre>
            <code>{lesson.example.code}</code>
          </pre>
          <p>
            <strong>What happens:</strong> {lesson.example.output}
          </p>
          <ol>
            {lesson.example.explanation.map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ol>
          <button className="course-button" onClick={next}>
            Try the first guided step
            <ArrowRight size={18} />
          </button>
        </section>
      ) : stage === exerciseStage ? (
        <section className="course-card">
          <p className="course-eyebrow">
            Guided exercise · Step {step + 1} of {exercise.steps.length}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {task.title}
          </h1>
          <p>{task.task}</p>
          <details>
            <summary>What am I building?</summary>
            <p>{exercise.brief}</p>
            {exercise.parameters.length > 0 && (
              <p>
                The checks supply these inputs: {exercise.parameters.join(', ')}. Write the shown
                function or statements; you do not need to type those input values yourself.
              </p>
            )}
            {exercise.setup && (
              <details>
                <summary>Prepared data supplied by the lab</summary>
                <pre>
                  <code>{exercise.setup}</code>
                </pre>
              </details>
            )}
            <p className="course-small">
              {exercise.language === 'python'
                ? 'Actual Python; the first browser run needs its public runtime download. You can also use the downloaded local kit.'
                : exercise.language === 'react'
                  ? 'A real React preview. This browser compiles types; run the project typecheck to get TypeScript diagnostics.'
                  : exercise.language === 'html'
                    ? 'Your HTML, CSS, and script render in an isolated preview. Try a narrow browser window too.'
                    : 'Your JavaScript runs in an isolated worker.'}
            </p>
          </details>
          <label htmlFor="guided-code" className="course-code-label">
            Your {exercise.language === 'react' ? 'React / TypeScript' : exercise.language} code
          </label>
          <textarea
            id="guided-code"
            className="course-editor"
            value={code}
            spellCheck={false}
            maxLength={30000}
            onChange={(event) => updateCode(event.target.value)}
            aria-describedby="code-help"
          />
          <p id="code-help" className="course-small">
            Change the starter, then press Check this step. A failed check tells you what to
            investigate.
          </p>
          <ExerciseRunner exercise={exercise} code={code} step={step} onResults={checked} />
          {results.length > 0 && (
            <div className="course-checks" aria-live="polite">
              <p className="course-feedback">
                {passed
                  ? 'This step works. Explain why, then continue.'
                  : `${results.filter((item) => item.passed).length} of ${results.length} checks passed. Try one correction at a time.`}
              </p>
              {results.map((result) => (
                <details key={result.id} open={!result.passed}>
                  <summary>
                    {result.passed ? '✓' : 'Try again:'} {result.label}
                  </summary>
                  <p>{expected.find((item) => item.id === result.id)?.why}</p>
                  <p>
                    <strong>Expected:</strong> <code>{result.expected}</code>
                  </p>
                  <p>
                    <strong>Your result:</strong> <code>{result.actual}</code>
                  </p>
                </details>
              ))}
            </div>
          )}
          <details>
            <summary>I need a hint</summary>
            <p>{task.hint}</p>
          </details>
          <details>
            <summary>Show the reference solution</summary>
            <p>
              Use it to understand the step. Afterward, explain what each part does and try your own
              variation.
            </p>
            <pre>
              <code>{task.solution}</code>
            </pre>
            <button className="course-link-button" onClick={useSolution}>
              Load this reference into my editor
            </button>
          </details>
          {solutionNotice && (
            <p role="status" className="course-small">
              {solutionNotice}
            </p>
          )}
          <button
            className="course-button"
            disabled={!passed}
            onClick={() => {
              if (step < exercise.steps.length - 1) {
                const drafts = [...record.drafts];
                if (!drafts[step + 1]) drafts[step + 1] = code;
                patch({ step: step + 1, drafts });
              } else next();
            }}
          >
            {step < exercise.steps.length - 1 ? 'Next guided step' : 'Build the lesson project'}
            <ArrowRight size={18} />
          </button>
          <div className="course-step-links">
            {exercise.steps.map((item, i) => (
              <button
                key={i}
                className="course-link-button"
                disabled={i > step && !record.passed[i - 1]}
                onClick={() => patch({ step: i })}
              >
                Step {i + 1}
                {record.passed[i] ? ' ✓' : ''}: {item.title}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="course-card">
          <p className="course-eyebrow">Use the idea in a real project</p>
          <h1 ref={heading} tabIndex={-1}>
            {lesson.project.title}
          </h1>
          <p>{lesson.project.brief}</p>
          <p className="course-small">
            The browser exercise was the warm-up. Complete these milestones in the downloaded
            project and record what you actually tested.
          </p>
          <a
            className="course-button"
            href={`${import.meta.env.BASE_URL}course-projects/lesson-${String(lesson.day).padStart(2, '0')}.zip`}
            download
          >
            <Download size={18} />
            Download this lesson’s kit
          </a>
          {lesson.day >= 15 && (
            <a
              className="course-link-button"
              href={`${import.meta.env.BASE_URL}course-projects/shop-workspace.zip`}
              download
            >
              Download the real shop service and React workspace
            </a>
          )}
          {['javascript', 'python'].includes(exercise.language) && record.passed.at(-1) && (
            <OwnExample lesson={lesson} code={record.drafts.at(-1)!} />
          )}
          <details>
            <summary>What should I deliver?</summary>
            <ul>
              {lesson.project.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
          {lesson.project.milestones.map((milestone, i) => (
            <details key={i} open={i === 0}>
              <summary>
                Milestone {i + 1}: {milestone.title}
              </summary>
              <ol>
                {milestone.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </details>
          ))}
          <details>
            <summary>Tests to reproduce</summary>
            <ul>
              {lesson.project.tests.map((item) => (
                <li key={item.situation}>
                  <strong>{item.situation}:</strong> {item.expected}
                </li>
              ))}
            </ul>
          </details>
          <fieldset>
            <legend>Check these only after testing your project</legend>
            {lesson.project.acceptance.map((item, i) => (
              <label className="course-checkbox" key={item}>
                <input
                  type="checkbox"
                  checked={record.criteria[i]}
                  onChange={(event) => {
                    const criteria = [...record.criteria];
                    criteria[i] = event.target.checked;
                    patch({ criteria, completed: '' });
                  }}
                />
                {item}
              </label>
            ))}
          </fieldset>
          <label htmlFor="project-evidence">
            Your evidence: files or link, commands, and actual results
          </label>
          <textarea
            id="project-evidence"
            value={record.evidence}
            onChange={(event) => patch({ evidence: event.target.value, completed: '' })}
            maxLength={10000}
            placeholder="Example: repository/commit, command I ran, normal result, boundary result, and failure result."
          />
          <p className="course-small">
            At least 40 characters. A saved claim is a practice record; a reviewer must reproduce
            important results.
          </p>
          <details>
            <summary>Your independent extension</summary>
            <p>{lesson.project.extension}</p>
          </details>
          {lesson.project.reflection.map((question, i) => (
            <div key={question}>
              <label htmlFor={`reflection-${i}`}>{question}</label>
              <textarea
                id={`reflection-${i}`}
                value={record.reflection[i]}
                onChange={(event) => {
                  const reflection = [...record.reflection];
                  reflection[i] = event.target.value;
                  patch({ reflection, completed: '' });
                }}
                maxLength={10000}
              />
            </div>
          ))}
          <p className="course-small">
            Explain each answer in your own words (at least 10 characters).
          </p>
          {!record.completed ? (
            <>
              <button
                className="course-button"
                disabled={!projectReady(record)}
                onClick={() => patch({ completed: new Date().toISOString() })}
              >
                Save this completed lesson project
                <Check size={18} />
              </button>
              <p className="course-small">
                Needs a passing final exercise, tested acceptance checks, evidence, and your
                explanations.
              </p>
            </>
          ) : (
            <>
              <p className="course-feedback" role="status">
                Lesson project saved. Keep your evidence and continue at your pace.
              </p>
              <a
                className="course-button"
                href={lesson.day < 30 ? lessonHref(lesson.day + 1) : '#/evidence'}
              >
                {lesson.day < 30 ? 'Start the next lesson' : 'Review your independent evidence'}
                <ArrowRight size={18} />
              </a>
            </>
          )}
          <details>
            <summary>Read more from the original documentation</summary>
            <ul>
              {lesson.references.map((item) => (
                <li key={item.url}>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}
      {stage > 0 && (
        <nav className="course-back">
          <button className="course-link-button" onClick={() => patch({ stage: stage - 1 })}>
            ← Back one part
          </button>
          <details>
            <summary>Jump to a part</summary>
            {[
              ['Watch', 0],
              ['Understand', 1],
              ['Example', exampleStage],
              ['Exercise', exerciseStage],
              ['Project', projectStage],
            ].map(([label, value]) => (
              <button
                key={label}
                className="course-link-button"
                onClick={() => patch({ stage: Number(value) })}
              >
                {label}
              </button>
            ))}
          </details>
        </nav>
      )}
    </article>
  );
}

function OwnExample({ lesson, code }: { lesson: CourseLesson; code: string }) {
  const exercise = lesson.exercise;
  const initial = exercise.cases.find((item) => !item.error && item.args);
  const [inputs, setInputs] = useState(
      exercise.parameters.map((_, i) => JSON.stringify(initial?.args?.[i] ?? 0)),
    ),
    [prediction, setPrediction] = useState(JSON.stringify(initial?.expected ?? 0)),
    [results, setResults] = useState<CheckResult[]>([]);
  const parse = (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return value.trim();
    }
  };
  const custom = {
    ...exercise,
    steps: [{ ...exercise.steps.at(-1)!, cases: ['own-example'] }],
    cases: [
      {
        id: 'own-example',
        label: 'Your predicted result',
        why: 'Compare your prediction with the result of your actual completed code.',
        args: inputs.map(parse),
        expected: parse(prediction),
      },
    ],
  };
  return (
    <details>
      <summary>Try your own example in this browser</summary>
      <p>
        Use your completed exercise with different inputs. Predict the output first. A mismatch is
        useful evidence to investigate.
      </p>
      {exercise.parameters.map((parameter, i) => (
        <div key={parameter}>
          <label htmlFor={`own-${parameter}`}>{parameter}</label>
          <input
            id={`own-${parameter}`}
            value={inputs[i]}
            onChange={(event) => {
              const next = [...inputs];
              next[i] = event.target.value;
              setInputs(next);
              setResults([]);
            }}
          />
        </div>
      ))}
      <label htmlFor="own-prediction">Your predicted result</label>
      <textarea
        id="own-prediction"
        value={prediction}
        onChange={(event) => {
          setPrediction(event.target.value);
          setResults([]);
        }}
      />
      <p className="course-small">
        Numbers can be typed directly. For lists or records, use JSON. Text may be typed directly or
        in quotes. This runs the saved final exercise code.
      </p>
      <ExerciseRunner
        key={JSON.stringify([inputs, prediction])}
        exercise={custom}
        code={code}
        step={0}
        onResults={(values) => setResults(values)}
      />
      {results.map((result) => (
        <p className="course-feedback" key={result.id} role="status">
          Prediction: <code>{result.expected}</code>
          <br />
          Actual result: <code>{result.actual}</code>
          <br />
          {result.passed
            ? 'Your prediction matched.'
            : 'The result differs. Investigate the rule or your prediction.'}
        </p>
      ))}
    </details>
  );
}

const skillDescriptions: Record<string, string> = {
  build: 'Show a complete working interface and API change.',
  debug: 'Reproduce a failure, explain its cause, and prove the repair.',
  data: 'Show safe queries, persistence, and transaction/restore tests.',
  security: 'Prove denied access, approval/replay protection, and secret handling.',
  ai: 'Show labelled quality evidence, real-provider mode if claimed, and fallback failures.',
  delivery: 'Have someone reproduce setup, deployment rehearsal, and rollback.',
  explain: 'Explain the architecture and hand over operation to another person.',
  independent:
    'Complete an unseen accepted change and defend the result, including AI assistance you verified.',
};
function Evidence({
  progress,
  change,
  heading,
}: {
  progress: GuidedProgress;
  change: (next: GuidedProgress) => void;
  heading: React.RefObject<HTMLHeadingElement | null>;
}) {
  const gaps = readinessGaps(progress);
  return (
    <section>
      <h1 ref={heading} tabIndex={-1}>
        What can you demonstrate independently?
      </h1>
      <p>
        Completed lessons record practice. Readiness needs a reviewer to inspect and reproduce your
        work on an unseen requirement.
      </p>
      <p className="course-feedback">
        {gaps.length
          ? `${gaps.length} skill areas still need verified evidence.`
          : 'Every skill has a recorded reviewer check. This is your evidence record, not an automatic job or mastery guarantee.'}
      </p>
      <details open>
        <summary>Your saved lesson projects</summary>
        <ol>
          {catalog.map((lesson) => {
            const record = progress.lessons[lesson.day];
            return (
              <li key={lesson.day}>
                <a href={lessonHref(lesson.day)}>
                  {lesson.day}. {lesson.title}
                </a>
                <p className="course-small">
                  {record?.completed ? 'Project evidence saved' : 'Project not yet complete'}
                  {record?.usedSolution.some(Boolean) ? ' · used a guided reference' : ''}
                </p>
                {record?.evidence && (
                  <details>
                    <summary>Read evidence</summary>
                    <p className="course-preserve">{record.evidence}</p>
                  </details>
                )}
              </li>
            );
          })}
        </ol>
      </details>
      {skillNames.map((skill) => {
        const record = progress.skills[skill] || {
          artifact: '',
          reviewer: '',
          note: '',
          verified: false,
        };
        const patch = (next: Partial<typeof record>) =>
          change({ ...progress, skills: { ...progress.skills, [skill]: { ...record, ...next } } });
        return (
          <details className="course-skill" key={skill}>
            <summary>
              {gaps.includes(skill) ? 'Needs evidence' : 'Reviewed'} · {skill}
            </summary>
            <p>{skillDescriptions[skill]}</p>
            <label htmlFor={`artifact-${skill}`}>
              Repository/commit, report, or reproducible artifact
            </label>
            <input
              id={`artifact-${skill}`}
              value={record.artifact}
              onChange={(event) => patch({ artifact: event.target.value, verified: false })}
            />
            <label htmlFor={`reviewer-${skill}`}>Reviewer who checked it</label>
            <input
              id={`reviewer-${skill}`}
              value={record.reviewer}
              onChange={(event) => patch({ reviewer: event.target.value, verified: false })}
            />
            <label htmlFor={`note-${skill}`}>
              What did they reproduce, and what still needs work?
            </label>
            <textarea
              id={`note-${skill}`}
              value={record.note}
              onChange={(event) => patch({ note: event.target.value, verified: false })}
            />
            <label className="course-checkbox">
              <input
                type="checkbox"
                checked={record.verified}
                onChange={(event) => patch({ verified: event.target.checked })}
              />
              The reviewer verified independent work in this area.
            </label>
          </details>
        );
      })}
      <p>
        For each gap, choose an unfamiliar project or failure to reproduce, get review, and return
        with stronger evidence. Team projects, customer feedback, and repeated independent changes
        continue beyond these 30 lessons.
      </p>
      <button
        className="course-link-button"
        onClick={() =>
          download('amina-evidence-review.json', {
            skills: progress.skills,
            gaps,
            lessonProjects: progress.lessons,
          })
        }
      >
        Download your evidence review
      </button>
    </section>
  );
}
