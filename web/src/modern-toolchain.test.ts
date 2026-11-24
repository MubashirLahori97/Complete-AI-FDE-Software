import { describe, expect, it } from 'vitest';
import {
  OS_GUIDES,
  TOOLCHAIN_BENCHMARKS,
  ARCHITECTURE_TREE_ITEMS,
  type SupportedOs,
} from './ModernToolchainExplorer';

describe('Modern Toolchain Explorer Suite', () => {
  it('provides complete OS guides for macOS, Linux, Windows, and Package Managers', () => {
    const expectedOs: SupportedOs[] = ['mac', 'linux', 'windows', 'brew'];
    for (const os of expectedOs) {
      const guide = OS_GUIDES[os];
      expect(guide).toBeDefined();
      expect(guide.name.length).toBeGreaterThan(3);
      expect(guide.installCmd).toContain('uv');
      expect(guide.initCmd).toBe('uv venv');
      expect(guide.activateCmd.length).toBeGreaterThan(5);
      expect(guide.installDepsCmd).toContain('pyproject.toml');
      expect(guide.runCmd).toBe('uv run main.py');
      expect(guide.lintCmd).toContain('ruff');
      expect(guide.fullScript.length).toBeGreaterThan(40);
    }
  });

  it('contains verified execution benchmarks comparing uv vs legacy pip', () => {
    expect(TOOLCHAIN_BENCHMARKS.length).toBe(3);
    for (const bench of TOOLCHAIN_BENCHMARKS) {
      expect(bench.title.length).toBeGreaterThan(5);
      expect(bench.uvTime).toBeLessThan(bench.legacyTime);
      expect(bench.speedupMultiplier).toContain('Faster');
      expect(bench.insight.length).toBeGreaterThan(20);
    }

    // Specifically verify package install benchmark
    const installBench = TOOLCHAIN_BENCHMARKS.find((b) =>
      b.title.toLowerCase().includes('package resolution'),
    );
    expect(installBench).toBeDefined();
    expect(installBench?.uvTime).toBe(0.12);
    expect(installBench?.legacyTime).toBe(2.84);
  });

  it('contains comprehensive clean architecture project tree items', () => {
    expect(ARCHITECTURE_TREE_ITEMS.length).toBeGreaterThanOrEqual(7);

    const paths = ARCHITECTURE_TREE_ITEMS.map((item) => item.path);
    expect(paths).toContain('pyproject.toml');
    expect(paths).toContain('src/domain/models.py');
    expect(paths).toContain('src/services/billing.py');
    expect(paths).toContain('src/api/routes.py');
    expect(paths).toContain('tests/test_domain.py');
    expect(paths).toContain('.env.example');
    expect(paths).toContain('Dockerfile');

    for (const item of ARCHITECTURE_TREE_ITEMS) {
      expect(item.id.length).toBeGreaterThan(2);
      expect(item.badge.length).toBeGreaterThan(3);
      expect(item.summary.length).toBeGreaterThan(15);
      expect(item.importance.length).toBeGreaterThan(20);
      expect(item.sampleCode.length).toBeGreaterThan(20);
    }
  });
});
