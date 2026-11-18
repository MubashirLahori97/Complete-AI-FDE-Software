import { readCourse } from './validate-course.mjs';
const lessons = await readCourse();
const urls = [...new Set(lessons.flatMap((lesson) => lesson.references.map((item) => item.url)))];
const failures = [];
for (let offset = 0; offset < urls.length; offset += 6) {
  const results = await Promise.allSettled(
    urls.slice(offset, offset + 6).map(async (url) => {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      await response.body?.cancel();
      return { url, status: response.status };
    }),
  );
  results.forEach((result, i) => {
    if (result.status === 'rejected')
      failures.push({ url: urls[offset + i], error: String(result.reason) });
    else if (result.value.status >= 400) failures.push(result.value);
  });
}
console.log(JSON.stringify({ referenceLinksChecked: urls.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
