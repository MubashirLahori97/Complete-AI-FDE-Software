import { useState } from 'react';
import { Check, Copy, ShieldAlert } from 'lucide-react';
import type { Mission, MissionRecord } from './mission-types';
import { HalfLifeBadge } from './ui';
import './agentic-era.css';

export default function MissionVivaPanel({
  mission,
  record,
}: {
  mission: Mission;
  record: MissionRecord;
}) {
  const [copied, setCopied] = useState(false);

  const buildVivaPrompt = () => {
    const draftedSystem = Object.entries(record.system)
      .filter(([, value]) => value.trim().length > 0)
      .map(([key, value]) => `- ${key}: ${value.trim()}`)
      .join('\n');

    const draftedReasoning = Object.entries(record.reasoning)
      .filter(([, value]) => value.trim().length > 0)
      .map(([key, value]) => `- ${key}: ${value.trim()}`)
      .join('\n');

    return `Act as a skeptical Principal Forward Deployed Engineer conducting a 2028–2030 oral system defense (Viva Voce).
Do NOT flatter me or accept vague answers. My goal is to eliminate the "Illusion of Competence" when directing AI coding agents.

Mission ${mission.id}: ${mission.title}
Target Outcome: ${mission.outcome}
Project Brief: ${mission.project.brief}

My drafted system explanation:
${draftedSystem || '(No system notes drafted yet — start by asking me to describe my actual stack and data flow.)'}

My drafted reasoning:
${draftedReasoning || '(No reasoning notes drafted yet.)'}

Unseen Chaos Variation to test me on:
"${mission.assess.variations[record.variation]}"

Rules for our Viva:
1. Ask ONE tough, concrete follow-up question at a time.
2. Force me to predict exact failure behavior before revealing the answer.
3. Probe trust boundaries, data integrity, concurrency/retries, or cost trade-offs relevant to this mission.
4. If my answer sounds like copy-pasted AI fluff, reject it and ask me to trace a concrete user action end-to-end.
5. After 4 questions, give an honest verdict: Demonstrated or Revisit, listing exact mental-model gaps.`;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(buildVivaPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="mission-viva-panel" aria-label="Adversarial Socratic Viva Cross-Examiner">
      <div className="mission-viva-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          <ShieldAlert size={17} style={{ color: '#38bdf8' }} />
          <strong>Beat the Illusion of Competence: Run a Hostile Principal-Engineer Viva</strong>
          <HalfLifeBadge tier="law" />
        </div>
        <button type="button" className="button light small" onClick={copyPrompt}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Viva Prompt Copied!' : 'Copy Socratic Viva Prompt'}
        </button>
      </div>
      <p>
        Paste this prompt into any AI assistant (Claude, ChatGPT, Gemini). It packages your drafted
        system answers above and instructs the AI to act as a skeptical Principal Engineer who
        refuses flattery and cross-examines your real mental model on an unseen failure scenario.
      </p>
    </aside>
  );
}
