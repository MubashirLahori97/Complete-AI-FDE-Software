import { it, expect } from 'vitest';
import labs from '../src/mission-labs.json' with { type: 'json' };
import stories from '../src/lab-stories.json' with { type: 'json' };
import { validateLabStories } from './validate-lab-stories.mjs';
it('rejects invalid starting values even when the changed case overwrites them', () => {
  const broken = structuredClone(stories);
  broken[3].comparisons[0].before.quantity = 123;
  expect(() => validateLabStories(labs, broken)).toThrow('Invalid comparison value 4:quantity');
});
it('refuses unknown controls, multiple changes, unchanged cases and out-of-range values', () => {
  const edit = (change) => {
    const copy = structuredClone(stories);
    change(copy);
    return () => validateLabStories(labs, copy);
  };
  expect(
    edit((copy) => {
      copy[0].comparisons[0].change.extra = true;
    }),
  ).toThrow('must change one control');
  expect(
    edit((copy) => {
      copy[0].comparisons[0].before.unknown = true;
    }),
  ).toThrow('Unknown comparison control');
  expect(
    edit((copy) => {
      copy[0].comparisons[0].change.heading = 'Welcome.';
    }),
  ).toThrow('changes nothing');
  expect(
    edit((copy) => {
      copy[2].comparisons[0].change.size = 100;
    }),
  ).toThrow('Invalid comparison value');
  expect(
    edit((copy) => {
      copy[0].comparisons[0].change.heading = 'a'.repeat(71);
    }),
  ).toThrow('Invalid comparison value');
});
