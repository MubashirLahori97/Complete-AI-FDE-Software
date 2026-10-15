import { ArrowRight, Download, FolderGit2 } from 'lucide-react';
import { dailyProjects } from './data';
import type { Progress } from './state';
import { Checkbox, ProgressBar } from './ui';
import Markdown from './Markdown';
import { lessonTeaching } from './lesson-content';

export default function LessonProject({
  day,
  folder,
  progress,
  update,
  onRecord,
}: {
  day: number;
  folder: string;
  progress: Progress;
  update: (next: Progress) => void;
  onRecord: () => void;
}) {
  const project = dailyProjects[day - 1];
  const { guide, teaching } = lessonTeaching(day);
  const checks = progress.lessonProjectChecks[day] || [];
  const done = checks.filter(Boolean).length;
  return (
    <>
      <section className="lesson-project-intro">
        <div className="lesson-project-heading">
          <div>
            <p className="eyebrow">YOUR LESSON {day} PROJECT</p>
            <h2>{project.title}</h2>
          </div>
          <span className="project-symbol">
            <FolderGit2 size={23} />
          </span>
        </div>
        <p>{project.brief}</p>
        <div className="project-first-step">
          <p className="eyebrow">DO THIS FIRST</p>
          <p>{guide.firstStep}</p>
          <p className="field-help">
            The download contains a worked example. Your project is to extend it into the result
            described above. Follow one milestone at a time.
          </p>
        </div>
        <div className="lesson-project-actions">
          <a
            className="button primary"
            href={`${import.meta.env.BASE_URL}projects/${project.starter}`}
            download
          >
            <Download size={16} />
            Download starter kit
          </a>
          <span className="field-help">
            Full lesson + project brief + worked example + expected output
          </span>
        </div>
      </section>
      <section className="reading-card project-milestones" aria-label="Project milestones">
        <p className="eyebrow">BUILD IN SMALL STEPS · INDEPENDENT PROJECT</p>
        <h2>Your project plan</h2>
        <p>
          Try each step yourself. Open the help below if you get stuck. This project may take more
          than one study session.
        </p>
        {teaching.project.milestones.map((milestone, index) => (
          <details
            className="guide-details"
            key={milestone.title}
            open={index === 0 ? true : undefined}
          >
            <summary>
              Milestone {index + 1}: {milestone.title}
            </summary>
            <ol>
              {milestone.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="milestone-check">
              <strong>Stop and check:</strong> {milestone.check}
            </p>
          </details>
        ))}
        <details className="guide-details">
          <summary>What should I hand in?</summary>
          <ul>
            {project.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
        <details className="guide-details">
          <summary>How do I use the download on my computer?</summary>
          <ol>
            <li>
              Download the kit and extract the ZIP into its own folder. Open that folder in your
              editor.
            </li>
            <li>
              Read README.md and PROJECT.md. The worked-example file is{' '}
              <code>{project.filename}</code>.
            </li>
            <li>{teaching.example.run}</li>
            <li>
              Compare with expected-output.txt. Then extend the example using the milestones above.
            </li>
          </ol>
          {teaching.example.language === 'python' && (
            <p>
              If python is not recognised, try <code>py {project.filename}</code> on Windows or{' '}
              <code>python3 {project.filename}</code> on macOS/Linux. If Python is not installed
              yet, use the browser exercise while you follow the setup links in the full notes. Type
              run commands in the terminal, not inside the Python file.
            </p>
          )}
          <p>
            Your browser exercise and your extracted files are separate copies. Browser edits do not
            update the ZIP or the files on your computer.
          </p>
        </details>
        <details className="guide-details">
          <summary>I am stuck. Help me take the next step.</summary>
          <p>
            Return to the worked example. Find the smallest difference between its behaviour and
            your project goal. Make one change, then test it.
          </p>
          <p>
            You can use this prompt with your AI assistant. Add your own code and actual error only
            when needed:
          </p>
          <blockquote>
            I am learning {guide.title.toLowerCase()}. My project is {project.title}. Ask which
            milestone I am on, then give me one small hint. Explain unfamiliar words. Let me try
            before showing a solution. Help me test one normal case and one failure case.
          </blockquote>
        </details>
        <details className="guide-details">
          <summary>Finished the core? Try an extra challenge.</summary>
          <p>Optional: choose one after the five project checks work.</p>
          <ul>
            {teaching.project.extensions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      </section>
      <details className="reading-card project-guide guide-details">
        <summary>Full project guide, test cases, and references</summary>
        <Markdown folder={folder} filename="PROJECT.md" contents />
      </details>
      <section className="lesson-project-checks">
        <p className="eyebrow">VERIFY THE RESULT</p>
        <h2>Project acceptance checks</h2>
        <p className="muted">
          Your done checklist: try each behaviour, then tick it only when you have observed the
          result. These are your own recorded checks; ticking a box does not run a test. Save what
          happened in your build notes.
        </p>
        {project.acceptance.map((check, index) => (
          <Checkbox
            key={check}
            checked={checks[index] || false}
            onChange={(value) => {
              const next = Array.from(
                { length: project.acceptance.length },
                (_, item) => checks[item] || false,
              );
              next[index] = value;
              update({
                ...progress,
                lessonProjectChecks: { ...progress.lessonProjectChecks, [day]: next },
              });
            }}
          >
            {check}
          </Checkbox>
        ))}
        <ProgressBar
          value={(done / project.acceptance.length) * 100}
          label={`Lesson ${day} project acceptance`}
        />
        <div className="lesson-project-footer">
          <span>
            {done} / {project.acceptance.length} checks recorded
          </span>
          <button className="button light" onClick={onRecord}>
            Record your build
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </>
  );
}
