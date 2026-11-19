import { describe, expect, it, beforeEach } from 'vitest';
import {
  FASTAPI_LABS,
  FASTAPI_OVERVIEW,
  loadFastApiProgress,
  saveFastApiCleared,
  loadFastApiDrafts,
  saveFastApiDraft,
} from './python-fastapi-data';

describe('FastAPI Production Backend Data Suite', () => {
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

  it('contains overview and 4 core FastAPI production engineering labs', () => {
    expect(FASTAPI_OVERVIEW.corePillars.length).toBeGreaterThanOrEqual(4);
    expect(FASTAPI_LABS).toHaveLength(4);

    for (const [index, lab] of FASTAPI_LABS.entries()) {
      expect(lab.number).toBe(index + 1);
      expect(lab.id).toBe(`fastapi-lab-${index + 1}`);
      expect(lab.title.length).toBeGreaterThan(10);
      expect(lab.summary.length).toBeGreaterThan(20);
      expect(lab.specification.length).toBeGreaterThanOrEqual(3);
      expect(lab.starterCode.length).toBeGreaterThan(20);
      expect(lab.solutionCode.length).toBeGreaterThan(20);
      expect(lab.testSuiteCode.length).toBeGreaterThan(20);
      expect(lab.testCases.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('correctly persists progress and drafts in localStorage', () => {
    expect(Object.keys(loadFastApiProgress())).toHaveLength(0);
    saveFastApiCleared('fastapi-lab-1');
    expect(loadFastApiProgress()['fastapi-lab-1']).toBe(true);

    expect(Object.keys(loadFastApiDrafts())).toHaveLength(0);
    saveFastApiDraft('fastapi-lab-1', 'def test(): pass');
    expect(loadFastApiDrafts()['fastapi-lab-1']).toBe('def test(): pass');
  });
});
