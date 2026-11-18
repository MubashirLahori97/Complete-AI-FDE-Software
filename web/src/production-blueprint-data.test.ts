import { describe, expect, it } from 'vitest';
import {
  ARCHITECTURE_LAYERS,
  CONCEPT_CARDS,
  OMITTED_TRADEOFFS,
  PRODUCTION_SPRINTS,
  filterConcepts,
} from './production-blueprint-data';

describe('Production Blueprint hands-on AI playbook data', () => {
  it('defines 8 ordered sprints with copy-ready AI prompts and human verification gates', () => {
    expect(PRODUCTION_SPRINTS).toHaveLength(8);
    expect(PRODUCTION_SPRINTS.map((sprint) => sprint.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    for (const sprint of PRODUCTION_SPRINTS) {
      expect(sprint.filesCreated.length).toBeGreaterThanOrEqual(3);
      expect(sprint.aiPrompt.length).toBeGreaterThan(80);
      expect(sprint.humanVerifyChecklist.length).toBeGreaterThanOrEqual(3);
      expect(sprint.commonAiMistake.trim().length).toBeGreaterThan(20);
      expect(sprint.relatedMissionIds.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('maps all 6 architecture layers cleanly to valid sprint numbers', () => {
    expect(ARCHITECTURE_LAYERS).toHaveLength(6);
    const sprintNumbers = new Set(PRODUCTION_SPRINTS.map((sprint) => sprint.number));
    for (const layer of ARCHITECTURE_LAYERS) {
      expect(layer.sprintNumbers.length).toBeGreaterThanOrEqual(1);
      for (const num of layer.sprintNumbers) {
        expect(sprintNumbers.has(num)).toBe(true);
      }
    }
  });

  it('filters 60-second concept cards cleanly by category', () => {
    expect(filterConcepts('all')).toHaveLength(CONCEPT_CARDS.length);
    expect(filterConcepts('apis').length).toBeGreaterThanOrEqual(2);
    expect(filterConcepts('databases').length).toBeGreaterThanOrEqual(2);
    expect(filterConcepts('security').length).toBeGreaterThanOrEqual(2);
    expect(filterConcepts('ai-systems').length).toBeGreaterThanOrEqual(2);
    expect(filterConcepts('testing').length).toBeGreaterThanOrEqual(1);
    expect(filterConcepts('operations').length).toBeGreaterThanOrEqual(2);
  });

  it('includes pragmatic "What NOT to Build" senior trade-offs with zero client references', () => {
    expect(OMITTED_TRADEOFFS.length).toBeGreaterThanOrEqual(5);
    const serialized = JSON.stringify({
      PRODUCTION_SPRINTS,
      CONCEPT_CARDS,
      OMITTED_TRADEOFFS,
      ARCHITECTURE_LAYERS,
    }).toLowerCase();
    expect(serialized).not.toContain('genesis');
    expect(serialized).not.toContain('hipaa');
    expect(serialized).not.toContain('amina');
  });
});
