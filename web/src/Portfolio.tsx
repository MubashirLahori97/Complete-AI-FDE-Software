import { Download, FolderGit2, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { projectDefinitions } from './data';
import { downloadFile, emptyEvidence, safeUrl, type Progress, type ProjectEvidence } from './state';
import { Checkbox, ProgressBar } from './ui';
import { missions, canRecordMission, productReady } from './missions';
import {
  FULLSTACK_CS_MODULES,
  SYSTEMS_QUIZ_QUESTIONS,
  loadFullStackProgress,
} from './fullstack-cs-data';
import './studio-pages.css';

export default function Portfolio({
  progress,
  update,
}: {
  progress: Progress;
  update: (next: Progress) => void;
}) {
  const fsProgress = loadFullStackProgress();
  const completedMissions = missions.filter(
    (m) => progress.missions[m.id]?.recorded && canRecordMission(m, progress.missions[m.id]),
  );
  const startedMissions = missions.filter((m) => Boolean(progress.missions[m.id]));

  const save = (id: string, evidence: ProjectEvidence) =>
    update({ ...progress, projects: { ...progress.projects, [id]: evidence } });

  const exportPortfolio = () => {
    const missionLines = startedMissions
      .map((m) => {
        const r = progress.missions[m.id];
        return `- Lesson ${m.id}: ${m.title} (${productReady(m, r) ? 'Evidence recorded' : 'In progress'})`;
      })
      .join('\n');

    const sections = projectDefinitions.map((project) => {
      const evidence = progress.projects[project.id] || emptyEvidence();
      return `## ${project.title}\n\n${project.description}\n\nDemo: ${evidence.demo || 'Not recorded'}\nRepository: ${evidence.repo || 'Not recorded'}\n\n### Decisions & test results\n\n${evidence.notes || 'Not recorded'}\n\n### Checks\n\n${project.checks.map((check, index) => `- [${evidence.checks[index] ? 'x' : ' '}] ${check}`).join('\n')}`;
    });

    downloadFile(
      'fde-portfolio.md',
      `# ${progress.name ? `${progress.name} — ` : ''}FDE Academy Portfolio\n\n- Core lessons completed: ${completedMissions.length} / 30\n- Full-Stack & CS modules completed: ${fsProgress.completedModules.length} / ${FULLSTACK_CS_MODULES.length}\n- Practice quizzes solved: ${fsProgress.correctQuizIds.length} / ${SYSTEMS_QUIZ_QUESTIONS.length}\n\n## Core Lessons\n\n${missionLines || 'No lessons started yet.'}\n\n---\n\n${sections.join('\n\n---\n\n')}`,
      'text/markdown',
    );
  };

  return (
    <div className="studio-page">
      <header className="studio-page-head">
        <div>
          <h1>Your Portfolio</h1>
          <p>
            Track every lesson you finish, log live links to projects you build, and export a clean
            markdown summary of your work at any time.
          </p>
        </div>
        <button type="button" className="button primary" onClick={exportPortfolio}>
          <Download size={16} />
          Export portfolio
        </button>
      </header>

      <section className="portfolio-stats-row" aria-label="Learning progress summary">
        <div className="portfolio-stat-card">
          <span>Core lessons</span>
          <strong>
            {completedMissions.length} / 30
          </strong>
          <ProgressBar value={(completedMissions.length / 30) * 100} label="Core lessons progress" />
        </div>
        <div className="portfolio-stat-card">
          <span>Full-Stack &amp; CS</span>
          <strong>
            {fsProgress.completedModules.length} / {FULLSTACK_CS_MODULES.length}
          </strong>
          <ProgressBar
            value={(fsProgress.completedModules.length / FULLSTACK_CS_MODULES.length) * 100}
            label="Full-Stack and CS progress"
          />
        </div>
        <div className="portfolio-stat-card">
          <span>Practice quizzes</span>
          <strong>
            {fsProgress.correctQuizIds.length} / {SYSTEMS_QUIZ_QUESTIONS.length}
          </strong>
          <ProgressBar
            value={(fsProgress.correctQuizIds.length / SYSTEMS_QUIZ_QUESTIONS.length) * 100}
            label="Practice quizzes progress"
          />
        </div>
      </section>

      <section className="portfolio-section" aria-label="Core lesson progress">
        <div className="home-section-head">
          <div>
            <h2>Core lessons in progress</h2>
            <p>Each lesson saves your system notes and proof of work automatically.</p>
          </div>
          <a className="button light" href="#/curriculum">
            Browse all 30 lessons
          </a>
        </div>

        {startedMissions.length > 0 ? (
          <div className="portfolio-mission-grid">
            {startedMissions.map((m) => {
              const r = progress.missions[m.id];
              const done = productReady(m, r);
              return (
                <a key={m.id} href={`#/mission/${m.id}`} className="portfolio-mission-card">
                  <div className="portfolio-mission-top">
                    <span className="portfolio-num">{String(m.id).padStart(2, '0')}</span>
                    <span className={`portfolio-status ${done ? 'is-done' : ''}`}>
                      {done ? 'Evidence recorded' : 'In progress'}
                    </span>
                  </div>
                  <strong>{m.title}</strong>
                  <span className="portfolio-sub">
                    Understanding:{' '}
                    {r.verdict === 'demonstrated' && r.reviewer.trim() && r.review.trim()
                      ? 'Demonstrated'
                      : r.verdict === 'revisit'
                        ? 'Revisit'
                        : 'Pending review'}
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="portfolio-empty-card">
            <strong>Start your first lesson to begin building your portfolio.</strong>
            <p>
              Every experiment, system explanation, and project link you save appears right here.
            </p>
            <a className="button primary" href="#/mission/1?step=0">
              Start Lesson 1
            </a>
          </div>
        )}
      </section>

      <section className="portfolio-section" aria-label="Showcase projects">
        <div className="home-section-head">
          <div>
            <h2>Featured project links</h2>
            <p>
              Optional: save live demo URLs, GitHub repos, and test notes for up to four capstone
              projects you want to share.
            </p>
          </div>
        </div>

        <div className="portfolio-projects-grid">
          {projectDefinitions.map((project) => {
            const evidence = progress.projects[project.id] || emptyEvidence();
            const checked = evidence.checks.filter(Boolean).length;
            return (
              <section className="portfolio-project-card" key={project.id}>
                <div className="portfolio-project-head">
                  <div>
                    <span className="home-path-tag">{project.type}</span>
                    <h3>{project.title}</h3>
                  </div>
                  <span className="portfolio-icon-badge">
                    <FolderGit2 size={18} />
                  </span>
                </div>
                <p className="portfolio-project-desc">{project.description}</p>

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
                  What you built and tested
                </label>
                <textarea
                  id={`${project.id}-notes`}
                  className="notes-field"
                  rows={3}
                  maxLength={10000}
                  value={evidence.notes}
                  placeholder="The problem was… I built… I tested… The result was…"
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

                <div className="portfolio-project-foot">
                  <span>
                    <CheckCircle2 size={14} />
                    {checked} / {project.checks.length} checks
                  </span>
                  <div className="portfolio-project-links">
                    {safeUrl(evidence.demo) && (
                      <a href={safeUrl(evidence.demo)} target="_blank" rel="noopener noreferrer">
                        Live demo
                      </a>
                    )}
                    {safeUrl(evidence.repo) && (
                      <a href={safeUrl(evidence.repo)} target="_blank" rel="noopener noreferrer">
                        Repository
                      </a>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
