import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { unzipSync, strFromU8 } from 'fflate';
import {
  missions,
  canRecordMission,
  missionBrief,
  newMissionRecord,
  productReady,
  understandingReady,
} from './missions';
import { reasoningLabels, systemQuestions } from './mission-types';
import { emptyProgress, parseProgress } from './state';

describe('concepts + AI core', () => {
  it('implements all thirty accepted missions in six stages with complete learning and project experiences', () => {
    expect(missions).toHaveLength(30);
    const roadmap = fs.readFileSync(path.resolve('../ROADMAP.md'), 'utf8');
    for (const [index, m] of missions.entries()) {
      expect(m.id).toBe(index + 1);
      expect(m.stage).toBe(Math.ceil(m.id / 5));
      expect(roadmap).toContain(`${m.id}. ${m.title}`);
      expect(m.concepts.length).toBeGreaterThanOrEqual(2);
      for (const concept of m.concepts)
        for (const field of ['explanation', 'example', 'misconception'] as const)
          expect(concept[field].length).toBeGreaterThan(30);
      expect(m.experiment.options).toHaveLength(3);
      expect(new Set(m.experiment.options.map((o) => o.result)).size).toBe(3);
      for (const option of m.experiment.options) expect(m.flow[option.node]).toBeDefined();
      expect(m.project.steps).toHaveLength(3);
      expect(m.project.checks).toHaveLength(3);
      for (const key of Object.keys(reasoningLabels) as (keyof typeof reasoningLabels)[])
        expect(m.assess[key].length).toBeGreaterThan(30);
      expect(m.assess.variations).toHaveLength(2);
      expect(m.reuse.every((day) => day >= 1 && day <= 30)).toBe(true);
      expect(missionBrief(m)).toContain('I do not need to type code manually');
    }
    expect(new Set(missions.flatMap((m) => m.foundation)).size).toBe(16);
  });
  it('cannot record output alone or treat old workshop completion as new understanding', () => {
    const m = missions[0],
      record = newMissionRecord();
    record.checks = [true, true, true];
    record.artifact = 'local/project';
    record.observation =
      'I opened the actual page and verified the contact option and phone layout.';
    expect(productReady(m, record)).toBe(true);
    expect(understandingReady(record)).toBe(false);
    expect(canRecordMission(m, record)).toBe(false);
    for (const [key] of systemQuestions)
      record.system[key] =
        'A substantive explanation to be checked by a reviewer in the actual product.';
    expect(canRecordMission(m, record)).toBe(false);
    for (const key of Object.keys(reasoningLabels) as (keyof typeof reasoningLabels)[])
      record.reasoning[key] =
        'My prediction and reasoning, still requiring a fresh-scenario review.';
    expect(canRecordMission(m, record)).toBe(true);
    expect(record.verdict).toBe('unreviewed');
    expect(
      parseProgress({ version: 1, completed: { 1: '2026-10-15' }, quizPassed: [1] }).missions,
    ).toEqual({});
  });
  it('round-trips separate mission records and bounds untrusted imports', () => {
    const progress = emptyProgress();
    const record = newMissionRecord();
    record.step = 3;
    record.system.stack = 'Static HTML and CSS in the browser; no backend.';
    record.reasoning.predict = 'If hosting fails, a new visitor cannot fetch files.';
    record.checks = [true, false, true];
    record.option = 2;
    progress.missions[1] = record;
    progress.lastMission = 1;
    progress.notes[2] = 'Earlier workshop notes';
    const restored = parseProgress(JSON.parse(JSON.stringify(progress)));
    expect(restored.missions[1]).toMatchObject(record);
    expect(restored.notes[2]).toBe('Earlier workshop notes');
    const malformed = parseProgress({
      version: 1,
      lastMission: 99,
      missions: {
        1: {
          step: 99,
          option: 99,
          recorded: 'yes',
          system: { stack: 45 },
          checks: [1, true, 'true'],
          variation: 45,
          verdict: 'certified',
        },
        999: record,
      },
    });
    expect(malformed.lastMission).toBe(1);
    expect(malformed.missions[1].step).toBe(0);
    expect(malformed.missions[1].option).toBe(0);
    expect(malformed.missions[1].recorded).toBe(false);
    expect(malformed.missions[1].verdict).toBe('unreviewed');
    expect(malformed.missions[1].system.stack).toBe('');
    expect(malformed.missions[999]).toBeUndefined();
  });
  it('ships thirty complete kits and matching repository guides', () => {
    for (const m of missions) {
      const number = String(m.id).padStart(2, '0');
      const files = unzipSync(fs.readFileSync(`public/mission-projects/mission-${number}.zip`));
      for (const file of [
        'MISSION.md',
        'AI-BRIEF.txt',
        'SYSTEM-EXPLANATION.md',
        'EVIDENCE.md',
        'TOOL-RECORD.md',
      ])
        expect(files[file], `${number}/${file}`).toBeDefined();
      const guide = fs.readFileSync(`../missions/${number}/README.md`, 'utf8');
      expect(guide).toContain(m.title);
      expect(guide).toContain(m.assess.challenge);
      const sheet = strFromU8(files['SYSTEM-EXPLANATION.md']);
      for (const [, label] of systemQuestions)
        expect(sheet.toLowerCase()).toContain(label.toLowerCase());
      if (m.id <= 5)
        expect(strFromU8(files['worked-example.html'])).toContain(
          'no backend, database, login or live AI',
        );
    }
  });
});
