import { describe, expect, it } from 'vitest';
import {
  ALL_SDLC_PHASE_IDS,
  SDLC_PHASES,
  SDLC_PILLARS,
  SDLC_PRESETS,
  SDLC_SCENARIOS,
  evaluateSdlcRun,
} from './sdlc-data';

describe('AI-Native SDLC data & failure simulator', () => {
  it('defines all 7 ordered phases and maps every core mission (1..30) exactly once', () => {
    expect(SDLC_PHASES).toHaveLength(7);
    expect(SDLC_PHASES.map((phase) => phase.order)).toEqual([1, 2, 3, 4, 5, 6, 7]);

    const mappedMissions = SDLC_PHASES.flatMap((phase) => phase.missionIds).sort((a, b) => a - b);
    const expectedMissions = Array.from({ length: 30 }, (_, index) => index + 1);
    expect(mappedMissions).toEqual(expectedMissions);

    const totalWeight = SDLC_PHASES.reduce((sum, phase) => sum + phase.scoreWeight, 0);
    expect(totalWeight).toBe(100);
  });

  it('includes all four AI-era pillars and three generic scenarios', () => {
    expect(SDLC_PILLARS).toHaveLength(4);
    expect(SDLC_SCENARIOS).toHaveLength(3);
    expect(SDLC_PRESETS.length).toBeGreaterThanOrEqual(4);
  });

  it('returns Production-ready with 1.0x rework and zero failures when all 7 phases run', () => {
    const result = evaluateSdlcRun(ALL_SDLC_PHASE_IDS, 'support-triage');
    expect(result.score).toBe(100);
    expect(result.reliability).toBe('Production-ready');
    expect(result.tone).toBe('good');
    expect(result.reworkMultiplier).toBe(1.0);
    expect(result.failures).toHaveLength(0);
    expect(result.enabledCount).toBe(7);
    expect(result.skippedCount).toBe(0);
  });

  it('flags vibe-coding drift when Specify is skipped', () => {
    const withoutSpecify = ALL_SDLC_PHASE_IDS.filter((id) => id !== 'specify');
    const result = evaluateSdlcRun(withoutSpecify, 'field-dispatch');
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].phaseId).toBe('specify');
    expect(result.failures[0].headline).toMatch(/Vibe-coding drift/i);
    expect(result.failures[0].consequence).toMatch(/Double-bookings/i);
    expect(result.reworkMultiplier).toBeGreaterThan(1.5);
  });

  it('flags critical outage risk for pure vibe coding preset', () => {
    const vibePreset = SDLC_PRESETS.find((preset) => preset.id === 'vibe-coding')!;
    const result = evaluateSdlcRun(vibePreset.enabled, 'invoice-intake');
    expect(result.reliability).toBe('Critical outage risk');
    expect(result.tone).toBe('danger');
    expect(result.skippedCount).toBe(5);
    expect(result.reworkMultiplier).toBeGreaterThanOrEqual(4.0);
    expect(result.failures.map((item) => item.phaseId)).toContain('verify');
    expect(result.failures.map((item) => item.phaseId)).toContain('operate');
  });

  it('produces scenario-specific failure consequences for every scenario', () => {
    const withoutVerify = ALL_SDLC_PHASE_IDS.filter((id) => id !== 'verify');
    const consequences = SDLC_SCENARIOS.map(
      (scenario) => evaluateSdlcRun(withoutVerify, scenario.id).failures[0].consequence,
    );
    expect(new Set(consequences).size).toBe(SDLC_SCENARIOS.length);
  });
});
