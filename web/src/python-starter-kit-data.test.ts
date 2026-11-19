import { describe, expect, it } from 'vitest';
import { STARTER_KIT_FILES } from './python-starter-kit-data';

describe('Python Microservice Starter Kit Data Suite', () => {
  it('contains all required production microservice template files', () => {
    expect(STARTER_KIT_FILES.length).toBeGreaterThanOrEqual(10);
    const paths = STARTER_KIT_FILES.map((f) => f.path);
    expect(paths).toContain('pyproject.toml');
    expect(paths).toContain('Dockerfile');
    expect(paths).toContain('Makefile');
    expect(paths).toContain('.env.example');
    expect(paths).toContain('src/app/main.py');
    expect(paths).toContain('src/app/config.py');
    expect(paths).toContain('src/app/domain.py');
    expect(paths).toContain('src/app/service.py');
    expect(paths).toContain('tests/conftest.py');
    expect(paths).toContain('tests/test_api.py');
    expect(paths).toContain('tests/test_service.py');
    expect(paths).toContain('README.md');

    for (const file of STARTER_KIT_FILES) {
      expect(file.content.length).toBeGreaterThan(20);
      expect(file.description.length).toBeGreaterThan(10);
    }
  });
});
