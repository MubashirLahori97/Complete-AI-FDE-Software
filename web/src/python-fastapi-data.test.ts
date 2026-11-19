import { describe, expect, it, beforeEach } from 'vitest';
import {
  FASTAPI_LABS,
  FASTAPI_OVERVIEW,
  FASTAPI_ROADMAP_STAGES,
  FASTAPI_PRODUCTION_PROJECT_FILES,
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

  it('contains comprehensive 6-stage FastAPI production roadmap', () => {
    expect(FASTAPI_ROADMAP_STAGES).toHaveLength(6);
    for (const [idx, stage] of FASTAPI_ROADMAP_STAGES.entries()) {
      expect(stage.number).toBe(idx + 1);
      expect(stage.id).toBe(`stage-${idx + 1}`);
      expect(stage.title.length).toBeGreaterThan(15);
      expect(stage.description.length).toBeGreaterThan(30);
      expect(stage.topics.length).toBeGreaterThanOrEqual(3);

      for (const topic of stage.topics) {
        expect(topic.title.length).toBeGreaterThan(5);
        expect(topic.summary.length).toBeGreaterThan(20);
        expect(topic.codeSnippet.length).toBeGreaterThan(30);
        expect(topic.productionBestPractice.length).toBeGreaterThan(20);
        expect(topic.commonPitfall.length).toBeGreaterThan(20);
      }
    }
  });

  it('contains complete production project file scaffolding', () => {
    expect(FASTAPI_PRODUCTION_PROJECT_FILES.length).toBeGreaterThanOrEqual(10);
    const paths = FASTAPI_PRODUCTION_PROJECT_FILES.map((f) => f.path);
    expect(paths).toContain('pyproject.toml');
    expect(paths).toContain('app/core/config.py');
    expect(paths).toContain('app/core/database.py');
    expect(paths).toContain('app/core/exceptions.py');
    expect(paths).toContain('app/core/lifespan.py');
    expect(paths).toContain('app/routers/health.py');
    expect(paths).toContain('app/routers/tasks.py');
    expect(paths).toContain('app/main.py');
    expect(paths).toContain('tests/test_api.py');
    expect(paths).toContain('Dockerfile');

    for (const file of FASTAPI_PRODUCTION_PROJECT_FILES) {
      expect(file.category.length).toBeGreaterThan(3);
      expect(file.description.length).toBeGreaterThan(10);
      expect(file.code.length).toBeGreaterThan(20);
    }
  });
});
