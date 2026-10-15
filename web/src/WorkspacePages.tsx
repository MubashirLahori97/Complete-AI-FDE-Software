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
      if (file.size > 1000000) throw new Error('Choose a backup smaller than 1 MB.');
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
            Lessons, notes, code drafts, scenarios, and portfolio evidence are saved in this
            browser. There is no account or cross-device sync. Clearing browser storage removes the
            saved copy.
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
        'The language behind the core lessons. Learn types, control flow, functions, and more.',
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
    <>
      <PageHeading
        eyebrow="GO TO THE SOURCE"
        title="Fewer tabs. Better understanding."
        description="Keep the official references close. Read what you need, then return to the build."
      />
      <SectionHeading title="Course guides" />
      <div className="guide-links">
        {[
          [
            'CURRICULUM.md',
            'The complete curriculum',
            'Objectives, builds, and exercises for each core lesson.',
          ],
          [
            'PROJECTS.md',
            'All 30 lesson projects',
            'Dedicated project guides, starter kits, milestones, and acceptance checks.',
          ],
          [
            'ROADMAP.md',
            'The longer roadmap',
            'Deepen your engineering skills after the first 30 lessons.',
          ],
          [
            'VISION.md',
            'Why this course exists',
            'The ideas behind a concepts-first learning approach.',
          ],
        ].map(([file, title, description]) => (
          <a href={`#/document/${file}`} className="guide-link" key={file}>
            <BookOpen size={22} />
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <ArrowRight size={17} />
          </a>
        ))}
      </div>
      <SectionHeading title="Official learning references" />
      <div className="resource-grid">
        {resources.map((resource) => (
          <a
            className="resource-card"
            href={resource.url}
            key={resource.title}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="eyebrow">{resource.label}</span>
            <h2>
              {resource.title}
              <ExternalLink size={16} />
            </h2>
            <p>{resource.description}</p>
            <span className="resource-domain">{new URL(resource.url).hostname}</span>
          </a>
        ))}
      </div>
      <div className="callout">
        <BookOpen size={22} />
        <div>
          <strong>Improve the course with us.</strong>
          <p>
            The curriculum and this app are open source. Share a clearer explanation, an issue, or a
            useful exercise.
          </p>
        </div>
        <a
          className="text-link"
          href={`${REPO}/blob/main/CONTRIBUTING.md`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contribute
          <ExternalLink size={16} />
        </a>
      </div>
      <p className="muted">
        Optional shop examples: <a href="#/sample/amina">Amina’s one-idea sample</a> and{' '}
        <a href="#/guided">guided shop examples</a>. Your main course remains the FDE Academy
        learning path.
      </p>
    </>
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
