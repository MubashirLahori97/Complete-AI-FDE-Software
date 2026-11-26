import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import {
  FULLSTACK_CS_MODULES,
  loadFullStackProgress,
  saveFullStackProgress,
  type FullStackTrackCategory,
} from './fullstack-cs-data';
import { HalfLifeBadge } from './ui';
import './studio-pages.css';

const TRACK_FILTERS: ('All' | FullStackTrackCategory)[] = [
  'All',
  'Frontend',
  'CS & Systems',
  'Architecture',
];

export default function FullStackCourse() {
  const [trackFilter, setTrackFilter] = useState<'All' | FullStackTrackCategory>('All');
  const [selectedId, setSelectedId] = useState(FULLSTACK_CS_MODULES[0].id);
  const [progress, setProgress] = useState(() => loadFullStackProgress());
  const [pickedOption, setPickedOption] = useState<number | null>(null);

  const visibleModules = useMemo(
    () =>
      trackFilter === 'All'
        ? FULLSTACK_CS_MODULES
        : FULLSTACK_CS_MODULES.filter((m) => m.track === trackFilter),
    [trackFilter],
  );

  const activeModule =
    visibleModules.find((m) => m.id === selectedId) ?? visibleModules[0] ?? FULLSTACK_CS_MODULES[0];

  const selectModule = (id: string) => {
    setSelectedId(id);
    setPickedOption(null);
  };

  const handleCheckOption = (optIndex: number) => {
    setPickedOption(optIndex);
    if (
      optIndex === activeModule.quickCheck.correctIndex &&
      !progress.completedModules.includes(activeModule.id)
    ) {
      const next = {
        ...progress,
        completedModules: [...progress.completedModules, activeModule.id],
      };
      setProgress(next);
      saveFullStackProgress(next);
    }
  };

  const currentIdx = visibleModules.findIndex((m) => m.id === activeModule.id);
  const nextModule = visibleModules[currentIdx + 1];

  return (
    <div className="studio-page">
      <div className="courses-hub-bar" role="navigation" aria-label="Course tracks">
        <strong style={{ fontSize: 14 }}>Course tracks</strong>
        <div className="courses-hub-links">
          <a className="courses-hub-link" href="#/curriculum">
            Build with AI (30 lessons)
          </a>
          <a className="courses-hub-link is-active" href="#/fullstack">
            Full-Stack &amp; CS Foundations
          </a>
          <a className="courses-hub-link" href="#/python">
            Python &amp; FastAPI
          </a>
          <a className="courses-hub-link" href="#/agentic-era">
            AI-Era Lab
          </a>
        </div>
      </div>

      <header className="studio-page-head">
        <div>
          <h1>Full-Stack &amp; CS Foundations</h1>
          <p>
            Plain-English guides to React 19, databases, networking, Git, distributed systems, and
            senior engineering judgment. Start with the analogy, answer one quick check, and open
            the code drawer whenever you want deeper detail.
          </p>
        </div>
        <div className="studio-progress-pill">
          <CheckCircle2 size={16} color="#15803d" />
          <span>
            {progress.completedModules.length} of {FULLSTACK_CS_MODULES.length} completed
          </span>
        </div>
      </header>

      <div className="studio-tabs" role="tablist" aria-label="Filter topics">
        {TRACK_FILTERS.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={trackFilter === cat}
            className={`studio-tab ${trackFilter === cat ? 'is-active' : ''}`}
            onClick={() => {
              setTrackFilter(cat);
              const first =
                cat === 'All'
                  ? FULLSTACK_CS_MODULES[0]
                  : FULLSTACK_CS_MODULES.find((m) => m.track === cat);
              if (first) selectModule(first.id);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="fs-layout">
        <nav className="fs-nav" aria-label="Full-Stack and CS modules">
          {visibleModules.map((mod) => {
            const done = progress.completedModules.includes(mod.id);
            return (
              <button
                key={mod.id}
                type="button"
                className={`fs-nav-item ${mod.id === activeModule.id ? 'is-active' : ''}`}
                onClick={() => selectModule(mod.id)}
              >
                <span>{mod.title}</span>
                {done && <CheckCircle2 size={15} className="fs-nav-done" aria-label="Completed" />}
              </button>
            );
          })}
        </nav>

        <article className="fs-article">
          <div className="fs-article-head">
            <div className="fs-article-meta">
              <span>{activeModule.track}</span>
              <span>{activeModule.readTime} read</span>
              <HalfLifeBadge tier={activeModule.halfLife} />
            </div>
            <h2>{activeModule.title}</h2>
            <p className="fs-article-summary">{activeModule.plainSummary}</p>
          </div>

          <section className="fs-analogy" aria-label="Everyday analogy">
            <strong>{activeModule.analogyTitle}</strong>
            <p>{activeModule.analogy}</p>
          </section>

          <section className="fs-points" aria-label="Key mental models">
            {activeModule.visualPoints.map((pt) => (
              <div className="fs-point-row" key={pt.label}>
                <strong>{pt.label}</strong>
                <span>{pt.detail}</span>
              </div>
            ))}
          </section>

          <section className="fs-check-box" aria-label="Quick understanding check">
            <h3>Quick check: {activeModule.quickCheck.question}</h3>
            <div className="fs-check-options">
              {activeModule.quickCheck.options.map((opt, idx) => {
                const isPicked = pickedOption === idx;
                const isCorrect = idx === activeModule.quickCheck.correctIndex;
                let cls = 'fs-check-opt';
                if (pickedOption !== null) {
                  if (isCorrect) cls += ' is-correct';
                  else if (isPicked) cls += ' is-wrong';
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    className={cls}
                    onClick={() => handleCheckOption(idx)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {pickedOption !== null && (
              <p className="fs-check-feedback" role="status">
                <strong>
                  {pickedOption === activeModule.quickCheck.correctIndex
                    ? 'Correct. '
                    : 'Good try. '}
                </strong>
                {activeModule.quickCheck.explanation}
              </p>
            )}
          </section>

          <details className="fs-deep-dive">
            <summary>
              <span>Technical details and code: {activeModule.deepDiveTitle}</span>
              <ChevronDown size={16} />
            </summary>
            <div className="fs-deep-dive-body">
              <ul>
                {activeModule.deepDiveNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              <pre className="fs-code-stage">
                <code>{activeModule.code}</code>
              </pre>
            </div>
          </details>

          <div className="practice-actions">
            {nextModule ? (
              <button
                type="button"
                className="button primary"
                onClick={() => selectModule(nextModule.id)}
              >
                Next topic: {nextModule.title}
              </button>
            ) : (
              <a className="button primary" href="#/practice">
                Test yourself with 50 practice questions
              </a>
            )}
            <a className="button light" href="#/practice">
              Open Practice Hub
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
