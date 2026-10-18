import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync, strToU8 } from 'fflate';
import { validateLabStories } from './validate-lab-stories.mjs';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.dirname(web);
const missions = JSON.parse(fs.readFileSync(path.join(web, 'src/missions.json'), 'utf8'));
const labs = JSON.parse(fs.readFileSync(path.join(web, 'src/mission-labs.json'), 'utf8'));
const stories = JSON.parse(fs.readFileSync(path.join(web, 'src/lab-stories.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(web, 'src/lesson-guides.json'), 'utf8'));
if (guides.length !== 30) throw new Error('Every core lesson needs beginner directions.');
for (const [index, guide] of guides.entries()) {
  if (guide.id !== index + 1) throw new Error('Lesson directions must follow the course order.');
  for (const key of ['why', 'lookFor', 'projectStart', 'explainFocus'])
    if (typeof guide[key] !== 'string' || !guide[key].trim())
      throw new Error(`Lesson ${guide.id} needs ${key}`);
}
if (labs.length !== 30) throw new Error('Every core mission needs an interactive lab.');
for (const [index, lab] of labs.entries()) {
  if (lab.id !== index + 1 || !Array.isArray(lab.controls) || !lab.controls.length)
    throw new Error(`Invalid interactive lab ${lab.id}`);
  for (const key of ['title', 'idea', 'task', 'first', 'boundary', 'challenge'])
    if (typeof lab[key] !== 'string' || !lab[key].trim())
      throw new Error(`Lab ${lab.id} needs ${key}`);
  const ids = new Set();
  for (const c of lab.controls) {
    if (ids.has(c.id) || !c.id || !c.label) throw new Error(`Invalid control in lab ${lab.id}`);
    ids.add(c.id);
    const valueFits = (value) =>
      c.type === 'text'
        ? typeof value === 'string'
        : c.type === 'toggle'
          ? typeof value === 'boolean'
          : c.type === 'select'
            ? c.options?.some(([key]) => key === value)
            : c.type === 'range' &&
              Number.isFinite(value) &&
              Number.isFinite(c.min) &&
              Number.isFinite(c.max) &&
              c.min <= value &&
              value <= c.max &&
              c.step > 0;
    if (!valueFits(c.default) || (c.id in lab.try && !valueFits(lab.try[c.id])))
      throw new Error(`Invalid value for lab ${lab.id} control ${c.id}`);
  }
  if (!Object.keys(lab.try).length || Object.keys(lab.try).some((id) => !ids.has(id)))
    throw new Error(`Lab ${lab.id} has an invalid first experiment`);
}
validateLabStories(labs, stories);
const fields = [
  'Purpose and success',
  'Actual technologies',
  'How the parts fit',
  'Choices and alternatives',
  'Where it runs',
  'One action, end to end',
  'Information, access and AI',
  'Changes and failures',
];
const systemTemplate = `# Explain the system you actually built\n\nWrite or transcribe in your own words. AI may help inspect and teach. A generated explanation alone is insufficient; demonstrate that you can apply the concepts. Update this after meaningful changes. A static site can have no database, accounts, server or live AI.\n\n${fields.map((title) => `## ${title}\n\nYour explanation, actual component/configuration evidence and useful diagram:\n`).join('\n')}\nDo not put secrets or private customer data here.\n`;
const toolsTemplate = `# Current tool and environment record\n\nVerification date:\nAI builder/agent and model, if known:\nActual languages / runtimes / frameworks / libraries / versions:\nActual database / services / hosting (or absent):\nStart / build / test / deployment instructions:\nConfiguration names (never secret values):\nObserved capability and relevant limits:\nProvider pricing source + date, or cost explicitly unknown:\nBudget, authority and stopping conditions:\nReal observations versus fixtures / simulations / unrun checks:\nReplacement or export route:\n`;
const stages = [
  'Build with AI and understand the result',
  'Understand the problem and design the product',
  'Understand how the complete system works',
  'Direct AI work at greater scale',
  'Establish quality and keep the product working',
  'Deliver value and demonstrate ownership',
];
const destination = path.join(web, 'public/mission-projects');
fs.mkdirSync(destination, { recursive: true });
const repositoryFolder = path.join(root, 'missions');
fs.mkdirSync(repositoryFolder, { recursive: true });
const validateText = (value) => typeof value === 'string' && value.trim().length > 15;
if (missions.length !== 30) throw new Error('The core requires exactly 30 missions.');
for (const [index, m] of missions.entries()) {
  if (m.id !== index + 1 || m.stage !== Math.ceil(m.id / 5))
    throw new Error(`Invalid mission sequence ${m.id}`);
  if (
    m.concepts.length < 2 ||
    m.experiment.options.length !== 3 ||
    m.project.steps.length !== 3 ||
    m.project.checks.length !== 3 ||
    m.assess.variations.length !== 2
  )
    throw new Error(`Incomplete mission ${m.id}`);
  if (
    ![
      m.problem,
      m.outcome,
      m.project.brief,
      ...Object.values(m.example),
      ...m.concepts.flatMap((c) => Object.values(c)),
      ...m.experiment.options.flatMap((o) => [o.label + ' (scenario)', o.result, o.why]),
      ...m.project.steps,
      ...m.project.checks,
      ...Object.values(m.assess).flat(),
    ].every(validateText)
  )
    throw new Error(`Missing teaching content in mission ${m.id}`);
  const number = String(m.id).padStart(2, '0');
  const lab = labs[m.id - 1];
  const guide = guides[m.id - 1];
  const story = stories[m.id - 1];
  const guidedText = `## Two guided comparisons\n\n${story.scene}\n\nEach pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.\n\n${story.comparisons.map((comparison, index) => `### ${index + 1}. ${comparison.title}\n\n${comparison.notice}\n\nStarting overrides (other controls use this lab's defaults):\n\n\`\`\`json\n${JSON.stringify(comparison.before, null, 2)}\n\`\`\`\n\nChange one control:\n\n\`\`\`json\n${JSON.stringify(comparison.change, null, 2)}\n\`\`\`\n\nWhat to understand: ${comparison.takeaway}\n`).join('\n')}\n`;
  const labGuide = `# Mission ${m.id}: interactive experiment\n\n${lab.title}\n\n## Start here\n\nOpen mission ${m.id} in the academy. ${lab.task}\n\nFirst action: **${lab.first}**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.\n\n## The idea\n\n${lab.idea}\n\n## Things you can change\n\n${lab.controls.map((c) => `- **${c.label}:** starts at ${JSON.stringify(c.default)}.${c.options ? ' Choices: ' + c.options.map(([, label]) => label).join('; ') + '.' : ''}${c.type === 'range' ? ` Range: ${c.min}–${c.max} ${c.unit || ''}, step ${c.step}.` : ''}`).join('\n')}\n\n## A different situation\n\n${lab.challenge}\n\nPredict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.\n\n## What this experiment establishes\n\n${lab.boundary}\n\nYour controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.\n\nAuthored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.\n`;
  const brief = `Help me deliver: ${m.project.brief}\n\nContext: ${m.problem}\n\nYou may plan, implement, test, diagnose and improve the solution. Manual coding is optional. Ask about missing information, use fictional or authorized data, label assumptions and simulations, and explain concepts in simple English. Establish budget, authority and stopping conditions. Discuss new access, spending and publication before acting.\n\nMilestones:\n${m.project.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nExpected observations:\n${m.project.checks.map((s) => `- ${s}`).join('\n')}\n\nName the actual stack, supported versions, configuration, costs and opening instructions. Never invent interviews, measurements or test results. Help me inspect the system, update my system explanation and predict a changed case before showing the result. Do not complete my understanding assessment as if I had demonstrated it.\n`;
  const content = `# Mission ${m.id}: ${m.title}\n\nStage ${m.stage}: ${stages[m.stage - 1]}\n\n${m.outcome}\n\nAI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.\n\n## The problem\n\n${m.problem}\n\n## Understand the concepts\n\n${m.concepts.map((c) => `### ${c.name}\n\n${c.explanation}\n\n**Example:** ${c.example}\n\n**Common wrong idea:** ${c.misconception}`).join('\n\n')}\n\n## Predict, change, observe\n\n${m.experiment.prompt}\n\nPrepared teaching simulation, not live provider or business evidence. Predict before selecting.\n\n${m.experiment.options.map((o) => `- **${o.label}:** ${o.result} ${o.why}`).join('\n')}\n\nFlow: ${m.flow.map((n) => `${n.name} (${n.runs})`).join(' → ')}\n\n## Worked example\n\n${Object.entries(
    m.example,
  )
    .map(([label, value]) => `**${label}:** ${value}`)
    .join(
      '\n\n',
    )}\n\nAuthored example; your project requires its own observations.\n\n## Project: ${m.project.title}\n\n${m.project.brief}\n\n${m.project.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n## Outcome checks\n\n${m.project.checks.map((s) => `- [ ] ${s}`).join('\n')}\n\nRecord starting state, action, expected result, observed result, environment and evidence location. Leave unrun checks unticked.\n\n## System explanation\n\n${fields.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nExplain the actual project; mark absent components as absent. Use your own words and a diagram where useful. Update after meaningful changes.\n\n## Understanding, separately from output\n\n${['explain', 'locate', 'predict', 'compare', 'challenge'].map((k) => `- **${k}:** ${m.assess[k]}`).join('\n')}\n\n## Reviewer guidance\n\n${m.assess.guide}\n\nAI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:\n\n${m.assess.variations.map((s) => `- ${s}`).join('\n')}\n\nRecord who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.\n\n## Optional implementation source material\n\n${m.reuse.map((day) => `- [Original workshop ${day}](../../${fs.readdirSync(root).find((name) => name.startsWith(`${String(day).padStart(2, '0')}_Day_`))}/README.md)`).join('\n')}\n\nUse relevant material; manual coding and the old sequence are not core gates.\n\n<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->\n`;
  const directory = path.join(repositoryFolder, number);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'README.md'), content);
  const completeLabGuide = (labGuide + '\n' + guidedText).trimEnd() + '\n';
  fs.writeFileSync(path.join(directory, 'LAB-GUIDE.md'), completeLabGuide);
  const evidence = `# Mission ${m.id} evidence\n\n## Product evidence\n\nArtifact / local location and opening instructions:\nStarting state:\nAction:\nExpected result:\nActual observation:\nEnvironment / revision / date:\nFixtures, reports, unrun checks and limits:\n\n${m.project.checks.map((c) => `- [ ] ${c}`).join('\n')}\n\n## Understanding demonstrations\n\n${['explain', 'locate', 'predict', 'compare', 'challenge'].map((k) => `### ${k}\n${m.assess[k]}\n\nYour reasoning and evidence:\n`).join('\n')}\n## Review\n\nReviewer or method:\nFresh scenario:\nPrediction before result:\nObserved reasoning and outcome:\nGaps and next practice:\nStatus: unreviewed / revisit / reviewer reports demonstrated\n\nField completeness is not concept mastery. AI remains available throughout.\n`;
  const files = {
    'SCENE-GUIDE.md': strToU8(`# Mission ${m.id}: learn through the scene\n\n${m.title}\n\n## Try one change\n\n${lab.task}\n\nFirst action: **${lab.first}**. The scene uses the same saved inputs and local rules as the original experiment. Changes appear immediately. ${[1,3].includes(m.id) ? 'The framed page runs actual HTML, CSS and browser JavaScript.' : m.id===26 ? 'Try the visit, compare speed with access approval, and pause or replay the finite illustrated sequence.' : 'Use either scene change, inspect a reading moment, or choose Follow the idea. Pause, restart and replay are available.'}\n\nThe illustration is a teaching view, not measured execution or real customer/provider evidence. ${lab.boundary}\n\n## Your own project: ${m.project.title}\n\n${m.project.brief}\n\nStart here: ${m.project.steps[0]}\n\nUse Build this with AI to open the existing project. AI may implement everything. Explain the relevant input, rule and result in your own system; predict a changed case and check what actually happens. Keep your product observations separate from the teaching model.\n\nInputs and notes use the saved experiment and progress backup. Undo/reset remain available. Playback is temporary and never records mastery. Inspect the numbers and rules for full values. System/3D inspection and guided comparisons remain available.\n`),
    'MISSION.md': strToU8(
      content.replace(
        /\]\(\.\.\/\.\.\/([^)]+)\)/g,
        '](https://github.com/MubashirLahori97/Complete-AI-FDE-Software/blob/main/$1)',
      ),
    ),
    'AI-BRIEF.txt': strToU8(brief),
    'LAB-GUIDE.md': strToU8(completeLabGuide),
    'comparisons.json': strToU8(JSON.stringify(story, null, 2)),
    'SYSTEM-EXPLANATION.md': strToU8(systemTemplate),
    'EVIDENCE.md': strToU8(evidence),
    'TOOL-RECORD.md': strToU8(toolsTemplate),
  };
  const sceneDirections = `## Why this lesson\n\n${guide.why}\n\n## What to look for\n\n${guide.lookFor}\n\n## Start your project\n\n${guide.projectStart}\n\n## Explain your own result\n\n${guide.explainFocus}\n\n## Your next steps\n\nUse **Next: understand the idea**, explore the concepts, then **Build my project**. Copy the ready-to-use AI brief into your AI builder or coding assistant and ask how to open the result. Save your project observations, choose **Explain my system**, and then **Review my evidence**. Work through one question at a time. You can return later; a lesson can take more than one session.\n\n`;
  const sceneGuide = new TextDecoder().decode(files['SCENE-GUIDE.md']);
  files['SCENE-GUIDE.md'] = strToU8(sceneGuide.replace('## Try one change', sceneDirections + '## Try one change'));
  fs.writeFileSync(path.join(directory, 'SCENE-GUIDE.md'), files['SCENE-GUIDE.md']);
  if (m.id === 18) {
    const neuronGuide = fs.readFileSync(path.join(root, 'NEURAL-LEARNING.md'));
    fs.writeFileSync(path.join(directory, 'NEURON-GUIDE.md'), neuronGuide);
    files['NEURON-GUIDE.md'] = neuronGuide;
    files['neuron-model.ts'] = fs.readFileSync(path.join(web, 'src/neuron-model.ts'));
  }
  if (m.id === 1) {
    const pageGuide = fs.readFileSync(path.join(root, 'PAGE-UNDERSTANDING.md'));
    fs.writeFileSync(path.join(directory, 'PAGE-CONCEPTS.md'), pageGuide);
    files['PAGE-CONCEPTS.md'] = pageGuide;
  }
  if (m.id === 4) {
    const logicGuide = fs.readFileSync(path.join(root, 'LOGIC-UNDERSTANDING.md'));
    fs.writeFileSync(path.join(directory, 'LOGIC-CONCEPTS.md'), logicGuide);
    files['LOGIC-CONCEPTS.md'] = logicGuide;
    const logicModel = fs.readFileSync(path.join(web, 'src/estimate-model.ts'));
    fs.writeFileSync(path.join(directory, 'estimate-model.ts'), logicModel);
    files['estimate-model.ts'] = logicModel;
  }
  if (m.id === 26) {
    const accessGuide = fs.readFileSync(path.join(root, 'ACCESS-JOURNEY.md'));
    fs.writeFileSync(path.join(directory, 'ACCESS-SCENE.md'), accessGuide);
    files['ACCESS-SCENE.md'] = accessGuide;
  }
  if (m.id <= 5)
    files['worked-example.html'] = fs.readFileSync(
      path.join(web, 'curriculum/service-example.html'),
    );
  fs.writeFileSync(path.join(destination, `mission-${number}.zip`), zipSync(files));
}
const mapping = `# Core mission implementation and reuse map\n\nThe six-stage core is implemented at \`#/mission/1\` through \`#/mission/30\`. Original workshops remain at \`#/lesson/1\` through \`#/lesson/30\`; Amina remains optional. Old completions do not complete new missions.\n\n## Mapping and added teaching\n\n| Mission | Shared foundation | Reused workshop material | Added concept / assessment depth |\n| --- | --- | --- | --- |\n${missions.map((m) => `| [${m.id}. ${m.title}](missions/${String(m.id).padStart(2, '0')}/README.md) | ${m.foundation.join(', ')} | ${m.reuse.join(', ')} | ${m.concepts.map((c) => c.name).join('; ')}; five reasoning actions and two practice variations |`).join('\n')}\n\n## Foundation coverage\n\n${[
  ...new Set(missions.flatMap((m) => m.foundation)),
]
  .sort()
  .map(
    (area) =>
      `- **${area}:** missions ${missions
        .filter((m) => m.foundation.includes(area))
        .map((m) => m.id)
        .join(', ')}`,
  )
  .join(
    '\n',
  )}\n\n## Remaining work that cannot be claimed from authored content\n\nThe thirty mission experiences, project kits, system-explanation records and reviewer prompts are implemented. The first five kits include a runnable static worked example; later kits contain complete briefs, evidence sheets and optional source-workshop links. They are not prebuilt independent customer solutions. Learners and their available AI build and verify those projects.\n\nBeginner pilots, delayed concept-transfer measurements, practitioner calibration with comparable tools, real business outcomes and future 2028/2029 tool compatibility remain unmeasured. No pacing estimate, employment equivalence or graduate outcome is established by implementation or passing app tests. Source research separates observations, forecasts and curriculum scenarios.\n\nGenerated from \`web/src/missions.json\` by \`web/scripts/pack-missions.mjs\`.\n`;
fs.writeFileSync(path.join(root, 'MISSION-MAP.md'), mapping);
console.log(
  `Validated and packaged ${missions.length} core missions, repository guides and project kits.`,
);
