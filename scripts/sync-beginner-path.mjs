import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function syncBeginnerPath() {
  const guides = JSON.parse(fs.readFileSync(path.join(root, 'web/src/beginner-path.json'), 'utf8'));
  const teaching = fs.readdirSync(path.join(root, 'scripts/curriculum')).filter(file => file.endsWith('.json')).flatMap(file => JSON.parse(fs.readFileSync(path.join(root, 'scripts/curriculum', file), 'utf8'))).sort((a, b) => a.day - b.day);
  if (guides.length !== 30 || guides.some((guide, i) => guide.day !== i + 1)) throw new Error('Expected a beginner path for all 30 lessons.');
  const block = (text, contents) => {
    const cleaned = text.replace(/\n<!-- beginner-path:begin -->[\s\S]*?<!-- beginner-path:end -->\n/g, '');
    const line = cleaned.indexOf('\n');
    return cleaned.slice(0, line + 1) + `\n<!-- beginner-path:begin -->\n${contents}\n<!-- beginner-path:end -->\n` + cleaned.slice(line + 1);
  };
  for (const guide of guides) {
    const lesson = teaching[guide.day - 1];
    const directory = path.join(root, fs.readdirSync(root).find(name => name.startsWith(`${String(guide.day).padStart(2, '0')}_Day_`)));
    const start = `## Start here — one idea at a time\n\n**Your goal:** ${lesson.project.title}. You can take several study sessions.\n\n**The situation:** ${guide.situation}\n\n### One idea: ${guide.title}\n\n${guide.explanation}\n\n**New words:**\n\n${guide.terms.map(([word, meaning]) => `- **${word}:** ${meaning}`).join('\n')}\n\n### Follow the example below\n\n${guide.walkthrough.map((line, i) => `${i + 1}. ${line}`).join('\n')}\n\n### Try one small decision\n\n${guide.question}\n\n${guide.options.map(([label], i) => `${i + 1}. ${label}`).join('\n')}\n\n<details>\n<summary>A small hint</summary>\n\n${guide.hints[0]}\n\n</details>\n\n<details>\n<summary>Another hint</summary>\n\n${guide.hints[1]}\n\n</details>\n\n<details>\n<summary>Answer and explanation</summary>\n\n**${guide.options[guide.answer][0]}** ${guide.options[guide.answer][1]}\n\n</details>\n\n**Then practise:** ${guide.codeTask}\n\n**Your project's first action:** ${guide.firstStep}\n\n**How it connects:** ${guide.connection}\n\nUse the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.\n`;
    const projectStart = `## Your first action\n\n${guide.firstStep}\n\nThe download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.\n\n**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file \`${lesson.example.filename}\`. ${lesson.example.run}\n\n${guide.connection}\n`;
    for (const [filename, contents] of [['README.md', start], ['PROJECT.md', projectStart]]) {
      const file = path.join(directory, filename);
      fs.writeFileSync(file, block(fs.readFileSync(file, 'utf8'), contents));
    }
  }
  console.log('Synced beginner explanations and first project actions into all 30 lesson documents.');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) syncBeginnerPath();
