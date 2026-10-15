export type EvidenceTone = 'ready' | 'careful' | 'blocked' | 'neutral';
export type LabVisual =
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
