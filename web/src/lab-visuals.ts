export type EvidenceTone = 'ready' | 'careful' | 'blocked' | 'neutral';
export type VisualCheck = {
  label: string;
  pass: boolean | null;
  detail: string;
  control?: string;
  value?: boolean;
  action?: string;
};
export type SystemVisual =
  | { kind: 'provenance'; source: string; sample: number; missed: number; valid: boolean }
  | {
      kind: 'cost';
      months: number;
      setup: number;
      monthly: number;
      build: number;
      fits: boolean;
      points: { month: number; package: number }[];
    }
  | {
      kind: 'budget';
      budget: number;
      demand: number;
      executed: number;
      allowed: boolean;
      permission: string;
      request: string;
    }
  | {
      kind: 'contract';
      title: string;
      expected: string;
      actual: string;
      payload: string;
      compatible: boolean;
      checks?: VisualCheck[];
      schedule?: {
        workers: number;
        tasks: number;
        minutes: number;
        rounds: number;
        work: number;
        coordination: number;
      };
    }
  | {
      kind: 'retrieval';
      question: string;
      age: number;
      limit: number;
      docAction: boolean;
      authority: boolean;
      checks: VisualCheck[];
    }
  | {
      kind: 'release';
      code: string;
      schema: string;
      compatible: boolean;
      rollback: boolean;
      checks: VisualCheck[];
    }
  | {
      kind: 'trace';
      total: number;
      selected: string;
      longest: string[];
      spans: { id: string; label: string; start: number; duration: number }[];
    }
  | {
      kind: 'cache';
      mode: string;
      age: number;
      ttl: number;
      changed: boolean;
      reusable: boolean;
      latency: number;
      calls: number;
      hits: number;
      stale: number;
      reads: { route: 'source' | 'cache' | 'queue'; stale: boolean }[];
    }
  | { kind: 'workflow'; approval: boolean; required: boolean; eligible: boolean; minutes: number }
  | {
      kind: 'architecture';
      title: string;
      need: string;
      fits: boolean;
      design?: string;
      operated?: number;
      parts: { label: string; enabled: boolean; required: boolean; control?: string }[];
    }
  | {
      kind: 'benefit';
      people: number;
      adoption: number;
      users: number;
      saved: number;
      rework: number;
      gross: number;
      correction: number;
      net: number;
    };
export type LabVisual =
  | SystemVisual
  | {
      kind: 'brief';
      text: string;
      scope: string;
      signals: { label: string; term: string | null; start: number; example: string }[];
    }
  | {
      kind: 'estimate';
      raw: string;
      quantity: number | null;
      price: number;
      total: number | null;
      reason: string;
    }
  | { kind: 'collection'; records: { id: string; label: string; repeated: boolean }[] }
  | {
      kind: 'rate';
      eligible: number | null;
      missed: number;
      percent: number | null;
      target: number;
    }
  | {
      kind: 'journey';
      title: string;
      draft: string;
      timing?: { response: number; wait: number };
      steps: { label: string; state: EvidenceTone; detail: string }[];
    }
  | {
      kind: 'records';
      title: string;
      context: string;
      beforeLabel: string;
      afterLabel: string;
      records: { id: string; before: string; after: string; detail: string; state: EvidenceTone }[];
    }
  | {
      kind: 'access';
      caller: string;
      owner: string;
      trustedCheck: boolean;
      permitted: boolean;
      returned: boolean;
    }
  | {
      kind: 'validation';
      raw: string;
      formatted: string;
      sourceDate: string;
      checks: { label: string; state: 'pass' | 'fail' | 'notrun'; detail: string }[];
    };

const systemKinds = new Set([
  'provenance',
  'cost',
  'budget',
  'contract',
  'retrieval',
  'release',
  'trace',
  'cache',
  'workflow',
  'architecture',
  'benefit',
]);
export const isSystemVisual = (visual: LabVisual): visual is SystemVisual =>
  systemKinds.has(visual.kind);
