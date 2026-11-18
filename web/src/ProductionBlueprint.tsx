import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  FileCode2,
  Layers,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { missions } from './missions';
import { PageHeading, ProgressBar, SectionHeading } from './ui';
import {
  ARCHITECTURE_LAYERS,
  OMITTED_TRADEOFFS,
  PRODUCTION_SPRINTS,
  filterConcepts,
  loadCompletedSprints,
  saveCompletedSprints,
  type ConceptCategory,
} from './production-blueprint-data';

const CATEGORY_TABS: { id: ConceptCategory; label: string }[] = [
  { id: 'all', label: 'All concepts' },
  { id: 'apis', label: 'APIs & Networking' },
  { id: 'databases', label: 'Databases & ORMs' },
  { id: 'security', label: 'Security & Auth' },
  { id: 'ai-systems', label: 'AI & Guardrails' },
  { id: 'testing', label: 'Testing Harness' },
  { id: 'operations', label: 'Scaling & Ops' },
];

export default function ProductionBlueprint() {
  const [selectedSprintId, setSelectedSprintId] = useState<string>(PRODUCTION_SPRINTS[0].id);
  const [completedSprints, setCompletedSprints] = useState<string[]>(() => loadCompletedSprints());
  const [category, setCategory] = useState<ConceptCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeSprint = useMemo(
    () => PRODUCTION_SPRINTS.find((sprint) => sprint.id === selectedSprintId) || PRODUCTION_SPRINTS[0],
    [selectedSprintId],
  );
  const visibleConcepts = useMemo(() => filterConcepts(category), [category]);

  const toggleSprintDone = (id: string) => {
    const next = completedSprints.includes(id)
      ? completedSprints.filter((item) => item !== id)
      : [...completedSprints, id];
    setCompletedSprints(next);
    saveCompletedSprints(next);
  };

  const copyPrompt = async (sprintId: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(sprintId);
      setTimeout(() => setCopiedId((current) => (current === sprintId ? null : current)), 2200);
    } catch {
      /* clipboard API unavailable in restricted contexts */
    }
  };

  const jumpToSprintNumber = (sprintNumber: number) => {
    const found = PRODUCTION_SPRINTS.find((sprint) => sprint.number === sprintNumber);
    if (found) {
      setSelectedSprintId(found.id);
      document.getElementById('hands-on-sprints')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDone = completedSprints.includes(activeSprint.id);

  return (
    <div className="bp-page">
      <PageHeading
        eyebrow="HANDS-ON PRODUCTION BLUEPRINT"
        title="Build a Production-Grade AI System With AI"
        description="Learn fast without memorizing boilerplate syntax. Follow this 8-sprint blueprint (modeled on OpsDesk AI, a multi-user AI operations platform) to direct AI coding agents across every real engineering layer—from layered APIs and PostgreSQL to security, SSE streaming, harnesses, and safe rollbacks."
        action={
          <div className="bp-head-actions">
            <a className="button light" href="#/sdlc">
              <Workflow size={16} />
              AI-Native SDLC
            </a>
            <a className="button light" href="#/document/PRODUCTION-BLUEPRINT.md">
              <BookOpen size={16} />
              Read full guide
            </a>
          </div>
        }
      />

      <section className="bp-progress-banner" aria-label="Hands-on sprint progress">
        <div className="bp-progress-copy">
          <strong>
            Hands-on build progress: {completedSprints.length} / {PRODUCTION_SPRINTS.length} sprints
            verified
          </strong>
          <p className="muted">
            Each sprint teaches one production concept in 60 seconds, gives you a copy-paste
            Spec-Driven AI prompt, and lists the exact human gate to check before moving on.
          </p>
        </div>
        <div className="bp-progress-meter">
          <ProgressBar
            value={(completedSprints.length / PRODUCTION_SPRINTS.length) * 100}
            label="Production blueprint sprints completed"
          />
          <span>{Math.round((completedSprints.length / PRODUCTION_SPRINTS.length) * 100)}%</span>
        </div>
      </section>

      <section className="bp-section" aria-label="Six-layer production architecture">
        <SectionHeading
          title="1. The 6 layers of a real production AI app"
          subtitle="Click any sprint badge inside a layer to jump straight to its hands-on build prompt and verification gate."
        />
        <div className="bp-layers-grid">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <article className="bp-layer-card" key={layer.id}>
              <div className="bp-layer-head">
                <Layers size={17} />
                <h3>{layer.name}</h3>
              </div>
              <span className="bp-stack-pill">{layer.stack}</span>
              <p className="muted">{layer.role}</p>
              <div className="bp-pattern-tags">
                {layer.keyPatterns.map((pattern) => (
                  <span key={pattern} className="bp-pattern-tag">
                    {pattern}
                  </span>
                ))}
              </div>
              <div className="bp-layer-sprints">
                {layer.sprintNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    className="bp-jump-chip"
                    onClick={() => jumpToSprintNumber(num)}
                  >
                    Sprint {num}
                    <ArrowRight size={12} />
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="hands-on-sprints" className="bp-section" aria-label="8-sprint AI build playbook">
        <SectionHeading
          title="2. The 8-sprint hands-on AI build playbook"
          subtitle="Build in vertical slices. Understand the concept first, copy the guarded prompt into your AI coding agent, then verify the human checklist."
        />

        <div className="bp-sprint-tabs" role="tablist" aria-label="Production build sprints">
          {PRODUCTION_SPRINTS.map((sprint) => {
            const active = sprint.id === activeSprint.id;
            const done = completedSprints.includes(sprint.id);
            return (
              <button
                key={sprint.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`bp-sprint-tab ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
                onClick={() => setSelectedSprintId(sprint.id)}
              >
                <span className="bp-sprint-tab-top">
                  <span>Sprint {sprint.number}</span>
                  {done ? <Check size={14} /> : <small>{sprint.duration}</small>}
                </span>
                <strong>{sprint.title}</strong>
              </button>
            );
          })}
        </div>

        <article className="bp-sprint-detail" role="tabpanel">
          <div className="bp-sprint-header">
            <div>
              <p className="eyebrow">
                SPRINT {activeSprint.number} OF {PRODUCTION_SPRINTS.length} · {activeSprint.layer} ·{' '}
                {activeSprint.duration}
              </p>
              <h2>{activeSprint.title}</h2>
            </div>
            <button
              type="button"
              className={`button ${isDone ? 'primary' : 'light'}`}
              onClick={() => toggleSprintDone(activeSprint.id)}
            >
              <CheckCircle2 size={16} />
              {isDone ? `Sprint ${activeSprint.number} verified` : `Mark Sprint ${activeSprint.number} verified`}
            </button>
          </div>

          <div className="bp-concept-box">
            <div className="bp-box-title">
              <Lightbulb size={17} />
              <strong>60-Second Concept: {activeSprint.conceptTitle}</strong>
            </div>
            <p className="bp-analogy">
              <strong>Everyday analogy:</strong> {activeSprint.analogy}
            </p>
            <p className="muted">
              <strong>Why it matters in production:</strong> {activeSprint.whyItMatters}
            </p>
          </div>

          <div className="bp-files-row">
            <div className="bp-box-title">
              <FileCode2 size={16} />
              <strong>Files created in this slice</strong>
            </div>
            <div className="bp-files-chips">
              {activeSprint.filesCreated.map((file) => (
                <code key={file} className="bp-file-chip">
                  {file}
                </code>
              ))}
            </div>
          </div>

          <div className="bp-prompt-box">
            <div className="bp-prompt-head">
              <div className="bp-box-title">
                <Sparkles size={16} />
                <strong>Copy-paste Spec-Driven AI Prompt (hand this to your AI coding agent)</strong>
              </div>
              <button
                type="button"
                className="button primary bp-copy-btn"
                onClick={() => void copyPrompt(activeSprint.id, activeSprint.aiPrompt)}
              >
                {copiedId === activeSprint.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === activeSprint.id ? 'Copied!' : 'Copy prompt'}
              </button>
            </div>
            <pre className="bp-prompt-pre">{activeSprint.aiPrompt}</pre>
          </div>

          <div className="bp-verify-grid">
            <div className="bp-gate-box">
              <div className="bp-box-title">
                <ShieldCheck size={17} />
                <strong>Human Verification Gate (Check Before Moving On)</strong>
              </div>
              <ul>
                {activeSprint.humanVerifyChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bp-trap-box">
              <div className="bp-box-title">
                <AlertTriangle size={17} />
                <strong>Common AI Mistake to Catch in Review</strong>
              </div>
              <p>{activeSprint.commonAiMistake}</p>
            </div>
          </div>

          <div className="bp-missions-row">
            <strong>Practice these concepts deeper in core missions:</strong>
            <div className="bp-mission-chips">
              {activeSprint.relatedMissionIds.map((id) => {
                const mission = missions[id - 1];
                return (
                  <a key={id} href={`#/mission/${id}`} className="bp-mission-chip">
                    <span>M{id}</span>
                    <span>{mission ? mission.title : `Mission ${id}`}</span>
                    <ArrowRight size={13} />
                  </a>
                );
              })}
            </div>
          </div>
        </article>
      </section>

      <section className="bp-section" aria-label="60-second engineering concept library">
        <SectionHeading
          title="3. Fast-learning 60-second mental models"
          subtitle="Filter by area whenever you want plain-English clarity on an architectural term while directing AI."
        />

        <div className="bp-filter-row" role="tablist" aria-label="Concept categories">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={category === tab.id}
              className={`bp-filter-pill ${category === tab.id ? 'is-selected' : ''}`}
              onClick={() => setCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bp-concepts-grid">
          {visibleConcepts.map((card) => (
            <article className="bp-concept-card" key={card.id}>
              <h3>{card.title}</h3>
              <p className="bp-one-liner">{card.oneLiner}</p>
              <p className="muted">
                <strong>Analogy:</strong> {card.analogy}
              </p>
              <p className="bp-rule">
                <strong>Production rule:</strong> {card.productionRule}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bp-section" aria-label="What not to build early">
        <SectionHeading
          title="4. Senior judgment: what NOT to build on Day 1"
          subtitle="Senior engineers ship faster and break less because they deliberately postpone complex infrastructure until real metrics demand it."
        />

        <div className="bp-table-wrap">
          <table className="bp-tradeoff-table">
            <thead>
              <tr>
                <th>Temptation to skip early</th>
                <th>Pragmatic production choice</th>
                <th>Why waiting wins</th>
                <th>Upgrade trigger</th>
              </tr>
            </thead>
            <tbody>
              {OMITTED_TRADEOFFS.map((row) => (
                <tr key={row.temptation}>
                  <td>
                    <strong>{row.temptation}</strong>
                  </td>
                  <td className="bp-choice-cell">{row.pragmaticChoice}</td>
                  <td>{row.whyWait}</td>
                  <td>{row.upgradeTrigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
