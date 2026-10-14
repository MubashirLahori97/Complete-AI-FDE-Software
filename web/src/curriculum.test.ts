import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { unzipSync, strFromU8 } from 'fflate';
import { dailyProjects, lessons } from './data';
import { parseProgress } from './state';

describe('every lesson has substantive teaching and a complete project kit', () => {
  it('provides 30 unique projects with full briefs, milestones, and test matrices', () => {
    expect(dailyProjects).toHaveLength(30);
    expect(new Set(dailyProjects.map((project) => project.title)).size).toBe(30);
    for (const lesson of lessons) {
      const project = dailyProjects[lesson.day - 1];
      const directory = path.resolve('..', lesson.folder);
      const teaching = fs.readFileSync(path.join(directory, 'README.md'), 'utf8');
      const brief = fs.readFileSync(path.join(directory, 'PROJECT.md'), 'utf8');
      expect(teaching, `lesson ${lesson.day}`).toContain('## A worked example, step by step');
      expect(teaching).toContain('### Exercise 3:');
      expect(teaching).toContain('## Common mistakes and how to debug them');
      expect(teaching).toContain('## The FDE connection');
      expect(
        teaching.split('<!-- original-workshop:begin -->')[0].split(/\s+/).length,
      ).toBeGreaterThan(600);
      expect(brief).toContain(project.title);
      expect(brief).toContain('### Milestone 3:');
      expect(brief).toContain('## Test matrix');
      expect(brief).toContain('## Review rubric and reflection');
      expect(project.acceptance).toHaveLength(5);
      for (const check of project.acceptance) expect(brief).toContain(check);
    }
  });
  it('packages real starter files and the matching project guide for all 30 downloads', () => {
    for (const project of dailyProjects) {
      const archive = fs.readFileSync(path.resolve('public/projects', project.starter));
      const files = unzipSync(archive);
      expect(Object.keys(files).sort()).toEqual(
        ['PROJECT.md', 'README.md', 'expected-output.txt', project.filename].sort(),
      );
      expect(strFromU8(files['PROJECT.md'])).toContain(project.title);
      expect(strFromU8(files['README.md'])).toContain('## A worked example, step by step');
      expect(strFromU8(files[project.filename]).trim().length).toBeGreaterThan(100);
      expect(strFromU8(files['expected-output.txt']).trim().length).toBeGreaterThan(10);
      for (const filename of Object.keys(files)) expect(filename).not.toMatch(/\.\.|^[\\/]/);
    }
  });
  it('retains older backups and validates the new project checklists', () => {
    const old = parseProgress({
      version: 1,
      completed: { 1: '2026-10-14' },
      notes: { 1: 'My original evidence is still here.' },
    });
    expect(old.completed[1]).toBe('2026-10-14');
    expect(old.notes[1]).toBe('My original evidence is still here.');
    expect(old.lessonProjectChecks).toEqual({});
    const next = parseProgress({
      version: 1,
      lessonProjectChecks: { 2: [true, 'true', true, false, true, true], 99: [true] },
    });
    expect(next.lessonProjectChecks[2]).toEqual([true, false, true, false, true]);
    expect(next.lessonProjectChecks).not.toHaveProperty('99');
  });
});
