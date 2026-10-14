import { useState } from 'react';
import { ArrowRight, Check, Search, BookOpen, CheckCircle2 } from 'lucide-react';
import { lessons, phases, tracks, type Track } from './data';
import type { Progress } from './state';
import { PageHeading, ProgressBar } from './ui';

export default function Curriculum({
  progress,
  initialTrack = '',
  initialQuery = '',
}: {
  progress: Progress;
  initialTrack?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [track, setTrack] = useState(initialTrack);
  const [filter, setFilter] = useState('all');
  const [mode, setMode] = useState('core');
  const visible = lessons.filter(
    (lesson) =>
      (!track || lesson.track === track) &&
      `${lesson.title} ${lesson.summary} ${lesson.track} ${lesson.day}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === 'all' ||
        (filter === 'completed'
          ? !!progress.completed[lesson.day]
          : !progress.completed[lesson.day])),
  );
  return (
    <>
      <PageHeading
        eyebrow="YOUR CURRICULUM"
        title="A path you can put into practice."
        description="Start at the beginning or explore a topic. Every lesson connects understanding to a working build."
      />
      <div className="tabs" role="tablist" aria-label="Learning path">
        <button role="tab" aria-selected={mode === 'core'} onClick={() => setMode('core')}>
          Core journey <span className="count-badge">30 lessons</span>
        </button>
        <button role="tab" aria-selected={mode === 'roadmap'} onClick={() => setMode('roadmap')}>
          Beyond the core <span className="count-badge">3 phases</span>
        </button>
      </div>
      {mode === 'core' ? (
        <>
          <div className="curriculum-controls">
            <div className="search-field">
              <Search size={17} />
              <label className="sr-only" htmlFor="lesson-search">
                Search lessons
              </label>
              <input
                id="lesson-search"
                placeholder="Search topics, skills, or lesson number…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <label className="status-select">
              Show{' '}
              <select
                aria-label="Filter lesson status"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="all">All lessons</option>
                <option value="unfinished">Not completed</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
          <div className="filter-chips" aria-label="Filter by track">
            <button
              className={!track ? 'active' : ''}
              onClick={() => setTrack('')}
              aria-pressed={!track}
            >
              All tracks
            </button>
            {tracks.map((item) => (
              <button
                key={item.name}
                className={track === item.name ? 'active' : ''}
                aria-pressed={track === item.name}
                onClick={() => setTrack(item.name)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <p className="result-count" role="status">
            {visible.length} {visible.length === 1 ? 'lesson' : 'lessons'}
            {query ? ` matching “${query}”` : ''}
          </p>
          {tracks
            .filter((item) => !track || track === item.name)
            .map((item, index) => {
              const group = visible.filter((lesson) => lesson.track === item.name);
              if (!group.length) return null;
              const all = lessons.filter((lesson) => lesson.track === item.name);
              const done = all.filter((lesson) => progress.completed[lesson.day]).length;
              return (
                <section className="curriculum-group" key={item.name}>
                  <div className="curriculum-group-heading">
                    <div>
                      <span className="eyebrow">
                        CHAPTER {tracks.findIndex((t) => t.name === item.name) + 1}{' '}
                        <span className="dot-divider">/</span> {item.skill.toUpperCase()}
                      </span>
                      <h2>{item.name}</h2>
                    </div>
                    <span className="muted small-text">
                      {done} / {all.length} complete
                    </span>
                  </div>
                  <div className="lesson-list">
                    {group.map((lesson) => (
                      <a className="lesson-row" href={`#/lesson/${lesson.day}`} key={lesson.day}>
                        <span
                          className={`day-number ${progress.completed[lesson.day] ? 'completed' : `chapter-${index}`}`}
                        >
                          {progress.completed[lesson.day] ? (
                            <Check size={20} />
                          ) : (
                            String(lesson.day).padStart(2, '0')
                          )}
                        </span>
                        <div className="lesson-row-copy">
                          <h3>{lesson.title}</h3>
                          <p>{lesson.summary}</p>
                        </div>
                        <span className="lesson-row-status">
                          {progress.completed[lesson.day] ? (
                            <>
                              <CheckCircle2 size={15} />
                              Complete
                            </>
                          ) : progress.quizPassed.includes(lesson.day) ? (
                            <>
                              <CheckCircle2 size={15} />
                              Check passed
                            </>
                          ) : (
                            <>
                              <BookOpen size={15} />
                              Learn + build
                            </>
                          )}
                        </span>
                        <ArrowRight size={18} />
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}
          {!visible.length && (
            <div className="empty-state">
              <Search size={28} />
              <h2>No lessons found</h2>
              <p>Try a different search or clear your filters.</p>
              <button
                className="button primary"
                onClick={() => {
                  setQuery('');
                  setTrack('');
                  setFilter('all');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="roadmap-intro">
            The original roadmap labels these as days 31–90. Treat them as suggested stages: move on
            when you can demonstrate the skills, and adapt the pace to your available time.
          </p>
          <div className="phase-grid">
            {phases.map((phase) => {
              const done = progress.phaseTasks[phase.id]?.filter(Boolean).length || 0;
              return (
                <a className="phase-card" href={`#/phase/${phase.id}`} key={phase.id}>
                  <span className="eyebrow">
                    PHASE {phase.id} <span className="dot-divider">·</span>{' '}
                    {phase.range.toUpperCase()}
                  </span>
                  <h2>{phase.title}</h2>
                  <p>{phase.description}</p>
                  <ul>
                    {phase.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                  <ProgressBar
                    value={(done / phase.tasks.length) * 100}
                    label={`${phase.title} milestones`}
                  />
                  <div className="track-card-bottom">
                    <span>
                      {done} / {phase.tasks.length} milestones recorded
                    </span>
                    <ArrowRight size={17} />
                  </div>
                </a>
              );
            })}
          </div>
          <div className="callout">
            <BookOpen size={22} />
            <div>
              <strong>Depth grows through real work.</strong>
              <p>
                The roadmap is a practice plan. Job readiness depends on your demonstrated skills,
                experience, and the role.
              </p>
            </div>
            <a href="#/document/ROADMAP.md" className="text-link">
              Read the full roadmap
              <ArrowRight size={16} />
            </a>
          </div>
        </>
      )}
    </>
  );
}
