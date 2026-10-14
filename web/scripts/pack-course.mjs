import fs from 'node:fs';
import path from 'node:path';
import { zipSync, strToU8 } from 'fflate';
import { readCourse, web } from './validate-course.mjs';
const lessons = await readCourse();
const destination = path.join(web, 'public/course');
const kits = path.join(web, 'public/course-projects');
fs.mkdirSync(destination, { recursive: true });
fs.mkdirSync(kits, { recursive: true });
const catalog = lessons.map((lesson) => ({
  day: lesson.day,
  title: lesson.title,
  slug: lesson.slug,
  chapter: lesson.chapter,
  outcome: lesson.outcome,
  sections: lesson.sections.length,
  steps: lesson.exercise.steps.length,
  frames: lesson.demo.frames.length,
  criteria: lesson.project.acceptance.length,
  reflections: lesson.project.reflection.length,
}));
fs.writeFileSync(
  path.join(web, 'src/course/catalog.json'),
  JSON.stringify(catalog, null, 2) + '\n',
);
const indent = (source) =>
  source
    .split('\n')
    .map((line) => '    ' + line)
    .join('\n');
const wrap = (exercise, code) =>
  exercise.language === 'python'
    ? `def exercise(${exercise.parameters.join(', ')}):\n${indent(exercise.setup || '')}\n${indent(code)}\n    return (${exercise.result})\n`
    : `export default async function exercise(${exercise.parameters.join(',')}) {\n${exercise.setup || ''}\n${code}\nreturn (${exercise.result});\n}\n`;
const projectText = (lesson) =>
  `# ${lesson.project.title}\n\n${lesson.project.brief}\n\nThe browser exercise is a warm-up. Its passing checks do not prove this project's acceptance. Build the milestones below, run the listed tests, and save your evidence.\n\n## Deliverables\n\n${lesson.project.deliverables.map((item) => '- ' + item).join('\n')}\n\n${lesson.project.milestones.map((milestone, i) => `## Milestone ${i + 1}: ${milestone.title}\n\n${milestone.actions.map((action, i) => `${i + 1}. ${action}`).join('\n')}`).join('\n\n')}\n\n## Acceptance\n\n${lesson.project.acceptance.map((item) => '- [ ] ' + item).join('\n')}\n\n## Tests to reproduce\n\n${lesson.project.tests.map((item) => `- ${item.situation}: ${item.expected}`).join('\n')}\n\n## Independent extension\n\n${lesson.project.extension}\n\n## Explain your work\n\n${lesson.project.reflection.map((item) => '- ' + item).join('\n')}\n`;
const walk = (root, prefix = '') => {
  const result = {};
  for (const name of fs.readdirSync(root)) {
    if (
      ['node_modules', 'dist', '.venv', '__pycache__'].includes(name) ||
      name.endsWith('.db') ||
      (name.startsWith('.env') && name !== '.env.example')
    )
      continue;
    const absolute = path.join(root, name),
      key = prefix + name;
    if (fs.statSync(absolute).isDirectory()) Object.assign(result, walk(absolute, key + '/'));
    else result[key] = fs.readFileSync(absolute);
  }
  return result;
};
const workspace = walk(path.join(web, '../guided-projects/shop-workspace'));
fs.writeFileSync(path.join(kits, 'shop-workspace.zip'), zipSync(workspace));
for (const lesson of lessons) {
  const number = String(lesson.day).padStart(2, '0');
  fs.writeFileSync(path.join(destination, `lesson-${number}.json`), JSON.stringify(lesson) + '\n');
  const ex = lesson.exercise;
  const files = {
    'PROJECT.md': strToU8(projectText(lesson)),
    'lesson.json': strToU8(JSON.stringify(lesson, null, 2)),
  };
  const language = ex.language;
  const command =
    language === 'python'
      ? 'python check.py'
      : language === 'javascript'
        ? 'node check.mjs'
        : language === 'react'
          ? 'npm install, then npm run dev and npm run typecheck'
          : 'Open index.html in a browser; use MANUAL-CHECKS.md';
  files['README.md'] = strToU8(
    `# Lesson ${lesson.day}: ${lesson.title}\n\nStart here:\n\n1. Extract the ZIP into a new folder.\n2. Read PROJECT.md to see the real project and its milestones.\n3. Complete the browser exercise or edit the local starter. The supplied checker runs the final exercise contract.\n4. ${command}.\n5. Extend the warm-up into the actual project. Record normal, boundary, and failing results.\n\nFor lessons 15–30, download shop-workspace.zip from the course project page and follow its README. It supplies a real service and connected React page. Its offline mode requires no model key. Real provider experiments require your explicit configuration and budget.\n\nReference files are learning aids. An independent extension must be completed without copying its solution.\n`,
  );
  if (['python', 'javascript'].includes(language)) {
    const extension = language === 'python' ? 'py' : 'mjs';
    files[`starter.${extension}`] = strToU8(wrap(ex, ex.starter));
    files[`reference.${extension}`] = strToU8(wrap(ex, ex.steps.at(-1).solution));
    const cases = ex.cases.map(({ expectedAtStep, ...item }) => item);
    if (language === 'python')
      files['check.py'] = strToU8(
        `import json\nfrom starter import exercise\ncases=json.loads(${JSON.stringify(JSON.stringify(cases))})\nfor case in cases:\n    try:\n        actual=exercise(*case.get('args',[]))\n    except Exception as error:\n        assert case.get('error')==type(error).__name__, (case['id'],str(error))\n    else:\n        assert not case.get('error') and json.dumps(actual,sort_keys=True)==json.dumps(case.get('expected'),sort_keys=True), (case['id'],actual,case.get('expected'))\n    print('PASS',case['label'])\nprint('Exercise checks passed. Complete PROJECT.md separately.')\n`,
      );
    else
      files['check.mjs'] = strToU8(
        `import assert from 'node:assert/strict';\nimport exercise from './starter.mjs';\nfor(const item of ${JSON.stringify(cases)}){let actual,error;try{actual=await exercise(...(item.args||[]));}catch(caught){error=caught;}if(item.error)assert.equal(error?.name,item.error,item.label);else{if(error)throw error;assert.deepEqual(actual,item.expected,item.label);}console.log('PASS',item.label);}\nconsole.log('Exercise checks passed. Complete PROJECT.md separately.');\n`,
      );
  } else {
    files[language === 'html' ? 'index.html' : 'src/App.tsx'] = strToU8(ex.starter);
    files[language === 'html' ? 'reference.html' : 'reference.tsx'] = strToU8(
      ex.steps.at(-1).solution,
    );
    files['MANUAL-CHECKS.md'] = strToU8(
      '# Inspect the rendered result\n\n' +
        ex.cases.map((item) => `- ${item.label}: ${item.why}`).join('\n') +
        '\n\nCheck at 320px and 900px widths, with keyboard input. The course browser also executes these behaviour checks. Project acceptance requires the broader tests in PROJECT.md.\n',
    );
    if (language === 'react') {
      for (const name of ['package.json', 'package-lock.json', 'tsconfig.json', 'index.html'])
        files[name] = workspace['frontend/' + name];
      files['src/main.tsx'] = strToU8(
        'import React from "react";\nimport {createRoot} from "react-dom/client";\nimport App from "./App";\ncreateRoot(document.getElementById("root")!).render(<App/>);\n',
      );
    }
  }
  for (const [name, content] of Object.entries(lesson.project.files || {}))
    files[name] = strToU8(content);
  files['GUIDE.md'] = strToU8(
    `# ${lesson.title}\n\n${lesson.story}\n\n${lesson.sections.map((item) => `## ${item.title}\n\n${item.paragraphs.join('\n\n')}`).join('\n\n')}\n\n## Worked example\n\n\`\`\`${lesson.example.language}\n${lesson.example.code}\n\`\`\`\n\n${lesson.example.output}\n\n${lesson.example.explanation.map((item) => '- ' + item).join('\n')}\n\n## Further reading\n\n${lesson.references.map((item) => `- [${item.title}](${item.url})`).join('\n')}\n`,
  );
  fs.writeFileSync(path.join(kits, `lesson-${number}.zip`), zipSync(files));
}
console.log(
  `Packaged all ${lessons.length} guided lessons, local exercise checks, and the full-stack workspace.`,
);
