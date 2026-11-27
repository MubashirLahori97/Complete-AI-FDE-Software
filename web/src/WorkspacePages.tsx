import { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  ExternalLink,
  FileJson,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { phases, REPO } from './data';
import { downloadFile, emptyProgress, parseProgress, studyPlan, type Progress } from './state';
import { Checkbox, PageHeading, SectionHeading } from './ui';
import Markdown from './Markdown';

export function Settings({
  progress,
  update,
}: {
  progress: Progress;
  update: (next: Progress) => void;
}) {
  const [message, setMessage] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const importFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 5000000) throw new Error('Choose a backup smaller than 5 MB.');
      const parsed = parseProgress(JSON.parse(await file.text()));
      if (
        !window.confirm(
          'Replace your browser progress with this backup? Export your current progress first if you need to keep it.',
        )
      )
        return;
      update(parsed);
      setMessage('Backup imported. Your workspace has been restored.');
    } catch (error) {
      setMessage(
        error instanceof SyntaxError
          ? 'That file is not valid JSON. Choose an FDE Academy backup.'
          : error instanceof Error
            ? error.message
            : 'Could not import that backup.',
      );
    } finally {
      if (input.current) input.current.value = '';
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="MAKE IT YOURS"
        title="Your learning workspace"
        description="Choose a pace you can sustain, and keep a backup of your work."
      />
      <div className="settings-grid">
        <section className="settings-card">
          <h2>Your study plan</h2>
          <label className="form-label" htmlFor="learner-name">
            What should we call you? <span className="muted">(optional)</span>
          </label>
          <input
            id="learner-name"
            className="form-input"
            maxLength={50}
            placeholder="Your first name"
            value={progress.name}
            onChange={(event) => update({ ...progress, name: event.target.value })}
          />
          <label className="form-label" htmlFor="study-minutes">
            Daily study time
          </label>
          <select
            id="study-minutes"
            className="form-input"
            value={progress.minutes}
            onChange={(event) => update({ ...progress, minutes: Number(event.target.value) })}
          >
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
          <div className="study-breakdown">
            {studyPlan(progress.minutes).map((step) => (
              <div key={step.label}>
                <span>{step.minutes} min</span>
                {step.label}
              </div>
            ))}
          </div>
          <p className="field-help">
            The daily time is a planning aid. Take more time when a concept or project needs it.
          </p>
        </section>
        <section className="settings-card">
          <h2>Your progress, your copy.</h2>
          <p className="muted">
            Core mission explanations, review records, original lessons, code drafts, scenarios, and
            portfolio evidence are saved in this browser. There is no account or cross-device sync.
            Clearing browser storage removes the saved copy.
          </p>
          <div className="backup-actions">
            <button
              className="button primary"
              onClick={() => {
                downloadFile('fde-academy-backup.json', JSON.stringify(progress, null, 2));
                setMessage('Backup downloaded. Keep it somewhere you can find again.');
              }}
            >
              <Download size={16} />
              Export backup
            </button>
            <button className="button light" onClick={() => input.current?.click()}>
              <Upload size={16} />
              Import backup
            </button>
            <input
              ref={input}
              className="sr-only"
              type="file"
              accept="application/json,.json"
              aria-label="Import progress backup"
              onChange={(event) => void importFile(event.target.files?.[0])}
            />
          </div>
          <div className="backup-note">
            <FileJson size={20} />
            <p>
              Transfer your workspace to another browser by exporting here and importing there. Your
              data is not sent to a server.
            </p>
          </div>
          {message && (
            <p className="settings-feedback" role="status">
              {message}
            </p>
          )}
        </section>
      </div>
      <section className="reset-card">
        <div>
          <h2>Start fresh</h2>
          <p className="muted">
            Reset your saved learning data in this browser. Export a backup first to keep a copy.
          </p>
        </div>
        <button
          className="button danger"
          onClick={() => {
            if (
              window.confirm(
                'Reset all your local progress, notes, code drafts, and portfolio evidence?',
              )
            ) {
              update(emptyProgress());
              setMessage('Your local workspace has been reset.');
            }
          }}
        >
          <RotateCcw size={16} />
          Reset local progress
        </button>
      </section>
    </>
  );
}

export function Resources() {
  const resources = [
    {
      title: 'Python tutorial',
      description:
        'Optional implementation depth: explore types, control flow and functions in Python.',
      url: 'https://docs.python.org/3/tutorial/',
      label: 'PYTHON',
    },
    {
      title: 'MDN web development',
      description: 'Learn HTML, CSS, JavaScript, accessibility, and how the web works.',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development',
      label: 'FRONTEND',
    },
    {
      title: 'Pro Git',
      description:
        'A free guide to version control, branching, collaboration, and recovering changes.',
      url: 'https://git-scm.com/book/en/v2',
      label: 'COLLABORATION',
    },
    {
      title: 'FastAPI tutorial',
      description: 'Build Python APIs with clear request contracts and validation.',
      url: 'https://fastapi.tiangolo.com/tutorial/',
      label: 'BACKEND',
    },
    {
      title: 'PostgreSQL tutorial',
      description:
        'Learn relational data, SQL, joins, and transactions from the official documentation.',
      url: 'https://www.postgresql.org/docs/current/tutorial.html',
      label: 'DATABASES',
    },
    {
      title: 'Building effective agents',
      description: 'Understand workflows, agents, tool use, and the value of simple designs.',
      url: 'https://www.anthropic.com/engineering/building-effective-agents',
      label: 'AI ENGINEERING',
    },
  ];
  return (
    <div className="studio-page">
      <header className="studio-page-head">
        <div>
          <h1>Guides &amp; Resources</h1>
          <p>
            Core architecture handbooks, official language documentation, and archived
            implementation workshops—all in one place.
          </p>
        </div>
      </header>

      <section className="resources-group" aria-label="Core engineering guides">
        <h2>Core engineering guides</h2>
        <div className="resources-grid">
          {[
            [
              'ROADMAP.md',
              'Core 30-lesson roadmap',
              'The concept foundation, six stages, and thirty guided lessons.',
            ],
            [
              'AI-NATIVE-SDLC.md',
              'AI-Era software workflow',
              'Spec-Driven Development, Context Engineering, and verification harnesses.',
            ],
            [
              'PRODUCTION-BLUEPRINT.md',
              'Production AI system blueprint',
              '8 hands-on sprints with AI prompts, mental models, and senior trade-offs.',
            ],
            [
              'PYTHON-MASTERY-GUIDE.md',
              'Python mastery handbook',
              'Execution internals, OOP protocols, async systems, and 68 interview Q&As.',
            ],
            [
              'RESEARCH-2030.md',
              '2030 engineering research',
              'Evidence and conditional scenarios behind preparing for AI-era engineering.',
            ],
            [
              'VISION.md',
              'Why this academy exists',
              'The philosophy behind concepts-first learning when AI writes code.',
            ],
          ].map(([file, title, description]) => (
            <a href={`#/document/${file}`} className="resource-tile" key={file}>
              <div className="resource-tile-head">
                <BookOpen size={17} />
                <strong>{title}</strong>
              </div>
              <p>{description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="resources-group" aria-label="Official external documentation">
        <h2>Official documentation</h2>
        <div className="resources-grid">
          {resources.map((resource) => (
            <a
              className="resource-tile"
              href={resource.url}
              key={resource.title}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="resource-tile-head">
                <strong>{resource.title}</strong>
                <ExternalLink size={15} />
              </div>
              <p>{resource.description}</p>
              <span className="resource-domain">{new URL(resource.url).hostname}</span>
            </a>
          ))}
        </div>
      </section>

      <details className="fs-deep-dive">
        <summary>
          <span>Archived implementation workshops (legacy 30-day coding track)</span>
        </summary>
        <div className="fs-deep-dive-body" style={{ paddingTop: 14 }}>
          <div className="resources-grid">
            <a href="#/workshops" className="resource-tile">
              <strong>Legacy workshop dashboard</strong>
              <p>Original 30-day manual coding workshop overview.</p>
            </a>
            <a href="#/workshop-path" className="resource-tile">
              <strong>Legacy 30-day lesson list</strong>
              <p>All 30 original coding lessons with starter kits.</p>
            </a>
            <a href="#/lab" className="resource-tile">
              <strong>Classic Python playground</strong>
              <p>Standalone scratchpad for running quick Python snippets.</p>
            </a>
            <a href="#/document/CURRICULUM.md" className="resource-tile">
              <strong>Original curriculum document</strong>
              <p>Complete syllabus for the optional manual coding workshops.</p>
            </a>
          </div>
        </div>
      </details>

      <div className="resources-footer-banner">
        <div>
          <strong>Improve the course with us</strong>
          <p>
            FDE Academy is open source. Share a clearer explanation, report an issue, or suggest a
            better exercise.
          </p>
        </div>
        <a
          className="button light"
          href={`${REPO}/blob/main/CONTRIBUTING.md`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contribute on GitHub
        </a>
      </div>
    </div>
  );
}

export function Phase({
  id,
  progress,
  update,
}: {
  id: number;
  progress: Progress;
  update: (next: Progress) => void;
}) {
  const phase = phases.find((item) => item.id === id)!;
  return (
    <>
      <a className="back-link" href="#/curriculum">
        <ArrowLeft size={15} />
        Learning path
      </a>
      <PageHeading
        eyebrow={`PHASE ${id} · ${phase.range}`}
        title={phase.title}
        description={phase.description}
      />
      <section className="lesson-start">
        <p className="eyebrow">YOUR FIRST ACTION</p>
        <p>
          {id === 2
            ? 'Choose one core project you have already built. Sketch its data records and how they relate before changing its implementation.'
            : id === 3
              ? 'Choose one working project. Write the main task a user must finish and sketch the smallest screen that supports it.'
              : 'Choose one fictional or authorized customer workflow. Describe the problem and current steps before drafting a proposal.'}
        </p>
        <p className="field-help">
          Use the guide below for the full requirements. Work toward one milestone at a time; a
          phase takes several projects and study sessions.
        </p>
      </section>
      <div className="phase-milestones">
        <h2>Record your milestones</h2>
        <p className="muted">
          Use the full guide below for the build requirements. These checks record your own
          assessment.
        </p>
        {phase.tasks.map((task, index) => (
          <Checkbox
            key={task}
            checked={progress.phaseTasks[id]?.[index] || false}
            onChange={(value) => {
              const tasks = [...(progress.phaseTasks[id] || [])];
              tasks[index] = value;
              update({ ...progress, phaseTasks: { ...progress.phaseTasks, [id]: tasks } });
            }}
          >
            {task}
          </Checkbox>
        ))}
      </div>
      <div className="reading-card">
        <div className="source-note">
          Original roadmap notes · Day numbers are suggested stages. Adjust the pace to your
          demonstrated skills.
        </div>
        <Markdown folder={phase.folder} />
      </div>
    </>
  );
}
export function Document({ filename }: { filename: string }) {
  const titles: Record<string, string> = {
    'ROADMAP.md': 'The full roadmap',
    'CURRICULUM.md': 'The complete curriculum',
    'VISION.md': 'The course vision',
    'PROJECTS.md': 'The 30 lesson projects',
    'MISSION-COURSE.md': 'The concepts + AI core course',
    'MISSION-MAP.md': 'The mission and reuse map',
    'RESEARCH-2030.md': 'Research and future scenarios',
    'AI-NATIVE-SDLC.md': 'The AI-Native FDE SDLC',
    'STEP-BY-STEP-GUIDE.md': 'Step-by-step AI-era guide',
    'PRODUCTION-BLUEPRINT.md': 'Production-grade AI system blueprint',
    'PYTHON-MASTERY-GUIDE.md': 'Complete Python mastery firmware (Beginner to Advanced)',
    'AGENTIC-ERA-2030.md': 'Engineering for the 2028–2030 Agentic Era',
  };
  return (
    <>
      <a className="back-link" href="#/resources">
        <ArrowLeft size={15} />
        Resources
      </a>
      <PageHeading
        eyebrow="COURSE SOURCE"
        title={titles[filename]}
        description="The original repository guide. Treat timelines as a practice plan; professional outcomes depend on demonstrated skills and experience."
      />
      <div className="reading-card">
        <Markdown filename={filename} />
      </div>
    </>
  );
}
