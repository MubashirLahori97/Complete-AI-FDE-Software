import { describe, expect, it, beforeEach } from 'vitest';
import {
  PRODUCTION_INCIDENTS,
  loadIncidentProgress,
  saveIncidentResolved,
  loadIncidentDrafts,
  saveIncidentDraft,
} from './python-incidents-data';

describe('Production Incident Simulator Data Suite', () => {
  beforeEach(() => {
    const memory = new Map<string, string>();
    const mockStorage: Storage = {
      length: 0,
      clear: () => memory.clear(),
      getItem: (key: string) => memory.get(key) ?? null,
      key: (index: number) => Array.from(memory.keys())[index] ?? null,
      removeItem: (key: string) => memory.delete(key),
      setItem: (key: string, value: string) => {
        memory.set(key, String(value));
      },
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    });
    mockStorage.clear();
  });

  it('contains 5 realistic production outage scenarios', () => {
    expect(PRODUCTION_INCIDENTS).toHaveLength(5);
    for (const [index, inc] of PRODUCTION_INCIDENTS.entries()) {
      expect(inc.number).toBe(index + 1);
      expect(inc.id).toBe(`inc-${index + 1}`);
      expect(inc.title.length).toBeGreaterThan(10);
      expect(inc.outageSummary.length).toBeGreaterThan(30);
      expect(inc.symptoms.length).toBeGreaterThanOrEqual(2);
      expect(inc.errorLogs.length).toBeGreaterThanOrEqual(2);
      expect(inc.rootCauseAnalysis.length).toBeGreaterThan(30);
      expect(inc.brokenCode.length).toBeGreaterThan(20);
      expect(inc.fixedCode.length).toBeGreaterThan(20);
      expect(inc.testSuiteCode.length).toBeGreaterThan(20);
      expect(inc.postMortem.length).toBeGreaterThan(30);
    }
  });

  it('persists incident resolution progress and user drafts in localStorage', () => {
    expect(Object.keys(loadIncidentProgress())).toHaveLength(0);

    saveIncidentResolved('inc-1');
    const resolved = loadIncidentProgress();
    expect(resolved['inc-1']).toBe(true);
    expect(resolved['inc-2']).toBeUndefined();

    saveIncidentDraft('inc-1', 'async def fixed(): pass');
    const drafts = loadIncidentDrafts();
    expect(drafts['inc-1']).toBe('async def fixed(): pass');
  });
});
