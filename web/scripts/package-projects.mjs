import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync, strToU8 } from 'fflate';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.dirname(web);
const projects = JSON.parse(fs.readFileSync(path.join(web, 'src/lesson-projects.json'), 'utf8'));
const destination = path.join(web, 'public/projects');
fs.mkdirSync(destination, { recursive: true });
for (const project of projects) {
  const folder = fs.readdirSync(root).find(name => name.startsWith(`${String(project.day).padStart(2, '0')}_Day_`));
  const directory = path.join(root, folder);
  const files = {
    'PROJECT.md': strToU8(fs.readFileSync(path.join(directory, 'PROJECT.md'), 'utf8')),
    'README.md': strToU8(fs.readFileSync(path.join(directory, 'README.md'), 'utf8')),
  };
  for (const name of fs.readdirSync(path.join(directory, 'starter'))) {
    if (name === project.filename || name === 'expected-output.txt') files[name] = fs.readFileSync(path.join(directory, 'starter', name));
  }
  fs.writeFileSync(path.join(destination, project.starter), zipSync(files));
}
console.log(`Packaged ${projects.length} lesson project starter kits.`);
