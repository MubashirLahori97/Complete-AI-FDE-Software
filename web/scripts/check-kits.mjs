import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { unzipSync, strFromU8 } from 'fflate';
import { readCourse, web } from './validate-course.mjs';
const lessons = await readCourse();
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'amina-kits-'));
let executed = 0;
try {
  for (const lesson of lessons) {
    const bytes = fs.readFileSync(
      path.join(web, `public/course-projects/lesson-${String(lesson.day).padStart(2, '0')}.zip`),
    );
    const files = unzipSync(bytes);
    for (const name of ['README.md', 'GUIDE.md', 'PROJECT.md', 'lesson.json'])
      if (!files[name]) throw new Error(`Lesson ${lesson.day} missing ${name}`);
    const record = JSON.parse(strFromU8(files['lesson.json']));
    if (
      record.day !== lesson.day ||
      !strFromU8(files['PROJECT.md']).includes(lesson.project.extension)
    )
      throw new Error('Incomplete project content');
    const language = lesson.exercise.language;
    if (['python', 'javascript'].includes(language)) {
      const folder = path.join(root, String(lesson.day));
      fs.mkdirSync(folder);
      const extension = language === 'python' ? 'py' : 'mjs';
      fs.writeFileSync(path.join(folder, `starter.${extension}`), files[`reference.${extension}`]);
      const checker = language === 'python' ? 'check.py' : 'check.mjs';
      fs.writeFileSync(path.join(folder, checker), files[checker]);
      const result = spawnSync(
        language === 'python' ? process.env.FDE_PYTHON || 'python' : process.execPath,
        [checker],
        { cwd: folder, encoding: 'utf8', timeout: 15000 },
      );
      if (result.status !== 0)
        throw new Error(`Lesson ${lesson.day} local reference: ${result.stderr || result.stdout}`);
      executed++;
    } else if (language === 'react') {
      for (const name of [
        'package.json',
        'package-lock.json',
        'src/App.tsx',
        'src/main.tsx',
        'tsconfig.json',
      ])
        if (!files[name]) throw new Error('Incomplete standalone React kit');
    } else if (!files['index.html'] || !files['MANUAL-CHECKS.md'])
      throw new Error('Incomplete HTML kit');
    if (lesson.day === 7) {
      const folder = path.join(root, String(lesson.day));
      fs.writeFileSync(
        path.join(folder, 'project-shipping.mjs'),
        files['project-shipping-reference.mjs'],
      );
      fs.writeFileSync(
        path.join(folder, 'project-check-shipping.mjs'),
        files['project-check-shipping.mjs'],
      );
      const result = spawnSync(process.execPath, ['project-check-shipping.mjs'], {
        cwd: folder,
        encoding: 'utf8',
      });
      if (result.status !== 0) throw new Error(result.stderr);
      executed++;
    }
  }
  const workspace = unzipSync(
    fs.readFileSync(path.join(web, 'public/course-projects/shop-workspace.zip')),
  );
  for (const name of [
    'README.md',
    'server.py',
    'test_service.py',
    'requirements.txt',
    'frontend/package-lock.json',
    'frontend/src/main.tsx',
  ])
    if (!workspace[name]) throw new Error('Incomplete shop workspace');
  if (
    Object.keys(workspace).some(
      (name) => name.includes('node_modules/') || name.endsWith('.db') || name === '.env',
    )
  )
    throw new Error('Private or generated workspace artifacts packaged');
  console.log(
    JSON.stringify({
      kitsInspected: lessons.length,
      localReferenceChecksExecuted: executed,
      fullStackWorkspaceInspected: true,
    }),
  );
} finally {
  const absolute = path.resolve(root);
  if (
    path.dirname(absolute) !== path.resolve(os.tmpdir()) ||
    !path.basename(absolute).startsWith('amina-kits-')
  )
    throw new Error('Refusing unexpected cleanup path');
  fs.rmSync(absolute, { recursive: true, force: true });
}
