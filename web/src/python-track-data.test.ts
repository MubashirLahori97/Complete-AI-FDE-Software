import { describe, expect, it, beforeEach } from 'vitest';
import {
  PYTHON_STAGES,
  PYTHON_TOPICS,
  PYTHON_INTERVIEW_QUESTIONS,
  PYTHON_QUIZ_QUESTIONS,
  getTopicsByDifficulty,
  getTopicByNumber,
  getQuestionByNumber,
  getAllQuestionTags,
  searchInterviewQuestions,
  loadMasteredQuestions,
  saveMasteredQuestions,
  loadQuizAnswers,
  saveQuizAnswers,
} from './python-track-data';

describe('Python Track Data Suite', () => {
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

  it('contains 4 well-structured stages', () => {
    expect(PYTHON_STAGES.length).toBe(4);
    expect(PYTHON_STAGES[0].id).toBe('stage-1');
    expect(PYTHON_STAGES[0].topicIds.length).toBe(6);
    expect(PYTHON_STAGES[1].topicIds.length).toBe(6);
    expect(PYTHON_STAGES[2].topicIds.length).toBe(6);
  });

  it('contains exactly 18 comprehensive concept topics', () => {
    expect(PYTHON_TOPICS.length).toBe(18);
    for (const [index, topic] of PYTHON_TOPICS.entries()) {
      expect(topic.number).toBe(index + 1);
      expect(topic.title.length).toBeGreaterThan(10);
      expect(topic.summary.length).toBeGreaterThan(20);
      expect(topic.mentalModel.length).toBeGreaterThan(15);
      expect(topic.codeExample.length).toBeGreaterThan(30);
      expect(topic.commonAiPitfalls.length).toBeGreaterThanOrEqual(2);
      expect(topic.verificationChecklist.length).toBeGreaterThanOrEqual(2);
      expect(topic.relatedQuestions.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('filters topics by difficulty', () => {
    const beginner = getTopicsByDifficulty('beginner');
    const intermediate = getTopicsByDifficulty('intermediate');
    const advanced = getTopicsByDifficulty('advanced');

    expect(beginner.length).toBe(6);
    expect(intermediate.length).toBe(6);
    expect(advanced.length).toBe(6);
  });

  it('contains exactly 68 GeeksforGeeks interview questions in strict sequential order', () => {
    expect(PYTHON_INTERVIEW_QUESTIONS.length).toBe(68);
    for (let i = 0; i < 68; i++) {
      const q = PYTHON_INTERVIEW_QUESTIONS[i];
      expect(q.number).toBe(i + 1);
      expect(q.id).toBe(`py-q${i + 1}`);
      expect(q.question.length).toBeGreaterThan(5);
      expect(q.explanation.length).toBeGreaterThan(10);
      expect(q.interviewerNote.length).toBeGreaterThan(10);
      expect(q.tags.length).toBeGreaterThanOrEqual(1);

      if (i < 29) {
        expect(q.difficulty).toBe('beginner');
      } else if (i < 51) {
        expect(q.difficulty).toBe('intermediate');
      } else {
        expect(q.difficulty).toBe('advanced');
      }
    }
  });

  it('retrieves questions and topics by number lookup', () => {
    const q1 = getQuestionByNumber(1);
    expect(q1?.question).toContain('compiled language');
    expect(q1?.difficulty).toBe('beginner');

    const q63 = getQuestionByNumber(63);
    expect(q63?.question).toContain('GIL');
    expect(q63?.difficulty).toBe('advanced');

    const t1 = getTopicByNumber(1);
    expect(t1?.title).toContain('CPython Execution Engine');

    const notFoundQ = getQuestionByNumber(999);
    expect(notFoundQ).toBeUndefined();
  });

  it('extracts all unique tags across questions', () => {
    const tags = getAllQuestionTags();
    expect(tags.length).toBeGreaterThan(20);
    expect(tags).toContain('internals');
    expect(tags).toContain('oop');
    expect(tags).toContain('async');
    expect(tags).toContain('gil');
  });

  it('searches interview questions by query, difficulty, and tag', () => {
    // Search by text
    const gilMatches = searchInterviewQuestions('GIL');
    expect(gilMatches.some((q) => q.number === 63)).toBe(true);

    // Search by number "q5"
    const q5 = searchInterviewQuestions('q5');
    expect(q5.length).toBe(1);
    expect(q5[0].number).toBe(5);

    // Filter by difficulty
    const adv = searchInterviewQuestions('', 'advanced');
    expect(adv.length).toBe(17);

    // Filter by tag
    const dunderTagged = searchInterviewQuestions('', 'all', 'dunder');
    expect(dunderTagged.length).toBeGreaterThan(0);
  });

  it('manages mastered questions persistence in localStorage', () => {
    expect(loadMasteredQuestions().size).toBe(0);

    const mastered = new Set([1, 5, 63]);
    saveMasteredQuestions(mastered);

    const reloaded = loadMasteredQuestions();
    expect(reloaded.size).toBe(3);
    expect(reloaded.has(1)).toBe(true);
    expect(reloaded.has(5)).toBe(true);
    expect(reloaded.has(63)).toBe(true);
  });

  it('contains 10 tricky quiz questions with valid answers and explanations', () => {
    expect(PYTHON_QUIZ_QUESTIONS.length).toBe(10);
    for (const q of PYTHON_QUIZ_QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation.length).toBeGreaterThan(15);
      expect(q.gotchaConcept.length).toBeGreaterThan(3);
    }
  });

  it('manages quiz answers persistence in localStorage', () => {
    expect(Object.keys(loadQuizAnswers()).length).toBe(0);

    saveQuizAnswers({ 'quiz-1': 1, 'quiz-2': 1 });
    const loaded = loadQuizAnswers();
    expect(loaded['quiz-1']).toBe(1);
    expect(loaded['quiz-2']).toBe(1);
  });
});
