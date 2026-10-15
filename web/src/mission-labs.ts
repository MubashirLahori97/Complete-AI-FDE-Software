import content from './mission-labs.json' with { type: 'json' };
import type { LabVisual } from './lab-visuals';

export type LabValue = string | number | boolean;
export type LabValues = Record<string, LabValue>;
export type LabControl = {
  id: string;
  label: string;
  type: 'text' | 'range' | 'select' | 'toggle';
  default: LabValue;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[][];
};
export type LabSpec = {
  id: number;
  title: string;
  idea: string;
  task: string;
  first: string;
  try: LabValues;
  boundary: string;
  challenge: string;
  controls: LabControl[];
};
export type LabResult = {
  visual?: LabVisual;
  headline: string;
  explanation: string;
  nodes: [string, string, string];
  tone: 'ready' | 'careful' | 'blocked';
  active: number;
  facts: { label: string; value: string }[];
  rows?: { label: string; before: string; after: string }[];
  bars?: { label: string; value: number; unit: string }[];
  reservations?: {
    capacity: number;
    attempts: number;
    operations: { id: string; state: 'accepted' | 'overbooked' | 'refused' }[];
  };
  cases?: { id: string; positive: boolean; score: number; alert: boolean }[];
};
export type LabRecord = { values: LabValues; note: string };
export const hasModelEvidence = (outcome: LabResult) =>
  !!(outcome.visual || outcome.reservations || outcome.cases);
// The packaging step validates the authored JSON before publishing.
export const labSpecs = content as unknown as LabSpec[];
export const labSpec = (id: number) => labSpecs[id - 1];
export function labValues(id: number, raw: unknown = {}): LabValues {
  const input =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  return Object.fromEntries(
    labSpec(id).controls.map((control) => {
      const value = input[control.id];
      let safe = control.default;
      if (control.type === 'toggle') safe = typeof value === 'boolean' ? value : control.default;
      if (control.type === 'text')
        safe =
          typeof value === 'string'
            ? value.slice(0, control.id === 'heading' ? 70 : 500)
            : control.default;
      if (control.type === 'select')
        safe =
          typeof value === 'string' && control.options?.some((option) => option[0] === value)
            ? value
            : control.default;
      if (control.type === 'range' && typeof value === 'number' && Number.isFinite(value)) {
        const step = control.step || 1;
        safe = Math.max(
          control.min!,
          Math.min(control.max!, Math.round((value - control.min!) / step) * step + control.min!),
        );
      }
      return [control.id, safe];
    }),
  );
}
const pct = (value: number | null) =>
  value === null ? 'Unknown' : `${Number((value * 100).toFixed(1))}%`;
const fact = (label: string, value: string | number) => ({ label, value: String(value) });
const result = (
  headline: string,
  explanation: string,
  nodes: [string, string, string],
  options: Partial<Omit<LabResult, 'headline' | 'explanation' | 'nodes'>> = {},
): LabResult => ({ headline, explanation, nodes, tone: 'ready', active: 2, facts: [], ...options });
const isoDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
export function evaluateLab(id: number, raw: unknown): LabResult {
  const v = labValues(id, raw);
  const s = (key: string) => String(v[key] ?? '');
  const n = (key: string) => Number(v[key]);
  const b = (key: string) => v[key] === true;
  switch (id) {
    case 1:
      return result(
        s('heading').trim() || 'A heading is still missing',
        'The live page below displays your heading. The browser is doing this work locally; an AI service does not participate in this change.',
        [
          'A visitor opens the page',
          'Files are already in this browser',
          s('heading').trim() || 'No useful heading yet',
        ],
        {
          tone: s('heading') === 'Welcome.' ? 'careful' : 'ready',
          facts: [fact('Heading characters', s('heading').length), fact('Live AI calls', 0)],
        },
      );
    case 2: {
      const text = s('direction');
      const signals = [
        {
          label: 'A named part',
          regex: /\b(hours|opening|services|heading|contact)\b/i,
          example: 'opening hours',
        },
        {
          label: 'An action',
          regex: /\b(move|put|show|replace|add|remove|keep)\b/i,
          example: 'put below Services',
        },
        {
          label: 'A check',
          regex: /\b(check|visible|verify|phone|keyboard)\b/i,
          example: 'check on a phone',
        },
      ].map(({ label, regex, example }) => {
        const match = regex.exec(text);
        return { label, term: match?.[0] || null, start: match?.index ?? -1, example };
      });
      const [part, action, check] = signals.map((signal) => !!signal.term);
      const count = Number(part) + Number(action) + Number(check);
      return result(
        count === 3 && s('scope') === 'one'
          ? 'A bounded, checkable example'
          : 'Which part or observation is missing?',
        `This small checklist recognised ${count} of 3 signals: a named part, an action and a check. ${s('scope') === 'one' ? 'Unrelated parts are outside the stated scope.' : 'The whole site is still in scope.'} It cannot judge arbitrary instructions or guarantee AI behaviour.`,
        [
          part ? 'A part is named' : 'No recognised part',
          `${action ? 'Action named' : 'Action unclear'} · scope: ${s('scope')}`,
          check ? 'An observation is named' : 'No recognised check',
        ],
        {
          visual: { kind: 'brief', text, scope: s('scope'), signals },
          tone: count === 3 && s('scope') === 'one' ? 'ready' : 'careful',
          facts: [
            fact('Recognised signals', `${count} / 3`),
            fact('Scope', s('scope') === 'one' ? 'One part' : 'Whole site'),
          ],
        },
      );
    }
    case 3:
      return result(
        `${n('size')}px · ${b('rule') ? 'click rule present' : 'click rule removed'}`,
        'The words and size are separate inputs. The actual preview keeps the same words when CSS size changes. A visible button still needs an action rule to reveal details.',
        [s('heading'), `${n('size')}px`, b('rule') ? 'Click → show details' : 'Click → no action'],
        {
          tone: b('rule') ? 'ready' : 'careful',
          facts: [
            fact('Heading size', `${n('size')}px`),
            fact('Action rule', b('rule') ? 'Present' : 'Removed'),
          ],
        },
      );
    case 4: {
      const quantity = s('quantity');
      const q = Number(quantity);
      const valid =
        quantity.trim() !== '' && Number.isFinite(q) && Number.isInteger(q) && q >= 0 && q <= 20;
      return result(
        valid ? `${q * n('price')} units` : 'No estimate produced',
        valid
          ? `${q} whole items × ${n('price')} units per item = ${q * n('price')} units. Zero is allowed by this rule.`
          : 'This rule requires a whole quantity from 0 to 20. A blank input is missing information; converting it to zero silently would change its meaning.',
        [
          quantity.trim() || 'Blank input',
          valid ? 'Whole quantity in range' : 'Validation refuses input',
          valid ? `${q * n('price')} units` : 'Explain the correction',
        ],
        {
          visual: {
            kind: 'estimate',
            raw: quantity,
            quantity: valid ? q : null,
            price: n('price'),
            total: valid ? q * n('price') : null,
            reason: valid
              ? 'Whole quantities from 0 to 20 are allowed.'
              : quantity.trim() === ''
                ? 'A blank quantity is missing information. It is not zero.'
                : 'Use a whole quantity from 0 to 20.',
          },
          tone: valid ? 'ready' : 'blocked',
          active: valid ? 2 : 1,
          facts: [fact('Unit price', n('price')), fact('Accepted quantity', valid ? q : 'None')],
        },
      );
    }
    case 5: {
      const records = Array.from({ length: n('count') }, (_, i) => ({
        id: `S${b('duplicate') && i === n('count') - 1 && i > 0 ? i : i + 1}`,
        label: `${s('prefix') || 'Service'} ${i + 1}`,
      }));
      const unique = new Set(records.map((row) => row.id)).size;
      const duplicate = unique !== records.length;
      return result(
        duplicate
          ? 'Two records share an identifier'
          : records.length
            ? `${records.length} records, one shared rule`
            : 'The collection is empty',
        duplicate
          ? 'The duplicate check compared actual generated identifiers. A display label does not repair a repeated ID.'
          : `The same mapping function ran ${records.length} times. ${records.length ? 'Each generated record keeps its identifier.' : 'An empty collection produces no service cards.'}`,
        [
          `${records.length} source records`,
          `${unique} unique identifiers`,
          duplicate ? 'Resolve identity before display' : `${records.length} labelled cards`,
        ],
        {
          visual: {
            kind: 'collection',
            records: records.map((row) => ({
              ...row,
              repeated: records.filter((other) => other.id === row.id).length > 1,
            })),
          },
          tone: duplicate ? 'blocked' : 'ready',
          active: duplicate ? 1 : 2,
          facts: [fact('Records', records.length), fact('Unique IDs', unique)],
          rows: records.map((row) => ({
            label: row.id,
            before: 'Source record',
            after: row.label,
          })),
        },
      );
    }
    case 6: {
      const valid = n('missed') <= n('sample');
      const source = s('source');
      return result(
        !valid
          ? 'The counts cannot describe that sample'
          : source === 'records'
            ? 'A defined record sample'
            : 'The claim needs stronger support',
        !valid
          ? 'The missed count cannot exceed the visits in the same sample. Check definitions and data before calculating a rate.'
          : source === 'records'
            ? `Within these fictional inputs, ${n('missed')} of ${n('sample')} visits were missed. This describes the sample; it does not identify a cause.`
            : source === 'memory'
              ? 'A recollection can guide investigation, but it does not establish the frequency in a defined population.'
              : 'An invented example illustrates a possibility. It is not an observation about the organisation.',
        [
          source === 'records'
            ? 'Checked records'
            : source === 'memory'
              ? 'A recollection'
              : 'An invented example',
          valid ? `${n('missed')} / ${n('sample')}` : 'Counts conflict',
          source === 'records' && valid ? 'Investigate the causes' : 'Gather relevant evidence',
        ],
        {
          tone: !valid ? 'blocked' : source === 'records' ? 'ready' : 'careful',
          facts: [
            fact('Sample rate', valid ? pct(n('missed') / n('sample')) : 'Invalid counts'),
            fact('Real field observations', 0),
          ],
        },
      );
    }
    case 7: {
      const total = s('eligible').trim() ? n('eligible') : NaN;
      const valid = Number.isSafeInteger(total) && total > 0 && total >= n('missed');
      const rate = valid ? n('missed') / total : null;
      return result(
        rate === null ? 'The rate is unknown' : `${pct(rate)} of eligible visits missed`,
        rate === null
          ? 'A rate needs a known positive denominator and consistent counts. Unknown is not zero.'
          : `${n('missed')} ÷ ${total} × 100 = ${pct(rate)}. The target is ${n('target')}% using the same definition. These fictional counts do not demonstrate improvement.`,
        [
          valid ? `${total} eligible visits` : 'Eligible total not established',
          `${n('missed')} missed`,
          rate === null ? 'No defensible rate' : pct(rate),
        ],
        {
          visual: {
            kind: 'rate',
            eligible: valid ? total : null,
            missed: n('missed'),
            percent: rate === null ? null : rate * 100,
            target: n('target'),
          },
          tone: valid ? 'ready' : 'blocked',
          active: valid ? 2 : 0,
          facts: [fact('Baseline', pct(rate)), fact('Target', `${n('target')}%`)],
        },
      );
    }
    case 8: {
      const valid = s('visit').trim().length > 0;
      const connected = b('connected');
      return result(
        !valid
          ? 'Tell the visitor what to fill in'
          : !connected
            ? 'Keep the draft. Explain the failure.'
            : 'The model can show a confirmation',
        !valid
          ? 'The identifier is required. The model stops before attempting submission.'
          : !connected
            ? `The draft still contains ${s('visit')}. The interface should not claim that an unavailable service confirmed it.`
            : 'Validation and the model connection both permit the journey. A real confirmation would still need an actual service response.',
        [
          s('visit').trim() || 'Identifier missing',
          valid ? 'Required input present' : 'Validation blocks submission',
          valid && connected
            ? 'Confirmation in this model'
            : valid
              ? 'Draft retained; not confirmed'
              : 'Show an input correction',
        ],
        {
          visual: {
            kind: 'journey',
            title: 'Can the visitor finish the request?',
            draft: s('visit'),
            steps: [
              {
                label: 'Your draft',
                state: valid ? 'ready' : 'blocked',
                detail: valid
                  ? `Visit ${s('visit')} is still in the form.`
                  : 'A visit identifier is required.',
              },
              {
                label: 'The connection',
                state: !valid ? 'neutral' : connected ? 'ready' : 'blocked',
                detail: !valid
                  ? 'Submission has not been attempted.'
                  : connected
                    ? 'The teaching connection is available.'
                    : 'The teaching connection is unavailable.',
              },
              {
                label: 'The result',
                state: valid && connected ? 'ready' : valid ? 'careful' : 'neutral',
                detail:
                  valid && connected
                    ? 'Confirmed inside this local model.'
                    : valid
                      ? 'Draft kept. No confirmation claimed.'
                      : 'Correct the input before submitting.',
              },
            ],
          },
          tone: valid && connected ? 'ready' : 'blocked',
          active: !valid ? 1 : 2,
          facts: [fact('Draft preserved', s('visit') || 'Blank'), fact('Real submissions', 0)],
        },
      );
    }
    case 9: {
      const packaged = n('setup') + n('license') * n('months');
      const build = n('build');
      const fits = !b('needExport') || b('vendorExport');
      return result(
        !fits
          ? 'The package misses a required capability'
          : packaged === build
            ? 'The arithmetic totals tie'
            : `${packaged < build ? 'Package' : 'Build'} has the lower stated total`,
        `Package: ${n('setup')} + ${n('license')} × ${n('months')} = ${packaged}. Build: ${build}. ${fits ? 'Capabilities still need verification.' : 'Record export is required but unsupported by this package.'} Maintenance and other omitted costs can change the decision.`,
        [
          `${n('months')} months; export ${b('needExport') ? 'required' : 'optional'}`,
          `${packaged} vs ${build} units`,
          fits ? 'Compare omitted costs and risks' : 'Capability mismatch',
        ],
        {
          tone: fits ? 'careful' : 'blocked',
          facts: [
            fact('Package total', `${packaged} units`),
            fact('Build total', `${build} units`),
          ],
          bars: [
            { label: 'Package', value: packaged, unit: 'units' },
            { label: 'Build', value: build, unit: 'units' },
          ],
        },
      );
    }
    case 10:
    case 21: {
      const ids = ['V-42', 'V-43'];
      const selected = s('selected');
      const changed = b('defect') ? ids.find((id) => id !== selected)! : selected;
      const before = ids.map((id) => ({ id, status: 'pending' }));
      const after = before.map((row) => ({
        ...row,
        status: row.id === changed ? 'confirmed' : row.status,
      }));
      const correct =
        after.find((row) => row.id === selected)?.status === 'confirmed' &&
        after.filter((row) => row.id !== selected).every((row) => row.status === 'pending');
      const pass = s('check') === 'toast' || correct;
      return result(
        pass
          ? s('check') === 'toast' && !correct
            ? 'The toast check passes over a real defect'
            : 'The chosen assertion passes'
          : 'The record assertion exposes the defect',
        `Selected ${selected}; updater changed ${changed}. ${s('check') === 'toast' ? 'The toast is always Saved, so that assertion cannot distinguish the wrong-record defect.' : 'The assertion checks that the selected visit changed and the other visit did not.'}`,
        [
          `Selected: ${selected}`,
          `Changed: ${changed}`,
          pass ? 'Assertion passes' : 'Assertion fails',
        ],
        {
          tone: correct ? 'ready' : s('check') === 'toast' ? 'careful' : 'blocked',
          facts: [
            fact('Toast', 'Saved'),
            fact('Record behaviour', correct ? 'Correct' : 'Wrong record'),
          ],
          rows: after.map((row) => ({ label: row.id, before: 'pending', after: row.status })),
          visual: {
            kind: 'records',
            title: 'What actually changed?',
            context: `You selected ${selected}. The toast says Saved. Inspect both records.`,
            beforeLabel: 'Before the update',
            afterLabel: 'After the update',
            records: after.map((row) => ({
              id: row.id,
              before: 'pending',
              after: row.status,
              state:
                row.status === (row.id === selected ? 'confirmed' : 'pending')
                  ? 'ready'
                  : 'blocked',
              detail:
                row.id === selected
                  ? 'This is the visit you intended to confirm.'
                  : 'This other visit should remain pending.',
            })),
          },
        },
      );
    }
    case 11: {
      const late = n('latency') > n('timeout');
      const valid = b('valid');
      return result(
        !valid
          ? 'Validation refuses the request'
          : late
            ? 'The client stops waiting'
            : 'The response arrives in time',
        !valid
          ? 'The server-side rule rejects this input. No success response should be displayed.'
          : late
            ? `Response delay ${n('latency')} ms exceeds the ${n('timeout')} ms waiting limit. The server's final state remains unknown from this timeout alone.`
            : `The response delay is within the model's waiting limit. This does not measure a real endpoint.`,
        [
          valid ? 'Request submitted' : 'Invalid request',
          valid ? `${n('latency')} ms handling journey` : 'Validation error',
          !valid ? 'Error response' : late ? 'Client timeout' : 'Confirmation response',
        ],
        {
          visual: {
            kind: 'journey',
            title: 'Where does the waiting stop?',
            draft: valid ? 'A valid request' : 'A request with invalid input',
            timing: valid ? { response: n('latency'), wait: n('timeout') } : undefined,
            steps: [
              {
                label: 'Send a request',
                state: 'ready',
                detail: 'A request reaches the model server.',
              },
              {
                label: 'Server handling',
                state: valid ? 'ready' : 'blocked',
                detail: valid
                  ? `The model response takes ${n('latency')} ms.`
                  : 'The server validation rule refuses the input.',
              },
              {
                label: 'Client result',
                state: !valid ? 'blocked' : late ? 'careful' : 'ready',
                detail: !valid
                  ? 'Show an error response, not success.'
                  : late
                    ? `The client stops waiting at ${n('timeout')} ms. The final server state is unknown from this timeout alone.`
                    : 'The response arrives within the waiting limit.',
              },
            ],
          },
          tone: !valid ? 'blocked' : late ? 'careful' : 'ready',
          active: valid ? 2 : 1,
          facts: [
            fact('Response delay', `${n('latency')} ms`),
            fact('Waiting limit', `${n('timeout')} ms`),
          ],
        },
      );
    }
    case 12: {
      const all = [
        { id: 'V-42', name: 'Alex' },
        { id: 'V-43', name: 'Alex' },
      ];
      const records = b('restart') && s('storage') === 'memory' ? [] : all;
      const query = s('lookup').trim().toLowerCase();
      const matches = records.filter(
        (row) => row.id.toLowerCase() === query || row.name.toLowerCase() === query,
      );
      return result(
        !records.length
          ? 'The process lost its in-memory records'
          : matches.length === 1
            ? 'One visit identified'
            : matches.length > 1
              ? 'A name matches more than one visit'
              : 'No visit matches that query',
        !records.length
          ? 'Process memory had the process lifetime. Restarting this model removes those records; a persistent store has a separate lifetime.'
          : `${matches.length} of ${records.length} records match. V-42 and V-43 distinguish two people named Alex.`,
        [
          `${all.length} initial records`,
          `${s('storage')} · ${b('restart') ? 'restarted' : 'running'}`,
          `${matches.length} lookup matches`,
        ],
        {
          tone: matches.length === 1 ? 'ready' : 'careful',
          facts: [
            fact('Records after restart', records.length),
            fact('Matching records', matches.length),
          ],
          rows: all.map((row) => ({
            label: row.id,
            before: row.name,
            after: records.some((r) => r.id === row.id) ? 'Retained' : 'Lost with process',
          })),
          visual: {
            kind: 'records',
            title: b('restart') ? 'What survived the restart?' : 'Same name. Different records.',
            context: `${s('storage') === 'memory' ? 'Process memory' : 'Persistent storage'} · ${b('restart') ? 'after restart' : 'process running'}. Your lookup found ${matches.length} match(es).`,
            beforeLabel: 'Original record',
            afterLabel: 'Current model state',
            records: all.map((row) => ({
              id: row.id,
              before: row.name,
              after: records.some((r) => r.id === row.id) ? 'Retained' : 'Lost with process',
              state: !records.length
                ? 'blocked'
                : matches.some((r) => r.id === row.id)
                  ? 'ready'
                  : 'neutral',
              detail: !records.length
                ? 'The restarted process has no records to search.'
                : matches.some((r) => r.id === row.id)
                  ? 'This record matches your lookup.'
                  : 'This record does not match the current lookup.',
            })),
          },
        },
      );
    }
    case 13: {
      const unique = n('requests') + (b('sameKey') ? 0 : n('retries'));
      const attempts = n('requests') + n('retries');
      const accepted = b('atomic') ? Math.min(unique, n('slots')) : unique;
      const extra = Math.max(0, accepted - n('slots'));
      return result(
        extra
          ? `${extra} booking${extra === 1 ? '' : 's'} beyond capacity`
          : `${accepted} reservation${accepted === 1 ? '' : 's'} within capacity`,
        `${attempts} attempts represent ${unique} operations with these keys. ${b('atomic') ? 'The atomic rule never accepts more than the available slots.' : 'Each separate check sees the same initial available snapshot and can overbook.'} ${b('sameKey') ? 'Retries reuse an operation identity.' : 'New retry keys can create additional operations.'}`,
        [
          `${attempts} attempts; ${unique} identities`,
          b('atomic') ? 'One atomic capacity rule' : 'Separate check, then write',
          `${accepted} accepted; ${extra} over capacity`,
        ],
        {
          tone: extra ? 'blocked' : 'ready',
          facts: [
            fact('Capacity', n('slots')),
            fact('Accepted', accepted),
            fact('Over capacity', extra),
          ],
          reservations: {
            capacity: n('slots'),
            attempts,
            operations: Array.from({ length: unique }, (_, i) => ({
              id: `R-${i + 1}`,
              state: i >= accepted ? 'refused' : i >= n('slots') ? 'overbooked' : 'accepted',
            })),
          },
          bars: [
            { label: 'Capacity', value: n('slots'), unit: 'slots' },
            { label: 'Accepted', value: accepted, unit: 'reservations' },
          ],
        },
      );
    }
    case 14: {
      const authenticated = s('caller') !== 'none';
      const owner = s('caller') === s('owner');
      const permitted = authenticated && owner;
      const returned = b('serverCheck') ? permitted : true;
      return result(
        returned && !permitted
          ? 'The model leaks a record'
          : returned
            ? 'The requested record is allowed'
            : 'The boundary refuses access',
        b('serverCheck')
          ? `Identity: ${s('caller')}; owner: ${s('owner')}. ${permitted ? 'Both policy checks pass.' : !authenticated ? 'There is no valid session.' : 'Being signed in does not grant access to another customer’s record.'}`
          : 'The trusted permission check is absent. A sign-in badge or hidden button does not enforce record ownership.',
        [
          authenticated ? s('caller') : 'No session',
          b('serverCheck') ? `Check owner ${s('owner')}` : 'No trusted owner check',
          returned ? 'Record returned' : 'Record withheld',
        ],
        {
          visual: {
            kind: 'access',
            caller: s('caller'),
            owner: s('owner'),
            trustedCheck: b('serverCheck'),
            permitted,
            returned,
          },
          tone: returned && !permitted ? 'blocked' : permitted ? 'ready' : 'careful',
          active: returned ? 2 : 1,
          facts: [
            fact('Policy permits', permitted ? 'Yes' : 'No'),
            fact('Record returned', returned ? 'Yes' : 'No'),
          ],
        },
      );
    }
    case 15: {
      const configured = b('credential');
      const provider = s('provider');
      const attempts = configured ? 1 + n('retries') : 0;
      return result(
        !configured
          ? 'Configuration is missing'
          : provider === 'accepted'
            ? 'Accepted by the provider'
            : provider === 'offline'
              ? 'Provider unavailable'
              : 'Acceptance remains unknown',
        !configured
          ? 'The adapter cannot make an authorised request without its required configuration. No secret value is requested here.'
          : provider === 'accepted'
            ? `${attempts} attempt(s) are acknowledged in this model. An acceptance acknowledgement is not a delivery receipt.`
            : provider === 'offline'
              ? `${attempts} attempts meet an unavailable dependency. Retrying needs a bounded policy and a useful status.`
              : `After ${attempts} ambiguous attempts, delivery count is unknown. Reconcile using stable operation identifiers instead of inventing a success count.`,
        [
          configured ? 'Adapter configured' : 'Credential absent',
          configured ? `${attempts} provider attempts` : 'No attempt',
          !configured
            ? 'Configure before sending'
            : provider === 'accepted'
              ? 'Accepted; delivery unverified'
              : provider === 'offline'
                ? 'Failure status'
                : 'Reconcile unknown state',
        ],
        {
          visual: {
            kind: 'journey',
            title: 'Accepted is a step. Delivery needs evidence.',
            draft: 'A fictional visit reminder',
            steps: [
              {
                label: 'Your adapter',
                state: configured ? 'ready' : 'blocked',
                detail: configured
                  ? 'Required configuration is present in this model.'
                  : 'Required configuration is absent. No provider attempt is made.',
              },
              {
                label: 'The provider',
                state: !configured
                  ? 'neutral'
                  : provider === 'accepted'
                    ? 'ready'
                    : provider === 'offline'
                      ? 'blocked'
                      : 'careful',
                detail: !configured
                  ? 'This step has not run.'
                  : provider === 'accepted'
                    ? `${attempts} attempt(s) acknowledged.`
                    : provider === 'offline'
                      ? 'The dependency is unavailable.'
                      : 'Acceptance remains unknown after the attempts.',
              },
              {
                label: 'Delivery evidence',
                state: configured ? 'careful' : 'neutral',
                detail: configured
                  ? 'No delivery receipt exists in this model. Do not turn acceptance or an ambiguous retry into verified delivery.'
                  : 'No sending attempt means no delivery evidence.',
              },
            ],
          },
          tone: configured && provider === 'accepted' ? 'ready' : 'careful',
          active: configured ? 2 : 1,
          facts: [fact('Attempts', attempts), fact('Verified deliveries', 0)],
        },
      );
    }
    case 16: {
      const rank: Record<string, number> = { read: 0, test: 1, live: 2 };
      const allowed = rank[s('request')] <= rank[s('permission')];
      const executed = allowed ? Math.min(n('demand'), n('budget')) : 0;
      const complete = executed === n('demand');
      return result(
        !allowed
          ? 'The requested action exceeds authority'
          : complete
            ? 'The model finishes within its boundary'
            : 'The budget stops the task',
        !allowed
          ? 'Budget does not create permission. The rule executor refuses the requested scope before acting.'
          : `${executed} of ${n('demand')} operations execute at one unit each. ${complete ? 'The task fits its stated budget.' : 'The executor stops before exceeding the budget.'} This does not establish an AI agent's real capability.`,
        [
          `${n('budget')} units · ${s('permission')} authority`,
          `${executed} operations allowed and affordable`,
          complete ? 'Model task finished' : !allowed ? 'Action refused' : 'Budget stop',
        ],
        {
          tone: complete ? 'ready' : 'blocked',
          active: complete ? 2 : 1,
          facts: [fact('Operations run', executed), fact('Budget left', n('budget') - executed)],
        },
      );
    }
    case 17: {
      const compatible = s('uiField').trim() !== '' && s('uiField') === s('serverField');
      const work = Math.ceil(n('tasks') / n('workers')) * n('minutes');
      const coordination = (n('workers') - 1) * 2;
      return result(
        !compatible ? 'The parts do not agree' : `${work + coordination} model minutes`,
        `${Math.ceil(n('tasks') / n('workers'))} task rounds × ${n('minutes')} minutes + ${coordination} coordination minutes. ${compatible ? 'The field names agree; real integration still needs a journey check.' : `The interface expects ${s('uiField') || '(nothing)'} but receives ${s('serverField') || '(nothing)'}.`}`,
        [
          `${s('uiField')} ↔ ${s('serverField')}`,
          `${n('workers')} workers; ${n('tasks')} tasks`,
          compatible ? `${work + coordination} model minutes` : 'Integration blocked',
        ],
        {
          tone: compatible ? 'ready' : 'blocked',
          facts: [
            fact('Parallel work', `${work} min`),
            fact('Coordination', `${coordination} min`),
          ],
          bars: [
            { label: 'Work', value: work, unit: 'min' },
            { label: 'Coordination', value: coordination, unit: 'min' },
          ],
        },
      );
    }
    case 18: {
      let parsed: unknown;
      try {
        parsed = JSON.parse(s('output'));
      } catch {
        return result(
          'The JSON parser refuses this text',
          'The response must first be parseable. A schema or factual check cannot repair malformed JSON by pretending it parsed.',
          [s('sourceDate') || 'Source date unknown', 'JSON parse fails', 'No accepted summary'],
          {
            tone: 'blocked',
            active: 1,
            facts: [fact('Parser', 'Failed')],
            visual: {
              kind: 'validation',
              raw: s('output'),
              formatted: s('output'),
              sourceDate: s('sourceDate'),
              checks: [
                {
                  label: 'Parse the JSON',
                  state: 'fail',
                  detail: 'The text cannot be parsed as JSON.',
                },
                {
                  label: 'Check its shape',
                  state: 'notrun',
                  detail: 'There is no parsed value to check.',
                },
                {
                  label: 'Check date support',
                  state: 'notrun',
                  detail: 'Parsing and shape checks must come first.',
                },
              ],
            },
          },
        );
      }
      const obj =
        parsed && typeof parsed === 'object' && !Array.isArray(parsed)
          ? (parsed as Record<string, unknown>)
          : {};
      const schema =
        typeof obj.summary === 'string' &&
        obj.summary.trim().length > 0 &&
        (obj.date === null || isoDate(obj.date));
      const known = s('sourceDate').trim();
      const sourceValid = !known || isoDate(known);
      const supported = schema && sourceValid && obj.date === (known || null);
      return result(
        !schema
          ? 'Parsed, but the schema does not fit'
          : !sourceValid
            ? 'The source date is invalid'
            : supported
              ? 'The date stays within the supplied facts'
              : 'A valid shape contains an unsupported date',
        !schema
          ? 'Require a non-empty summary and a date that is null or a real ISO calendar date.'
          : !sourceValid
            ? 'Correct the source input rather than treating an impossible calendar date as evidence.'
            : supported
              ? 'The supplied date matches the explicit source, or remains null when no source date exists. This narrow check does not verify every statement in the summary.'
              : 'A JSON schema can validate a date-shaped value without establishing that the source supports it.',
        [
          known || 'Date absent from source',
          schema ? 'JSON + schema pass' : 'Schema fails',
          supported ? 'Date supported' : 'Do not accept invented certainty',
        ],
        {
          visual: {
            kind: 'validation',
            raw: s('output'),
            formatted: JSON.stringify(parsed, null, 2),
            sourceDate: known,
            checks: [
              {
                label: 'Parse the JSON',
                state: 'pass',
                detail: 'The JSON parser produced a value.',
              },
              {
                label: 'Check its shape',
                state: schema ? 'pass' : 'fail',
                detail: schema
                  ? 'A non-empty summary and null or a real ISO date are present.'
                  : 'Require a non-empty summary and null or a real ISO date.',
              },
              {
                label: 'Check date support',
                state: !schema ? 'notrun' : supported ? 'pass' : 'fail',
                detail: !schema
                  ? 'The shape needs correction first.'
                  : !sourceValid
                    ? 'The supplied source date is not a real ISO date.'
                    : supported
                      ? 'The date matches the supplied source, or stays null when no date was supplied.'
                      : 'The date is not supported by the supplied source.',
              },
            ],
          },
          tone: supported ? 'ready' : 'blocked',
          active: schema ? 2 : 1,
          facts: [
            fact('Parser', 'Passed'),
            fact('Schema', schema ? 'Passed' : 'Failed'),
            fact('Date support', supported ? 'Supported' : 'Not established'),
          ],
        },
      );
    }
    case 19: {
      const relevant = /cancel|visit|appointment/i.test(s('question'));
      const fresh = n('age') <= n('maxAge');
      const actionAllowed = !b('docAction') || b('authority');
      const supported = relevant && fresh && actionAllowed;
      return result(
        !relevant
          ? 'The keyword source does not match'
          : !fresh
            ? 'Relevant, but too old for this rule'
            : !actionAllowed
              ? 'Document text cannot grant authority'
              : 'The model has a permitted current source',
        !relevant
          ? 'This toy search recognises cancel, visit or appointment. A missing match shows the limits of keyword retrieval, not that no useful source exists.'
          : !fresh
            ? `Source age ${n('age')} days exceeds ${n('maxAge')} days. Relevance alone does not meet the freshness rule.`
            : !actionAllowed
              ? 'An instruction inside retrieved material is not the separate user and policy authority needed to change a visit.'
              : 'The local relevance, freshness and authority checks permit this model path. An actual answer still needs support from the actual retrieved evidence.',
        [
          s('question') || 'No question',
          `Policy age ${n('age')} days`,
          supported ? 'Support can be inspected' : 'Withhold unsupported action or answer',
        ],
        {
          tone: supported ? 'ready' : 'blocked',
          facts: [
            fact('Keyword match', relevant ? 'Yes' : 'No'),
            fact('Freshness', fresh ? 'Within rule' : 'Outside rule'),
            fact('Action authority', actionAllowed ? 'Sufficient for path' : 'Missing'),
          ],
        },
      );
    }
    case 20: {
      const cases = [
        ...Array.from({ length: n('positives') }, (_, i) => ({
          id: `P${i + 1}`,
          positive: true,
          score: (i * 37 + 31) % 100,
        })),
        ...Array.from({ length: n('negatives') }, (_, i) => ({
          id: `N${i + 1}`,
          positive: false,
          score: (i * 17 + 11) % 100,
        })),
      ];
      const tp = cases.filter((c) => c.positive && c.score >= n('threshold')).length;
      const fp = cases.filter((c) => !c.positive && c.score >= n('threshold')).length;
      const fn = n('positives') - tp;
      const precision = tp + fp ? tp / (tp + fp) : null;
      const recall = tp / n('positives');
      return result(
        `${tp + fp} alerts · ${fn} missed positives`,
        `Precision = ${tp} / ${tp + fp || 'no alerts'}: ${pct(precision)}. Recall = ${tp} / ${n('positives')}: ${pct(recall)}. The same cases are rescored at the chosen threshold; no actual AI model runs.`,
        [
          `${cases.length} labelled cases`,
          `Alert when score ≥ ${n('threshold')}`,
          `${tp} true + ${fp} false alerts`,
        ],
        {
          tone: 'careful',
          cases: cases.map((c) => ({ ...c, alert: c.score >= n('threshold') })),
          facts: [
            fact('Precision', pct(precision)),
            fact('Recall', pct(recall)),
            fact('Missed positives', fn),
          ],
          bars: [
            { label: 'Correct alerts', value: tp, unit: 'cases' },
            { label: 'False alerts', value: fp, unit: 'cases' },
            { label: 'Missed positives', value: fn, unit: 'cases' },
          ],
        },
      );
    }
    case 22: {
      const configured = b('credential') && b('build');
      const code = b('rollback') ? 'v1' : configured ? 'v2' : 'v1';
      const schema = b('migration') ? 'v2' : 'v1';
      const compatible = !(code === 'v1' && schema === 'v2');
      return result(
        !compatible
          ? 'Old code cannot read the new schema'
          : !b('rollback') && !configured
            ? 'The release gate is incomplete'
            : `${code} code with compatible data`,
        !compatible
          ? 'Rolling code back did not restore the data schema. A rehearsed compatible migration or recovery is needed.'
          : !b('rollback') && !configured
            ? 'Both the build/checks and required configuration must be ready before this model releases v2.'
            : `${code} is compatible with the ${schema} schema under this model's declared rules. Real release verification and recovery evidence are still needed.`,
        [
          b('build') ? 'Build passes' : 'Build fails',
          `Code ${code} · schema ${schema}`,
          compatible ? 'Compatibility holds' : 'Recovery required',
        ],
        {
          tone: compatible && configured ? 'ready' : compatible ? 'careful' : 'blocked',
          facts: [
            fact('Running code', code),
            fact('Data schema', schema),
            fact('Compatible', compatible ? 'Yes' : 'No'),
          ],
        },
      );
    }
    case 23: {
      const total = n('validation') + n('database') + n('provider');
      const selected = s('inspect');
      const spent = selected === 'css' ? 0 : n(selected);
      const dominant = n('database') > n('provider') ? 'database' : 'provider';
      return result(
        `${total} ms end to end`,
        `${selected === 'css' ? 'CSS is not a measured span in this trace.' : `${selected} accounts for ${spent} ms (${pct(total ? spent / total : 0)}).`} The longest of the shown database/provider spans is ${dominant}. Inspection guides a hypothesis; a real fix needs a new observation.`,
        [`${total} ms symptom`, `Inspect ${selected}`, `Verify an intervention; not a claim`],
        {
          tone: selected === dominant ? 'ready' : 'careful',
          facts: [fact('Total', `${total} ms`), fact('Inspected', `${spent} ms`)],
          bars: [
            { label: 'Validation', value: n('validation'), unit: 'ms' },
            { label: 'Database', value: n('database'), unit: 'ms' },
            { label: 'Provider', value: n('provider'), unit: 'ms' },
          ],
        },
      );
    }
    case 24: {
      const mode = s('mode');
      const initiallyFresh = n('ttl') > 0 && n('age') < n('ttl');
      const calls = mode !== 'cache' || n('ttl') === 0 ? n('reads') : initiallyFresh ? 0 : 1;
      const hits = n('reads') - calls;
      const stale = mode === 'cache' && initiallyFresh && b('changed') ? hits : 0;
      return result(
        `${calls} source reads · ${stale} stale result${stale === 1 ? '' : 's'}`,
        `${n('reads')} reads use the same key at the same instant. ${mode === 'queue' ? 'Queuing changes when work happens, not the number of source reads.' : mode === 'fresh' ? 'Every read contacts the source.' : initiallyFresh ? 'The existing cached copy is within its lifetime.' : 'The first read refreshes an expired copy; later reads can reuse it.'} ${stale ? 'The source changed after this still-valid copy, so its reused answers are stale.' : ''}`,
        [
          `${n('reads')} same-key reads`,
          `${hits} cache hits; TTL ${n('ttl')} min`,
          `${calls * n('latency')} ms model work`,
        ],
        {
          tone: stale ? 'careful' : 'ready',
          facts: [
            fact('Source calls', calls),
            fact('Cache hits', hits),
            fact('Stale answers', stale),
          ],
          bars: [
            { label: 'Source reads', value: calls, unit: 'reads' },
            { label: 'Cache hits', value: hits, unit: 'reads' },
          ],
        },
      );
    }
    case 25: {
      const original = Array.from({ length: n('count') }, (_, i) => `V-${i + 1}`);
      const changed = original.slice(Math.min(n('dropped'), original.length));
      const after = b('restore') && b('backup') ? [...original] : changed;
      const allFound = original.every((id) => after.includes(id));
      const verified = b('verify') && allFound;
      return result(
        b('restore') && !b('backup')
          ? 'There is no snapshot to restore'
          : verified
            ? 'Every expected identifier was found'
            : b('restore')
              ? 'Restored in the model; inspect the records'
              : `${original.length - after.length} records missing`,
        b('restore') && !b('backup')
          ? 'A restore instruction cannot reconstruct a missing snapshot. Code rollback alone does not provide these records.'
          : `${original.length} original records; ${changed.length} remain after the change; ${after.length} after the chosen recovery. ${b('verify') ? (allFound ? 'The model query found every expected ID.' : 'The model query still finds missing IDs.') : 'Run the identifier queries rather than relying on the snapshot label.'}`,
        [
          `${original.length} original; snapshot ${b('backup') ? 'present' : 'absent'}`,
          `${changed.length} after the change`,
          verified ? 'IDs checked' : `${after.length} after recovery`,
        ],
        {
          tone: verified ? 'ready' : allFound ? 'careful' : 'blocked',
          facts: [
            fact('Original', original.length),
            fact('After recovery', after.length),
            fact('Queries run', b('verify') ? 'Yes' : 'No'),
          ],
          rows: original.map((id) => ({
            label: id,
            before: 'Present',
            after: after.includes(id) ? 'Present' : 'Missing',
          })),
          visual: {
            kind: 'records',
            title: 'Did the records come back?',
            context: `Snapshot ${b('backup') ? 'present' : 'absent'}. Restore ${b('restore') ? 'requested' : 'not requested'}. Identifier checks ${b('verify') ? 'run' : 'not run'}.`,
            beforeLabel: 'Original state',
            afterLabel: 'After chosen recovery',
            records: original.map((id) => ({
              id,
              before: 'Present',
              after: after.includes(id) ? 'Present' : 'Missing',
              state: !after.includes(id) ? 'blocked' : b('verify') ? 'ready' : 'careful',
              detail: !after.includes(id)
                ? 'This expected identifier is still missing.'
                : b('verify')
                  ? 'The model query found this identifier.'
                  : 'The record is present in the model, but the identifier check has not run.',
            })),
          },
        },
      );
    }
    case 26: {
      const eligible = !b('needsAccess') || b('approval');
      return result(
        eligible ? 'The visit meets the access prerequisite' : 'Dispatch speed cannot grant access',
        eligible
          ? `The model can proceed with ${n('dispatch')} minutes of preparation. A real investigation still needs to verify who grants and records approval.`
          : 'This scenario requires approval before a visit. Reducing preparation time does not remove that prerequisite.',
        [
          b('needsAccess') ? 'Access approval required' : 'No access prerequisite',
          b('approval') ? 'Approval recorded' : 'Approval missing',
          eligible ? `${n('dispatch')} min preparation` : 'Visit blocked before dispatch',
        ],
        {
          tone: eligible ? 'ready' : 'blocked',
          active: eligible ? 2 : 1,
          facts: [
            fact('Eligible in scenario', eligible ? 'Yes' : 'No'),
            fact('Dispatch preparation', `${n('dispatch')} min`),
          ],
        },
      );
    }
    case 27: {
      const needsConnected = b('privateRecords') || b('accounts');
      const fits = !needsConnected || s('design') === 'connected';
      return result(
        fits ? 'The declared capability can fit' : 'Static files alone miss the requirement',
        fits
          ? `The choice includes ${n('services')} operated component(s). Each adds an operating boundary to explain; more does not itself make the product better.`
          : 'Shared private records or accounts need suitable connected capabilities and trusted access control. A static frontend can use external services, but that is a connected design rather than files alone.',
        [
          needsConnected ? 'Private/shared capability needed' : 'Public information needed',
          s('design') === 'static' ? 'Static files only' : 'Suitable connected services',
          fits ? 'Check actual implementation' : 'Missing capability',
        ],
        {
          tone: fits ? 'ready' : 'blocked',
          facts: [
            fact('Connected need', needsConnected ? 'Yes' : 'No'),
            fact('Operated components', n('services')),
          ],
        },
      );
    }
    case 28: {
      const users = Math.round((n('people') * n('adoption')) / 100);
      const gross = users * n('saved');
      const correction = users * n('rework');
      const net = gross - correction;
      return result(
        `${net} net minutes per day`,
        `${users} of ${n('people')} people use the scenario tool after rounding adoption to whole people. ${gross} minutes saved − ${correction} extra correction minutes = ${net}. These are assumed counts, not measured benefits.`,
        [
          `${users} people use it`,
          `${gross} saved; ${correction} correction`,
          `${net} net min/day`,
        ],
        {
          tone: net > 0 ? 'ready' : 'careful',
          facts: [fact('People using it', users), fact('Net time', `${net} min/day`)],
          bars: [
            { label: 'Dispatch saving', value: gross, unit: 'min/day' },
            { label: 'Correction work', value: correction, unit: 'min/day' },
          ],
        },
      );
    }
    case 29: {
      const payload: Record<string, string> = { [s('field')]: 'approved' };
      const compatible = payload.accessStatus === 'approved';
      const ready = b('guide') && b('access') && b('check') && compatible;
      return result(
        ready
          ? 'The model handoff journey passes'
          : !b('guide') || !b('access')
            ? 'The new operator lacks a prerequisite'
            : !b('check')
              ? 'The replacement remains unchecked'
              : 'The replacement contract breaks the journey',
        ready
          ? 'Guide, access and the actual local field assertion all fit. A real fresh-operator trial must still demonstrate the journey.'
          : `Guide: ${b('guide') ? 'present' : 'missing'}; access: ${b('access') ? 'available' : 'missing'}; check: ${b('check') ? 'run' : 'not run'}. ${b('check') ? `Expected accessStatus; received ${s('field') || '(empty field)'}.` : ''}`,
        [
          b('guide') && b('access') ? 'Operator can start' : 'Opening/access gap',
          `Provider field ${s('field') || '(empty)'}`,
          ready
            ? 'Local journey check passes'
            : !b('check')
              ? 'No check result'
              : compatible
                ? 'Resolve operator prerequisites'
                : 'Adapter check fails',
        ],
        {
          tone: ready ? 'ready' : 'blocked',
          facts: [
            fact('Field assertion', b('check') ? (compatible ? 'Passed' : 'Failed') : 'Not run'),
            fact('Real operator trials', 0),
          ],
        },
      );
    }
    case 30: {
      const need = s('need');
      const connected = need === 'public' || b('server');
      const permitted = need !== 'private' || b('permissions');
      const grounded = need !== 'ai' || b('source');
      const works = connected && permitted && grounded;
      return result(
        works
          ? 'This model path can work'
          : !connected
            ? 'The changed journey needs a connected capability'
            : !permitted
              ? 'The private-record path lacks a trusted check'
              : 'The AI-helper path has no supporting source',
        works
          ? 'The selected components fit this simplified journey. This does not establish graduation: demonstrate your own outcome, explanation and a fresh changed condition with a reviewer.'
          : !connected
            ? 'The public-page design alone does not supply shared private information or a connected knowledge-backed helper.'
            : !permitted
              ? 'Adding a data store does not grant or enforce the right record permissions.'
              : 'An AI helper needs permitted supporting information for a grounded answer. A data store is not automatically that source.',
        [
          need === 'public'
            ? 'Public page'
            : need === 'private'
              ? 'Private customer record'
              : 'Grounded AI answer',
          `${b('server') ? 'Connected' : 'Static'} · ${b('permissions') ? 'permission check' : 'no record check'}`,
          works ? 'Demonstrate it in your project' : 'Identify and fix the missing boundary',
        ],
        {
          tone: works ? 'ready' : 'blocked',
          facts: [
            fact('Model path', works ? 'Fits' : 'Incomplete'),
            fact('Professional capability', 'Requires independent evidence'),
          ],
        },
      );
    }
    default:
      throw new Error(`No executed learning model for mission ${id}.`);
  }
}
