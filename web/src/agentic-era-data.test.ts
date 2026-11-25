import { describe, expect, it } from 'vitest';
import {
  DIRTY_DATASETS,
  SABOTAGED_PR_CASES,
  emptyAgenticProgress,
  evaluateFinOpsRouting,
  parseAgenticProgress,
  simulateCompoundReliability,
} from './agentic-era-data';

describe('2028–2030 Agentic Era Engine', () => {
  it('defines 6 complete sabotaged AI PR cases with valid hunk and harness references', () => {
    expect(SABOTAGED_PR_CASES).toHaveLength(6);
    for (const item of SABOTAGED_PR_CASES) {
      expect(item.diffHunks.some((h) => h.id === item.sabotagedHunkId)).toBe(true);
      expect(item.failureModes.some((f) => f.id === item.correctFailureModeId)).toBe(true);
      expect(item.harnessOptions.some((h) => h.id === item.correctHarnessId)).toBe(true);
      expect(item.postmortem.length).toBeGreaterThan(40);
      expect(item.invariantSnippet.length).toBeGreaterThan(30);
    }
  });

  it('models exponential pass^k decay and verifies harnessed architecture recovery', () => {
    const naive = simulateCompoundReliability({
      steps: 15,
      stepAccuracy: 95,
      deterministicRatio: 0,
      validatorCatchRate: 0,
      humanGateEnabled: false,
    });
    expect(naive.naivePassK).toBeCloseTo(46.3, 0);
    expect(naive.verdict).toBe('unshippable');

    const engineered = simulateCompoundReliability({
      steps: 15,
      stepAccuracy: 95,
      deterministicRatio: 60,
      validatorCatchRate: 90,
      humanGateEnabled: true,
    });
    expect(engineered.harnessedPassK).toBeGreaterThan(94);
    expect(engineered.verdict).toBe('production-ready');
    expect(engineered.silentCorruptionRisk).toBeLessThan(8);
  });

  it('computes accurate ground truth for dirty datasets', () => {
    expect(DIRTY_DATASETS.length).toBeGreaterThanOrEqual(2);
    const maintenance = DIRTY_DATASETS[0];
    const cleanRows = maintenance.records.filter(
      (r) => !r.flags.some((f) => maintenance.requiredFilters.includes(f)),
    );
    const completed = cleanRows.filter((r) => r.rawStatus === 'completed').length;
    const rate = Math.round((completed / cleanRows.length) * 100);
    expect(rate).toBe(maintenance.trueSuccessRate);
  });

  it('evaluates FinOps routing cascade margins, latency, and portability SLAs', () => {
    const naiveFrontier = evaluateFinOpsRouting({
      dailyRequests: 100_000,
      pricePerUserMonthly: 20,
      requestsPerUserMonthly: 600,
      deterministicPct: 0,
      cacheHitPct: 0,
      fastModelPct: 0,
      fallbackProviderEnabled: false,
    });
    expect(naiveFrontier.meetsAllSla).toBe(false);
    expect(naiveFrontier.slaChecks.marginOk).toBe(false);
    expect(naiveFrontier.slaChecks.latencyOk).toBe(false);

    const balanced = evaluateFinOpsRouting({
      dailyRequests: 100_000,
      pricePerUserMonthly: 20,
      requestsPerUserMonthly: 600,
      deterministicPct: 30,
      cacheHitPct: 30,
      fastModelPct: 75,
      fallbackProviderEnabled: true,
    });
    expect(balanced.meetsAllSla).toBe(true);
    expect(balanced.grossMarginPct).toBeGreaterThanOrEqual(80);
    expect(balanced.p95LatencyMs).toBeLessThanOrEqual(900);
    expect(balanced.blendedQualityPct).toBeGreaterThanOrEqual(95);
  });

  it('sanitizes untrusted localStorage backups safely', () => {
    expect(parseAgenticProgress(null)).toEqual(emptyAgenticProgress());
    const parsed = parseAgenticProgress({
      clearedPrIds: ['pr-reward-hack', 'pr-reward-hack', 'injected-id', 42],
      clearedDatasetIds: ['building-maintenance', 'fake'],
      reliabilityMastered: true,
      finOpsMastered: 'yes',
    });
    expect(parsed.clearedPrIds).toEqual(['pr-reward-hack']);
    expect(parsed.clearedDatasetIds).toEqual(['building-maintenance']);
    expect(parsed.reliabilityMastered).toBe(true);
    expect(parsed.finOpsMastered).toBe(false);
  });
});
