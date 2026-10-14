import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Flame,
  Layers,
  Sparkles,
  Target,
  Terminal,
  Users,
} from 'lucide-react';
import { lessons, tracks } from './data';
import { completionCount, nextLesson, streak, type Progress } from './state';
import { ProgressBar, SectionHeading } from './ui';

const trackIcons = [Terminal, Code2, Sparkles, Users];
function JourneyArt() {
  return (
    <svg className="journey-art" viewBox="0 0 400 260" fill="none" aria-hidden="true">
      <defs>
        <pattern id="hero-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" stroke="#8eac94" strokeOpacity=".14" />
        </pattern>
      </defs>
      <rect width="400" height="260" fill="url(#hero-grid)" />
      <path
        d="M32 215H86V174H159V133H232V92H305V51H366"
        stroke="#d9ebb3"
        strokeOpacity=".8"
        strokeWidth="2"
      />
      <path d="m86 174 20-12h73v-41h73V80h73V39h40" stroke="#a8c0ab" strokeOpacity=".4" />
      <path
        d="m86 215 20-12v-41m53 12 20-12m53-29 20-12m53-29 20-12"
        stroke="#a8c0ab"
        strokeOpacity=".4"
      />
      <circle cx="86" cy="174" r="5" fill="#d9ebb3" />
      <circle cx="159" cy="133" r="5" fill="#d9ebb3" />
      <circle cx="232" cy="92" r="5" fill="#d9ebb3" />
      <circle cx="305" cy="51" r="6" fill="#d9ebb3" />
      <text x="35" y="151" fill="#b3cbb7" fontSize="10" fontFamily="DM Mono, monospace">
        01 / UNDERSTAND
      </text>
      <text x="110" y="110" fill="#b3cbb7" fontSize="10" fontFamily="DM Mono, monospace">
        02 / BUILD
      </text>
      <text x="183" y="69" fill="#b3cbb7" fontSize="10" fontFamily="DM Mono, monospace">
        03 / EVALUATE
      </text>
      <text x="270" y="29" fill="#e0eebc" fontSize="10" fontFamily="DM Mono, monospace">
        04 / DELIVER
      </text>
      <rect
        x="209"
        y="176"
        width="158"
        height="48"
        rx="8"
        fill="#315c4b"
        stroke="#6e9175"
        strokeOpacity=".55"
      />
      <text x="227" y="197" fill="#e1efba" fontSize="11" fontFamily="DM Mono, monospace">
        skill = practice()
      </text>
      <text x="227" y="213" fill="#b4c9ba" fontSize="9" fontFamily="DM Mono, monospace">
        // one step at a time
      </text>
      <path d="M293 163v-38h30" stroke="#8eac94" strokeDasharray="3 4" />
      <circle cx="326" cy="125" r="3" stroke="#b3cbb7" />
    </svg>
  );
}

export default function Dashboard({ progress }: { progress: Progress }) {
  const completed = completionCount(progress);
  const next = lessons[nextLesson(progress) - 1];
  const currentStreak = streak(progress);
  const passed = progress.quizPassed.length;
  return (
    <>
      <section className="sample-invite">
        <div>
          <h2>Try one idea at Amina’s shop.</h2>
          <p>Press one button, watch the message count change, and learn one idea.</p>
        </div>
        <a className="button primary" href="#/sample/amina">
          Try the sample lesson
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      </section>
      <div className="welcome-heading">
        <div>
          <p className="eyebrow">YOUR LEARNING WORKSPACE</p>
          <h1>
            {progress.name ? `Welcome back, ${progress.name}.` : 'A little progress, every day.'}
          </h1>
          <p className="muted">
            Great engineers are built through practice. Here’s your next step.
          </p>
        </div>
        <a className="plan-pill" href="#/settings">
          <span className="online-dot" />
          {progress.minutes >= 60
            ? `${progress.minutes / 60} ${progress.minutes === 60 ? 'hour' : 'hours'}`
            : `${progress.minutes} min`}{' '}
          / day
          <ArrowRight size={13} />
        </a>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">FROM FIRST PROGRAM TO REAL-WORLD IMPACT</p>
          <h2>
            Build the skills.
            <br />
            <span>Own the outcome.</span>
          </h2>
          <p>
            Learn to build, evaluate, and ship AI software.
            <br className="desktop-break" /> A practical path to Forward Deployed Engineering.
          </p>
          <div className="hero-actions">
            <a className="button lime" href={`#/lesson/${next.day}`}>
              {completed ? 'Continue learning' : 'Start your journey'}
              <ArrowRight size={17} />
            </a>
            <a className="hero-link" href="#/curriculum">
              Explore the path
              <ArrowUpIcon />
            </a>
          </div>
          <p className="hero-footnote">
            30 lessons <span>·</span> 30 projects <span>·</span> Your own pace
          </p>
        </div>
        <JourneyArt />
      </section>
      <div className="metrics">
        <div className="metric">
          <div className="metric-icon sage">
            <BookOpen size={21} />
          </div>
          <div>
            <p className="metric-label">Lessons completed</p>
            <p className="metric-value">
              {completed}
              <span> / 30</span>
            </p>
          </div>
          <div className="metric-end">
            <span>{Math.round((completed / 30) * 100)}%</span>
            <ProgressBar value={(completed / 30) * 100} label="Core course completion" />
          </div>
        </div>
        <div className="metric">
          <div className="metric-icon lavender">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <p className="metric-label">Concept checks passed</p>
            <p className="metric-value">
              {passed}
              <span> / 30</span>
            </p>
          </div>
          <span className="metric-caption">
            Understand it.
            <br />
            Then prove it.
          </span>
        </div>
        <div className="metric">
          <div className="metric-icon peach">
            <Flame size={21} />
          </div>
          <div>
            <p className="metric-label">Learning streak</p>
            <p className="metric-value">
              {currentStreak}
              <span> {currentStreak === 1 ? 'day' : 'days'}</span>
            </p>
          </div>
          <span className="metric-caption">
            {currentStreak ? 'Keep showing up.' : 'Your first step\nstarts the streak.'}
          </span>
        </div>
      </div>
      <SectionHeading
        title="Your learning path"
        subtitle="Four chapters. One connected journey."
        href="#/curriculum"
        link="View all lessons"
      />
      <div className="track-grid">
        {tracks.map((track, index) => {
          const Icon = trackIcons[index];
          const group = lessons.filter((lesson) => lesson.track === track.name);
          const done = group.filter((lesson) => progress.completed[lesson.day]).length;
          return (
            <a
              className={`track-card track-${index}`}
              href={`#/curriculum?track=${encodeURIComponent(track.name)}`}
              key={track.name}
            >
              <div className="track-card-top">
                <span className="track-icon">
                  <Icon size={20} />
                </span>
                <span className="mono muted">{track.range}</span>
              </div>
              <h3>{track.name}</h3>
              <p>{track.description}</p>
              <div className="track-card-bottom">
                <span>
                  {done} of {group.length} lessons
                </span>
                <ArrowRight size={16} />
              </div>
              <ProgressBar value={(done / group.length) * 100} label={`${track.name} completion`} />
            </a>
          );
        })}
      </div>
      <div className="home-bottom">
        <section>
          <SectionHeading title={completed === 30 ? 'Keep building' : 'Pick up here'} />
          <a className="next-card" href={completed === 30 ? '#/phase/2' : `#/lesson/${next.day}`}>
            <div className="next-card-main">
              <span className="badge">
                {completed === 30
                  ? 'BEYOND THE CORE'
                  : `LESSON ${String(next.day).padStart(2, '0')}`}{' '}
                <span className="dot-divider">·</span> {completed === 30 ? 'Phase 2' : next.track}
              </span>
              <h3>{completed === 30 ? 'Build like an engineer' : next.title}</h3>
              <p className="muted">
                {completed === 30
                  ? 'Deepen your skills with the next phase of the roadmap.'
                  : next.summary}
              </p>
              <div className="next-meta">
                <span>
                  <BookOpen size={14} />
                  Learn
                </span>
                <span>
                  <Code2 size={14} />
                  Build
                </span>
                <span>
                  <CheckCircle2 size={14} />
                  Check
                </span>
              </div>
              <span className="text-link">
                {completed === 30 ? 'Open the next phase' : 'Open lesson'}
                <ArrowRight size={16} />
              </span>
            </div>
            <div className="next-illustration" aria-hidden="true">
              <div className="code-symbol">&lt;/&gt;</div>
              <div className="code-lines">
                <i />
                <i />
                <i />
              </div>
              <span>ideas → working software</span>
            </div>
          </a>
        </section>
        <section>
          <SectionHeading title="Beyond the code" />
          <a className="field-card" href="#/scenarios">
            <div className="field-label">
              <Users size={17} />
              FIELD SCENARIOS
            </div>
            <h3>
              What would
              <br />
              you do next?
            </h3>
            <p>Meet a customer. Ask better questions. Make a decision with real tradeoffs.</p>
            <span className="text-link">
              Try a scenario
              <ArrowRight size={16} />
            </span>
            <div className="field-orbit" aria-hidden="true">
              <Target size={46} />
            </div>
          </a>
        </section>
      </div>
      <div className="footer-note">
        <Layers size={15} />
        <p>
          Follow the learning loop: understand → specify → build → evaluate → reflect. Progress
          shows practice, not certification.
        </p>
      </div>
    </>
  );
}
function ArrowUpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 15 15 5M5 5h10v10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
