import { comparisonValues, labStories, sameLabValues } from './lab-stories';
import type { LabValues } from './mission-labs';
import './lesson-pacing.css';

export default function GuidedComparison({
  id,
  values,
  choice,
  onChoice,
  open,
  onOpen,
}: {
  id: number;
  values: LabValues;
  choice: number;
  onChoice: (choice: number) => void;
  open: boolean;
  onOpen: (open: boolean) => void;
}) {
  const story = labStories[id - 1],
    comparison = story.comparisons[choice];
  const before = comparisonValues(id, comparison),
    after = comparisonValues(id, comparison, true);
  const showing = sameLabValues(values, before)
    ? 'before'
    : sameLabValues(values, after)
      ? 'after'
      : 'variation';
  return (
    <details
      className="lab-guided-comparison"
      open={open}
      onToggle={(event) => onOpen(event.currentTarget.open)}
    >
      <summary>
        <span>Try a guided comparison</span>
        <small>One change. Two cases.</small>
      </summary>
      <div className="guided-comparison-content">
        <div className="comparison-choices" role="group" aria-label="Choose a guided comparison">
          {story.comparisons.map((item, index) => (
            <button
              key={item.title}
              aria-pressed={index === choice}
              onClick={() => onChoice(index)}
            >
              {index + 1}. {item.title}
            </button>
          ))}
        </div>
        <p className="comparison-notice">{comparison.notice}</p>
        <p className="comparison-result" role="status">
          <strong>
            {showing === 'before'
              ? 'Starting case'
              : showing === 'after'
                ? 'Changed case'
                : 'Your own variation'}
          </strong>
          <span>
            {showing === 'after'
              ? comparison.takeaway
              : showing === 'before'
                ? 'Now change one part and compare the live result.'
                : 'Use either example case, or keep exploring with your own inputs. The live result follows your actual values.'}
          </span>
        </p>
        <small className="comparison-boundary">
          Example buttons load fictional teaching inputs. You can edit them freely and undo the
          change.
        </small>
      </div>
    </details>
  );
}

export function ComparisonSwitch({
  id,
  choice,
  values,
  onApply,
}: {
  id: number;
  choice: number;
  values: LabValues;
  onApply: (values: LabValues) => void;
}) {
  const comparison = labStories[id - 1].comparisons[choice];
  const before = comparisonValues(id, comparison),
    after = comparisonValues(id, comparison, true);
  return (
    <div className="comparison-action-dock" aria-label="Compare the live result">
      <div className="comparison-actions">
        <button aria-pressed={sameLabValues(values, before)} onClick={() => onApply(before)}>
          Show before
        </button>
        <span aria-hidden="true">→</span>
        <button aria-pressed={sameLabValues(values, after)} onClick={() => onApply(after)}>
          Change one part
        </button>
      </div>
    </div>
  );
}
