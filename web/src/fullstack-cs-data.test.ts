import { describe, expect, it } from 'vitest';
import {
  FULLSTACK_CS_MODULES,
  SYSTEMS_FLASHCARDS,
  SYSTEMS_QUIZ_QUESTIONS,
} from './fullstack-cs-data';

describe('Full-Stack & CS Foundations track data', () => {
  it('provides 10 structured progressive-disclosure modules across Frontend, CS & Systems, and Architecture', () => {
    expect(FULLSTACK_CS_MODULES).toHaveLength(10);
    const tracks = new Set(FULLSTACK_CS_MODULES.map((m) => m.track));
    expect(tracks.has('Frontend')).toBe(true);
    expect(tracks.has('CS & Systems')).toBe(true);
    expect(tracks.has('Architecture')).toBe(true);
    for (const mod of FULLSTACK_CS_MODULES) {
      expect(mod.analogy.length).toBeGreaterThan(20);
      expect(mod.quickCheck.options.length).toBeGreaterThanOrEqual(3);
      expect(mod.quickCheck.correctIndex).toBeGreaterThanOrEqual(0);
      expect(mod.quickCheck.correctIndex).toBeLessThan(mod.quickCheck.options.length);
    }
  });

  it('includes 50 valid systems & frontend quizzes and 56 recall flashcards', () => {
    expect(SYSTEMS_QUIZ_QUESTIONS).toHaveLength(50);
    expect(SYSTEMS_FLASHCARDS).toHaveLength(56);
    for (const q of SYSTEMS_QUIZ_QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
    }
  });

  it('contains zero private Genesis Health / Deborah client names', () => {
    const serialized = JSON.stringify({
      FULLSTACK_CS_MODULES,
      SYSTEMS_QUIZ_QUESTIONS,
      SYSTEMS_FLASHCARDS,
    });
    expect(serialized).not.toMatch(/Genesis Health/i);
    expect(serialized).not.toMatch(/Deborah/i);
  });
});
