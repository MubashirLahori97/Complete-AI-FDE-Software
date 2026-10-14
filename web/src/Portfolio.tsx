import { ArrowRight, Download, FolderGit2, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { projectDefinitions, dailyProjects } from './data';
import { downloadFile, emptyEvidence, safeUrl, type Progress, type ProjectEvidence } from './state';
import { Checkbox, PageHeading, ProgressBar } from './ui';

export default function Portfolio({
  progress,
  update,
}: {
  progress: Progress;
  update: (next: Progress) => void;
}) {
  const save = (id: string, evidence: ProjectEvidence) =>
    update({ ...progress, projects: { ...progress.projects, [id]: evidence } });
  const exportPortfolio = () => {
    const sections = projectDefinitions.map((project) => {
      const evidence = progress.projects[project.id] || emptyEvidence();
      return `## ${project.title}\n\n${project.description}\n\nDemo: ${evidence.demo || 'Not recorded'}\nRepository: ${evidence.repo || 'Not recorded'}\n\n### Evidence and reflection\n\n${evidence.notes || 'Not recorded'}\n\n### Self-assessment\n\n${project.checks.map((check, index) => `- [${evidence.checks[index] ? 'x' : ' '}] ${check}`).join('\n')}`;
    });
    downloadFile(
      'fde-portfolio.md',
      `# ${progress.name ? `${progress.name} — ` : ''}FDE Learning Portfolio\n\nSelf-reported learning evidence. Links and results have not been independently verified.\n\n${sections.join('\n\n---\n\n')}\n\n# Lesson projects\n\n${dailyProjects.map((project) => `## Lesson ${project.day}: ${project.title}\n\n${progress.notes[project.day] || 'Build evidence not recorded.'}\n\n${project.acceptance.map((check, index) => `- [${progress.lessonProjectChecks[project.day]?.[index] ? 'x' : ' '}] ${check}`).join('\n')}`).join('\n\n')}`,
      'text/markdown',
    );
  };
  return (
    <>
      <PageHeading
        eyebrow="PROOF OF WORK"
        title="Build a portfolio with evidence."
        description="Show the problem, your decisions, what you tested, and what actually happened."
        action={
          <button className="button light" onClick={exportPortfolio}>
            <Download size={16} />
            Export portfolio
          </button>
        }
      />
      <div className="portfolio-intro">
        <FolderGit2 size={24} />
        <div>
          <strong>Your project is the story. Evidence makes it credible.</strong>
          <p>
            Record a demo, repository, and honest reflection. Checks are your own assessment; the
            app does not verify links or certify readiness.
          </p>
        </div>
      </div>
      <div className="portfolio-grid">
        {projectDefinitions.map((project) => {
          const evidence = progress.projects[project.id] || emptyEvidence();
          const checked = evidence.checks.filter(Boolean).length;
          return (
            <section className="project-card" key={project.id}>
              <div className="project-heading">
                <div>
                  <p className="eyebrow">{project.type}</p>
                  <h2>{project.title}</h2>
                </div>
                <span className="project-symbol">
                  <FolderGit2 size={22} />
                </span>
              </div>
              <p className="muted">{project.description}</p>
              <a href={`#/lesson/${project.day}`} className="text-link small-text">
                Open lesson {project.day}
                <ArrowRight size={14} />
              </a>
              <label className="form-label" htmlFor={`${project.id}-demo`}>
                Live demo URL
              </label>
              <div className="url-input">
                <LinkIcon size={15} />
                <input
                  id={`${project.id}-demo`}
                  type="url"
                  value={evidence.demo}
                  placeholder="https://your-demo.example"
                  maxLength={2000}
                  onChange={(event) => save(project.id, { ...evidence, demo: event.target.value })}
                />
              </div>
              {evidence.demo && !safeUrl(evidence.demo) && (
                <p className="inline-warning">Use a complete http:// or https:// URL.</p>
              )}
              <label className="form-label" htmlFor={`${project.id}-repo`}>
                Repository URL
              </label>
              <div className="url-input">
                <FolderGit2 size={15} />
                <input
                  id={`${project.id}-repo`}
                  type="url"
                  value={evidence.repo}
                  placeholder="https://github.com/you/project"
                  maxLength={2000}
                  onChange={(event) => save(project.id, { ...evidence, repo: event.target.value })}
                />
              </div>
              {evidence.repo && !safeUrl(evidence.repo) && (
                <p className="inline-warning">Use a complete http:// or https:// URL.</p>
              )}
              <label className="form-label" htmlFor={`${project.id}-notes`}>
                Decisions, tests & results
              </label>
              <textarea
                id={`${project.id}-notes`}
                className="notes-field"
                rows={4}
                maxLength={10000}
                value={evidence.notes}
                placeholder="The problem was… I chose… I tested… The result was…"
                onChange={(event) => save(project.id, { ...evidence, notes: event.target.value })}
              />
              <div className="project-checks">
                {project.checks.map((check, index) => (
                  <Checkbox
                    key={check}
                    checked={evidence.checks[index] || false}
                    onChange={(value) => {
                      const checks = [...evidence.checks];
                      checks[index] = value;
                      save(project.id, { ...evidence, checks });
                    }}
                  >
                    {check}
                  </Checkbox>
                ))}
              </div>
              <ProgressBar
                value={(checked / project.checks.length) * 100}
                label={`${project.title} self-assessment`}
              />
              <div className="project-footer">
                <span>
                  <CheckCircle2 size={14} />
                  {checked} / {project.checks.length} checks recorded
                </span>
                <div>
                  {safeUrl(evidence.demo) && (
                    <a href={safeUrl(evidence.demo)} target="_blank" rel="noopener noreferrer">
                      Demo
                      <ArrowRight size={13} />
                    </a>
                  )}
                  {safeUrl(evidence.repo) && (
                    <a href={safeUrl(evidence.repo)} target="_blank" rel="noopener noreferrer">
                      Code
                      <ArrowRight size={13} />
                    </a>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <section className="daily-projects-section">
        <h2>Your 30 lesson projects</h2>
        <p className="muted">
          Build a smaller project with every lesson. Choose your strongest work for the showcase
          above.
        </p>
        <div className="daily-projects-grid">
          {dailyProjects.map((project) => {
            const done = progress.lessonProjectChecks[project.day]?.filter(Boolean).length || 0;
            return (
              <a
                className="daily-project-row"
                key={project.day}
                href={`#/lesson/${project.day}?tab=project`}
              >
                <span className="day-number">{String(project.day).padStart(2, '0')}</span>
                <div>
                  <h3>{project.title}</h3>
                  <p>
                    {done} / {project.acceptance.length} checks recorded
                  </p>
                </div>
                <ArrowRight size={16} />
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
