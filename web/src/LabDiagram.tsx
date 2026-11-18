import type { WorldProps } from './LabWorld';
export default function LabDiagram({
  nodes,
  selected,
  onSelect,
}: Pick<WorldProps, 'nodes' | 'selected' | 'onSelect'>) {
  return (
    <div className="lab-diagram" aria-label="System diagram">
      <svg viewBox="0 0 800 200" aria-hidden="true">
        <path d="M130 95C270 95 270 95 400 95S570 95 670 95" />
        <circle cx="130" cy="95" r="42" />
        <path d="M400 45l50 50-50 50-50-50Z" />
        <circle cx="670" cy="95" r="42" />
      </svg>
      {nodes.map((node, index) => (
        <button key={index} aria-pressed={selected === index} onClick={() => onSelect(index)}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{node.name}</strong>
          <output>{node.value}</output>
        </button>
      ))}
    </div>
  );
}
