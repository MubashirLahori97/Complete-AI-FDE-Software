import { useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, Search } from 'lucide-react';
import { missions, stages, canRecordMission } from './missions';
import { labSpec } from './mission-labs';
import type { Progress } from './state';
import LivePage from './LivePage';
import JourneySketch from './JourneySketch';

type Props = { progress: Progress; update: (next: Progress) => void };
const chapterOutcomes = [
  'A useful website',
  'A workflow worth improving',
  'A connected service',
  'An evaluated AI helper',
  'A reliable release',
  'Your independent delivery',
];
const nextMission = (progress: Progress) =>
  missions.find(
    (m) =>
      m.id >= progress.lastMission &&
      (!progress.missions[m.id]?.recorded || progress.missions[m.id]?.verdict !== 'demonstrated'),
  ) ||
  missions.find(
    (m) =>
      !progress.missions[m.id]?.recorded || progress.missions[m.id]?.verdict !== 'demonstrated',
  ) ||
  missions[29];

export function AcademyHome({ progress, update, records }: Props & { records: number }) {
  const current = nextMission(progress);
  const started = Object.keys(progress.missions).length > 0;
  const [heading, setHeading] = useState('Welcome.');
  const [contact, setContact] = useState('');
  const changed = heading !== 'Welcome.';
  const carryExperiment = () => {
    if (!started)
      update({
        ...progress,
        missionLabs: {
          ...progress.missionLabs,
          1: { values: { heading }, note: progress.missionLabs[1]?.note || '' },
        },
      });
  };
  return (
    <div className="mission-core academy-journey academy-home">
      <div className="journey-masthead">
        <span>FDE ACADEMY</span>
        <span>30 interactive lessons · start from zero</span>
      </div>
      <section className="journey-hero">
        <div className="journey-hero-copy">
          <span className="journey-kicker">
            <i /> A software course for complete beginners
          </span>
          <h1>
            Learn to build
            <br />
            <em>software with AI.</em>
          </h1>
          <p>
            Learn how websites, servers and AI apps work. Try small examples that respond to your
            changes, then build your own projects with AI.
          </p>
          <a
            className="journey-primary"
            href={started ? `#/mission/${current.id}` : '#/mission/1?step=0'}
            onClick={carryExperiment}
          >
            {started ? `Continue lesson ${current.id}` : 'Start here: Lesson 1'}
            <ArrowRight size={18} />
          </a>
          <span className="journey-first-note">
            {started
              ? current.title
              : 'First: change a repair shop’s page heading and watch the page update. No setup needed.'}
          </span>
          {started && (
            <a className="journey-new-start" href="#/mission/1?step=0">
              New here? Start with Lesson 1 <ArrowRight size={14} />
            </a>
          )}
          <p className="journey-course-note">
            No coding experience needed. AI can help you write the code.
          </p>
        </div>
        <div className="journey-playground">
          <div className="journey-playground-heading">
            <span>OPTIONAL PREVIEW · YOU CAN START LESSON 1 DIRECTLY</span>
            <strong>Change the heading. Watch the page update.</strong>
          </div>
          <div className="journey-browser">
            <div className="journey-browser-chrome">
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>your-first-idea.local</span>
              <span>↗</span>
            </div>
            <LivePage
              heading={heading}
              title="Your first live page"
              onAction={(open) =>
                setContact(
                  open
                    ? 'The button revealed fictional contact details, here in your browser.'
                    : 'The same button hid the details again.',
                )
              }
            />
          </div>
          <div className="journey-sign-editor">
            <label htmlFor="home-page-heading">What should the visitor see?</label>
            <div>
              <input
                id="home-page-heading"
                value={heading}
                maxLength={70}
                onChange={(e) => {
                  setHeading(e.target.value);
                  setContact('');
                }}
                autoComplete="off"
              />
              <button
                onClick={() => {
                  setHeading(changed ? 'Welcome.' : 'Repairs near you.');
                  setContact('');
                }}
                aria-label={
                  changed ? 'See before: the original message' : 'Try example: a clearer message'
                }
              >
                <span>{changed ? 'See before' : 'Try example'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
            <p role="status" key={heading}>
              {contact ||
                (changed
                  ? 'Your words changed the real page above. That is your first experiment.'
                  : 'Type a new heading, or press the arrow to try an example.')}
            </p>
            <small>Local teaching preview · no live AI</small>
          </div>
        </div>
      </section>
      <div className="journey-under-hero">
        <span>
          <BookOpen size={15} /> Concepts first
        </span>
        <span>AI can do the implementation</span>
        <a href="#/curriculum">
          See all 30 lessons <ArrowDown size={14} />
        </a>
      </div>
      <section className="journey-principle">
        <div>
          <span className="journey-kicker">WHAT IS THIS COURSE FOR?</span>
          <h2>
            From your first page
            <br />
            <em>to solving real problems.</em>
          </h2>
        </div>
        <div>
          <p>
            FDE means Forward Deployed Engineer: someone who works with customers to solve real
            problems using software and AI. This course helps you practise those skills, starting
            with a simple website.
          </p>
          <ol>
            <li>
              <span>01</span>
              <p>
                <strong>Start with Lesson 1.</strong> Change the page heading. You can try it in
                your browser.
              </p>
            </li>
            <li>
              <span>02</span>
              <p>
                <strong>Follow the lesson.</strong> Try a change, learn why it works, then use AI to
                build your own project.
              </p>
            </li>
            <li>
              <span>03</span>
              <p>
                <strong>Keep going in order.</strong> Move from websites to servers, data, AI and
                delivering a working product. A lesson can take more than one session.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section className="journey-sampler">
        <div className="journey-section-heading">
          <div>
            <span className="journey-kicker">A LOOK AT LATER LESSONS</span>
            <h2>Explore these whenever you’re ready.</h2>
          </div>
          <span>Optional. Start with Lesson 1 if you’re new.</span>
        </div>
        <div className="journey-discoveries">
          {[
            {
              id: 3,
              stage: 1,
              question: 'Can it look the same, but stop working?',
              hint: 'Remove a button’s action. Try the button.',
            },
            {
              id: 13,
              stage: 3,
              question: 'Two requests. One last slot. Who gets it?',
              hint: 'Change the rule and inspect the reservations.',
            },
            {
              id: 20,
              stage: 4,
              question: 'Fewer alerts. More missed requests?',
              hint: 'Move a threshold. Watch the missed cases.',
            },
          ].map((item) => (
            <a
              key={item.id}
              href={`#/mission/${item.id}`}
              className={`journey-discovery chapter-${item.stage}`}
            >
              <JourneySketch stage={item.stage} />
              <span className="journey-kicker">MISSION {String(item.id).padStart(2, '0')}</span>
              <h3>{item.question}</h3>
              <p>{item.hint}</p>
              <span className="journey-discovery-action">
                Try the experiment <ArrowRight size={16} />
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="journey-chapters">
        <div className="journey-section-heading">
          <div>
            <span className="journey-kicker">THE BIGGER PICTURE</span>
            <h2>Watch your skills connect.</h2>
          </div>
          <a href="#/curriculum">
            The full learning path <ArrowRight size={16} />
          </a>
        </div>
        <div className="journey-chapter-index">
          {stages.map((stage, index) => (
            <a
              key={stage.title}
              href={`#/curriculum?stage=${index + 1}`}
              className={`journey-chapter chapter-${index + 1}`}
            >
              <span className="journey-chapter-number">0{index + 1}</span>
              <JourneySketch stage={index + 1} />
              <div>
                <span>
                  Missions {index * 5 + 1}–{index * 5 + 5}
                </span>
                <h3>{stage.title}</h3>
                <p>{chapterOutcomes[index]}</p>
              </div>
              <ArrowRight size={18} />
            </a>
          ))}
        </div>
      </section>
      <aside className="journey-record-note">
        <span>{records} / 30 practice records</span>
        <p>
          Your experiments, projects and explanations stay in your browser. A practice record is a
          place to collect evidence; understanding still needs review.
        </p>
        <a href="#/settings">
          Back up your work <ArrowRight size={15} />
        </a>
      </aside>
      <p className="journey-footnote">
        Manual coding is optional. AI is available throughout. Learn at your pace; a mission may
        take several sessions. <a href="#/resources">Optional workshops and Amina examples</a>.
      </p>
    </div>
  );
}

export function AcademyPath({
  progress,
  initialStage = '',
  initialQuery = '',
}: {
  progress: Progress;
  initialStage?: string;
  initialQuery?: string;
}) {
  const [stage, setStage] = useState(initialStage);
  const [query, setQuery] = useState(initialQuery);
  const current = nextMission(progress);
  const visible = missions.filter(
    (m) =>
      (!stage || String(m.stage) === stage) &&
      `${m.id} ${m.title} ${m.problem} ${m.foundation.join(' ')} ${m.concepts.map((c) => c.name).join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="mission-core academy-journey academy-path">
      <div className="journey-masthead">
        <span>YOUR LEARNING JOURNEY</span>
        <a href="#/">
          Back to the studio <ArrowRight size={13} />
        </a>
      </div>
      <header className="journey-path-intro">
        <div>
          <span className="journey-kicker">30 MISSIONS · SIX CONNECTED STAGES</span>
          <h1>
            Make. Understand.
            <br />
            <em>Deliver.</em>
          </h1>
          <p>
            Start with a small website. Connect it to a real workflow. Learn to direct AI, look
            after the system, and deliver your own project.
          </p>
        </div>
        <a className={`journey-resume chapter-${current.stage}`} href={`#/mission/${current.id}`}>
          <JourneySketch stage={current.stage} />
          <span>Your next mission · {String(current.id).padStart(2, '0')}</span>
          <h2>{current.title}</h2>
          <span className="journey-resume-action">
            {progress.missions[current.id]
              ? 'Pick up where you left off'
              : 'Start with one small experiment'}
            <ArrowRight size={18} />
          </span>
        </a>
      </header>
      <div className="journey-path-navigation" aria-label="Explore the six stages">
        {stages.map((s, index) => (
          <button
            key={s.title}
            aria-pressed={stage === String(index + 1)}
            onClick={() => setStage(stage === String(index + 1) ? '' : String(index + 1))}
          >
            <span>0{index + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="mission-path-controls journey-path-controls">
        <label>
          <Search size={17} />
          <span className="sr-only">Search missions</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find an idea or a mission"
          />
        </label>
        <label>
          Stage
          <select
            aria-label="Filter mission stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="">All six stages</option>
            {stages.map((s, i) => (
              <option key={s.title} value={i + 1}>
                {i + 1}. {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="journey-results" role="status">
        {visible.length} missions · Explore freely. Your place is saved as you go.
      </p>
      <div className="journey-path-timeline">
        {stages.map((s, index) => {
          const group = visible.filter((m) => m.stage === index + 1);
          if (!group.length) return null;
          const recorded = group.filter(
            (m) =>
              progress.missions[m.id]?.recorded && canRecordMission(m, progress.missions[m.id]),
          ).length;
          return (
            <section
              key={s.title}
              className={`mission-path-stage journey-path-stage chapter-${index + 1}`}
            >
              <header>
                <div className="journey-path-art">
                  <JourneySketch stage={index + 1} />
                </div>
                <div>
                  <span className="journey-kicker">
                    CHAPTER 0{index + 1} · {chapterOutcomes[index]}
                  </span>
                  <h2>{s.title}</h2>
                  <p>{s.description}</p>
                </div>
                <span className="journey-chapter-records">
                  {recorded} / {group.length}
                  <small>practice records</small>
                </span>
              </header>
              <div className="mission-path-list journey-path-list">
                {group.map((m) => {
                  const record = progress.missions[m.id];
                  const saved = record?.recorded && canRecordMission(m, record);
                  const isNext = m.id === current.id;
                  const lab = labSpec(m.id);
                  return (
                    <a
                      className={`mission-path-row journey-mission-row ${isNext ? 'is-next' : ''}`}
                      href={`#/mission/${m.id}`}
                      key={m.id}
                    >
                      <span className="journey-mission-number">
                        {saved ? <Check size={19} /> : String(m.id).padStart(2, '0')}
                      </span>
                      <div>
                        <h3>{m.title}</h3>
                        <p>{lab.task}</p>
                        <span className="journey-project-label">
                          Your project <span>↳</span> {m.project.title}
                        </span>
                      </div>
                      <small>
                        {saved
                          ? 'Practice recorded'
                          : record
                            ? 'Continue exploring'
                            : isNext
                              ? 'Start here'
                              : 'Try it'}
                        <ArrowRight size={16} />
                      </small>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      {!visible.length && (
        <div className="journey-no-results">
          <Search size={25} />
          <h2>No missions match that yet.</h2>
          <p>Try a shorter phrase, or explore all six stages.</p>
          <button
            onClick={() => {
              setQuery('');
              setStage('');
            }}
          >
            Clear filters <ArrowRight size={15} />
          </button>
        </div>
      )}
      <p className="journey-footnote">
        All missions stay open. Practice records and review reports are learner-owned; they are not
        certified qualifications. <a href="#/workshops">Original coding workshops</a> and{' '}
        <a href="#/guided">Amina’s guided examples</a> remain available.
      </p>
    </div>
  );
}
