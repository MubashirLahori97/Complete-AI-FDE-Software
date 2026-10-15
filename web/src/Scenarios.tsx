import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  RotateCcw,
  Users,
  Target,
  Wrench,
  MessageSquare,
} from 'lucide-react';
import { scenarios } from './scenarios-data';
import { downloadFile, localDate, type Progress } from './state';
import { PageHeading, ProgressBar, SectionHeading } from './ui';

const briefTemplate =
  '# Customer brief\n\nCustomer and users:\n\nProblem and current workflow:\n\nMeasured baseline (or clearly labelled estimate):\n\nProposed solution:\n\nIn scope:\n- \n\nOut of scope:\n- \n\nSuccess metric and evaluation method:\n\nData access and permissions:\n\nRisks and mitigations:\n\nHandoff and operational owner:\n';
export default function Scenarios({
  progress,
  update,
}: {
  progress: Progress;
  update: (next: Progress) => void;
}) {
  const [id, setId] = useState('discovery');
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const scenario = scenarios.find((item) => item.id === id)!;
  const current = scenario.steps[step];
  const score = Math.round(
    (choices.reduce((sum, choice, index) => sum + scenario.steps[index].choices[choice].points, 0) /
      (scenario.steps.length * 2)) *
      100,
  );
  const choose = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setChoices((old) => [...old, index]);
  };
  const reset = (newId = id) => {
    setId(newId);
    setStep(0);
    setChoices([]);
    setSelected(null);
    setFinished(false);
  };
  const advance = () => {
    if (step + 1 < scenario.steps.length) {
      setStep(step + 1);
      setSelected(null);
    } else {
      setFinished(true);
      update({
        ...progress,
        scenarios: {
          ...progress.scenarios,
          [id]: { score: Math.max(score, progress.scenarios[id]?.score || 0), date: localDate() },
        },
      });
    }
  };
  const brief = progress.drafts['business-brief'] ?? briefTemplate;
  return (
    <>
      <PageHeading
        eyebrow="THE WORK BEYOND THE CODE"
        title="Practise the field part of FDE."
        description="Start with the customer discovery scenario already selected below. Read the customer's message, choose your next action, and read the feedback. These are scripted practice scenarios, not a live AI chat."
      />
      <div className="scenario-grid">
        {scenarios.map((item, index) => {
          const Icon = [Users, Wrench, Target][index];
          return (
            <button
              className={`scenario-card ${id === item.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => reset(item.id)}
              aria-pressed={id === item.id}
            >
              <span className="scenario-icon">
                <Icon size={20} />
              </span>
              <span className="eyebrow">{item.skill}</span>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <span className="scenario-card-footer">
                {progress.scenarios[item.id]
                  ? `Best practice score: ${progress.scenarios[item.id].score}%`
                  : '4 decisions · Guided feedback'}
                <ArrowRight size={16} />
              </span>
            </button>
          );
        })}
      </div>
      <section className="simulation">
        <div className="simulation-heading">
          <div>
            <p className="eyebrow">{scenario.role}</p>
            <h2>{scenario.title}</h2>
          </div>
          <span className="badge">
            {finished ? 'Debrief' : `Decision ${step + 1} / ${scenario.steps.length}`}
          </span>
        </div>
        <ProgressBar
          value={finished ? 100 : (step / scenario.steps.length) * 100}
          label="Scenario progress"
        />
        {!finished ? (
          <>
            <div className="customer-message">
              <span className="customer-avatar">
                <MessageSquare size={20} />
              </span>
              <div>
                <p className="eyebrow">THE SITUATION</p>
                <p>{current.situation}</p>
              </div>
            </div>
            <h3 className="decision-question">{current.question}</h3>
            <div className="decision-options">
              {current.choices.map((choice, index) => (
                <button
                  key={choice.text}
                  disabled={selected !== null}
                  className={selected === index ? 'selected' : ''}
                  onClick={() => choose(index)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span>{choice.text}</span>
                  <ArrowRight size={17} />
                </button>
              ))}
            </div>
            {selected !== null && (
              <div className="decision-feedback" role="status">
                <strong>
                  {current.choices[selected].points === 2
                    ? 'A sound decision.'
                    : 'Consider the tradeoff.'}
                </strong>
                <p>{current.choices[selected].feedback}</p>
                <button className="button primary small" onClick={advance}>
                  {step + 1 === scenario.steps.length ? 'View your debrief' : 'Next decision'}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="debrief">
            <div className="score-circle">
              {score}
              <span>/ 100</span>
            </div>
            <div>
              <p className="eyebrow">PRACTICE SCORE</p>
              <h2>
                {score >= 75
                  ? 'You kept the outcome in focus.'
                  : 'There’s useful learning in these decisions.'}
              </h2>
              <p className="muted">
                This score reflects choices in a scripted exercise. Real customer work needs
                context, dialogue, and evidence.
              </p>
              <button className="button light small" onClick={() => reset()}>
                <RotateCcw size={15} />
                Practise again
              </button>
            </div>
            <div className="debrief-review">
              {scenario.steps.map((item, index) => (
                <div key={item.question}>
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>{item.question}</strong>
                    <p>{item.choices[choices[index]].feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <SectionHeading
        title="Turn discovery into a brief"
        subtitle="Write something a customer and an engineer could both review."
      />
      <section className="brief-card">
        <label className="form-label" htmlFor="business-brief">
          Your customer brief
        </label>
        <textarea
          id="business-brief"
          className="notes-field mono"
          rows={16}
          value={brief}
          maxLength={10000}
          onChange={(event) =>
            update({
              ...progress,
              drafts: { ...progress.drafts, 'business-brief': event.target.value },
            })
          }
        />
        <div className="brief-footer">
          <p className="field-help">
            Saved in this browser. Write a specific scope and a measurable outcome.
          </p>
          <button
            className="button primary small"
            onClick={() => downloadFile('customer-brief.md', brief, 'text/markdown')}
          >
            <Download size={15} />
            Download brief
          </button>
        </div>
      </section>
    </>
  );
}
