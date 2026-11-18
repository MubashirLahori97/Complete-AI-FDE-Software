import { describe, expect, it } from 'vitest';
import {
  GUIDE_STEPS,
  SKILL_TOPICS,
  emptyLearnerIntake,
  recommendStartStep,
} from './step-guide-data';

describe('Step-by-step AI-era guide & prior-learning recommender', () => {
  it('defines 7 ordered steps covering all 30 core missions exactly once', () => {
    expect(GUIDE_STEPS).toHaveLength(7);
    expect(GUIDE_STEPS.map((step) => step.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(SKILL_TOPICS).toHaveLength(7);

    const mapped = GUIDE_STEPS.flatMap((step) => step.missionIds).sort((a, b) => a - b);
    const expected = Array.from({ length: 30 }, (_, index) => index + 1);
    expect(mapped).toEqual(expected);
  });

  it('recommends Step 1 (AI-Native SDLC) for a brand-new learner', () => {
    const intake = emptyLearnerIntake();
    const rec = recommendStartStep(intake);
    expect(rec.recommendedStepNumber).toBe(1);
    expect(rec.recommendedHref).toBe('#/sdlc');
    expect(rec.knownCount).toBe(0);
    expect(rec.fastTrackStepNumbers).toEqual([]);
  });

  it('fast-tracks steps the learner has already practiced and jumps ahead', () => {
    const intake = emptyLearnerIntake();
    intake.completedCheck = true;
    intake.skills['web-basics'] = 'practiced';
    intake.skills['apis-contracts'] = 'practiced';
    intake.skills['data-state'] = 'practiced';
    intake.skills['security-access'] = 'practiced';
    intake.skills['ai-specs'] = 'practiced';
    intake.skills['testing-evals'] = 'new';
    intake.skills['release-ops'] = 'new';

    const rec = recommendStartStep(intake);
    expect(rec.knownCount).toBe(5);
    expect(rec.fastTrackStepNumbers).toEqual([2, 3, 4, 5]);
    expect(rec.recommendedStepNumber).toBe(6);
    expect(rec.recommendedHref).toBe('#/mission/20');
  });

  it('routes experienced builders who practiced all 7 skills directly to Mission 30 capstone', () => {
    const intake = emptyLearnerIntake();
    intake.completedCheck = true;
    for (const topic of SKILL_TOPICS) intake.skills[topic.id] = 'practiced';

    const rec = recommendStartStep(intake);
    expect(rec.knownCount).toBe(7);
    expect(rec.recommendedStepNumber).toBe(7);
    expect(rec.recommendedHref).toBe('#/mission/30');
  });
});
