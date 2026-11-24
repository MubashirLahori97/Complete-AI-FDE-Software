import { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Bug,
  Info,
} from 'lucide-react';

export interface PitfallItem {
  id: string;
  category: 'runtime' | 'memory' | 'type' | 'logic';
  categoryLabel: string;
  headline: string;
  explanation: string;
  solutionRule: string;
}

function parsePitfall(raw: string, index: number): PitfallItem {
  // Determine category based on keywords
  const lower = raw.toLowerCase();
  let category: PitfallItem['category'] = 'logic';
  let categoryLabel = 'Logic Trap';

  if (lower.includes('typeerror') || lower.includes('type') || lower.includes('cast')) {
    category = 'type';
    categoryLabel = 'Type Invariant';
  } else if (
    lower.includes('memory') ||
    lower.includes('leak') ||
    lower.includes('id(') ||
    lower.includes('caching') ||
    lower.includes('reference')
  ) {
    category = 'memory';
    categoryLabel = 'Memory / CPython';
  } else if (
    lower.includes('error') ||
    lower.includes('exception') ||
    lower.includes('crash') ||
    lower.includes('raise')
  ) {
    category = 'runtime';
    categoryLabel = 'Runtime Hazard';
  }

  // Extract a punchy headline
  let headline = raw;
  let explanation = raw;
  let solutionRule = 'Always write explicit unit tests asserting invariant boundary behaviors.';

  if (raw.includes('(') && raw.includes(')')) {
    const parts = raw.split('(');
    headline = parts[0].trim();
    explanation = raw;
    const insideParens = parts[1].replace(/\)$/, '').trim();
    if (insideParens.length > 5) {
      solutionRule = `Rule: ${insideParens}`;
    }
  } else if (raw.includes(';')) {
    const parts = raw.split(';');
    headline = parts[0].trim();
    explanation = raw;
    solutionRule = `Rule: ${parts.slice(1).join(';').trim()}`;
  } else if (raw.includes('.')) {
    const firstSentence = raw.split('.')[0].trim();
    headline = firstSentence;
    explanation = raw;
  }

  return {
    id: `p-${index}`,
    category,
    categoryLabel,
    headline,
    explanation,
    solutionRule,
  };
}

export default function CommonPitfallsAccordion({
  topicId,
  pitfalls,
}: {
  topicId: string;
  pitfalls: string[];
}) {
  const parsedItems = pitfalls.map((p, i) => parsePitfall(p, i));

  // Initialize with first item open
  const [openStates, setOpenStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (parsedItems.length > 0) {
      initial[parsedItems[0].id] = true;
    }
    return initial;
  });

  const allOpen = parsedItems.every((item) => openStates[item.id]);

  const toggleItem = (id: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = () => {
    const nextState = !allOpen;
    const next: Record<string, boolean> = {};
    parsedItems.forEach((item) => {
      next[item.id] = nextState;
    });
    setOpenStates(next);
  };

  if (!pitfalls || pitfalls.length === 0) {
    return null;
  }

  return (
    <div className="common-pitfalls-accordion-group">
      <div className="pitfalls-accordion-header">
        <div className="pitfalls-header-left">
          <AlertTriangle size={17} className="pitfalls-main-icon" />
          <div>
            <h4>Troubleshooting & Common Candidate Traps ({pitfalls.length})</h4>
            <span className="pitfalls-subtitle">
              Expandable error post-mortems inspired by real production incidents
            </span>
          </div>
        </div>
        <button
          type="button"
          className="pitfalls-toggle-all-btn"
          onClick={toggleAll}
        >
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="pitfalls-items-container">
        {parsedItems.map((item, idx) => {
          const isOpen = Boolean(openStates[item.id]);
          return (
            <div
              key={item.id}
              className={`pitfall-card ${isOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="pitfall-trigger"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
              >
                <div className="trigger-left">
                  <span className={`pitfall-cat-pill cat-${item.category}`}>
                    {item.categoryLabel}
                  </span>
                  <span className="pitfall-headline">
                    #{idx + 1}. {item.headline}
                  </span>
                </div>
                <div className="trigger-chevron">
                  {isOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                </div>
              </button>

              {isOpen && (
                <div className="pitfall-content-body">
                  <div className="pitfall-explanation">
                    <p>{item.explanation}</p>
                  </div>

                  <div className="pitfall-rule-box">
                    <CheckCircle size={15} className="rule-icon" />
                    <span className="rule-text">{item.solutionRule}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
