import foundations from '../../scripts/curriculum/01-06.json';
import engineering from '../../scripts/curriculum/07-12.json';
import ai from '../../scripts/curriculum/13-18.json';
import systems from '../../scripts/curriculum/19-24.json';
import field from '../../scripts/curriculum/25-30.json';
import beginnerPath from './beginner-path.json';

// The web lesson and downloadable project share the existing curriculum source.
export const teachingLessons = [...foundations, ...engineering, ...ai, ...systems, ...field];
export const beginnerLessons = beginnerPath;

export function lessonTeaching(day: number) {
  return { guide: beginnerLessons[day - 1], teaching: teachingLessons[day - 1] };
}
