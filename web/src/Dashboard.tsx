import { useState } from 'react';
import { ArrowRight, Check, Code2, Flag, Lightbulb, Sparkles, Trophy, Users } from 'lucide-react';
import { dailyProjects, lessons, tracks } from './data';
import { completionCount, resumeLesson, resumeHref, type Progress } from './state';
import { learningLevel } from './motivation';
import { Companion, JourneyMap, XPChip } from './MissionUI';
import QuickChallenge from './QuickChallenge';
import { ProgressBar, SectionHeading } from './ui';

export default function Dashboard({
  progress,
  update,
}: {
  progress: Progress;
  update: (next: Progress) => void;
}) {
  const [mood, setMood] = useState<'spark' | 'build'>('spark');
  const completed = completionCount(progress);
  const next = lessons[resumeLesson(progress) - 1];
  const started = Object.keys(progress.lessonActivities).length > 0;
  const level = learningLevel(progress);
  const wins = lessons.filter((lesson) => progress.conceptWins[lesson.day]);
  const chapter = lessons.filter((lesson) => lesson.track === next.track);
  const destination =
    completed === 30
      ? '#/phase/2'
      : mood === 'build'
        ? `#/lesson/${next.day}?tab=project`
        : resumeHref(progress);
  return (
    <div className="learning-home">
      <div className="welcome-heading">
        <div>
          <p className="eyebrow">FDE ACADEMY · YOUR BUILDER'S JOURNEY</p>
          <h1>
            {progress.name ? `Welcome back, ${progress.name}.` : 'A little progress, every day.'}
          </h1>
          <p className="muted">Pick a small challenge. Make something happen.</p>
        </div>
        <XPChip progress={progress} />
      </div>
      <section className="alive-hero">
        <div className="alive-hero-copy">
          <span className="alive-kicker">
            <span /> SMALL WINS. REAL SKILLS.
          </span>
          <h2>
            You don't need to
            <br />
            <em>know it all.</em>
            <br />
            Just start something.
          </h2>
          <p>
            Make a guess. Change a line. See what happens. Your first small win is closer than you
            think.
          </p>
          <div className="session-choice" role="group" aria-label="Choose your session">
            <button aria-pressed={mood === 'spark'} onClick={() => setMood('spark')}>
              <Sparkles size={16} />A quick spark
            </button>
            <button aria-pressed={mood === 'build'} onClick={() => setMood('build')}>
              <Code2 size={16} />
              Project time
            </button>
          </div>
          <a className="button alive-primary" href={destination}>
            {completed === 30
              ? 'Explore the next phase'
              : mood === 'build'
                ? "Open today's project"
                : started || completed
                  ? 'Continue learning'
                  : 'Start Lesson 1'}
            <ArrowRight size={19} />
          </a>
          <p className="hero-reassurance">
            {mood === 'spark'
              ? 'Start with one idea. Stop at a good point. Your place stays saved.'
              : 'Pick up your project. One working improvement is a good session.'}
          </p>
          <div className="hero-doodles" aria-hidden="true">
            <span>&lt;/&gt;</span>
            <span>aha!</span>
            <span>→</span>
          </div>
        </div>
        <QuickChallenge progress={progress} update={update} />
      </section>
      <div className="builder-strip">
        <div className="builder-identity">
          <Companion mood={wins.length ? 'win' : 'ready'} />
          <div>
            <small>YOUR LEARNING LEVEL</small>
            <strong>{level.name}</strong>
            <span>
              {level.next
                ? `${level.next - level.xp} XP to your next level`
                : 'Keep exploring. Every build teaches you something.'}
            </span>
          </div>
        </div>
        <div className="builder-progress">
          <div>
            <span>{level.xp} learning XP</span>
            <strong>Level {level.index}</strong>
          </div>
          <ProgressBar value={level.percent} label="Learning level progress" />
        </div>
        <div className="builder-stat">
          <Lightbulb size={20} />
          <strong>{wins.length}</strong>
          <span>discoveries</span>
        </div>
        <div className="builder-stat">
          <Flag size={20} />
          <strong>{completed}</strong>
          <span>projects recorded</span>
        </div>
      </div>
      <p className="xp-explanation">
        XP marks recorded practice: 15 for a discovery, 25 for a concept check, 80 for a completed
        project lesson. Levels describe practice, not a qualification.
      </p>
      <section className="next-action mission-invite" aria-label="Your next action">
        <div className="mission-invite-number" aria-hidden="true">
          {String(next.day).padStart(2, '0')}
        </div>
        <div>
          <p className="eyebrow">
            {completed === 30
              ? 'YOUR NEXT CHAPTER'
              : started
                ? 'YOUR NEXT SMALL WIN'
                : 'YOUR FIRST MISSION'}
          </p>
          <h2>{completed === 30 ? 'Keep building from real feedback' : next.title}</h2>
          <p>
            {completed === 30
              ? 'Use your completed projects to choose a deeper engineering challenge.'
              : dailyProjects[next.day - 1].title}
          </p>
          <span className="mission-tag">One idea → one experiment → your own project</span>
        </div>
        <a className="button alive-primary" href={resumeHref(progress)}>
          {completed === 30 ? 'Open Phase 2' : started ? 'Resume my lesson' : 'Begin with one idea'}
          <ArrowRight size={16} />
        </a>
      </section>
      <SectionHeading
        title="Your adventure, one mission at a time"
        subtitle="Every dot is something you can learn to build. Explore freely."
        href="#/curriculum"
        link="See all 30 missions"
      />
      <div className="chapter-ribbon">
        {tracks.map((track, i) => (
          <a
            href={`#/curriculum?track=${encodeURIComponent(track.name)}`}
            className={track.name === next.track ? 'active' : ''}
            key={track.name}
          >
            <span>{i + 1}</span>
            <strong>{track.name}</strong>
            <small>
              {
                lessons.filter((item) => item.track === track.name && progress.completed[item.day])
                  .length
              }
              /{lessons.filter((item) => item.track === track.name).length}
            </small>
          </a>
        ))}
      </div>
      <JourneyMap progress={progress} items={chapter} compact />
      <div className="discovery-and-field">
        <section className="discovery-shelf">
          <div className="shelf-heading">
            <Trophy size={22} />
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2>Little moments of “I get it.”</h2>
            </div>
          </div>
          <p>Each solved lesson challenge adds a discovery card here.</p>
          {wins.length ? (
            <div className="skill-collection">
              {wins.slice(-4).map((lesson) => (
                <a
                  className="skill-card"
                  href={`#/lesson/${lesson.day}?tab=learn`}
                  key={lesson.day}
                >
                  <span className="skill-seal">
                    <Lightbulb size={23} />
                  </span>
                  <small>DISCOVERY {String(lesson.day).padStart(2, '0')}</small>
                  <strong>{lesson.title}</strong>
                  <span>
                    <Check size={14} />
                    Challenge solved
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="empty-collection">
              <span className="empty-skill">
                <Lightbulb size={30} />
              </span>
              <div>
                <strong>Your first discovery belongs here.</strong>
                <p>Solve the small task in Lesson 1 to collect it.</p>
                <a className="text-link" href="#/lesson/1?tab=learn">
                  Find your first aha moment
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          )}
        </section>
        <a className="field-mission" href="#/scenarios">
          <span className="field-stamp">
            <Users size={25} />
          </span>
          <p className="eyebrow">STEP INTO THE REAL WORLD</p>
          <h2>
            A customer says,
            <br />
            “We need AI.”
          </h2>
          <p>
            What would you ask first? Try a conversation where your decisions change the feedback.
          </p>
          <span className="text-link">
            Take the customer challenge
            <ArrowRight size={17} />
          </span>
        </a>
      </div>
      <div className="home-completion">
        <span>{completed}/30 core lessons completed</span>
        <ProgressBar value={(completed / 30) * 100} label="Core course completion" />
        <a href="#/portfolio">
          See what you've built
          <ArrowRight size={14} />
        </a>
      </div>
      <p className="home-signoff">
        A few minutes counts. Coming back after a break counts too. Your progress stays yours.
      </p>
    </div>
  );
}
