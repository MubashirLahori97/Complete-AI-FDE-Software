import { describe, expect, it, beforeEach } from 'vitest';
import {
  RAG_LABS,
  RAG_OVERVIEW,
  loadRagProgress,
  saveRagCleared,
  loadRagDrafts,
  saveRagDraft,
} from './python-rag-data';

describe('Production RAG Architecture & Labs Data Suite', () => {
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

  it('contains RAG overview and 4 end-to-end production RAG labs', () => {
    expect(RAG_OVERVIEW.pipelineSteps.length).toBeGreaterThanOrEqual(5);
    expect(RAG_LABS).toHaveLength(4);

    for (const [index, lab] of RAG_LABS.entries()) {
      expect(lab.number).toBe(index + 1);
      expect(lab.id).toBe(`rag-lab-${index + 1}`);
      expect(lab.title.length).toBeGreaterThan(10);
      expect(lab.summary.length).toBeGreaterThan(20);
      expect(lab.specification.length).toBeGreaterThanOrEqual(3);
      expect(lab.starterCode.length).toBeGreaterThan(20);
      expect(lab.solutionCode.length).toBeGreaterThan(20);
      expect(lab.testSuiteCode.length).toBeGreaterThan(20);
      expect(lab.testCases.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('persists RAG lab progress and code drafts', () => {
    expect(Object.keys(loadRagProgress())).toHaveLength(0);
    saveRagCleared('rag-lab-1');
    expect(loadRagProgress()['rag-lab-1']).toBe(true);

    expect(Object.keys(loadRagDrafts())).toHaveLength(0);
    saveRagDraft('rag-lab-1', 'class CustomChunker: pass');
    expect(loadRagDrafts()['rag-lab-1']).toBe('class CustomChunker: pass');
  });
});
