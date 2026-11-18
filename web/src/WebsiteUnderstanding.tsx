import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  MapPin,
  Palette,
  RotateCcw,
  Undo2,
  Code2,
  MousePointer2,
  Type,
} from 'lucide-react';
import LivePage from './LivePage';
import { labValues, type LabRecord, type LabValues } from './mission-labs';
import { rememberLabEdit, type LabEdit } from './lab-history';
import { escapeHtml, visualAccents, type VisualAccent } from './visual-website';
import './website-understanding.css';

type Part = 'content' | 'appearance' | 'behaviour';
const parts: { id: Part; label: string; word: string; meaning: string }[] = [
  {
    id: 'content',
    label: 'Content',
    word: 'HTML',
    meaning: 'The words and structure on the page.',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    word: 'CSS',
    meaning: 'How those words and controls look.',
  },
  {
    id: 'behaviour',
    label: 'Behaviour',
    word: 'JavaScript',
    meaning: 'What the page does after an action.',
  },
];

export default function WebsiteUnderstanding({
  concept,
  record,
  onSave,
  onNext,
}: {
  concept: number;
  record?: LabRecord;
  onSave: (record: LabRecord) => void;
  onNext: () => void;
}) {
  const values = labValues(1, record?.values);
  const [part, setPart] = useState<Part>('content');
  const [history, setHistory] = useState<LabEdit[]>([]);
  const [generation, setGeneration] = useState(0);
  const [click, setClick] = useState<{ key: string; open: boolean; hasRule: boolean } | null>(null);
  const group = useRef(0);
  const pending = useRef<number | null>(null);
  const dock = useRef<HTMLDivElement>(null),
    preview = useRef<HTMLDivElement>(null);
  const title = String(values.heading),
    area = values.showArea === true,
    rule = values.rule === true;
  const accent = values.accent as VisualAccent;
  const selected = parts.find((p) => p.id === part)!;
  const viewKey = JSON.stringify([values, concept, part, generation]);
  const observation = click?.key === viewKey ? click : null;
  useEffect(
    () => () => {
      if (pending.current !== null) cancelAnimationFrame(pending.current);
    },
    [],
  );
  const reveal = () => {
    if (innerHeight <= 600 || matchMedia('(min-width:1100px)').matches) return;
    if (pending.current !== null) cancelAnimationFrame(pending.current);
    pending.current = requestAnimationFrame(() => {
      pending.current = null;
      if (!preview.current) return;
      const rect = preview.current.getBoundingClientRect(),
        inset = (dock.current?.getBoundingClientRect().height || 0) + 16;
      if (rect.top < inset || rect.top + Math.min(rect.height, 300) > innerHeight - 16)
        scrollBy({ top: rect.top - inset, behavior: 'instant' });
    });
  };
  const change = (patch: Partial<LabValues>, grouped = false, show = false) => {
    const after = labValues(1, { ...values, ...patch });
    setHistory((previous) =>
      rememberLabEdit(previous, {
        before: values,
        after,
        group: grouped ? group.current : undefined,
      }),
    );
    setClick(null);
    onSave({ values: after, note: record?.note || '' });
    if (show) reveal();
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setHistory(history.slice(0, -1));
    setClick(null);
    setGeneration((n) => n + 1);
    onSave({ values: previous.before, note: record?.note || '' });
  };
  const source =
    part === 'content'
      ? `<h1>${escapeHtml(title) || 'Your page title'}</h1>`
      : part === 'appearance'
        ? `h1 { color: ${visualAccents[accent].color}; }`
        : `const hasRule = ${rule};\nif (hasRule) {\n  details.hidden = !details.hidden;\n}`;
  const colour = () => {
    const choices: VisualAccent[] = ['teal', 'coral', 'violet'];
    change({ accent: choices[(choices.indexOf(accent) + 1) % choices.length] }, false, true);
  };
  return (
    <section
      className="website-understanding"
      aria-label="Understand your running page"
      data-concept={concept}
    >
      <header className="wu-heading">
        <span>SAME PAGE / A CLOSER LOOK</span>
        <h3>
          {concept === 0 ? 'Help a visitor find an answer.' : 'Three roles. One working page.'}
        </h3>
        <p>
          {concept === 0
            ? 'Change one thing and ask whether it helps the person using the page.'
            : 'Choose one role. Change it. Watch the matching part of your page.'}
        </p>
      </header>
      {concept === 1 && (
        <nav className="wu-parts" aria-label="Choose a page role">
          {parts.map((p) => (
            <button key={p.id} aria-pressed={part === p.id} onClick={() => setPart(p.id)}>
              {p.id === 'content' ? (
                <Type size={17} />
              ) : p.id === 'appearance' ? (
                <Palette size={17} />
              ) : (
                <MousePointer2 size={17} />
              )}
              <span>
                {p.label}
                <small>{p.word}</small>
              </span>
            </button>
          ))}
        </nav>
      )}
      <div className="wu-scene">
        <div className="wu-coach">
          {concept === 0 ? (
            <div className="wu-question">
              <span>
                <MapPin size={17} /> A VISITOR ASKS
              </span>
              <blockquote>“I’m in the North district. Can you visit me?”</blockquote>
              <p>
                The dedicated area line answers this question. Hide it, then try changing only the
                colour.
              </p>
            </div>
          ) : (
            <div className="wu-question">
              <span>
                <Code2 size={17} /> {selected.word}
              </span>
              <h4>{selected.meaning}</h4>
              <p>
                {part === 'content'
                  ? 'Edit the heading you brought from Explore. The outlined words are its HTML content.'
                  : part === 'appearance'
                    ? 'Change only the colour. The words, area setting and click rule stay the same.'
                    : 'Turn the click rule off, then press Contact inside the page. Compare what it does.'}
              </p>
            </div>
          )}
          <div className="wu-actions" ref={dock}>
            {concept === 0 ? (
              <>
                <button
                  className="wu-primary"
                  onClick={() => change({ showArea: !area }, false, true)}
                >
                  {area ? 'Hide the area line' : 'Show the area line'}
                  <ArrowRight size={16} />
                </button>
                <button onClick={colour}>
                  <Palette size={16} />
                  Change only the colour
                </button>
              </>
            ) : part === 'content' ? (
              <>
                <label>
                  Your page heading
                  <input
                    aria-label="Lesson page heading"
                    value={title}
                    maxLength={70}
                    onFocus={() => group.current++}
                    onChange={(event) => change({ heading: event.target.value }, true)}
                  />
                </label>
                <button
                  className="wu-primary"
                  onClick={() =>
                    change(
                      {
                        heading:
                          title === 'Bicycle repairs near you.'
                            ? 'Repairs near you.'
                            : 'Bicycle repairs near you.',
                      },
                      false,
                      true,
                    )
                  }
                >
                  Try a different heading
                  <ArrowRight size={16} />
                </button>
              </>
            ) : part === 'appearance' ? (
              <div className="wu-colours" role="group" aria-label="Choose the page colour">
                {(['teal', 'coral', 'violet'] as VisualAccent[]).map((key) => (
                  <button
                    key={key}
                    aria-pressed={key === accent}
                    onClick={() => change({ accent: key }, false, true)}
                  >
                    <i style={{ background: visualAccents[key].color }} />
                    {visualAccents[key].name}
                  </button>
                ))}
              </div>
            ) : (
              <button className="wu-primary" onClick={() => change({ rule: !rule }, false, true)}>
                {rule ? 'Turn the click rule off' : 'Turn the click rule on'}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
          {concept === 0 ? (
            <div className="wu-finding" role="status">
              <span>CURRENT OBSERVATION</span>
              <strong>The dedicated area line is {area ? 'shown.' : 'hidden.'}</strong>
              <p>
                {area
                  ? 'It explicitly names the North district. Colour changes can keep this information intact.'
                  : 'Changing colour does not restore this line. Look at whether other words still answer the visitor’s question.'}
              </p>
              <dl>
                <div>
                  <dt>Outcome</dt>
                  <dd>The visitor can find the information they need.</dd>
                </div>
                <div>
                  <dt>Implementation</dt>
                  <dd>The page content, styles and action rules that make it possible.</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="wu-source">
              <span>SMALL EXTRACT / CURRENT INSTRUCTIONS</span>
              <pre>
                <code>{source}</code>
              </pre>
              <p>
                {part === 'content'
                  ? 'Your heading is inserted as text; it cannot add new HTML elements.'
                  : part === 'appearance'
                    ? 'This colour value is used in the running page’s stylesheet.'
                    : observation
                      ? !observation.hasRule
                        ? 'Contact received the click. The rule was off, so the details stayed hidden.'
                        : observation.open
                          ? 'Contact revealed fictional details inside this browser. Nothing was sent.'
                          : 'Contact hid the details again. Nothing was sent.'
                      : 'Now press Contact in the page. The result here follows that actual click.'}
              </p>
              <small>AI can write the code. Your task is to explain its role.</small>
            </div>
          )}
        </div>
        <div className="wu-preview" ref={preview}>
          <div className="wu-preview-label">
            <span>
              <i /> YOUR RUNNING PAGE
            </span>
            <small>Fictional teaching example</small>
          </div>
          <LivePage
            key={generation}
            heading={title}
            showArea={area}
            accent={accent}
            rule={rule}
            focus={
              concept === 0
                ? 'area'
                : part === 'content'
                  ? 'heading'
                  : part === 'appearance'
                    ? 'heading'
                    : 'contact'
            }
            title="Your lesson page"
            onAction={(open, hasRule) => setClick({ key: viewKey, open, hasRule })}
          />
          <p>
            {concept === 0
              ? 'The dashed outline marks the area line when it exists. Your own heading may contain useful information too; inspect the whole page.'
              : 'The dashed outline connects this explanation to an actual element. A browser reads these instructions and displays the result.'}
          </p>
        </div>
      </div>
      <div className="wu-tools">
        <span>Same saved inputs as Explore.</span>
        <button disabled={!history.length} onClick={undo}>
          <Undo2 size={15} />
          Undo lesson change
        </button>
        <button
          onClick={() => {
            change(labValues(1));
            setGeneration((n) => n + 1);
          }}
        >
          <RotateCcw size={15} />
          Reset lesson page
        </button>
      </div>
      <footer className="wu-next">
        <div>
          <span>YOUR SMALL TASK</span>
          <p>
            {concept === 0
              ? 'Keep the heading fixed. Hide the area line, change the colour, then restore the line. Which action brought that information back?'
              : 'Restore the click rule. In your own project, ask AI to show the content, styles and behaviour it actually created.'}
          </p>
        </div>
        <button onClick={onNext}>
          {concept === 0 ? 'Next: the page’s three roles' : 'Apply it to my project'}
          <ArrowRight size={16} />
        </button>
      </footer>
      <details className="wu-boundary">
        <summary>What this experiment can show</summary>
        <p>
          This runs actual HTML, CSS and browser JavaScript, using the same saved Mission 1 inputs.
          It changes no live business site and sends no message. It tracks the dedicated area line,
          not the meaning of every word you write. A person must judge whether the whole page
          answers their visitor’s question.
        </p>
        <p>
          The code extracts show selected instructions, not the whole implementation or a measured
          execution trace. Hosting, a backend, a database or live AI are not demonstrated by this
          local page. Input undo is limited to this lesson visit; notes stay separate. These actions
          do not complete your project or its understanding review.
        </p>
      </details>
    </section>
  );
}
