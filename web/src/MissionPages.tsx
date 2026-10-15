import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, Play } from 'lucide-react';
import {
  missions,
  stages,
  newMissionRecord,
  missionBrief,
  canRecordMission,
  productReady,
  understandingReady,
} from './missions';
import {
  reasoningLabels,
  systemQuestions,
  type MissionRecord,
  type ReasoningKey,
} from './mission-types';
import { downloadFile, type Progress } from './state';
import CausalStudio from './CausalStudio';
import { AcademyHome, AcademyPath } from './AcademyJourney';

type Props = { progress: Progress; update: (next: Progress) => void };
const stepNames = ['Explore', 'Understand', 'Build with AI', 'Explain your system', 'Review'];
export function missionCount(progress: Progress) {
  return missions.filter(
    (mission) =>
      progress.missions[mission.id]?.recorded &&
      canRecordMission(mission, progress.missions[mission.id]),
  ).length;
}
export function MissionHome(props: Props) {
  return <AcademyHome {...props} records={missionCount(props.progress)} />;
}
export function MissionPath(props: {
  progress: Progress;
  initialStage?: string;
  initialQuery?: string;
}) {
  return <AcademyPath {...props} />;
}
export function MissionLesson({
  id,
  progress,
  update,
  initialStep,
}: Props & { id: number; initialStep?: number }) {
  const mission = missions[id - 1];
  const record = progress.missions[id] || newMissionRecord();
  const heading = useRef<HTMLHeadingElement>(null);
  const [message, setMessage] = useState('');
  const [concept, setConcept] = useState(0);
  const step = record.step;
  const reasoningKeys = Object.keys(reasoningLabels) as ReasoningKey[];
  const explanationIndex = record.explanationStep;
  const question = explanationIndex < 8 ? systemQuestions[explanationIndex] : null;
  const reasoningKey = reasoningKeys[Math.max(0, explanationIndex - 8)];
  const questionLabel = question ? question[1] : reasoningLabels[reasoningKey];
  const questionHelp = question ? question[2] : mission.assess[reasoningKey];
  const save = (patch: Partial<MissionRecord>, invalidate = true) => {
    const next = { ...record, ...patch };
    if (patch.review !== undefined || patch.reviewer !== undefined) next.verdict = 'unreviewed';
    if (invalidate) {
      next.recorded = false;
      next.verdict = 'unreviewed';
      next.review = '';
      next.reviewer = '';
    }
    update({ ...progress, lastMission: id, missions: { ...progress.missions, [id]: next } });
  };
  useEffect(() => {
    if (progress.lastMission !== id || !progress.missions[id] || initialStep !== undefined)
      update({
        ...progress,
        lastMission: id,
        missions: { ...progress.missions, [id]: { ...record, step: initialStep ?? record.step } },
      });
  }, [id, initialStep]); // visiting does not award completion
  const go = (next: number) => {
    save({ step: next }, false);
    setMessage('');
    requestAnimationFrame(() => {
      heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      heading.current?.focus({ preventScroll: true });
    });
  };
  const prompt = missionBrief(mission);
  return (
    <article className="mission-core mission-lesson" data-step={step}>
      <a className="back-link" href={`#/curriculum?stage=${mission.stage}`}>
        <ArrowLeft size={15} />
        Stage {mission.stage} · {stages[mission.stage - 1].title}
      </a>
      <div className="mission-lesson-heading">
        <span className="eyebrow">MISSION {String(id).padStart(2, '0')} / 30</span>
        <span className="mission-pill">AI welcome at every step</span>
        <h1>{mission.title}</h1>
        <p>{mission.outcome}</p>
      </div>
      <nav className="mission-step-nav" aria-label="Mission steps">
        {stepNames.map((name, index) => (
          <button
            key={name}
            aria-current={step === index ? 'step' : undefined}
            onClick={() => go(index)}
          >
            <span>{index + 1}</span>
            {name}
          </button>
        ))}
      </nav>
      <section className={`mission-workspace ${step === 0 ? 'mission-studio-workspace' : ''}`}>
        <h2 ref={heading} tabIndex={-1} className="mission-step-title">
          {
            [
              'Try one change. See what happens.',
              'One idea at a time.',
              'Your useful project. AI can build it.',
              'Explain the system you actually made.',
              'Apply the ideas to a fresh situation.',
            ][step]
          }
        </h2>
        {step === 0 && (
          <>
            <CausalStudio
              key={id}
              id={id}
              record={progress.missionLabs[id]}
              onSave={(lab) =>
                update({ ...progress, missionLabs: { ...progress.missionLabs, [id]: lab } })
              }
              prediction={record.prediction}
              onPrediction={(prediction) => save({ prediction })}
              sound={progress.soundEnabled}
              onSoundChange={(soundEnabled) => update({ ...progress, soundEnabled })}
              onLearn={() => go(1)}
            />
            {id === 1 && (
              <a className="mission-motion-entry" href="#/sample/motion">
                <Play size={16} />
                <span>
                  <strong>Watch the narrated visual story</strong>
                  <small>Optional: see the page pull apart into its three roles.</small>
                </span>
                <ArrowRight size={16} />
              </a>
            )}
          </>
        )}
        {step === 1 && (
          <>
            <div className="mission-concept-tabs" role="group" aria-label="Choose a concept">
              {mission.concepts.map((item, index) => (
                <button
                  key={item.name}
                  aria-pressed={index === concept}
                  onClick={() => setConcept(index)}
                >
                  {index + 1}. {item.name}
                </button>
              ))}
            </div>
            <div className="mission-concept">
              <span className="eyebrow">
                IDEA {concept + 1} OF {mission.concepts.length}
              </span>
              <h3>{mission.concepts[concept].name}</h3>
              <p>{mission.concepts[concept].explanation}</p>
              <div className="mission-example-line">
                <strong>For example</strong>
                <p>{mission.concepts[concept].example}</p>
              </div>
              <details>
                <summary>A common wrong idea</summary>
                <p>{mission.concepts[concept].misconception}</p>
              </details>
            </div>
            <section className="mission-worked">
              <h3>A worked example</h3>
              <dl>
                {[
                  ['Before', mission.example.before],
                  ['Direction to AI', mission.example.action],
                  ['Observed or intended result', mission.example.after],
                  ['What to learn', mission.example.lesson],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="field-help">
                This is an authored teaching example. Your own project needs its own observations.
              </p>
            </section>
          </>
        )}
        {step === 2 && (
          <>
            <div className="mission-project-header">
              <div>
                <span className="eyebrow">PROJECT {String(id).padStart(2, '0')}</span>
                <h3>{mission.project.title}</h3>
              </div>
              <a
                className="button light"
                href={`${import.meta.env.BASE_URL}mission-projects/mission-${String(id).padStart(2, '0')}.zip`}
                download
              >
                <Download size={16} />
                Download project kit
              </a>
            </div>
            <p className="mission-problem">{mission.project.brief}</p>
            <ol className="mission-build-steps">
              {mission.project.steps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <details className="mission-ai-brief">
              <summary>Open the ready-to-use AI brief</summary>
              <p>
                Copy this into an available AI builder or agent. Tools are replaceable; ask it for
                current setup and cost details.
              </p>
              <textarea aria-label="AI project brief" readOnly rows={12} value={prompt} />
              <button
                className="button light"
                onClick={() => downloadFile(`mission-${id}-ai-brief.txt`, prompt, 'text/plain')}
              >
                Save brief as text
                <Download size={15} />
              </button>
            </details>
            <h3>Check the actual outcome</h3>
            <p className="field-help">
              Tick only what you actually observed. AI can run the checks; distinguish its report
              from the evidence. Unrun checks stay unticked.
            </p>
            <div className="mission-project-checks">
              {mission.project.checks.map((check, index) => (
                <label key={check}>
                  <input
                    type="checkbox"
                    checked={record.checks[index] || false}
                    onChange={(e) => {
                      const checks = [...record.checks];
                      checks[index] = e.target.checked;
                      save({ checks });
                    }}
                  />
                  <span>{check}</span>
                </label>
              ))}
            </div>
            <label className="mission-field">
              Product artifact or local file location
              <input
                maxLength={2000}
                value={record.artifact}
                onChange={(e) => save({ artifact: e.target.value })}
                placeholder="Demo URL, repository, or local folder + opening instructions"
              />
            </label>
            <label className="mission-field">
              Observed evidence
              <textarea
                rows={4}
                maxLength={5000}
                value={record.observation}
                onChange={(e) => save({ observation: e.target.value })}
                placeholder="Starting state → action → expected result → actual observation. Include failures and distinguish fixtures, AI reports and real results."
              />
            </label>
            <details>
              <summary>Optional implementation workshops to reuse</summary>
              <p>
                These are source material, not required manual-coding gates. Check that the example
                fits your actual project.
              </p>
              <div className="mission-reference-links">
                {mission.reuse.map((day) => (
                  <a key={day} href={`#/lesson/${day}`}>
                    Workshop {day}
                    <ArrowRight size={14} />
                  </a>
                ))}
              </div>
            </details>
          </>
        )}
        {step === 3 && (
          <>
            <p className="mission-problem">
              AI may help you inspect and learn. Write or transcribe the explanation in your own
              words, then check that you can use it in a changed situation. Update it after
              meaningful changes.
            </p>
            <p className="field-help">
              Explain the product that actually exists. A static website can have no server,
              database, accounts or live AI. Add those responsibilities as they appear. Keep secrets
              and private customer data out of these notes.
            </p>
            <div className="mission-explanation-progress">
              <span className="mission-pill">Question {explanationIndex + 1} of 13</span>
              <span>
                {Object.values(record.system).filter((v) => v.trim().length >= 20).length +
                  Object.values(record.reasoning).filter((v) => v.trim().length >= 20).length}{' '}
                answers drafted · correctness needs review
              </span>
            </div>
            <label className="mission-field">
              Choose an explanation question
              <select
                value={explanationIndex}
                onChange={(e) => save({ explanationStep: Number(e.target.value) }, false)}
              >
                <optgroup label="Your actual system">
                  {systemQuestions.map(([, label], index) => (
                    <option key={label} value={index}>
                      {index + 1}. {label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Apply the concepts">
                  {reasoningKeys.map((key, index) => (
                    <option key={key} value={index + 8}>
                      {index + 9}. {reasoningLabels[key]}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            <div className={question ? 'mission-system-fields' : 'mission-reasoning-fields'}>
              <label className="mission-field" key={explanationIndex}>
                <strong>{questionLabel}</strong>
                <small>{questionHelp}</small>
                <textarea
                  rows={5}
                  maxLength={3000}
                  value={
                    question ? record.system[question[0]] || '' : record.reasoning[reasoningKey]
                  }
                  onChange={(e) =>
                    question
                      ? save({ system: { ...record.system, [question[0]]: e.target.value } })
                      : save({ reasoning: { ...record.reasoning, [reasoningKey]: e.target.value } })
                  }
                  placeholder="Explain it in your own words. You can ask AI to help you investigate."
                />
              </label>
            </div>
            <div className="mission-question-actions">
              <button
                className="button light"
                disabled={explanationIndex === 0}
                onClick={() => save({ explanationStep: explanationIndex - 1 }, false)}
              >
                <ArrowLeft size={16} />
                Previous question
              </button>
              {explanationIndex < 12 ? (
                <button
                  className="button primary"
                  onClick={() => save({ explanationStep: explanationIndex + 1 }, false)}
                >
                  Next explanation
                  <ArrowRight size={16} />
                </button>
              ) : (
                <span className="field-help">
                  Check your drafts, then review the evidence below.
                </span>
              )}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <div className="mission-evidence-pair">
              <div>
                <span className="eyebrow">PRODUCT EVIDENCE</span>
                <h3>
                  {productReady(mission, record) ? 'Recorded for review' : 'Still needs evidence'}
                </h3>
                <p>Observed outcome checks, artifact and a reproducible observation.</p>
              </div>
              <div>
                <span className="eyebrow">UNDERSTANDING</span>
                <h3>
                  {understandingReady(record)
                    ? 'Explanation ready for review'
                    : 'Still needs explanation'}
                </h3>
                <p>
                  Eight system areas and five reasoning actions. Field completeness does not
                  establish correctness or mastery.
                </p>
              </div>
            </div>
            <div className="mission-fresh">
              <span className="eyebrow">FRESH FOLLOW-UP · AI AVAILABLE</span>
              <h3>{mission.assess.variations[record.variation]}</h3>
              <button
                className="text-link"
                onClick={() => save({ variation: record.variation === 0 ? 1 : 0 })}
              >
                Try the other situation <ArrowRight size={14} />
              </button>
              <p>
                Ask a reviewer to choose a further unseen variation relevant to your product.
                Predict first, use AI to investigate or adapt, and explain what the evidence
                supports. Built-in examples are practice, not secret exam questions.
              </p>
            </div>
            <details>
              <summary>Reviewer guidance and the shared standard</summary>
              <p>{mission.assess.guide}</p>
              <p>
                Walk through the actual product and its technologies. Ask the learner to explain,
                locate, predict, compare and investigate. A working product plus an AI-generated
                explanation is insufficient when they cannot apply the ideas. Record gaps, revisit
                teaching and use a fresh variation. A reviewer may use AI; name who or what reviewed
                the work.
              </p>
              <p>
                Before final review, revisit all six stages and the shared foundation in the
                roadmap. Completing a local checklist does not independently establish graduation or
                employment readiness.
              </p>
              <a href="#/document/ROADMAP.md">Read the complete standard</a>
            </details>
            <label className="mission-field">
              Reviewer or review method
              <input
                maxLength={200}
                value={record.reviewer}
                onChange={(e) => save({ reviewer: e.target.value, recorded: false }, false)}
                placeholder="Name + role, AI-assisted review, or self-review"
              />
            </label>
            <label className="mission-field">
              Observed reasoning, fresh result and gaps
              <textarea
                rows={5}
                maxLength={5000}
                value={record.review}
                onChange={(e) => save({ review: e.target.value, recorded: false }, false)}
                placeholder="Which situation was new? What did the learner predict and explain? What was actually observed? What needs another demonstration?"
              />
            </label>
            <label className="mission-field">
              Review record
              <select
                disabled={record.reviewer.trim().length < 2 || record.review.trim().length < 30}
                value={record.verdict}
                onChange={(e) =>
                  save(
                    { verdict: e.target.value as MissionRecord['verdict'], recorded: false },
                    false,
                  )
                }
              >
                <option value="unreviewed">Not reviewed</option>
                <option value="revisit">Needs more practice</option>
                <option value="demonstrated">Reviewer reports understanding demonstrated</option>
              </select>
            </label>
            <div className="mission-record-actions">
              <button
                className="button primary"
                disabled={!canRecordMission(mission, record)}
                onClick={() => {
                  save({ recorded: true }, false);
                  setMessage(
                    'Practice record saved. This records your evidence; it does not certify mastery.',
                  );
                }}
              >
                Save mission practice record
                <Check size={17} />
              </button>
              <button
                className="button light"
                onClick={() =>
                  downloadFile(
                    `mission-${id}-evidence.json`,
                    JSON.stringify({ mission: id, title: mission.title, ...record }, null, 2),
                  )
                }
              >
                Export this evidence
                <Download size={16} />
              </button>
            </div>
            {!canRecordMission(mission, record) && (
              <p className="field-help">
                Before saving a practice record: complete the three outcome checks, artifact,
                observation, eight system areas and five reasoning answers. Add substantive notes
                (at least 20 characters per explanation); this is a completeness check only.
              </p>
            )}
            {record.recorded && (
              <p className="mission-saved" role="status">
                Practice recorded ·{' '}
                {record.verdict === 'demonstrated'
                  ? 'reviewer-reported understanding'
                  : record.verdict === 'revisit'
                    ? 'more practice needed'
                    : 'understanding not yet reviewed'}
                . Further review may still identify gaps.
              </p>
            )}
          </>
        )}
        {message && <p role="status">{message}</p>}
        {step !== 0 && (
          <div className="mission-step-footer">
            {step > 0 ? (
              <button className="button light" onClick={() => go(step - 1)}>
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <span className="field-help">Your place saves in this browser.</span>
            )}
            {step < 4 ? (
              <button className="button primary" onClick={() => go(step + 1)}>
                {
                  [
                    'Understand the idea',
                    'Build my project',
                    'Explain my system',
                    'Review my evidence',
                  ][step]
                }
                <ArrowRight size={17} />
              </button>
            ) : id < 30 ? (
              <a className="button light" href={`#/mission/${id + 1}`}>
                Explore mission {id + 1}
                <ArrowRight size={17} />
              </a>
            ) : (
              <a className="button light" href="#/portfolio">
                Review my portfolio
                <ArrowRight size={17} />
              </a>
            )}
          </div>
        )}
      </section>
      <p className="mission-save-note">
        AI can implement everything. Understanding is demonstrated through reasoning and changed
        situations. <a href="#/settings">Back up your work</a> ·{' '}
        <a href="#/document/RESEARCH-2030.md">Evidence and future scenarios</a>
      </p>
    </article>
  );
}

export function MissionPortfolio({ progress }: { progress: Progress }) {
  return (
    <section className="mission-core mission-portfolio">
      <span className="eyebrow">CORE MISSIONS · SEPARATE EVIDENCE</span>
      <h2>Your delivery and understanding record</h2>
      <p>
        {missionCount(progress)} practice records. These are your saved observations and review
        reports, not independently verified credentials.
      </p>
      <button
        className="button light"
        onClick={() =>
          downloadFile(
            'fde-mission-evidence.json',
            JSON.stringify({ name: progress.name, missions: progress.missions }, null, 2),
          )
        }
      >
        Export mission evidence <Download size={16} />
      </button>
      <div className="mission-portfolio-list">
        {missions
          .filter((m) => progress.missions[m.id])
          .map((m) => {
            const r = progress.missions[m.id];
            return (
              <a key={m.id} href={`#/mission/${m.id}`}>
                <strong>
                  {m.id}. {m.title}
                </strong>
                <span>Product: {productReady(m, r) ? 'evidence recorded' : 'in progress'}</span>
                <span>
                  Understanding:{' '}
                  {r.verdict === 'demonstrated' && r.reviewer.trim() && r.review.trim()
                    ? 'reviewer reports demonstrated'
                    : r.verdict === 'revisit'
                      ? 'revisit concepts'
                      : 'not yet reviewed'}
                </span>
              </a>
            );
          })}
      </div>
      {!Object.keys(progress.missions).length && (
        <a className="button primary" href="#/mission/1">
          Start your first mission
          <ArrowRight size={16} />
        </a>
      )}
    </section>
  );
}
