import { describe, expect, it, beforeEach } from 'vitest';
import {
  PYTHON_EXAMS,
  TOY_VS_PROD_COMPARISONS,
  loadExamProgress,
  saveExamPassed,
  loadExamDrafts,
  saveExamDraft,
} from './python-exams-data';

describe('Python Production Exams & Toy vs Prod Suite', () => {
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

  it('contains 6 comprehensive real-world coding exams', () => {
    expect(PYTHON_EXAMS).toHaveLength(6);
    for (const [index, exam] of PYTHON_EXAMS.entries()) {
      expect(exam.number).toBe(index + 1);
      expect(exam.id).toBe(`exam-${index + 1}`);
      expect(exam.title.length).toBeGreaterThan(10);
      expect(exam.realWorldContext.length).toBeGreaterThan(30);
      expect(exam.starterCode.length).toBeGreaterThan(20);
      expect(exam.solutionCode.length).toBeGreaterThan(30);
      expect(exam.testSuiteCode.length).toBeGreaterThan(30);
      expect(exam.testCases.length).toBeGreaterThanOrEqual(1);
      expect(exam.specification.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('contains at least 6 Toy vs Production comparison cards', () => {
    expect(TOY_VS_PROD_COMPARISONS.length).toBeGreaterThanOrEqual(6);
    for (const comp of TOY_VS_PROD_COMPARISONS) {
      expect(comp.title.length).toBeGreaterThan(5);
      expect(comp.toyCode.length).toBeGreaterThan(15);
      expect(comp.prodCode.length).toBeGreaterThan(15);
      expect(comp.toyPitfall.length).toBeGreaterThan(15);
      expect(comp.prodAdvantage.length).toBeGreaterThan(15);
    }
  });

  it('persists exam progress and drafts in localStorage', () => {
    expect(Object.keys(loadExamProgress())).toHaveLength(0);

    saveExamPassed('exam-1');
    const passed = loadExamProgress();
    expect(passed['exam-1']).toBe(true);
    expect(passed['exam-2']).toBeUndefined();

    saveExamDraft('exam-1', 'print("my custom draft")');
    const drafts = loadExamDrafts();
    expect(drafts['exam-1']).toBe('print("my custom draft")');
  });
});
