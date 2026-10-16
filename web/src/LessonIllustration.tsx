import type { ReactNode } from 'react';
import type { LabResult, LabValues } from './mission-labs';

const ink = '#142e37',
  cream = '#e5d1a4',
  teal = '#83c9b0',
  coral = '#e1a181',
  dim = '#547c79';
function Block({
  x,
  y,
  label,
  value = '',
  good = true,
  height = 64,
  children,
}: {
  x: number;
  y: number;
  label: string;
  value?: string | number;
  good?: boolean;
  height?: number;
  children?: ReactNode;
}) {
  const roof = good ? cream : '#a8b8ac';
  return (
    <g transform={`translate(${x} ${y})`} className="ls-object">
      <path d={`M0 0 57-27 114 0 57 27Z`} fill={roof} />
      <path d={`M0 0v${height}l57 27V27Z`} fill={good ? '#b8a582' : '#668782'} />
      <path d={`M57 27v${height}l57-27V0Z`} fill={good ? '#8b9e88' : '#3f6565'} />
      <text x="57" y="-43" textAnchor="middle" className="ls-map-label">
        {label}
      </text>
      <text x="57" y="72" textAnchor="middle" fill={ink} className="ls-map-value">
        {String(value).slice(0, 14)}
      </text>
      {children}
    </g>
  );
}
function Card({
  x,
  y,
  label,
  detail = '',
  good = true,
  width = 135,
}: {
  x: number;
  y: number;
  label: string;
  detail?: string;
  good?: boolean;
  width?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`} className="ls-object">
      <path d={`M0 0 ${width - 12} 0 ${width} 12V82H0Z`} fill={good ? '#ecdfbf' : '#b9cac0'} />
      <path d={`M${width - 12} 0v12h12`} fill="none" stroke="#8caa96" />
      <rect x="12" y="17" width="8" height="8" rx="2" fill={good ? '#367b67' : '#a95c45'} />
      <text x="12" y="43" fill={ink} className="ls-card-label">
        {label.slice(0, 19)}
      </text>
      <text x="12" y="65" fill="#426457" className="ls-card-detail">
        {detail.slice(0, 24)}
      </text>
    </g>
  );
}
function Dots({
  count,
  marked = 0,
  x = 135,
  y = 110,
  total = count,
}: {
  count: number;
  marked?: number;
  x?: number;
  y?: number;
  total?: number;
}) {
  const shown = Math.min(40, Math.max(0, count));
  return (
    <g>
      {Array.from({ length: shown }, (_, i) => (
        <g key={i} transform={`translate(${x + (i % 10) * 37} ${y + Math.floor(i / 10) * 35})`}>
          <path d="M0 0 12-6 24 0 12 6Z" fill={i < marked ? coral : cream} />
          <path d="M0 0v16l12 6V6Z" fill={i < marked ? '#b27660' : '#b9a782'} />
          <path d="M12 6v16l12-6V0Z" fill={i < marked ? '#865e51' : '#6d9887'} />
        </g>
      ))}
      <text x={x} y={y + Math.ceil(shown / 10) * 35 + 30} className="ls-map-label">
        {shown === total ? `${total} represented` : `Showing ${shown} of ${total}`}
      </text>
    </g>
  );
}
function Road({ blocked = false }: { blocked?: boolean }) {
  return (
    <path
      d="M115 222H594"
      stroke={blocked ? coral : '#a0bd9f'}
      strokeWidth="3"
      strokeDasharray={blocked ? '6 10' : '14 10'}
      opacity=".65"
    />
  );
}
function Shelves({ rows }: { rows: { id: string; label: string; good: boolean }[] }) {
  return (
    <g>
      {rows.slice(0, 8).map((r, i) => (
        <Card
          key={i}
          x={75 + (i % 4) * 146}
          y={92 + Math.floor(i / 4) * 107}
          label={r.id}
          detail={r.label}
          good={r.good}
        />
      ))}
      {rows.length === 0 && (
        <text x="360" y="180" textAnchor="middle" className="ls-empty">
          The collection is empty
        </text>
      )}
    </g>
  );
}
/** The illustration reads the already-executed result; it never grades or recomputes business rules. */
export default function LessonIllustration({
  id,
  outcome: o,
  values: v,
  moment,
}: {
  id: number;
  outcome: LabResult;
  values: LabValues;
  moment: number;
}) {
  const a = o.visual;
  let picture: ReactNode;
  switch (id) {
    case 2:
      picture = a?.kind === 'brief' && (
        <>
          <Road />
          <Card
            x={55}
            y={126}
            label="Builder’s brief"
            detail={a.text}
            good={a.signals.every((s) => s.term !== null)}
          />
          {a.signals.map((s, i) => (
            <g key={s.label} transform={`translate(${260 + i * 132} 95)`}>
              <path d="M0 100h100" stroke={s.term ? teal : coral} strokeWidth="6" />
              <Card
                x={0}
                y={0}
                width={116}
                label={s.label}
                detail={s.term || 'Not recognised'}
                good={!!s.term}
              />
            </g>
          ))}
        </>
      );
      break;
    case 4:
      picture = a?.kind === 'estimate' && (
        <>
          <Block
            x={60}
            y={164}
            label="Quantity text"
            value={a.raw.trim() || 'Blank'}
            good={a.quantity !== null}
          />
          <Card
            x={261}
            y={82}
            width={196}
            label={a.total === null ? 'No estimate' : `${a.total} units`}
            detail={a.total === null ? 'Correct the quantity' : `${a.quantity} × ${a.price} units`}
            good={a.total !== null}
          />
          {a.quantity !== null ? (
            <Dots x={260} y={220} count={a.quantity} total={a.quantity} />
          ) : (
            <text x="510" y="180" className="ls-empty">
              Stopped
            </text>
          )}
        </>
      );
      break;
    case 5:
      picture = a?.kind === 'collection' && (
        <Shelves rows={a.records.map((r) => ({ id: r.id, label: r.label, good: !r.repeated }))} />
      );
      break;
    case 6:
      picture = a?.kind === 'provenance' && (
        <>
          <Block x={55} y={110} label="Source" value={a.source} good={a.source === 'records'} />
          <Dots x={255} y={106} count={a.sample} marked={a.missed} total={a.sample} />
          <Card
            x={55}
            y={237}
            label={a.valid ? 'Counts fit' : 'Counts conflict'}
            detail={`${a.missed} missed / ${a.sample}`}
            good={a.valid}
          />
        </>
      );
      break;
    case 7:
      picture = a?.kind === 'rate' && (
        <>
          <Dots x={80} y={110} count={a.eligible ?? 0} marked={a.missed} total={a.eligible ?? 0} />
          <Card
            x={496}
            y={131}
            width={159}
            label={a.percent === null ? 'Rate unknown' : `${Number(a.percent.toFixed(1))}% missed`}
            detail={`Target ${a.target}%`}
            good={a.percent !== null}
          />
          {a.eligible === null && (
            <text x="150" y="150" className="ls-empty">
              Total unknown
            </text>
          )}
        </>
      );
      break;
    case 8:
      picture = a?.kind === 'journey' && (
        <>
          <Road blocked={o.tone === 'blocked'} />
          <Card
            x={55}
            y={128}
            label="Visitor’s draft"
            detail={a.draft || 'Missing identifier'}
            good={!!a.draft.trim()}
          />
          <Block
            x={295}
            y={151}
            label="Connection"
            value={v.connected ? 'Available' : 'Offline'}
            good={v.connected === true}
          />
          <Card
            x={514}
            y={128}
            label={a.steps[2].state === 'ready' ? 'Model confirmation' : 'Draft stays here'}
            detail={a.draft || 'Enter a visit'}
            good={a.steps[2].state === 'ready'}
          />
        </>
      );
      break;
    case 9:
      picture = a?.kind === 'cost' && (
        <>
          <Block x={95} y={145} label="Package" value={`${a.monthly} / month`} height={50} />
          <Block x={488} y={145} label="Build" value={a.build} height={50} />
          {a.points
            .filter(
              (_, i) =>
                i % Math.max(1, Math.ceil(a.points.length / 12)) === 0 || i === a.points.length - 1,
            )
            .map((p, i) => (
              <g key={p.month}>
                <rect
                  x={240 + i * 15}
                  y={249 - Math.min(120, (p.package / Math.max(a.build, 1)) * 85)}
                  width="9"
                  height={Math.min(120, (p.package / Math.max(a.build, 1)) * 85)}
                  fill={teal}
                />
              </g>
            ))}
          <text x="300" y="282" className="ls-map-label">
            {a.months} months · setup {a.setup}
          </text>
          <text x="300" y="84" className="ls-map-label">
            {a.fits ? 'Required export fits' : 'Missing required export'}
          </text>
        </>
      );
      break;
    case 10:
    case 21:
      picture = a?.kind === 'records' && (
        <>
          <text x="90" y="64" className="ls-map-label">
            {id === 10 ? 'WHAT ACTUALLY CHANGED?' : 'CAN YOUR CHECK CATCH THIS?'}
          </text>
          <text x="90" y="86" className="ls-card-detail" fill={cream}>
            {v.check === 'toast' ? 'Toast check' : 'Record assertion'} ·{' '}
            {o.tone === 'blocked' ? 'Fails' : 'Passes'}
          </text>
          {a.records.map((r, i) => (
            <g key={r.id}>
              <Card x={80} y={101 + i * 105} label={r.id} detail={r.before} />
              <path
                d={`M246 ${141 + i * 105}h133`}
                stroke={r.state === 'blocked' ? coral : teal}
                strokeWidth="3"
                strokeDasharray="7 6"
              />
              <Card
                x={441}
                y={101 + i * 105}
                label={r.id}
                detail={r.after}
                good={r.state !== 'blocked'}
              />
            </g>
          ))}
        </>
      );
      break;
    case 11:
      picture = a?.kind === 'journey' && (
        <>
          <Road blocked={o.tone !== 'ready'} />
          <Block
            x={55}
            y={151}
            label="Browser"
            value={a.timing ? `${a.timing.wait} ms wait` : 'Request'}
          />
          <Block
            x={300}
            y={151}
            label="Server"
            value={a.timing ? `${a.timing.response} ms` : 'Input refused'}
            good={!!a.timing}
          />
          <Card
            x={520}
            y={139}
            label={o.tone === 'ready' ? 'Response' : 'No success claim'}
            detail={
              o.tone === 'careful'
                ? 'Server state unknown'
                : o.tone === 'blocked'
                  ? 'Validation error'
                  : 'Within waiting limit'
            }
            good={o.tone === 'ready'}
          />
        </>
      );
      break;
    case 12:
      picture = a?.kind === 'records' && (
        <>
          <Block
            x={64}
            y={133}
            label={v.storage === 'memory' ? 'Process memory' : 'Persistent store'}
            value={v.restart ? 'Restarted' : 'Running'}
            good={!(v.restart && v.storage === 'memory')}
          />
          {a.records.map((r, i) => (
            <Card
              key={r.id}
              x={286 + i * 175}
              y={135}
              label={r.id}
              detail={
                r.after === 'Retained'
                  ? `${r.before} · ${r.state === 'ready' ? 'matched' : 'not matched'}`
                  : r.after
              }
              good={r.after === 'Retained'}
            />
          ))}
        </>
      );
      break;
    case 13:
      picture = o.reservations && (
        <>
          <text x="64" y="71" className="ls-map-label">
            {o.reservations.operations.length} distinct operations · {o.reservations.capacity} slots
          </text>
          <text x="64" y="94" className="ls-map-label">
            {v.atomic ? 'One atomic capacity rule' : 'Separate check, then write'}
          </text>
          <text x="64" y="310" className="ls-map-label">
            {o.reservations.attempts} attempts ·{' '}
            {v.sameKey ? 'Retries reuse the same identity' : 'Retries create new identities'}
          </text>
          {o.reservations.operations.slice(0, 12).map((r, i) => (
            <g
              key={r.id}
              transform={`translate(${70 + (i % 6) * 99} ${117 + Math.floor(i / 6) * 94})`}
            >
              <path
                d="M0 0 32-16 64 0 32 16Z"
                fill={r.state === 'accepted' ? teal : r.state === 'refused' ? dim : coral}
              />
              <path
                d="M0 0v32l32 16V16Zm32 16v32l32-16V0Z"
                fill={r.state === 'overbooked' ? '#976655' : '#527f74'}
              />
              <text x="32" y="68" textAnchor="middle" className="ls-card-detail" fill={cream}>
                {r.id} ·{' '}
                {r.state === 'accepted' ? 'fits' : r.state === 'refused' ? 'refused' : 'overbooked'}
              </text>
            </g>
          ))}
        </>
      );
      break;
    case 14:
      picture = a?.kind === 'access' && (
        <>
          <Road blocked={!a.permitted} />
          <Block x={65} y={150} label="Signed-in caller" value={a.caller} />
          <g transform="translate(342 136)">
            <path d="M0 0v125" stroke={a.trustedCheck ? cream : coral} strokeWidth="11" />
            <path
              d={a.permitted ? 'M0 15 20-41' : 'M0 15h79'}
              stroke={a.permitted ? teal : coral}
              strokeWidth="9"
            />
            <text x="20" y="-58" textAnchor="middle" className="ls-map-label">
              {a.trustedCheck ? 'Trusted check' : 'Check absent'}
            </text>
          </g>
          <Card
            x={508}
            y={137}
            label={`Owner ${a.owner}`}
            detail={a.returned ? 'Returned by model' : 'No record returned'}
            good={a.permitted}
          />
        </>
      );
      break;
    case 15:
      picture = a?.kind === 'journey' && (
        <>
          <Road blocked={a.steps[1].state !== 'ready'} />
          <Block
            x={55}
            y={149}
            label="Adapter"
            value={v.credential ? 'Configured' : 'Missing key'}
            good={v.credential === true}
          />
          <g transform="translate(298 135)">
            <path d="M0 0h115v75H0Z" fill={cream} />
            <path d="m0 0 57 40 58-40" stroke="#b3a184" fill="none" strokeWidth="3" />
            <text x="57" y="113" textAnchor="middle" className="ls-map-label">
              {v.credential ? `1 + ${v.retries} attempts` : '0 attempts'}
            </text>
          </g>
          <Block
            x={525}
            y={150}
            label="Provider"
            value={String(v.provider)}
            good={v.credential === true && v.provider === 'accepted'}
          />
          <text x="305" y="299" className="ls-map-label">
            Delivery is not verified
          </text>
        </>
      );
      break;
    case 16:
      picture = a?.kind === 'budget' && (
        <>
          <Block x={60} y={153} label="Authority" value={a.permission} good={a.allowed} />
          <Card
            x={278}
            y={104}
            width={164}
            label={`${a.executed} operations run`}
            detail={`Demand ${a.demand}`}
            good={a.allowed}
          />
          <g transform="translate(505 102)">
            <rect width="120" height="144" rx="12" fill={ink} stroke={cream} />
            <rect
              x="9"
              y={135 - (a.budget ? Math.max(0, (a.budget - a.executed) / a.budget) * 126 : 0)}
              width="102"
              height={a.budget ? Math.max(0, (a.budget - a.executed) / a.budget) * 126 : 0}
              rx="5"
              fill={teal}
            />
            <text x="60" y="174" textAnchor="middle" className="ls-map-label">
              {a.budget - a.executed} budget left
            </text>
          </g>
        </>
      );
      break;
    case 17:
      picture = a?.kind === 'contract' && (
        <>
          <Block x={45} y={136} label="Interface expects" value={a.expected} good={a.compatible} />
          <Block x={510} y={136} label="Server supplies" value={a.actual} good={a.compatible} />
          <path
            d="M190 170h310"
            stroke={a.compatible ? teal : coral}
            strokeWidth="4"
            strokeDasharray={a.compatible ? '0' : '9 12'}
          />
          {Array.from({ length: Math.min(a.schedule?.workers ?? 0, 6) }, (_, i) => (
            <g key={i}>
              <rect x="235" y={215 + i * 12} width="225" height="5" rx="2" fill={teal} />
            </g>
          ))}
          <text x="345" y="92" textAnchor="middle" className="ls-map-label">
            {a.compatible ? 'Names agree' : 'Different field names'}
          </text>
          <text x="345" y="310" textAnchor="middle" className="ls-map-label">
            {a.schedule?.workers} workers · {a.schedule?.rounds} rounds
          </text>
        </>
      );
      break;
    case 18:
      picture = a?.kind === 'validation' && (
        <>
          <Card
            x={45}
            y={124}
            label="AI-shaped text"
            detail={a.formatted ? 'Parsed' : 'Parse refused'}
            good={!!a.formatted}
          />
          {a.checks.map((c, i) => (
            <g key={c.label} transform={`translate(${239 + i * 145} 118)`}>
              <path
                d="M0 0 49-24 98 0 49 24Z"
                fill={c.state === 'pass' ? teal : c.state === 'fail' ? coral : dim}
              />
              <path d="M0 0v66l49 24V24Zm49 24v66l49-24V0Z" fill="#3d6665" />
              <text x="49" y="52" textAnchor="middle" className="ls-map-value" fill={cream}>
                {c.state === 'pass' ? '✓' : c.state === 'fail' ? '×' : '?'}
              </text>
              <text x="49" y="124" textAnchor="middle" className="ls-map-label">
                {c.label}
              </text>
            </g>
          ))}
        </>
      );
      break;
    case 19:
      picture = a?.kind === 'retrieval' && (
        <>
          <Block x={49} y={158} label="Question" value={a.question} />
          <g transform="translate(269 92)">
            {Array.from({ length: 5 }, (_, i) => (
              <path
                key={i}
                d={`M${i * 21} ${(i % 2) * 8}v132h16V${(i % 2) * 8}Z`}
                fill={i % 2 ? cream : '#779b88'}
              />
            ))}
            <text x="50" y="173" textAnchor="middle" className="ls-map-label">
              Source age {a.age} / {a.limit} days
            </text>
          </g>
          <Block
            x={525}
            y={158}
            label="Separate authority"
            value={a.authority ? 'Granted' : 'Not granted'}
            good={a.authority}
          />
          <text x="345" y="306" textAnchor="middle" className="ls-map-label">
            {a.docAction ? 'Document asks for an action' : 'No embedded action'}
          </text>
        </>
      );
      break;
    case 20:
      picture = o.cases && (
        <>
          <g>
            {o.cases.slice(0, 100).map((c, i) => (
              <g
                key={c.id}
                transform={`translate(${64 + (i % 20) * 29} ${93 + Math.floor(i / 20) * 36})`}
              >
                <circle
                  r="10"
                  fill={c.positive ? (c.alert ? teal : coral) : c.alert ? '#e7c784' : dim}
                />
                <text textAnchor="middle" y="4" fill={ink} fontSize="11">
                  {c.positive ? (c.alert ? '✓' : '×') : c.alert ? '!' : '·'}
                </text>
              </g>
            ))}
          </g>
          <text x="64" y="308" className="ls-map-label">
            Showing {Math.min(100, o.cases.length)} of {o.cases.length} labelled cases · threshold{' '}
            {v.threshold}
          </text>
        </>
      );
      break;
    case 22:
      picture = a?.kind === 'release' && (
        <>
          <Block x={75} y={150} label="Running code" value={a.code} good={a.compatible} />
          <Block x={510} y={150} label="Data schema" value={a.schema} good={a.compatible} />
          <path
            d="M224 193h250"
            stroke={a.compatible ? teal : coral}
            strokeWidth="4"
            strokeDasharray="12 10"
          />
          <Card
            x={278}
            y={79}
            width={165}
            label={a.compatible ? 'Versions fit' : 'Versions conflict'}
            detail={
              a.checks.every((c) => c.pass) ? 'Build + config present' : 'Check build and config'
            }
            good={a.compatible && a.checks.every((c) => c.pass === true)}
          />
        </>
      );
      break;
    case 23:
      picture = a?.kind === 'trace' && (
        <>
          {a.spans.map((s, i) => (
            <g key={s.id}>
              <text x="65" y={98 + i * 70} className="ls-map-label">
                {s.label}
              </text>
              <rect
                x="222"
                y={78 + i * 70}
                width={Math.max(2, a.total ? (s.duration / a.total) * 410 : 2)}
                height="30"
                rx="5"
                fill={a.selected === s.id ? cream : a.longest.includes(s.id) ? coral : teal}
              />
              <text x="222" y={126 + i * 70} className="ls-map-label">
                {s.duration} ms
              </text>
            </g>
          ))}
          <text x="65" y="312" className="ls-map-label">
            Total {a.total} ms ·{' '}
            {a.longest.length === 0 ? 'All durations are zero' : `Longest: ${a.longest.join(', ')}`}
          </text>
        </>
      );
      break;
    case 24:
      picture = a?.kind === 'cache' && (
        <>
          <Block x={70} y={135} label="Source now" value={a.changed ? 'Updated' : 'Original'} />
          <Block
            x={510}
            y={135}
            label="Cached copy"
            value={`${a.age} min old`}
            good={a.reusable && !a.changed}
          />
          <path
            d="M224 190h253"
            stroke={a.reusable ? teal : coral}
            strokeDasharray="12 10"
            strokeWidth="3"
          />
          {a.reads.slice(0, 24).map((r, i) => (
            <g
              key={i}
              transform={`translate(${82 + (i % 12) * 45} ${264 + Math.floor(i / 12) * 30})`}
            >
              <circle
                r="11"
                fill={
                  r.stale ? coral : r.route === 'cache' ? teal : r.route === 'queue' ? cream : dim
                }
              />
              <text y="4" textAnchor="middle" className="ls-card-detail" fill={ink}>
                {r.route === 'cache' ? 'C' : r.route === 'queue' ? 'Q' : 'S'}
              </text>
            </g>
          ))}
        </>
      );
      break;
    case 25:
      picture = a?.kind === 'records' && (
        <>
          <Block
            x={55}
            y={151}
            label="Saved snapshot"
            value={v.backup ? 'Available' : 'Missing'}
            good={v.backup === true}
          />
          {a.records.slice(0, 8).map((r, i) => (
            <Card
              key={r.id}
              x={256 + (i % 3) * 132}
              y={81 + Math.floor(i / 3) * 81}
              width={118}
              label={r.id}
              detail={r.after}
              good={r.state === 'ready'}
            />
          ))}
          <text x="265" y="329" className="ls-map-label">
            {v.verify ? 'Lookup requested' : 'Lookup not requested'} · showing{' '}
            {Math.min(8, a.records.length)} / {a.records.length}
          </text>
        </>
      );
      break;
    case 27:
    case 30:
      picture = a?.kind === 'architecture' && (
        <>
          <text x="58" y="64" className="ls-map-label">
            NEED: {a.need}
          </text>
          {a.parts.map((p, i) => (
            <Block
              key={p.label}
              x={57 + (i % 4) * 158}
              y={150 + Math.floor(i / 4) * 110}
              label={p.label.slice(0, 20)}
              value={p.enabled ? 'Included' : p.required ? 'Missing' : 'Optional'}
              good={p.enabled}
              height={p.required ? 72 : 40}
            />
          ))}
          <text x="65" y="322" className="ls-map-label">
            {a.fits ? 'Declared capabilities fit' : 'A required capability is missing'}
          </text>
        </>
      );
      break;
    case 28:
      picture = a?.kind === 'benefit' && (
        <>
          <Dots x={69} y={105} count={a.people} marked={a.users} total={a.people} />
          <Card
            x={468}
            y={102}
            width={181}
            label={`${a.net} min net`}
            detail={`${a.gross} saved − ${a.correction} rework`}
            good={a.net > 0}
          />
          <text x="80" y="292" className="ls-map-label">
            {a.users} of {a.people} people use the change
          </text>
        </>
      );
      break;
    case 29:
      picture = a?.kind === 'contract' && (
        <>
          <Card
            x={45}
            y={80}
            label="Operator guide"
            detail={v.guide ? 'Provided' : 'Missing'}
            good={v.guide === true}
          />
          <Card
            x={45}
            y={190}
            label="Operator access"
            detail={v.access ? 'Available' : 'Missing'}
            good={v.access === true}
          />
          <Card
            x={268}
            y={122}
            width={177}
            label={a.actual || 'No field'}
            detail={`Expected ${a.expected}`}
            good={a.compatible}
          />
          <Block
            x={520}
            y={155}
            label="Field assertion"
            value={!v.check ? 'Not run' : a.compatible ? 'Passed' : 'Failed'}
            good={v.check === true && a.compatible}
          />
        </>
      );
      break;
    default:
      picture = <></>;
  }
  return (
    <svg
      className="lesson-illustration"
      viewBox="0 0 720 350"
      role="img"
      aria-label={o.headline}
      data-art={id}
    >
      <path d="M20 221 350 44 702 216 371 343Z" fill="#244a48" />
      <path d="M20 221v9l351 123v-10Z" fill="#16373d" />
      <path d="M371 343v10l331-128v-9Z" fill="#193c40" />
      <g className={`ls-picture ls-moment-${Math.min(2, Math.floor(moment))}`}>{picture}</g>
      <g aria-hidden="true">
        <path d="M90 337H630" stroke="#94ad8b" strokeWidth="2" opacity=".35" />
        <circle cx={90 + Math.min(2, moment) * 270} cy="337" r="6" fill={cream} />
      </g>
    </svg>
  );
}
