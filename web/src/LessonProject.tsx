import { ArrowRight, Download, FolderGit2 } from 'lucide-react';
import { dailyProjects } from './data';
import type { Progress } from './state';
import { Checkbox, ProgressBar } from './ui';
import Markdown from './Markdown';

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
      <div className="reading-card project-guide">
        <Markdown folder={folder} filename="PROJECT.md" contents />
      </div>
      <section className="lesson-project-checks">
        <p className="eyebrow">VERIFY THE RESULT</p>
        <h2>Project acceptance checks</h2>
        <p className="muted">
          Run the checks in the project guide. Save the actual evidence in your build notes.
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
