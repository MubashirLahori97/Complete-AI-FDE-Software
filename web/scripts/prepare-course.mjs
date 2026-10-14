import { readCourse } from './validate-course.mjs';
// Refuse to build or package a partial guided course.
await readCourse();
await import('./package-projects.mjs');
await import('./pack-course.mjs');
await import('./pack-runtime.mjs');
