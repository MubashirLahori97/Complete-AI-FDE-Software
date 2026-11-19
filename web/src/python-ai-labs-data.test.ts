import { describe, expect, it, beforeEach } from 'vitest';
import {
  AI_FDE_LABS,
  loadAiLabProgress,
  saveAiLabCleared,
  loadAiLabDrafts,
  saveAiLabDraft,
} from './python-ai-labs-data';

describe('AI-FDE Production Labs Data Suite', () => {
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

  it('contains 4 pure Python AI engineering production labs', () => {
    expect(AI_FDE_LABS).toHaveLength(4);
    for (const [index, lab] of AI_FDE_LABS.entries()) {
      expect(lab.number).toBe(index + 1);
      expect(lab.id).toBe(`ai-lab-${index + 1}`);
      expect(lab.title.length).toBeGreaterThan(10);
      expect(lab.summary.length).toBeGreaterThan(30);
      expect(lab.whyItMattersInFde.length).toBeGreaterThan(20);
      expect(lab.specification.length).toBeGreaterThanOrEqual(3);
      expect(lab.starterCode.length).toBeGreaterThan(20);
      expect(lab.solutionCode.length).toBeGreaterThan(20);
      expect(lab.testSuiteCode.length).toBeGreaterThan(20);
      expect(lab.testCases.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('persists AI lab progress and drafts correctly', () => {
    expect(Object.keys(loadAiLabProgress())).toHaveLength(0);
    saveAiLabCleared('ai-lab-1');
    expect(loadAiLabProgress()['ai-lab-1']).toBe(true);

    expect(Object.keys(loadAiLabDrafts())).toHaveLength(0);
    saveAiLabDraft('ai-lab-1', 'def test_code(): pass');
    expect(loadAiLabDrafts()['ai-lab-1']).toBe('def test_code(): pass');
  });
});
